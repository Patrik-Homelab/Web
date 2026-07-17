<script lang="ts">
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
  import { formatDate, sToHHMM } from '$/lib/functions';
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

  type Frame = 'light' | 'dark' | 'bias' | 'flat';

  function openImage() {
    const image = data.post.images[selectedImage];
    const url = `/image/${image.name}?format=jpg`;
    window.open(url, '_blank');
  }

  let aladinContainer = $state<HTMLDivElement | null>(null);
  let aladinInstance: unknown = null;

  $effect(() => {
    const ra = data.post.ra;
    const dec = data.post.dec;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (ra !== null && dec !== null && aladinContainer) {
      const checkAndInit = () => {
        const globalA = (
          window as unknown as {
            A?: {
              init: Promise<void>;
              aladin: (...args: unknown[]) => unknown;
              graphicOverlay: (...args: unknown[]) => { add: (shape: unknown) => void };
              polygon: (...args: unknown[]) => unknown;
            };
          }
        ).A;
        if (globalA && globalA.init) {
          // A.init resolves when WASM module compilation is complete in v3
          globalA.init.then(() => {
            try {
              if (!aladinContainer) return;
              aladinInstance = globalA.aladin(aladinContainer, {
                survey: 'P/DSS2/color',
                fov: (data.post.fov_width || 1) * 2,
                target: `${ra} ${dec}`,
                showReticle: false,
                showZoomControl: true,
                showLayersControl: false,
                showFullscreenControl: false
              });

              if (data.post.fov_width && data.post.fov_height) {
                const width = data.post.fov_width;
                const height = data.post.fov_height;
                const rot = data.post.fov_rotation || 0;
                const raVal = ra as number;
                const decVal = dec as number;

                const overlay = globalA.graphicOverlay({
                  color: '#f75b00',
                  lineWidth: 2
                });
                // @ts-expect-error aladinInstance is typed as unknown
                aladinInstance.addOverlay(overlay);

                const rad = Math.PI / 180;
                const cosDec = Math.cos(decVal * rad) || 1;

                const rotateAndScale = (x: number, y: number, angleDeg: number) => {
                  const angleRad = -angleDeg * rad;
                  const rx = x * Math.cos(angleRad) - y * Math.sin(angleRad);
                  const ry = x * Math.sin(angleRad) + y * Math.cos(angleRad);
                  // Convert sky degrees to coordinate degrees for the RA component
                  return [rx / cosDec, ry];
                };

                const halfW = width / 2;
                const halfH = height / 2;

                const corners = [
                  [-halfW, -halfH],
                  [halfW, -halfH],
                  [halfW, halfH],
                  [-halfW, halfH]
                ].map(([x, y]) => {
                  const [dRa, dDec] = rotateAndScale(x, y, rot);
                  return [raVal + dRa, decVal + dDec];
                });

                const polygon = globalA.polygon(corners);
                overlay.add(polygon);
              }
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Failed to initialize Aladin Lite:', e);
            }
          });
        } else {
          timeoutId = setTimeout(checkAndInit, 100);
        }
      };

      checkAndInit();
    }
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.css"
  />
  <script
    src="https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js"
    charset="utf-8"
  ></script>
</svelte:head>

<section class="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6">
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

    <!-- High-Tech Telemetry Ribbon -->
    <div
      class="text-text-muted flex flex-wrap gap-4 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs font-semibold backdrop-blur-md"
    >
      <div class="flex items-center gap-1">
        <Icon name="bi-calendar" class="text-primary text-[10px]" />
        <span>{_lang.created}:</span>
        <span class="text-text-strong">{formatDate(data.post.created_at, false)}</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi-clock-history" class="text-primary text-[10px]" />
        <span>{_lang.updated}:</span>
        <span class="text-text-strong">{formatDate(data.post.updated_at, false)}</span>
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi-hourglass-split" class="text-primary text-[10px]" />
        <span>{_lang.totalExposure}:</span>
        <span class="text-primary-text font-mono font-bold"
          >{sToHHMM(
            data.post.exposures
              .filter((ex) => ex.type === 'light')
              .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
          )}</span
        >
      </div>
    </div>
  </div>

  <!-- Dashboard Grid -->
  <div class="flex flex-col gap-8 xl:flex-row">
    <!-- Left Column: Astro Telemetry Panels (1/3rd width) -->
    <div class="flex flex-col gap-6 xl:w-1/3">
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
          class="text-text-muted mt-2 truncate px-2 text-center text-xs font-semibold"
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
        <H3 class="text-text-strong border-b border-white/5 pb-2 text-lg font-bold">
          <Icon name="bi-tools" class="text-primary mr-1.5" />
          <span>{_lang.equipment}</span>
        </H3>
        <ul class="flex flex-col gap-2.5">
          {#each data.post.equipment as equipment (equipment.name)}
            <li>
              <a
                href={equipment.link}
                target="_blank"
                class="group flex items-center justify-between rounded-xl border border-transparent bg-white/5 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:border-white/10 hover:bg-white/10"
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
        <H3 class="text-text-strong border-b border-white/5 pb-2 text-lg font-bold">
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
                class="text-text-muted flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase"
              >
                {#if type === 'light'}<span
                    class="bg-primary h-1.5 w-1.5 animate-ping rounded-full"
                  ></span>{/if}
                <span>{_state.lang.frames[type]}</span>
              </div>
              <span class="text-text-strong mt-0.5 font-mono text-base font-extrabold"
                >{sToHHMM(totalSeconds)}</span
              >
              <span class="text-text-muted text-[10px] font-semibold"
                >{count} {resolveLanguagable(_lang.framesCount, count)}</span
              >
            </div>
          {/each}
        </div>
      </div>

      <!-- Sky View & Targets -->
      {#if data.post.object_id || (data.post.ra !== null && data.post.dec !== null)}
        <div
          class="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
        >
          <H3 class="text-text-strong border-b border-white/5 pb-2 text-lg font-bold">
            <Icon name="bi-compass" class="text-primary mr-1.5" />
            <span>{_lang.skyMap}</span>
          </H3>

          {#if data.objectTranslationUuid}
            <div class="flex items-center gap-2 text-sm font-semibold">
              <span class="text-text-muted">{_lang.object}:</span>
              <span
                class="bg-primary/20 text-primary border-primary/25 rounded-full border px-3 py-0.5 font-bold"
              >
                {_langDynamic[data.objectTranslationUuid]}
              </span>
            </div>
          {/if}

          {#if data.post.ra !== null && data.post.dec !== null}
            <div
              class="grid grid-cols-2 gap-2 rounded-xl border border-white/5 bg-white/5 p-3 font-mono text-xs font-semibold"
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
    <div class="flex flex-col gap-6 xl:w-2/3">
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

      <!-- Tab Content Area -->
      {#if section === 'article'}
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
                      >{sToHHMM(exposure.count * exposure.exposure_time_s)}</Td
                    >
                  </Tr>
                {/each}
              </TBody>
            </Table>
          </div>
        </div>

        <!-- Equipment Detailed Cards -->
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
    </div>
  </div>
</section>
