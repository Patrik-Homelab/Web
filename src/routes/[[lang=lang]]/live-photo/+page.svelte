<script lang="ts">
  import { H1, H2 } from '$/components/headers';
  import GuidingChart from '$/components/live/GuidingChart.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { API } from '$/lib/api';
  import { formatExposure } from '$/lib/functions';
  import { resolveLanguagable } from '$/lib/lang';
  import type { LiveStatus } from '$/lib/server/nina';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();
  const appState = getState();
  const obsStats = $derived(data.observatoryStats);
  const obsLang = $derived(appState.lang.live_photo.observatory_stats);
  const chartLang = $derived(appState.lang.live_photo.guiding_chart);
  const _langDynamic = $derived(data.dynamicTranslations);

  const maxTargetScore = $derived(
    Math.max(
      1,
      ...obsStats.topObjects.map((o) =>
        o.lightSeconds > 0 ? o.lightSeconds : o.articlesCount
      )
    )
  );
  const maxEquipScore = $derived(
    Math.max(1, ...obsStats.topEquipment.map((e) => e.articlesCount))
  );

  let liveData = $state<LiveStatus | null>(null);
  let now = $state(Date.now());
  let handler = $state<ReturnType<typeof setTimeout> | null>(null);

  const refreshData = async () => {
    try {
      const prevData = liveData;

      liveData = await API.telescope();

      if (
        liveData.active &&
        (prevData?.active != liveData.active ||
          liveData?.imageInfo?.Date != prevData?.imageInfo?.Date)
      ) {
        now = Date.now();
      }
    } catch {
      liveData = { active: false };
    }
  };

  const scheduleRefresh = async () => {
    await refreshData();
    handler = setTimeout(scheduleRefresh, 10000);
  };

  onMount(() => {
    scheduleRefresh();

    return () => {
      if (handler) clearTimeout(handler);
    };
  });
</script>

<section
  class="relative mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6 px-4 pt-6 pb-12 sm:px-6 md:pt-10 lg:px-8"
>
  <!-- Ambient background glow behind live indicator -->
  <div
    class="bg-primary/5 absolute top-12 left-1/2 -z-10 h-72 w-full max-w-3xl -translate-x-1/2 rounded-full blur-3xl filter"
  ></div>

  <!-- Page Header -->
  <div class="flex flex-col gap-2">
    <H1 class="text-left font-bold">{appState.lang.live_photo.title}</H1>
    <p class="text-text-muted text-sm leading-relaxed">
      {appState.lang.live_photo.description}
    </p>
    <p class="text-primary text-xs leading-relaxed italic">
      {appState.lang.live_photo.loading_description}
    </p>
  </div>

  <!-- Dashboard Grid -->
  <div class="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-4">
    <!-- Camera Viewfinder (Left 3 columns) -->
    <div class="flex flex-col gap-4 lg:col-span-3">
      <div
        class="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-slate-950/80 shadow-2xl"
      >
        <!-- Viewfinder corner marks -->
        <div
          class="absolute top-4 left-4 h-4 w-4 border-t-2 border-l-2 border-white/20"
        ></div>
        <div
          class="absolute top-4 right-4 h-4 w-4 border-t-2 border-r-2 border-white/20"
        ></div>
        <div
          class="absolute bottom-4 left-4 h-4 w-4 border-b-2 border-l-2 border-white/20"
        ></div>
        <div
          class="absolute right-4 bottom-4 h-4 w-4 border-r-2 border-b-2 border-white/20"
        ></div>

        <!-- Tech Overlay Info -->
        <div
          class="text-primary-text pointer-events-none absolute top-4 left-10 z-0 flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase"
        >
          <span
            class={[
              'h-1.5 w-1.5 rounded-full',
              liveData?.active ? 'bg-primary animate-pulse' : 'bg-text-muted'
            ].join(' ')}
          ></span>
          <span>{liveData?.active ? 'Live Camera Feed' : 'Camera Feed Offline'}</span>
        </div>

        <div
          class="text-text-muted pointer-events-none absolute right-10 bottom-4 z-0 font-mono text-[9px] tracking-wider uppercase"
        >
          {liveData?.imageInfo?.Date
            ? new Date(liveData.imageInfo.Date).toLocaleString()
            : '-'}
        </div>

        <!-- Central scope crosshair -->
        <div
          class="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-25"
        >
          <div class="bg-primary h-6 w-[1px]"></div>
          <div class="bg-primary h-[1px] w-6"></div>
          <div class="border-primary absolute h-8 w-8 rounded-full border"></div>
        </div>

        {#if liveData?.active && liveData?.showImage}
          <img
            src={`/api/live-image?t=${now}`}
            alt="Observatory Live feed"
            class="absolute inset-0 z-10 h-full w-full object-contain"
          />
        {/if}
      </div>

      <!-- PHD2 Guiding RMS Graph -->
      <div
        class="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-950/40 p-5 shadow-2xl backdrop-blur-md"
      >
        <div class="flex items-center justify-between border-b border-white/5 pb-3">
          <h2
            class="text-text-strong font-poppins flex items-center gap-2 text-base font-bold md:text-lg"
          >
            <Icon name="bi-graph-up" class="text-primary" />
            <span>{chartLang.title}</span>
          </h2>
          {#if liveData?.guideInfo}
            <span
              class="text-primary-text rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-xs font-bold"
            >
              {liveData.guideInfo.total.toFixed(2)}″ RMS
            </span>
          {/if}
        </div>

        {#if liveData?.active && (liveData.guideHistory?.length ?? 0) > 0}
          <GuidingChart history={liveData.guideHistory ?? []} />
        {:else}
          <div
            class="text-text-muted flex h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-black/20 px-4 text-center text-sm"
          >
            <Icon name="bi-activity" class="text-2xl opacity-40" />
            <span>{chartLang.empty}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Observatory Control Panel (Right 1 column) -->
    <div
      class="text-text flex h-fit flex-col gap-5 rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-md"
    >
      <!-- Panel Header -->
      <div class="flex items-center justify-between border-b border-white/5 pb-3">
        <h2
          class="text-text-strong font-poppins flex items-center gap-1.5 text-lg font-bold"
        >
          <Icon name="bi-hdd-network" class="text-primary" />
          <span>{appState.lang.live_photo.stats}</span>
        </h2>
        {#if liveData?.active}
          <span
            class="bg-primary/20 text-primary border-primary/25 flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest uppercase"
          >
            <span class="bg-primary h-1.5 w-1.5 animate-ping rounded-full"></span>
            ACTIVE
          </span>
        {:else}
          <span
            class="text-text-muted flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] font-extrabold tracking-widest uppercase"
          >
            <span class="bg-text-muted h-1.5 w-1.5 rounded-full"></span>
            STANDBY
          </span>
        {/if}
      </div>

      <div class="flex flex-col gap-4">
        <!-- Current Action Telemetry Card -->
        <div
          class="flex flex-col gap-1.5 rounded-xl border border-white/5 bg-white/5 p-4"
        >
          <span
            class="text-text-muted flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase"
          >
            <Icon name="bi-activity" class="text-primary text-[10px]" />
            {appState.lang.live_photo.current_status}
          </span>
          <p class="text-primary-text text-sm font-bold tracking-wide">
            {liveData?.currentAction || '-'}
          </p>
        </div>

        <!-- Mount Coordinates Card -->
        <div class="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-4">
          <span
            class="text-text-muted flex items-center gap-1 border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest uppercase"
          >
            <Icon name="bi-globe" class="text-primary text-[10px]" />
            {appState.lang.live_photo.mount}
          </span>
          <div class="grid grid-cols-2 gap-y-1.5 text-xs">
            <span class="text-text-muted font-bold uppercase">RA:</span>
            <span class="text-text-strong text-right font-mono font-bold"
              >{liveData?.mountInfo?.RightAscensionString || '-'}</span
            >

            <span class="text-text-muted font-bold uppercase">DEC:</span>
            <span class="text-text-strong text-right font-mono font-bold"
              >{liveData?.mountInfo?.DeclinationString || '-'}</span
            >
          </div>
        </div>

        <!-- Guiding Details Card -->
        <div class="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-4">
          <span
            class="text-text-muted flex items-center gap-1 border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest uppercase"
          >
            <Icon name="bi-bullseye" class="text-primary text-[10px]" />
            {appState.lang.live_photo.guide} (PHD2)
          </span>
          <div class="grid grid-cols-2 gap-y-1.5 text-xs">
            <span class="text-text-muted font-bold uppercase">RA Error:</span>
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.guideInfo ? `${liveData.guideInfo.ra.toFixed(2)}″` : '-'}</span
            >

            <span class="text-text-muted font-bold uppercase">Dec Error:</span>
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.guideInfo ? `${liveData.guideInfo.dec.toFixed(2)}″` : '-'}</span
            >

            <span class="text-primary font-bold uppercase">Total Error:</span>
            <span class="text-primary-text text-right font-mono font-bold">
              {liveData?.guideInfo
                ? `${liveData.guideInfo.total.toFixed(2)}″`
                : '-'}</span
            >
          </div>
        </div>

        <!-- Camera telemetry Details Card -->
        <div class="flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-4">
          <span
            class="text-text-muted flex items-center gap-1 border-b border-white/5 pb-1 text-[10px] font-bold tracking-widest uppercase"
          >
            <Icon name="bi-camera" class="text-primary text-[10px]" />
            {appState.lang.live_photo.image}
          </span>
          <div class="grid grid-cols-2 gap-y-2 text-xs">
            <span class="text-text-muted font-bold uppercase"
              >{appState.lang.live_photo.labels.target}:</span
            >
            <span
              class="text-text-strong truncate text-right font-bold"
              title={liveData?.imageInfo?.TargetName}
            >
              {liveData?.imageInfo?.TargetName || 'No info'}</span
            >

            <span class="text-text-muted font-bold uppercase"
              >{appState.lang.live_photo.labels.date}:</span
            >
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.imageInfo?.Date
                ? new Date(liveData.imageInfo.Date).toLocaleTimeString()
                : '-'}</span
            >

            <span class="text-text-muted font-bold uppercase"
              >{appState.lang.live_photo.labels.exposure}:</span
            >
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.imageInfo?.ExposureTime
                ? `${liveData.imageInfo.ExposureTime}s`
                : '-'}</span
            >

            <span class="text-text-muted font-bold uppercase"
              >{appState.lang.live_photo.labels.temp}:</span
            >
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.imageInfo?.Temperature
                ? `${liveData.imageInfo.Temperature}°C`
                : '-'}</span
            >

            <span class="text-text-muted font-bold uppercase"
              >{appState.lang.live_photo.labels.gain}:</span
            >
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.imageInfo?.Gain ?? '-'}</span
            >

            <span class="text-text-muted font-bold uppercase"
              >{appState.lang.live_photo.labels.focal_length}:</span
            >
            <span class="text-text-strong text-right font-mono font-bold">
              {liveData?.imageInfo?.FocalLength
                ? `${liveData.imageInfo.FocalLength}mm`
                : '-'}</span
            >

            <div class="col-span-2 mt-1 flex flex-col gap-1 border-t border-white/5 pt-2">
              <span class="text-text-muted text-[10px] font-bold uppercase"
                >{appState.lang.live_photo.labels.telescope}:</span
              >
              <span
                class="text-text-strong truncate rounded border border-white/5 bg-slate-900/60 p-2 text-xs font-bold"
                title={liveData?.imageInfo?.TelescopeName}
              >
                {liveData?.imageInfo?.TelescopeName || 'No info'}
              </span>
            </div>

            <div class="col-span-2 flex flex-col gap-1">
              <span class="text-text-muted text-[10px] font-bold uppercase"
                >{appState.lang.live_photo.labels.camera}:</span
              >
              <span
                class="text-text-strong truncate rounded border border-white/5 bg-slate-900/60 p-2 text-xs font-bold"
                title={liveData?.imageInfo?.CameraName}
              >
                {liveData?.imageInfo?.CameraName || 'No info'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Published Observatory Statistics -->
  <div class="mt-8 flex flex-col gap-6 border-t border-white/10 pt-8">
    <div class="flex flex-col gap-1">
      <H2 class="text-text-strong flex items-center gap-2 text-2xl font-bold">
        <Icon name="bi-stars" class="text-primary" />
        <span>{obsLang.title}</span>
      </H2>
      <p class="text-text-muted text-sm">{obsLang.subtitle}</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        class="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-xl backdrop-blur-md"
      >
        <span
          class="text-text-muted flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
        >
          <Icon name="bi-hourglass-split" class="text-primary" />
          {obsLang.light_time}
        </span>
        <span class="text-primary-text mt-1 font-mono text-2xl font-extrabold">
          {formatExposure(obsStats.totalLightSeconds) ?? '0s'}
        </span>
      </div>

      <div
        class="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-xl backdrop-blur-md"
      >
        <span
          class="text-text-muted flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
        >
          <Icon name="bi-camera-fill" class="text-primary" />
          {obsLang.total_frames}
        </span>
        <span class="text-text-strong mt-1 font-mono text-2xl font-extrabold">
          {obsStats.totalFrames.toLocaleString()}
        </span>
      </div>

      <div
        class="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-xl backdrop-blur-md"
      >
        <span
          class="text-text-muted flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
        >
          <Icon name="bi-journal-richtext" class="text-primary" />
          {obsLang.sessions}
        </span>
        <span class="text-text-strong mt-1 font-mono text-2xl font-extrabold">
          {obsStats.totalArticles}
        </span>
      </div>

      <div
        class="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-950/50 p-5 shadow-xl backdrop-blur-md"
      >
        <span
          class="text-text-muted flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
        >
          <Icon name="bi-compass" class="text-primary" />
          {obsLang.unique_objects}
        </span>
        <span class="text-text-strong mt-1 font-mono text-2xl font-extrabold">
          {obsStats.uniqueObjects}
        </span>
      </div>
    </div>

    <!-- Breakdown by Frame Type -->
    <div
      class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
    >
      <h3 class="text-text-strong flex items-center gap-2 text-sm font-bold uppercase">
        <Icon name="bi-layers-half" class="text-primary" />
        <span>{obsLang.frames_breakdown}</span>
      </h3>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {#each ['light', 'dark', 'flat', 'bias'] as const as frameType (frameType)}
          {@const item = obsStats.framesByType[frameType]}
          <div
            class="flex flex-col items-center gap-1 rounded-xl border border-white/5 bg-white/5 p-3 text-center"
          >
            <span class="text-text-muted text-xs font-bold tracking-wider uppercase">
              {appState.lang.frames[frameType]}
            </span>
            <span class="text-text-strong font-mono text-lg font-extrabold">
              {formatExposure(item.seconds) ?? '0s'}
            </span>
            <span class="text-text-muted text-xs">
              {item.count.toLocaleString()}
              {resolveLanguagable(appState.lang.gallery.framesCount, item.count)}
            </span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Top Targets & Top Equipment -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Top Targets -->
      <div
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
      >
        <h3 class="text-text-strong flex items-center gap-2 text-base font-bold">
          <Icon name="bi-bullseye" class="text-primary" />
          <span>{obsLang.top_targets}</span>
        </h3>
        <div class="flex flex-col gap-3">
          {#each obsStats.topObjects as obj (obj.id)}
            {@const score = obj.lightSeconds > 0 ? obj.lightSeconds : obj.articlesCount}
            {@const pct = Math.max(8, Math.round((score / maxTargetScore) * 100))}
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between gap-2 text-sm">
                <span class="text-text-strong truncate font-semibold">
                  {_langDynamic[obj.nameKey] || obj.id}
                </span>
                <span class="text-text-muted shrink-0 font-mono text-xs">
                  {formatExposure(obj.lightSeconds) ??
                    `${obj.articlesCount} ${resolveLanguagable(obsLang.session_count, obj.articlesCount)}`}
                </span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  class="from-primary to-secondary h-full rounded-full bg-gradient-to-r transition-all duration-500"
                  style="width: {pct}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Top Equipment -->
      <div
        class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 shadow-xl backdrop-blur-md"
      >
        <h3 class="text-text-strong flex items-center gap-2 text-base font-bold">
          <Icon name="bi-tools" class="text-primary" />
          <span>{obsLang.top_equipment}</span>
        </h3>
        <div class="flex flex-col gap-3">
          {#each obsStats.topEquipment as eq (eq.id)}
            {@const pct = Math.max(
              8,
              Math.round((eq.articlesCount / maxEquipScore) * 100)
            )}
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between gap-2 text-sm">
                <span class="text-text-strong truncate font-semibold">{eq.name}</span>
                <span class="text-text-muted shrink-0 font-mono text-xs">
                  {eq.articlesCount}
                  {resolveLanguagable(obsLang.session_count, eq.articlesCount)}
                  {#if formatExposure(eq.lightSeconds)}
                    • {formatExposure(eq.lightSeconds)}
                  {/if}
                </span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-500"
                  style="width: {pct}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
