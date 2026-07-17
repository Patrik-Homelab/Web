<script lang="ts">
  import { H1, H4 } from '$/components/headers';
  import { API } from '$/lib/api';
  import type { LiveStatus } from '$/lib/server/nina';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import Icon from '$/components/utility/Icon.svelte';

  const appState = getState();

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

<section class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
  <!-- Page Header -->
  <div class="flex flex-col gap-2">
    <H1 class="text-left font-bold">{appState.lang.live_photo.title}</H1>
    <H4 class="text-text-muted text-sm leading-relaxed"
      >{appState.lang.live_photo.description}</H4
    >
    <H4 class="text-primary text-xs leading-relaxed italic"
      >{appState.lang.live_photo.loading_description}</H4
    >
  </div>

  <!-- Dashboard Grid -->
  <div class="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
    <!-- Camera Viewfinder (Left 2 columns) -->
    <div class="flex flex-col gap-4 lg:col-span-2">
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
          class="text-primary-text pointer-events-none absolute top-4 left-10 z-20 flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase"
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
          class="text-text-muted pointer-events-none absolute right-10 bottom-4 z-20 font-mono text-[9px] tracking-wider uppercase"
        >
          {liveData?.imageInfo?.Date
            ? new Date(liveData.imageInfo.Date).toLocaleString()
            : '-'}
        </div>

        <!-- Central scope crosshair -->
        <div
          class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-25"
        >
          <div class="bg-primary h-6 w-[1px]"></div>
          <div class="bg-primary h-[1px] w-6"></div>
          <div class="border-primary absolute h-8 w-8 rounded-full border"></div>
        </div>

        <!-- Status display or image -->
        <span
          class="text-text-muted z-0 px-4 text-center font-mono text-sm tracking-wider uppercase"
        >
          {liveData?.active
            ? liveData?.currentAction || appState.lang.live_photo.inactive
            : appState.lang.live_photo.inactive}
        </span>

        {#if liveData?.active && liveData?.showImage}
          <img
            src={`/api/live-image?t=${now}`}
            alt="Observatory Live feed"
            class="absolute inset-0 z-10 h-full w-full object-contain"
          />
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
</section>
