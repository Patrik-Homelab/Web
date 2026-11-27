<script lang="ts">
  import { browser } from '$app/environment';
  import H1 from '$/components/headers/H1.svelte';
  import H2 from '$/components/headers/H2.svelte';
  import H3 from '$/components/headers/H3.svelte';
  import Table from '$/components/table/Table.svelte';
  import TBody from '$/components/table/TBody.svelte';
  import Td from '$/components/table/Td.svelte';
  import Th from '$/components/table/Th.svelte';
  import THead from '$/components/table/THead.svelte';
  import Tr from '$/components/table/Tr.svelte';
  import Dots from '$/components/utility/Dots.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import Image from '$/components/utility/Image.svelte';
  import Markdown from '$/components/utility/Markdown.svelte';
  import { computeAdaptiveFov, computeFovPolygon } from '$/lib/astro';
  import { formatDate, formatExposure, sToHHMM } from '$/lib/functions';
  import { resolveLanguagable, resolveTranslation } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const _state = getState();
  const _lang = $derived(_state.lang.gallery);
  const _langDynamic = $derived(data.dynamicTranslations);
  const _frames = $derived(_state.lang.admin.article.form.exposures);

  let selectedImage = $state(0);
  let section = $state<'article' | 'details'>('article');

  const hasArticleContent = $derived(
    Boolean((_langDynamic[data.post.content_md] || '').trim())
  );
  const descriptionText = $derived((_langDynamic[data.post.description] || '').trim());
  const totalLightSeconds = $derived(
    data.post.exposures
      .filter((ex) => ex.type === 'light')
      .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
  );
  const formattedTotalLight = $derived(formatExposure(totalLightSeconds));

  type Frame = 'light' | 'dark' | 'bias' | 'flat';

  function openImage() {
    const image = data.post.images[selectedImage];
    const url = `/image/${image.name}?format=jpg`;
    window.open(url, '_blank');
  }

  let aladinContainer = $state<HTMLDivElement | null>(null);
  let aladinInstance: {
    addOverlay: (overlay: unknown) => void;
    setFoV: (fov: number) => void;
    gotoRaDec: (ra: number, dec: number) => void;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    getBaseImageLayer?: () => unknown;
    [key: string]: unknown;
  } | null = null;
  let aladinLoading = $state(false);

  $effect(() => {
    const ra = data.post.ra;
    const dec = data.post.dec;
    let cancelled = false;
    let t1: ReturnType<typeof setTimeout> | undefined;
    let t2: ReturnType<typeof setTimeout> | undefined;
    let t3: ReturnType<typeof setTimeout> | undefined;
    let resizeObserver: ResizeObserver | null = null;

    let userInteracted = false;
    const markUserInteracted = () => {
      userInteracted = true;
    };

    function computeTargetFov(): number {
      if (!aladinContainer) return 2.0;
      const rect = aladinContainer.getBoundingClientRect();
      const widthPx = rect.width > 0 ? rect.width : aladinContainer.clientWidth || 305;
      const heightPx =
        rect.height > 0 ? rect.height : aladinContainer.clientHeight || 250;
      const aspect = widthPx / heightPx;

      return computeAdaptiveFov(
        data.post.fov_width,
        data.post.fov_height,
        data.post.fov_rotation,
        aspect
      );
    }

    function applyTargetView() {
      if (cancelled || !aladinInstance || !aladinContainer) return;
      const fov = computeTargetFov();
      aladinInstance.setFoV(fov);
      if (ra !== null && dec !== null) {
        aladinInstance.gotoRaDec(ra as number, dec as number);
      }
    }

    const handleLayerAdded = () => {
      if (!userInteracted) {
        applyTargetView();
      }
    };

    if (browser && ra !== null && dec !== null && aladinContainer) {
      aladinLoading = true;
      (async () => {
        try {
          // @ts-expect-error aladin-lite does not provide typescript types
          const aladinModule = await import('aladin-lite');
          const A = aladinModule.default as unknown as {
            init: Promise<void>;
            aladin: (...args: unknown[]) => {
              addOverlay: (overlay: unknown) => void;
              setFoV: (fov: number) => void;
              gotoRaDec: (ra: number, dec: number) => void;
              on: (event: string, callback: (...args: unknown[]) => void) => void;
              getBaseImageLayer?: () => unknown;
              [key: string]: unknown;
            };
            graphicOverlay: (...args: unknown[]) => { add: (shape: unknown) => void };
            polygon: (...args: unknown[]) => unknown;
          };
          if (cancelled || !aladinContainer) return;
          await A.init;
          if (cancelled || !aladinContainer) return;

          const initialFov = computeTargetFov();

          aladinInstance = A.aladin(aladinContainer, {
            survey: 'https://skies.esac.esa.int/DSSColor',
            fov: initialFov,
            target: `${ra} ${dec}`,
            showReticle: false,
            showZoomControl: true,
            showLayersControl: false,
            showFullscreenControl: false
          });

          // Intercept layer additions and survey properties load (which defaults to initialFov: 2)
          aladinInstance.on('stackChanged', handleLayerAdded);
          aladinContainer.addEventListener('AL:Layer.added', handleLayerAdded);

          // Track manual interaction so user zooming/panning is preserved
          aladinContainer.addEventListener('pointerdown', markUserInteracted, {
            passive: true
          });
          aladinContainer.addEventListener('wheel', markUserInteracted, {
            passive: true
          });
          aladinContainer.addEventListener('touchstart', markUserInteracted, {
            passive: true
          });
          aladinContainer.addEventListener('keydown', markUserInteracted, {
            passive: true
          });

          // Intercept the HiPS survey layer so when properties are fetched, it retains our target FOV
          const baseLayer = aladinInstance.getBaseImageLayer?.() as
            | {
                _addToView?: (arg: unknown) => unknown;
                initialFov?: number;
                initialRa?: number;
                initialDec?: number;
              }
            | undefined;

          if (baseLayer && typeof baseLayer._addToView === 'function') {
            const origAddToView = baseLayer._addToView;
            baseLayer._addToView = function (arg: unknown) {
              this.initialFov = computeTargetFov();
              this.initialRa = ra as number;
              this.initialDec = dec as number;
              const res = origAddToView.call(this, arg);
              if (!userInteracted) {
                applyTargetView();
              }
              return res;
            };
          }

          // Initial enforcement
          applyTargetView();

          if (data.post.fov_width && data.post.fov_height) {
            const overlay = A.graphicOverlay({
              color: '#f75b00',
              lineWidth: 2
            });
            aladinInstance.addOverlay(overlay);

            const corners = computeFovPolygon(
              ra as number,
              dec as number,
              data.post.fov_width,
              data.post.fov_height,
              data.post.fov_rotation || 0
            );

            const polygon = A.polygon(corners);
            overlay.add(polygon);
          }

          // Keep FOV adapted if container dimensions resize (e.g. mobile/desktop switch)
          if (typeof ResizeObserver !== 'undefined' && aladinContainer) {
            resizeObserver = new ResizeObserver(() => {
              if (!userInteracted) {
                applyTargetView();
              }
            });
            resizeObserver.observe(aladinContainer);
          }

          // Staggered reinforcement for initial settle
          requestAnimationFrame(() => {
            if (!userInteracted) applyTargetView();
          });
          t1 = setTimeout(() => {
            if (!userInteracted) applyTargetView();
          }, 150);
          t2 = setTimeout(() => {
            if (!userInteracted) applyTargetView();
          }, 400);
          t3 = setTimeout(() => {
            if (!userInteracted) applyTargetView();
          }, 1000);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to initialize Aladin Lite:', e);
        } finally {
          if (!cancelled) {
            aladinLoading = false;
          }
        }
      })();
    }

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (aladinContainer) {
        aladinContainer.removeEventListener('pointerdown', markUserInteracted);
        aladinContainer.removeEventListener('wheel', markUserInteracted);
        aladinContainer.removeEventListener('touchstart', markUserInteracted);
        aladinContainer.removeEventListener('keydown', markUserInteracted);
        aladinContainer.removeEventListener('AL:Layer.added', handleLayerAdded);
      }
      aladinInstance = null;
    };
  });
</script>

<section
  class="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-4 pt-6 pb-10 md:pt-10"
>
  <!-- Back Button Link -->
  <a
    href="/{_state.selectedLang}/gallery"
    class="text-text-muted hover:text-primary flex w-max items-center gap-1 text-sm font-bold transition-colors duration-200"
  >
    <Icon name="bi-arrow-left" />
    <span>{_lang.back}</span>
  </a>

  <!-- Header Title -->
  <div class="flex flex-col gap-3">
    <H1 class="text-left font-bold">{_langDynamic[data.post.title]}</H1>
    {#if descriptionText && !hasArticleContent}
      <p class="text-text-muted max-w-3xl text-base leading-relaxed md:text-lg">
        {descriptionText}
      </p>
    {/if}

    <!-- High-Tech Telemetry Ribbon -->
    <div
      class="text-text-muted flex flex-wrap gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-base font-semibold backdrop-blur-md"
    >
      <div class="flex items-center gap-1.5">
        <Icon name="bi-calendar" class="text-primary text-sm" />
        <span>{_lang.created}:</span>
        <span class="text-text-strong">{formatDate(data.post.created_at, false)}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <Icon name="bi-clock-history" class="text-primary text-sm" />
        <span>{_lang.updated}:</span>
        <span class="text-text-strong">{formatDate(data.post.updated_at, false)}</span>
      </div>
      {#if formattedTotalLight}
        <div class="flex items-center gap-1.5">
          <Icon name="bi-hourglass-split" class="text-primary text-sm" />
          <span>{_lang.totalExposure}:</span>
          <span class="text-primary-text font-mono font-bold">{formattedTotalLight}</span>
        </div>
      {/if}
    </div>
  </div>

  <!-- Dashboard Grid -->
  <div class="flex flex-col gap-8 xl:flex-row">
    <!-- Left Column: Astro Telemetry Panels (1/3rd width) -->
    <div class="flex flex-col gap-6 xl:w-[28%]">
      <!-- Main Photo Frame Carousel -->
      <div
        class="flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-4 shadow-2xl backdrop-blur-md"
      >
        <div
          class="relative flex h-[85%] w-full items-center justify-center overflow-hidden rounded-lg bg-black/40"
        >
          <Image
            name={data.post.images[selectedImage].name}
            alt={_langDynamic[data.post.images[selectedImage].alt_text]}
            class="h-full w-full object-contain"
          />
          <div
            role="button"
            aria-label="Image overlay viewer"
            tabindex={0}
            class="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-between p-2"
            onkeypress={(ev) => {
              if (ev.key === 'Enter') {
                openImage();
              }
            }}
            onclick={function (ev) {
              //@ts-expect-error Svelte dynamic binding click source validation
              if (ev.target === this) {
                openImage();
              }
            }}
          >
            {#if data.post.images.length > 1}
              <button
                onclick={() =>
                  (selectedImage =
                    (selectedImage - 1 + data.post.images.length) %
                    data.post.images.length)}
                class="text-text flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm transition-colors duration-200 hover:bg-slate-900/90"
              >
                <Icon name="bi-arrow-left" />
              </button>
              <button
                onclick={() =>
                  (selectedImage = (selectedImage + 1) % data.post.images.length)}
                class="text-text flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-sm transition-colors duration-200 hover:bg-slate-900/90"
              >
                <Icon name="bi-arrow-right" />
              </button>
            {/if}
          </div>
        </div>

        <span
          class="text-text-muted mt-2 truncate px-2 text-center text-base font-semibold"
        >
          {_langDynamic[data.post.images[selectedImage].alt_text]}
        </span>

        {#if data.post.images.length > 1}
          <div class="py-1">
            <Dots count={data.post.images.length} bind:index={selectedImage} />
          </div>
        {/if}
      </div>

      <!-- Equipment Specs Panel -->
      <div
        class="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
      >
        <H3
          class="text-text-strong border-b border-white/5 pb-2 text-xl font-bold lg:text-2xl"
        >
          <Icon name="bi-tools" class="text-primary mr-1.5" />
          <span>{_lang.equipment}</span>
        </H3>
        <ul class="flex flex-col gap-2.5">
          {#each data.post.equipment as equipment (equipment.name)}
            <li>
              <a
                href={equipment.link}
                target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center justify-between rounded-xl border border-transparent bg-white/5 px-4 py-2 text-base font-semibold transition-all duration-300 hover:border-white/10 hover:bg-white/10 lg:text-lg"
              >
                <span class="text-text-strong group-hover:text-primary transition-colors"
                  >{equipment.name}</span
                >
                <Icon
                  name="bi-box-arrow-up-right"
                  class="text-text-muted group-hover:text-text text-xs"
                />
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Exposure Status Matrix -->
      <div
        class="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
      >
        <H3
          class="text-text-strong border-b border-white/5 pb-2 text-xl font-bold lg:text-2xl"
        >
          <Icon name="bi-camera-video" class="text-primary mr-1.5" />
          <span>{_lang.exposureSummary}</span>
        </H3>
        <div class="grid grid-cols-2 gap-3">
          {#each ['light', 'dark', 'bias', 'flat'] as const as type (type)}
            {@const filtered = data.post.exposures.filter((ex) => ex.type === type)}
            {@const count = filtered.reduce((acc, ex) => acc + ex.count, 0)}
            {@const totalSeconds = filtered.reduce(
              (acc, ex) => acc + ex.count * ex.exposure_time_s,
              0
            )}
            {@const activeStyle =
              type === 'light'
                ? 'border-primary/20 text-primary shadow-[0_0_10px_rgba(247,91,0,0.05)]'
                : type === 'flat'
                  ? 'border-blue-500/20 text-blue-400'
                  : type === 'dark'
                    ? 'border-purple-500/20 text-purple-400'
                    : 'border-white/5 text-text-muted'}

            <div
              class={[
                'flex flex-col items-center gap-1 rounded-xl border bg-slate-950/60 p-3 text-center transition-all duration-300 hover:scale-[1.03]',
                activeStyle
              ].join(' ')}
            >
              <div
                class="text-text-muted flex items-center gap-1 text-xs font-bold tracking-wider uppercase lg:text-sm"
              >
                {#if type === 'light'}<span
                    class="bg-primary h-1.5 w-1.5 animate-ping rounded-full"
                  ></span>{/if}
                <span>{_state.lang.frames[type]}</span>
              </div>
              <span
                class="text-text-strong mt-0.5 font-mono text-lg font-extrabold lg:text-xl"
                >{sToHHMM(totalSeconds)}</span
              >
              <span class="text-text-muted text-xs font-semibold lg:text-sm"
                >{count} {resolveLanguagable(_lang.framesCount, count)}</span
              >
            </div>
          {/each}
        </div>
      </div>

      <!-- Sky View & Targets -->
      {#if data.objects.length > 0 || (data.post.ra !== null && data.post.dec !== null)}
        <div
          class="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
        >
          <H3
            class="text-text-strong border-b border-white/5 pb-2 text-xl font-bold lg:text-2xl"
          >
            <Icon name="bi-compass" class="text-primary mr-1.5" />
            <span>{_lang.skyMap}</span>
          </H3>

          {#if data.objects.length > 0}
            <div
              class="flex flex-wrap items-center gap-2 text-base font-semibold lg:text-lg"
            >
              <span class="text-text-muted"
                >{data.objects.length === 1 ? _lang.object : _lang.objects}:</span
              >
              {#each data.objects as obj (obj.id)}
                <span
                  class="bg-primary/20 text-primary border-primary/25 rounded-full border px-3 py-0.5 text-sm font-bold"
                >
                  {_langDynamic[obj.name]}
                </span>
              {/each}
            </div>
          {/if}

          {#if data.post.ra !== null && data.post.dec !== null}
            <div
              class="grid grid-cols-2 gap-2 rounded-xl border border-white/5 bg-white/5 p-3 font-mono text-sm font-semibold lg:text-base"
            >
              <div>
                <span class="text-text-muted">RA:</span>
                <span class="text-text-strong ml-0.5">{data.post.ra}°</span>
              </div>
              <div>
                <span class="text-text-muted">DEC:</span>
                <span class="text-text-strong ml-0.5">{data.post.dec}°</span>
              </div>
              {#if data.post.fov_width !== null && data.post.fov_height !== null}
                <div
                  class="col-span-2 mt-1.5 flex items-center justify-between border-t border-white/5 pt-1.5"
                >
                  <span class="text-text-muted">{_lang.fov}:</span>
                  <span class="text-text-strong"
                    >{data.post.fov_width}° × {data.post.fov_height}°</span
                  >
                </div>
                {#if data.post.fov_rotation}
                  <div class="col-span-2 flex items-center justify-between">
                    <span class="text-text-muted">Rotation:</span>
                    <span class="text-text-strong">{data.post.fov_rotation}°</span>
                  </div>
                {/if}
              {/if}
            </div>

            <!-- Virtual Observatory Viewport -->
            <div
              class="relative overflow-hidden rounded-xl border-2 border-white/10 shadow-2xl"
              style="height: 250px;"
            >
              <div bind:this={aladinContainer} class="h-full w-full bg-black"></div>
              {#if aladinLoading}
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300"
                >
                  <Icon
                    name="bi-arrow-repeat"
                    class="text-primary animate-spin text-2xl"
                  />
                </div>
              {/if}
              <!-- Virtual coordinate grid frame mask overlay -->
              <div
                class="pointer-events-none absolute inset-2 rounded border border-white/5"
              ></div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Right Column: Navigation Tabs & Tab Content (2/3rd width) -->
    <div class="flex flex-col gap-6 xl:w-[72%]">
      {#if hasArticleContent}
        <!-- Section Tab Switcher (Segmented Pill Control) -->
        <div
          class="flex rounded-full border border-white/15 bg-slate-950/60 p-1 font-semibold shadow-2xl backdrop-blur-md"
        >
          <button
            onclick={() => (section = 'article')}
            class={[
              'flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all duration-300 md:text-sm',
              section === 'article'
                ? 'bg-primary shadow-primary/20 text-slate-950 shadow-md'
                : 'text-text-muted hover:text-text hover:bg-white/5'
            ].join(' ')}
          >
            <Icon name="bi-file-earmark-text" />
            <span>{_lang.article}</span>
          </button>
          <button
            onclick={() => (section = 'details')}
            class={[
              'flex w-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all duration-300 md:text-sm',
              section === 'details'
                ? 'bg-primary shadow-primary/20 text-slate-950 shadow-md'
                : 'text-text-muted hover:text-text hover:bg-white/5'
            ].join(' ')}
          >
            <Icon name="bi-card-list" />
            <span>{_lang.details}</span>
          </button>
        </div>
      {:else}
        <!-- Photo Showcase when no written Markdown article exists -->
        <div
          class="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 p-4 shadow-2xl backdrop-blur-md"
        >
          <button
            type="button"
            onclick={openImage}
            class="relative flex max-h-[540px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-black/50"
          >
            <Image
              name={data.post.images[selectedImage].name}
              alt={_langDynamic[data.post.images[selectedImage].alt_text]}
              class="max-h-[520px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </button>
          {#if (_langDynamic[data.post.images[selectedImage].alt_text] || '').trim()}
            <p class="text-text-muted mt-3 text-center text-sm font-medium">
              {_langDynamic[data.post.images[selectedImage].alt_text]}
            </p>
          {/if}
        </div>
      {/if}

      <!-- Tab Content Area -->
      {#if hasArticleContent && section === 'article'}
        <div
          class="rounded-2xl border border-white/5 bg-slate-950/40 p-6 text-base leading-relaxed shadow-2xl backdrop-blur-md"
        >
          <Markdown
            class="prose prose-invert prose-orange w-full max-w-full"
            content={_langDynamic[data.post.content_md]}
          />
        </div>
      {:else}
        <!-- Exposure Detailed Log -->
        {#if data.post.exposures.length > 0}
          <div class="flex flex-col gap-3">
            <H2 class="text-text-strong flex items-center gap-1.5 px-2 text-lg font-bold">
              <Icon name="bi-stopwatch" class="text-primary" />
              <span>{_lang.exposureDetails}</span>
            </H2>

            <div
              class="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 shadow-2xl backdrop-blur-md"
            >
              <Table class="text-center text-sm">
                <THead>
                  <Tr class="border-b border-white/10 bg-slate-900/60">
                    <Th
                      class="text-text-strong py-3 text-[11px] font-extrabold tracking-wider uppercase"
                      >{_frames.date}</Th
                    >
                    <Th
                      class="text-text-strong py-3 text-[11px] font-extrabold tracking-wider uppercase"
                      >{_frames.type}</Th
                    >
                    <Th
                      class="text-text-strong py-3 text-[11px] font-extrabold tracking-wider uppercase"
                      >{_frames.count}</Th
                    >
                    <Th
                      class="text-text-strong py-3 text-[11px] font-extrabold tracking-wider uppercase"
                      >{_frames.seconds}</Th
                    >
                    <Th
                      class="text-text-strong py-3 text-[11px] font-extrabold tracking-wider uppercase"
                      >{_frames.total}</Th
                    >
                  </Tr>
                </THead>
                <TBody>
                  {#each data.post.exposures as exposure (exposure.id)}
                    <Tr
                      class="border-b border-white/5 transition-colors duration-150 last:border-b-0 hover:bg-white/5"
                    >
                      <Td class="text-text-strong py-3"
                        >{formatDate(exposure.date, false)}</Td
                      >
                      <Td class="py-3">
                        <span
                          class={[
                            'rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase',
                            exposure.type === 'light'
                              ? 'bg-primary/20 text-primary border-primary/20'
                              : exposure.type === 'flat'
                                ? 'border-blue-500/20 bg-blue-500/20 text-blue-400'
                                : exposure.type === 'dark'
                                  ? 'border-purple-500/20 bg-purple-500/20 text-purple-400'
                                  : 'text-text-muted border-white/10 bg-white/5'
                          ].join(' ')}
                        >
                          {_state.lang.frames[exposure.type as Frame]}
                        </span>
                      </Td>
                      <Td class="text-text-strong py-3 font-mono">{exposure.count}</Td>
                      <Td class="text-text-strong py-3 font-mono"
                        >{exposure.exposure_time_s}s</Td
                      >
                      <Td class="text-primary-text py-3 font-mono font-bold"
                        >{formatExposure(exposure.count * exposure.exposure_time_s) ??
                          '0s'}</Td
                      >
                    </Tr>
                  {/each}
                </TBody>
              </Table>
            </div>
          </div>
        {/if}

        <!-- Equipment Detailed Cards -->
        {#if data.post.equipment.length > 0}
          <div class="mt-4 flex flex-col gap-3">
            <H2 class="text-text-strong flex items-center gap-1.5 px-2 text-lg font-bold">
              <Icon name="bi-cpu-fill" class="text-primary" />
              <span>{_lang.equipmentDetails}</span>
            </H2>
            <div class="flex flex-wrap gap-4">
              {#each data.post.equipment as equipment (equipment.name)}
                <div
                  class="hover:border-primary/25 flex w-full flex-col gap-2 rounded-2xl border border-white/5 bg-slate-950/40 p-5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] md:w-[calc(50%_-_0.5rem)]"
                >
                  <div class="flex items-start justify-between">
                    <H3 class="text-text-strong text-base font-bold">{equipment.name}</H3>
                    <a
                      href={equipment.link}
                      class="hover:text-primary text-text-muted flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs transition-all duration-200 hover:bg-white/10"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="bi-box-arrow-up-right" />
                    </a>
                  </div>
                  <span class="text-text-muted mt-1 text-xs leading-relaxed"
                    >{resolveTranslation(equipment.lang_key, _state.lang)}</span
                  >
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>

  <!-- Related / Progression Captures for Same Object(s) -->
  {#if data.relatedPosts.length > 0}
    <div class="mt-6 flex flex-col gap-4 border-t border-white/10 pt-8">
      <H2 class="text-text-strong flex items-center gap-2 text-xl font-bold">
        <Icon name="bi-collection" class="text-primary" />
        <span>{_lang.moreCaptures}</span>
      </H2>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {#each data.relatedPosts as related (related.id)}
          {@const relExposure = formatExposure(related.lightSeconds)}
          <a
            href="/{_state.selectedLang}/gallery/{related.id}"
            class="group hover:border-primary/30 flex flex-col overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01]"
          >
            <div class="relative h-36 overflow-hidden bg-slate-900">
              {#if related.imageName}
                <Image
                  class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  name={related.imageName}
                  alt={related.imageAlt ? _langDynamic[related.imageAlt] || '' : ''}
                />
              {:else}
                <div
                  class="text-text-muted flex h-full w-full items-center justify-center"
                >
                  <Icon name="bi-image" class="text-2xl opacity-40" />
                </div>
              {/if}
              {#if relExposure}
                <div class="absolute top-2 right-2">
                  <span
                    class="text-text-strong flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/75 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md"
                  >
                    <Icon name="bi-clock" class="text-primary text-[9px]" />
                    <span>{relExposure}</span>
                  </span>
                </div>
              {/if}
            </div>
            <div class="flex flex-col gap-1 p-3.5">
              <h3
                class="text-text-strong group-hover:text-primary truncate text-sm font-bold transition-colors"
              >
                {_langDynamic[related.title]}
              </h3>
              <div class="text-text-muted flex items-center justify-between text-xs">
                <span>{formatDate(related.created_at, false)}</span>
                <Icon
                  name="bi-arrow-right"
                  class="text-primary transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</section>
