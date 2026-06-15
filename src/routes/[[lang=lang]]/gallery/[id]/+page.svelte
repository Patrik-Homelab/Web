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
    if (ra !== null && dec !== null && aladinContainer) {
      const checkAndInit = () => {
        // @ts-expect-error Aladin Lite is loaded via a global script tag
        if (window.A) {
          try {
            // @ts-expect-error Aladin Lite constructor is not typed
            aladinInstance = window.A.aladin(aladinContainer, {
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

              // @ts-expect-error graphicOverlay is not typed in global window.A
              const overlay = window.A.graphicOverlay({ color: '#f75b00', lineWidth: 2 });
              // @ts-expect-error aladinInstance is typed as unknown
              aladinInstance.addOverlay(overlay);

              const rad = Math.PI / 180;
              const cosDec = Math.cos(decVal * rad) || 1;
              const dRa = width / 2 / cosDec;
              const dDec = height / 2;

              const rotatePoint = (x: number, y: number, angleDeg: number) => {
                const angleRad = -angleDeg * rad;
                const rx = x * Math.cos(angleRad) - y * Math.sin(angleRad);
                const ry = x * Math.sin(angleRad) + y * Math.cos(angleRad);
                return [rx, ry];
              };

              const corners = [
                [-dRa, -dDec],
                [dRa, -dDec],
                [dRa, dDec],
                [-dRa, dDec]
              ].map(([x, y]) => {
                const [rx, ry] = rotatePoint(x, y, rot);
                return [raVal + rx, decVal + ry];
              });

              // @ts-expect-error polygon is not typed in global window.A
              const polygon = window.A.polygon(corners);
              overlay.add(polygon);
            }
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize Aladin Lite:', e);
          }
        } else {
          setTimeout(checkAndInit, 100);
        }
      };

      checkAndInit();
    }
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

<section class="flex flex-1 flex-col gap-4 p-4">
  <a href="/{_state.selectedLang}/gallery" class="font-bold"
    ><Icon name="bi-arrow-left" class="px-4" /> {_lang.back}</a
  >
  <H1>{_langDynamic[data.post.title]}</H1>
  <div class="text-text-muted flex flex-wrap gap-4 font-medium">
    <div>
      <Icon name="bi-calendar" />
      {_lang.created}
      {formatDate(data.post.created_at, false)}
    </div>
    <div>
      <Icon name="bi-clock" />
      {_lang.updated}
      {formatDate(data.post.updated_at, false)}
    </div>
    <div>
      <Icon name="bi-clock" />
      {_lang.totalExposure}: {sToHHMM(
        data.post.exposures
          .filter((ex) => ex.type === 'light')
          .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
      )}
    </div>
  </div>
  <div class="flex flex-col gap-8 xl:flex-row">
    <div class="flex flex-1/3 flex-col gap-8">
      <div
        class="border-text bg-background flex aspect-[5/4] flex-col gap-4 rounded-md border-2 p-4"
      >
        <div class="relative h-full overflow-hidden">
          <Image
            name={data.post.images[selectedImage].name}
            alt={_langDynamic[data.post.images[selectedImage].alt_text]}
            class="h-full w-full object-contain"
          />
          <div
            role="button"
            aria-label="Overlay for controlling Image opening by clicking it inside gallery. By pressing enter you open current image"
            tabindex={0}
            class="absolute top-0 left-0 flex h-full w-full cursor-pointer items-center justify-between p-4"
            onkeypress={(ev) => {
              if (ev.key === 'Enter') {
                openImage();
              }
            }}
            onclick={function (ev) {
              //@ts-expect-error The target is type of Node & this is of type HTMLElement
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
                class="bg-background/75 hover:bg-background/95 cursor-pointer rounded-md px-4 py-3 transition-colors duration-200"
              >
                <Icon name="bi-arrow-left" />
              </button>
              <button
                onclick={() =>
                  (selectedImage = (selectedImage + 1) % data.post.images.length)}
                class="bg-background/75 hover:bg-background/95 cursor-pointer rounded-md px-4 py-3 transition-colors duration-200"
              >
                <Icon name="bi-arrow-right" />
              </button>
            {/if}
          </div>
        </div>
        <span class="text-center"
          >{_langDynamic[data.post.images[selectedImage].alt_text]}</span
        >

        {#if data.post.images.length > 1}
          <Dots count={data.post.images.length} bind:index={selectedImage} />
        {/if}
      </div>

      <div class="border-text bg-background flex flex-col gap-4 rounded-md border-2 p-4">
        <H3 class="font-bold">{_lang.equipment}</H3>
        <ul class="text-xl">
          {#each data.post.equipment as equipment (equipment.name)}
            <li>
              <a href={equipment.link} target="_blank" class="flex items-center gap-2">
                <div class="bg-text inline-block h-2 w-2 rounded-full"></div>
                {equipment.name}
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="border-text bg-background flex flex-col gap-4 rounded-md border-2 p-4">
        <H3 class="font-bold">{_lang.exposureSummary}</H3>
        <div class="grid grid-cols-2 grid-rows-2 gap-4">
          {#each ['light', 'dark', 'bias', 'flat'] as const as type (type)}
            {@const filtered = data.post.exposures.filter((ex) => ex.type === type)}
            {@const count = filtered.reduce((acc, ex) => acc + ex.count, 0)}
            <div
              class="bg- flex w-full flex-col gap-2 rounded-md bg-gray-800 p-4 text-center"
            >
              <span class="text-text-muted"
                >{_state.lang.frames[type]} {_frames.frames}</span
              >
              <H3 class="font-bold"
                >{sToHHMM(
                  filtered.reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
                )}</H3
              >
              <span class="text-text-muted"
                >{count} {resolveLanguagable(_lang.framesCount, count)}</span
              >
            </div>
          {/each}
        </div>
      </div>

      {#if data.post.object_id || (data.post.ra !== null && data.post.dec !== null)}
        <div
          class="border-text bg-background flex flex-col gap-4 rounded-md border-2 p-4"
        >
          <H3 class="font-bold">{_lang.skyMap}</H3>

          {#if data.objectTranslationUuid}
            <div class="flex items-center gap-2">
              <span class="text-text-muted">{_lang.object}:</span>
              <span
                class="bg-primary/20 text-primary border-primary/30 rounded-full border px-3 py-0.5 text-base font-semibold"
              >
                {_langDynamic[data.objectTranslationUuid]}
              </span>
            </div>
          {/if}

          {#if data.post.ra !== null && data.post.dec !== null}
            <div class="flex flex-col gap-1 text-base">
              <div>
                <span class="text-text-muted">RA:</span>
                <span class="text-text-strong font-mono font-semibold"
                  >{data.post.ra}°</span
                >
              </div>
              <div>
                <span class="text-text-muted">DEC:</span>
                <span class="text-text-strong font-mono font-semibold"
                  >{data.post.dec}°</span
                >
              </div>
              {#if data.post.fov_width !== null && data.post.fov_height !== null}
                <div>
                  <span class="text-text-muted">{_lang.fov}:</span>
                  <span class="text-text-strong font-mono font-semibold"
                    >{data.post.fov_width}° × {data.post.fov_height}°</span
                  >
                  {#if data.post.fov_rotation}
                    <span class="text-text-muted"
                      >(rot: <span class="text-text-strong font-mono font-semibold"
                        >{data.post.fov_rotation}°</span
                      >)</span
                    >
                  {/if}
                </div>
              {/if}
            </div>

            <div
              class="border-divider relative overflow-hidden rounded border-2"
              style="height: 300px;"
            >
              <div bind:this={aladinContainer} class="h-full w-full"></div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    <div class="flex flex-2/3 flex-col gap-4">
      <div class="flex w-full rounded-md bg-gray-800 p-1">
        <button
          onclick={() => (section = 'article')}
          class={[
            'w-1/2 cursor-pointer rounded-l-md p-1 transition-colors duration-100',
            section === 'article' ? 'bg-background ' : 'text-text-muted'
          ]}
        >
          {_lang.article}
        </button>
        <button
          onclick={() => (section = 'details')}
          class={[
            'w-1/2 cursor-pointer rounded-r-md p-1 transition-colors duration-100',
            section === 'details' ? 'bg-background ' : 'text-text-muted'
          ]}
        >
          {_lang.details}
        </button>
      </div>
      {#if section === 'article'}
        <Markdown
          class="w-full max-w-full"
          content={_langDynamic[data.post.content_md]}
        />
      {:else}
        <div class="flex flex-col gap-2">
          <H2 class="font-bold">{_lang.exposureDetails}</H2>
          <div class="border-text rounded-md border-2">
            <Table class="text-center">
              <THead>
                <Tr>
                  <Th>{_frames.date}</Th>
                  <Th>{_frames.type}</Th>
                  <Th>{_frames.count}</Th>
                  <Th>{_frames.seconds}</Th>
                  <Th>{_frames.total}</Th>
                </Tr>
              </THead>
              <TBody>
                {#each data.post.exposures as exposure (exposure.id)}
                  <Tr>
                    <Td>{formatDate(exposure.date, false)}</Td>
                    <Td>{_state.lang.frames[exposure.type as Frame]}</Td>
                    <Td class="text-center">{exposure.count}</Td>
                    <Td class="text-center">{exposure.exposure_time_s}</Td>
                    <Td class="text-center"
                      >{exposure.count * exposure.exposure_time_s}</Td
                    >
                  </Tr>
                {/each}
              </TBody>
            </Table>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <H2 class="font-bold">{_lang.equipmentDetails}</H2>
          <div class="flex flex-wrap gap-2">
            {#each data.post.equipment as equipment (equipment.name)}
              <div
                class="border-text flex w-full flex-col gap-1 rounded-md border-2 p-4 md:w-[calc(50%_-_0.5rem)]"
              >
                <H3 class="font-bold">{equipment.name}</H3>
                <span class="text-text-muted"
                  >{resolveTranslation(equipment.lang_key, _state.lang)}</span
                >
                <a
                  href={equipment.link}
                  class="mt-auto ml-auto text-blue-500"
                  target="_blank"><Icon name="bi-box-arrow-up-left" /></a
                >
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
