<script lang="ts">
  import { browser } from '$app/environment';
  import H1 from '$/components/headers/H1.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import Image from '$/components/utility/Image.svelte';
  import {
    computeAdaptiveFov,
    computeFovPolygon,
    formatDecDms,
    formatRaHms
  } from '$/lib/astro';
  import { formatDate, formatExposure } from '$/lib/functions';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const _state = getState();
  const _lang = $derived(_state.lang.gallery);
  const _langDynamic = $derived(data.dynamicTranslations);

  type CaptureItem = (typeof data.captures)[number];

  const SURVEYS = [
    { id: 'https://skies.esac.esa.int/DSSColor', label: 'DSS2 Color' },
    { id: 'https://alasky.cds.unistra.fr/MellingerRGB', label: 'Mellinger All-Sky' },
    { id: 'https://alasky.cds.unistra.fr/2MASS/Color', label: '2MASS IR' },
    { id: 'https://alasky.cds.unistra.fr/AllWISE/RGB-W4-W2-W1', label: 'AllWISE IR' }
  ] as const;

  let selectedSurvey = $state<string>(SURVEYS[0].id);
  let searchQuery = $state('');
  let selectedCaptureId = $state<string | null>(null);
  let sidebarOpen = $state(false);
  let showPhotos = $state(true);
  let photoOpacity = $state(0.9);
  let showFrames = $state(true);
  let aladinLoading = $state(true);
  let aladinContainer = $state<HTMLDivElement | null>(null);
  let overlayCanvas = $state<HTMLCanvasElement | null>(null);

  let aladinInstance: {
    addOverlay: (overlay: unknown) => void;
    addCatalog: (catalog: unknown) => void;
    setImageSurvey: (survey: string) => void;
    setFoV: (fov: number) => void;
    gotoRaDec: (ra: number, dec: number) => void;
    world2pix: (ra: number, dec: number) => [number, number] | null;
    [key: string]: unknown;
  } | null = null;

  let fovOverlay: {
    add: (shape: unknown) => void;
    show?: () => void;
    hide?: () => void;
  } | null = null;

  let redrawScheduled = false;
  const loadedImages = new Map<string, HTMLImageElement>();
  const capturePolygons = new Map<string, [number, number][]>();

  interface ProjectedQuad {
    capture: CaptureItem;
    pTL: [number, number];
    ux: number;
    uy: number;
    vx: number;
    vy: number;
    area: number;
  }

  function getProjectedQuad(
    capture: CaptureItem,
    viewWidth: number,
    viewHeight: number
  ): ProjectedQuad | null {
    if (!aladinInstance?.world2pix || !capture.fov_width || !capture.fov_height) {
      return null;
    }
    const corners = capturePolygons.get(capture.id);
    if (!corners) return null;

    const pTL = aladinInstance.world2pix(corners[2][0], corners[2][1]);
    const pTR = aladinInstance.world2pix(corners[3][0], corners[3][1]);
    const pBL = aladinInstance.world2pix(corners[1][0], corners[1][1]);
    if (!pTL || !pTR || !pBL) return null;

    const values = [pTL[0], pTL[1], pTR[0], pTR[1], pBL[0], pBL[1]];
    if (values.some((v) => !Number.isFinite(v))) return null;

    const ux = pTR[0] - pTL[0];
    const uy = pTR[1] - pTL[1];
    const vx = pBL[0] - pTL[0];
    const vy = pBL[1] - pTL[1];

    const spanU = Math.hypot(ux, uy);
    const spanV = Math.hypot(vx, vy);
    if (spanU < 6 || spanV < 6 || spanU > viewWidth * 5 || spanV > viewHeight * 5) {
      return null;
    }

    return {
      capture,
      pTL,
      ux,
      uy,
      vx,
      vy,
      area: Math.abs(ux * vy - uy * vx)
    };
  }

  function findCaptureAtPoint(clickX: number, clickY: number): CaptureItem | null {
    if (!aladinContainer) return null;
    const width = aladinContainer.clientWidth;
    const height = aladinContainer.clientHeight;
    if (width <= 0 || height <= 0) return null;

    const hits: ProjectedQuad[] = [];
    for (const capture of data.captures) {
      const quad = getProjectedQuad(capture, width, height);
      if (!quad) continue;
      const det = quad.ux * quad.vy - quad.uy * quad.vx;
      if (Math.abs(det) < 1e-4) continue;

      const dx = clickX - quad.pTL[0];
      const dy = clickY - quad.pTL[1];
      const a = (dx * quad.vy - dy * quad.vx) / det;
      const b = (quad.ux * dy - quad.uy * dx) / det;
      if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
        hits.push(quad);
      }
    }

    if (hits.length === 0) return null;
    // Prefer the smallest FOV capture if nested frames overlap
    hits.sort((a, b) => a.area - b.area);
    return hits[0].capture;
  }

  function drawImageOverlays() {
    redrawScheduled = false;
    if (!overlayCanvas || !aladinContainer) return;
    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;

    const width = aladinContainer.clientWidth || overlayCanvas.clientWidth;
    const height = aladinContainer.clientHeight || overlayCanvas.clientHeight;
    if (width <= 0 || height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(width * dpr);
    const targetH = Math.floor(height * dpr);
    if (overlayCanvas.width !== targetW || overlayCanvas.height !== targetH) {
      overlayCanvas.width = targetW;
      overlayCanvas.height = targetH;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!showPhotos || !aladinInstance?.world2pix) return;

    for (const capture of data.captures) {
      if (!capture.imageName) continue;
      const img = loadedImages.get(capture.id);
      if (!img || !img.complete || img.naturalWidth === 0) continue;

      const quad = getProjectedQuad(capture, width, height);
      if (!quad) continue;

      ctx.save();
      ctx.globalAlpha = photoOpacity;
      ctx.setTransform(
        (dpr * quad.ux) / img.naturalWidth,
        (dpr * quad.uy) / img.naturalWidth,
        (dpr * quad.vx) / img.naturalHeight,
        (dpr * quad.vy) / img.naturalHeight,
        dpr * quad.pTL[0],
        dpr * quad.pTL[1]
      );
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }
  }

  function scheduleRedraw() {
    if (redrawScheduled) return;
    redrawScheduled = true;
    requestAnimationFrame(drawImageOverlays);
  }

  $effect(() => {
    void showPhotos;
    void photoOpacity;
    scheduleRedraw();
  });

  $effect(() => {
    if (!fovOverlay) return;
    if (showFrames) {
      fovOverlay.show?.();
    } else {
      fovOverlay.hide?.();
    }
  });

  const filteredCaptures = $derived.by(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.captures;
    return data.captures.filter((capture) => {
      const title = (_langDynamic[capture.titleKey] || '').toLowerCase();
      const objNames = capture.objects
        .map((o) => (_langDynamic[o.nameKey] || '').toLowerCase())
        .join(' ');
      const gear = capture.equipment.join(' ').toLowerCase();
      return title.includes(q) || objNames.includes(q) || gear.includes(q);
    });
  });

  const selectedCapture = $derived(
    data.captures.find((c) => c.id === selectedCaptureId) ?? null
  );

  const selectedIndex = $derived(
    selectedCaptureId ? filteredCaptures.findIndex((c) => c.id === selectedCaptureId) : -1
  );

  function focusCapture(capture: CaptureItem) {
    selectedCaptureId = capture.id;
    if (!aladinInstance || !aladinContainer) return;
    const rect = aladinContainer.getBoundingClientRect();
    const aspect = rect.width > 0 && rect.height > 0 ? rect.width / rect.height : 16 / 10;
    const fov = computeAdaptiveFov(
      capture.fov_width,
      capture.fov_height,
      capture.fov_rotation,
      aspect,
      1.75
    );
    aladinInstance.gotoRaDec(capture.ra, capture.dec);
    aladinInstance.setFoV(fov);
    scheduleRedraw();
  }

  function resetAllSky() {
    selectedCaptureId = null;
    if (!aladinInstance) return;
    aladinInstance.gotoRaDec(22, 30);
    aladinInstance.setFoV(150);
    scheduleRedraw();
  }

  function stepCapture(delta: number) {
    if (filteredCaptures.length === 0) return;
    const current = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIdx = (current + delta + filteredCaptures.length) % filteredCaptures.length;
    focusCapture(filteredCaptures[nextIdx]);
  }

  function handleSurveyChange(url: string) {
    selectedSurvey = url;
    aladinInstance?.setImageSurvey(url);
  }

  onMount(() => {
    if (!browser || !aladinContainer) return;
    if (window.innerWidth >= 1024) {
      sidebarOpen = true;
    }
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    // Preload lightweight preview thumbnails for mapped captures
    for (const capture of data.captures) {
      if (!capture.imageName || !capture.fov_width || !capture.fov_height) continue;
      capturePolygons.set(
        capture.id,
        computeFovPolygon(
          capture.ra,
          capture.dec,
          capture.fov_width,
          capture.fov_height,
          capture.fov_rotation || 0
        )
      );
      const img = new window.Image();
      img.onload = () => scheduleRedraw();
      img.src = `/image/${capture.imageName}?format=webp&scale=25&quality=75`;
      loadedImages.set(capture.id, img);
    }

    (async () => {
      try {
        // @ts-expect-error aladin-lite does not provide typescript types
        const aladinModule = await import('aladin-lite');
        const A = aladinModule.default as unknown as {
          init: Promise<void>;
          aladin: (...args: unknown[]) => NonNullable<typeof aladinInstance>;
          graphicOverlay: (...args: unknown[]) => { add: (shape: unknown) => void };
          polygon: (...args: unknown[]) => unknown;
          catalog: (...args: unknown[]) => { addSources: (sources: unknown[]) => void };
          source: (ra: number, dec: number, data: Record<string, unknown>) => unknown;
        };

        await A.init;
        if (cancelled || !aladinContainer) return;

        const instance = A.aladin(aladinContainer, {
          survey: selectedSurvey,
          fov: 150,
          target: '22 +30',
          projection: 'SIN',
          showReticle: true,
          showZoomControl: true,
          showLayersControl: false,
          showFullscreenControl: true
        });

        aladinInstance = instance;

        // Draw FOV polygons for captures with sensor footprint dimensions
        const overlay = A.graphicOverlay({
          color: '#f75b00',
          lineWidth: 2
        }) as NonNullable<typeof fovOverlay>;
        fovOverlay = overlay;
        instance.addOverlay(overlay);
        if (!showFrames) {
          overlay.hide?.();
        }

        for (const capture of data.captures) {
          if (capture.fov_width && capture.fov_height) {
            const corners = computeFovPolygon(
              capture.ra,
              capture.dec,
              capture.fov_width,
              capture.fov_height,
              capture.fov_rotation || 0
            );
            overlay.add(A.polygon(corners));
          }
        }

        // Clickable markers visible even when zoomed out to all-sky
        const catalog = A.catalog({
          name: 'Captured Sky',
          sourceSize: 16,
          color: '#f75b00',
          hoverColor: '#fbbf24',
          selectionColor: '#ffffff',
          shape: 'circle',
          onClick: (source: { data?: { captureId?: string } }) => {
            const id = source?.data?.captureId;
            if (!id) return;
            const match = data.captures.find((c) => c.id === id);
            if (match) {
              focusCapture(match);
            }
          }
        });
        instance.addCatalog(catalog);

        const sources = data.captures.map((capture) =>
          A.source(capture.ra, capture.dec, {
            captureId: capture.id,
            title: _langDynamic[capture.titleKey] || capture.id
          })
        );
        catalog.addSources(sources);

        aladinContainer.addEventListener('AL:position.changed', scheduleRedraw);
        aladinContainer.addEventListener('AL:zoom.changed', scheduleRedraw);
        aladinContainer.addEventListener('AL:Layer.added', scheduleRedraw);

        // Open capture preview card when clicking directly on a photo / FOV rectangle
        let downX = 0;
        let downY = 0;
        const onPointerDown = (e: PointerEvent) => {
          downX = e.clientX;
          downY = e.clientY;
        };
        const onPointerUp = (e: PointerEvent) => {
          if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
          const target = e.target as HTMLElement | null;
          if (
            target?.closest(
              '.aladin-btn, .aladin-location, .aladin-projection-control, .aladin-popup-container, button, a, input, select'
            )
          ) {
            return;
          }
          if (!aladinContainer) return;
          const rect = aladinContainer.getBoundingClientRect();
          const hit = findCaptureAtPoint(e.clientX - rect.left, e.clientY - rect.top);
          if (hit) {
            focusCapture(hit);
          }
        };
        aladinContainer.addEventListener('pointerdown', onPointerDown, { passive: true });
        aladinContainer.addEventListener('pointerup', onPointerUp, { passive: true });

        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => scheduleRedraw());
          resizeObserver.observe(aladinContainer);
        }

        scheduleRedraw();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize All-Sky Atlas:', e);
      } finally {
        if (!cancelled) {
          aladinLoading = false;
        }
      }
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      aladinContainer?.removeEventListener('AL:position.changed', scheduleRedraw);
      aladinContainer?.removeEventListener('AL:zoom.changed', scheduleRedraw);
      aladinContainer?.removeEventListener('AL:Layer.added', scheduleRedraw);
      fovOverlay = null;
      aladinInstance = null;
    };
  });
</script>

<section
  class="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-5 px-4 pt-6 pb-10 md:px-6 md:pt-10"
>
  <!-- Top Bar -->
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-col gap-1.5">
      <a
        href="/{_state.selectedLang}/gallery"
        class="text-text-muted hover:text-primary flex w-max items-center gap-1.5 text-sm font-bold transition-colors"
      >
        <Icon name="bi-arrow-left" />
        <span>{_lang.back}</span>
      </a>
      <H1 class="text-left font-bold">{_lang.skyMapTitle}</H1>
      <p class="text-text-muted max-w-2xl text-sm md:text-base">
        {_lang.skyMapSubtitle}
      </p>
    </div>

    <!-- Controls Toolbar -->
    <div class="flex flex-wrap items-center gap-2.5">
      <!-- Survey Switcher -->
      <div
        class="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-3 py-1.5 backdrop-blur-md"
      >
        <Icon name="bi-layers" class="text-primary text-sm" />
        <select
          aria-label={_lang.skyMapSurvey}
          value={selectedSurvey}
          onchange={(e) => handleSurveyChange(e.currentTarget.value)}
          class="text-text-strong cursor-pointer bg-transparent text-xs font-semibold focus:outline-none md:text-sm"
        >
          {#each SURVEYS as survey (survey.id)}
            <option value={survey.id} class="bg-slate-950 text-white">
              {survey.label}
            </option>
          {/each}
        </select>
      </div>

      <!-- Toggle Preview Photo Overlays & Opacity -->
      <div
        class="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/70 px-2.5 py-1.5 backdrop-blur-md"
      >
        <button
          type="button"
          onclick={() => (showPhotos = !showPhotos)}
          class={[
            'flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-bold transition-colors md:text-sm',
            showPhotos ? 'bg-primary/20 text-primary' : 'text-text-muted hover:text-text'
          ].join(' ')}
        >
          <Icon name={showPhotos ? 'bi-eye-fill' : 'bi-eye-slash'} />
          <span>{_lang.skyMapPhotos}</span>
        </button>

        {#if showPhotos}
          <div class="flex items-center gap-1.5 border-l border-white/10 pl-2">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              bind:value={photoOpacity}
              aria-label={_lang.skyMapOpacity}
              title={_lang.skyMapOpacity}
              class="accent-primary h-1.5 w-16 cursor-pointer sm:w-20"
            />
            <span class="text-text-muted w-9 text-right font-mono text-[11px] font-bold">
              {Math.round(photoOpacity * 100)}%
            </span>
          </div>
        {/if}
      </div>

      <!-- Toggle FOV Frames -->
      <button
        type="button"
        onclick={() => (showFrames = !showFrames)}
        class={[
          'flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold backdrop-blur-md transition-colors md:text-sm',
          showFrames
            ? 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/25'
            : 'text-text-muted hover:text-text border-white/10 bg-slate-950/70 hover:border-white/20'
        ].join(' ')}
      >
        <Icon name="bi-bounding-box" />
        <span>{_lang.skyMapFrames}</span>
      </button>

      <!-- Toggle Target Sidebar -->
      <button
        type="button"
        onclick={() => (sidebarOpen = !sidebarOpen)}
        class="text-text hover:text-primary flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-xs font-bold backdrop-blur-md transition-colors hover:border-white/20 md:text-sm"
      >
        <Icon name={sidebarOpen ? 'bi-layout-sidebar-inset' : 'bi-list-stars'} />
        <span>{_lang.skyMapTargets} ({data.captures.length})</span>
      </button>

      <!-- Reset All-Sky -->
      <button
        type="button"
        onclick={resetAllSky}
        class="bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all md:text-sm"
      >
        <Icon name="bi-globe2" />
        <span>{_lang.skyMapReset}</span>
      </button>
    </div>
  </div>

  <!-- Main Interactive Split Layout -->
  <div class="flex flex-col gap-5 lg:flex-row">
    <!-- Left Collapsible Target List -->
    {#if sidebarOpen}
      <aside
        class="flex max-h-[420px] w-full flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-2xl backdrop-blur-md lg:max-h-[72vh] lg:w-80 xl:w-96"
      >
        <!-- Search Box -->
        <div class="relative">
          <Icon
            name="bi-search"
            class="text-text-muted absolute top-1/2 left-3 -translate-y-1/2 text-xs"
          />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={_lang.skyMapSearch}
            class="focus:border-primary/50 text-text w-full rounded-xl border border-white/10 bg-black/40 py-2 pr-8 pl-8 text-sm placeholder-slate-400 focus:outline-none"
          />
          {#if searchQuery}
            <button
              type="button"
              onclick={() => (searchQuery = '')}
              aria-label="Clear search"
              class="text-text-muted hover:text-text-strong absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
            >
              <Icon name="bi-x-circle-fill" class="text-xs" />
            </button>
          {/if}
        </div>

        <!-- Target List -->
        <div class="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {#if filteredCaptures.length === 0}
            <div class="text-text-muted py-10 text-center text-sm">
              {_lang.skyMapNoTargets}
            </div>
          {:else}
            {#each filteredCaptures as capture (capture.id)}
              {@const isSelected = selectedCaptureId === capture.id}
              {@const exp = formatExposure(capture.lightSeconds)}
              <button
                type="button"
                onclick={() => focusCapture(capture)}
                class={[
                  'flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-200',
                  isSelected
                    ? 'border-primary/50 bg-primary/15 shadow-lg'
                    : 'border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10'
                ].join(' ')}
              >
                <div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                  {#if capture.imageName}
                    <Image
                      name={capture.imageName}
                      alt={capture.imageAltKey
                        ? _langDynamic[capture.imageAltKey] || ''
                        : ''}
                      class="h-full w-full object-cover"
                    />
                  {:else}
                    <div
                      class="text-text-muted flex h-full w-full items-center justify-center"
                    >
                      <Icon name="bi-image" />
                    </div>
                  {/if}
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-1">
                  <span class="text-text-strong truncate text-sm font-bold">
                    {_langDynamic[capture.titleKey]}
                  </span>
                  <div class="flex flex-wrap items-center gap-1.5">
                    {#each capture.objects.slice(0, 2) as obj (obj.id)}
                      <span
                        class="bg-primary/15 text-primary rounded-full px-2 py-0.5 text-[10px] font-bold"
                      >
                        {_langDynamic[obj.nameKey]}
                      </span>
                    {/each}
                    {#if exp}
                      <span class="text-text-muted font-mono text-[11px]">
                        {exp}
                      </span>
                    {/if}
                  </div>
                </div>
              </button>
            {/each}
          {/if}
        </div>
      </aside>
    {/if}

    <!-- Aladin Lite Sky Viewport -->
    <div
      class="relative h-[68vh] min-h-[460px] w-full flex-none overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl sm:h-[72vh] lg:h-[74vh] lg:min-h-[540px] lg:flex-1"
    >
      <div bind:this={aladinContainer} class="h-full w-full"></div>
      <canvas
        bind:this={overlayCanvas}
        class="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      ></canvas>

      {#if aladinLoading}
        <div
          class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/75 backdrop-blur-xs"
        >
          <Icon name="bi-arrow-repeat" class="text-primary animate-spin text-3xl" />
          <span class="text-text-muted font-mono text-xs tracking-wider uppercase">
            Loading Aladin Sky Atlas...
          </span>
        </div>
      {/if}

      <!-- Floating Capture Preview Card -->
      {#if selectedCapture}
        {@const exp = formatExposure(selectedCapture.lightSeconds)}
        <div
          class="absolute right-4 bottom-4 left-4 z-30 flex flex-col gap-3 rounded-2xl border border-white/15 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-xl sm:left-auto sm:w-96"
        >
          <div class="flex items-start gap-3">
            {#if selectedCapture.imageName}
              <div class="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-900">
                <Image
                  name={selectedCapture.imageName}
                  alt={selectedCapture.imageAltKey
                    ? _langDynamic[selectedCapture.imageAltKey] || ''
                    : ''}
                  class="h-full w-full object-cover"
                />
              </div>
            {/if}
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <div class="flex items-start justify-between gap-2">
                <h2 class="text-text-strong truncate text-base font-extrabold">
                  {_langDynamic[selectedCapture.titleKey]}
                </h2>
                <button
                  type="button"
                  onclick={() => (selectedCaptureId = null)}
                  aria-label={_state.lang.projects.close}
                  class="text-text-muted hover:text-text-strong cursor-pointer rounded-full p-1"
                >
                  <Icon name="bi-x-lg" class="text-xs" />
                </button>
              </div>
              <div class="flex flex-wrap gap-1">
                {#each selectedCapture.objects as obj (obj.id)}
                  <span
                    class="bg-primary/20 text-primary border-primary/25 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                  >
                    {_langDynamic[obj.nameKey]}
                  </span>
                {/each}
              </div>
              <span class="text-text-muted font-mono text-[11px]">
                {formatDate(selectedCapture.created_at, false)}
                {#if exp}• {exp}{/if}
              </span>
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-1 rounded-xl border border-white/5 bg-white/5 px-3 py-2 font-mono text-[11px]"
          >
            <div>
              <span class="text-text-muted">RA:</span>
              <span class="text-text-strong">{formatRaHms(selectedCapture.ra)}</span>
            </div>
            <div>
              <span class="text-text-muted">DEC:</span>
              <span class="text-text-strong">{formatDecDms(selectedCapture.dec)}</span>
            </div>
            {#if selectedCapture.fov_width && selectedCapture.fov_height}
              <div class="col-span-2 text-slate-300">
                <span class="text-text-muted">FOV:</span>
                {selectedCapture.fov_width}° × {selectedCapture.fov_height}°
              </div>
            {/if}
          </div>

          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5">
              <button
                type="button"
                onclick={() => stepCapture(-1)}
                title={_lang.skyMapPrev}
                aria-label={_lang.skyMapPrev}
                class="text-text hover:text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
              >
                <Icon name="bi-chevron-left" class="text-xs" />
              </button>
              <button
                type="button"
                onclick={() => stepCapture(1)}
                title={_lang.skyMapNext}
                aria-label={_lang.skyMapNext}
                class="text-text hover:text-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
              >
                <Icon name="bi-chevron-right" class="text-xs" />
              </button>
            </div>

            <a
              href="/{_state.selectedLang}/gallery/{selectedCapture.id}"
              class="bg-primary hover:bg-primary-600 flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-950 transition-all"
            >
              <span>{_lang.skyMapOpenArticle}</span>
              <Icon name="bi-arrow-right" />
            </a>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
