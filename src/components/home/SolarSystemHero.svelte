<script lang="ts">
  import Icon from '$/components/utility/Icon.svelte';
  import {
    ASTEROID_BELT,
    getDaysSinceJ2000,
    getPlanetLongitudeDeg,
    normalizeDegrees,
    PLANETS,
    type PlanetConfig,
    type PlanetId
  } from '$/lib/solarSystem';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';

  interface Props {
    pointerX?: number; // normalized [-0.5, 0.5]
    pointerY?: number; // normalized [-0.5, 0.5]
  }

  let { pointerX = 0, pointerY = 0 }: Props = $props();

  const _state = getState();
  const labels = $derived(_state.lang.main.solarSystem);

  let isTimeLapse = $state(false);
  let activePlanetId = $state<PlanetId | null>(null);
  let simulatedOffsetDays = $state(0);
  let ambientSeconds = $state(0);
  let beltRotationDeg = $state(0);
  let currentEpochMs = $state(Date.now());

  // Smoothed 3D tilt angles
  let tiltX = $state(0);
  let tiltY = $state(0);

  const daysSinceJ2000 = $derived(
    getDaysSinceJ2000(currentEpochMs) + simulatedOffsetDays
  );

  const simulatedDateStr = $derived.by(() => {
    const simMs = currentEpochMs + simulatedOffsetDays * 86_400_000;
    const d = new Date(simMs);
    return d.toISOString().slice(0, 10);
  });

  const planetStates = $derived.by(() => {
    return PLANETS.map((planet) => {
      const angleDeg = getPlanetLongitudeDeg(planet, daysSinceJ2000, ambientSeconds);
      const exactJ2000Deg = normalizeDegrees(planet.L0 + planet.LRate * daysSinceJ2000);
      const rad = (angleDeg * Math.PI) / 180;
      const radiusPct = planet.orbitPct / 2;
      const xPct = 50 + Math.cos(rad) * radiusPct;
      const yPct = 50 - Math.sin(rad) * radiusPct;

      const moons = (planet.moons ?? []).map((moon) => {
        const moonDeg = normalizeDegrees(
          moon.initialPhaseDeg +
            (daysSinceJ2000 / moon.periodDays) * 360 +
            ambientSeconds * (360 / Math.max(4, moon.periodDays * 0.45))
        );
        const moonRad = (moonDeg * Math.PI) / 180;
        return {
          ...moon,
          xPx: Math.cos(moonRad) * moon.radiusPx,
          yPx: -Math.sin(moonRad) * moon.radiusPx
        };
      });

      return {
        planet,
        angleDeg,
        exactJ2000Deg,
        xPct,
        yPct,
        moons
      };
    });
  });

  const activePlanetData = $derived(
    activePlanetId
      ? (planetStates.find((item) => item.planet.id === activePlanetId) ?? null)
      : null
  );

  function formatPeriod(planet: PlanetConfig): string {
    if (planet.periodDays >= 600) {
      return `${(planet.periodDays / 365.25).toFixed(1)} ${labels.years}`;
    }
    return `${Math.round(planet.periodDays)} ${labels.days}`;
  }

  function toggleMode() {
    isTimeLapse = !isTimeLapse;
    if (!isTimeLapse) {
      simulatedOffsetDays = 0;
      currentEpochMs = Date.now();
    }
  }

  onMount(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const animationsActive =
        _state.starsEnabled !== false && !prefersReducedMotion && !document.hidden;

      if (animationsActive) {
        const hoverSlowdown = activePlanetId ? 0.2 : 1;
        ambientSeconds += dt * hoverSlowdown;
        beltRotationDeg = (beltRotationDeg + dt * 1.6 * hoverSlowdown) % 360;

        if (isTimeLapse) {
          // Advance ~45 Earth days per second in time-lapse mode
          simulatedOffsetDays += dt * 45 * hoverSlowdown;
        }
      }

      // Smooth 3D tilt interpolation toward pointer
      const targetTiltX = animationsActive ? -pointerY * 18 : 0;
      const targetTiltY = animationsActive ? pointerX * 18 : 0;
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  });
</script>

<div class="relative flex flex-col items-center justify-center select-none">
  <!-- Main Interactive Orbital Stage -->
  <div
    class="relative flex h-[340px] w-[340px] items-center justify-center sm:h-[460px] sm:w-[460px] xl:h-[500px] xl:w-[500px]"
    style="perspective: 1100px;"
  >
    <!-- 3D Tilted Orbital Plane -->
    <div
      class="relative flex h-full w-full items-center justify-center transition-transform duration-75 ease-out"
      style="transform: rotateX({tiltX.toFixed(2)}deg) rotateY({tiltY.toFixed(
        2
      )}deg); transform-style: preserve-3d;"
    >
      <!-- Ambient Deep Solar Corona Backdrop -->
      <div
        class="from-primary/25 via-secondary/15 pointer-events-none absolute h-[58%] w-[58%] rounded-full bg-gradient-to-tr to-transparent blur-2xl"
      ></div>

      <!-- Asteroid Belt (Between Mars 75% and Jupiter 83.5%) -->
      <div
        class="pointer-events-none absolute inset-0"
        style="transform: rotate({beltRotationDeg.toFixed(2)}deg);"
      >
        {#each ASTEROID_BELT as rock, idx (idx)}
          {@const rad = (rock.angleDeg * Math.PI) / 180}
          {@const r = rock.radiusPct / 2}
          {@const x = 50 + Math.cos(rad) * r}
          {@const y = 50 - Math.sin(rad) * r}
          <span
            class="absolute rounded-full bg-amber-100/70"
            style="left: {x}%; top: {y}%; width: {rock.sizePx}px; height: {rock.sizePx}px; opacity: {rock.opacity}; transform: translate(-50%, -50%);"
          ></span>
        {/each}
      </div>

      <!-- Concentric Planetary Orbit Tracks -->
      {#each planetStates as { planet } (planet.id)}
        {@const isHighlighted = activePlanetId === planet.id}
        <div
          class="pointer-events-none absolute rounded-full border transition-all duration-300 {isHighlighted
            ? 'border-primary/65 shadow-[0_0_20px_rgba(249,115,22,0.22)]'
            : 'border-white/[0.09]'}"
          style="width: {planet.orbitPct}%; height: {planet.orbitPct}%;"
        ></div>
      {/each}

      <!-- Central Solar Core (Profile Photo + Corona Rings) -->
      <div
        class="relative z-10 flex h-[48%] w-[48%] items-center justify-center rounded-full"
        style="transform: translateZ(14px);"
      >
        <!-- Rotating Solar Prominence Rim -->
        <div
          class="border-primary/30 animate-spin-slow pointer-events-none absolute -inset-2 rounded-full border border-dashed"
        ></div>
        <div
          class="from-primary to-secondary animate-pulse-slow pointer-events-none absolute -inset-1.5 rounded-full bg-gradient-to-tr via-amber-400 opacity-35 blur-md"
        ></div>

        <!-- Profile Picture Frame -->
        <div
          class="relative h-full w-full overflow-hidden rounded-full border-2 border-amber-300/35 bg-slate-900 shadow-[0_0_35px_rgba(249,115,22,0.28)] transition-transform duration-500 hover:scale-103"
        >
          <picture>
            <source
              srcset="/images/Image-400.webp 400w, /images/Image-800.webp 800w"
              type="image/webp"
              sizes="(max-width: 640px) 400px, 800px"
            />
            <source
              srcset="/images/Image-400.jpg 400w, /images/Image-800.jpg 800w"
              type="image/jpeg"
              sizes="(max-width: 640px) 400px, 800px"
            />
            <img
              src="/images/Image-400.jpg"
              alt="Patrik Mintěl Profile"
              loading="eager"
              decoding="async"
              fetchpriority="high"
              width="240"
              height="240"
              class="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
            />
          </picture>
        </div>
      </div>

      <!-- Orbiting Planets, Rings & Moons -->
      {#each planetStates as { planet, xPct, yPct, moons } (planet.id)}
        {@const isHovered = activePlanetId === planet.id}
        <button
          type="button"
          aria-label={labels.planets[planet.id]}
          onmouseenter={() => (activePlanetId = planet.id)}
          onmouseleave={() => {
            if (activePlanetId === planet.id) activePlanetId = null;
          }}
          onfocus={() => (activePlanetId = planet.id)}
          onblur={() => {
            if (activePlanetId === planet.id) activePlanetId = null;
          }}
          onclick={() =>
            (activePlanetId = activePlanetId === planet.id ? null : planet.id)}
          class="group absolute z-20 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-2 focus:outline-none"
          style="left: {xPct}%; top: {yPct}%; transform: translate(-50%, -50%) translateZ(22px);"
        >
          <!-- Natural Satellites (Moons) -->
          {#each moons as moon (moon.id)}
            <span
              class="pointer-events-none absolute rounded-full shadow-xs"
              style="width: {moon.sizePx}px; height: {moon.sizePx}px; background: {moon.color}; transform: translate({moon.xPx.toFixed(
                1
              )}px, {moon.yPx.toFixed(1)}px); box-shadow: 0 0 4px {moon.color};"
            ></span>
          {/each}

          <!-- Planetary Ring System (Saturn / Uranus) -->
          {#if planet.rings}
            <span
              class="pointer-events-none absolute rounded-full border-2"
              style="width: {planet.rings.widthPx}px; height: {planet.rings
                .heightPx}px; border-color: {planet.rings
                .borderColor}; transform: rotate({planet.rings.tiltDeg}deg); {planet.rings
                .innerBorderColor
                ? `box-shadow: inset 0 0 0 1.5px ${planet.rings.innerBorderColor};`
                : ''}"
            ></span>
          {/if}

          <!-- Planet Sphere -->
          <span
            class="relative block rounded-full transition-transform duration-200 {isHovered
              ? 'scale-150 ring-2 ring-white/80'
              : 'group-hover:scale-135'}"
            style="width: {planet.sizePx}px; height: {planet.sizePx}px; background: {planet.gradient}; box-shadow: 0 0 {isHovered
              ? 16
              : 10}px {planet.glowColor};"
          ></span>
        </button>
      {/each}
    </div>

    <!-- Floating Telemetry Tooltip HUD (Top/Bottom Overlay) -->
    {#if activePlanetData}
      {@const { planet, exactJ2000Deg } = activePlanetData}
      <div
        class="pointer-events-none absolute -top-2 left-1/2 z-30 flex w-max max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-2 text-xs shadow-2xl backdrop-blur-xl sm:gap-4 sm:text-sm"
      >
        <div class="flex items-center gap-2">
          <span
            class="inline-block h-3 w-3 rounded-full"
            style="background: {planet.gradient}; box-shadow: 0 0 8px {planet.glowColor};"
          ></span>
          <span class="text-text-strong font-bold tracking-wide">
            {labels.planets[planet.id]}
          </span>
        </div>
        <div class="h-3.5 w-px bg-white/15"></div>
        <div class="font-mono text-[11px] sm:text-xs">
          <span class="text-text-muted">{labels.longitude}:</span>
          <span class="text-primary ml-1 font-semibold">{exactJ2000Deg.toFixed(1)}°</span>
        </div>
        <div class="hidden h-3.5 w-px bg-white/15 sm:block"></div>
        <div class="hidden font-mono text-xs sm:block">
          <span class="text-text-muted">{labels.distance}:</span>
          <span class="text-text-strong ml-1 font-semibold">{planet.au} AU</span>
        </div>
        <div class="h-3.5 w-px bg-white/15"></div>
        <div class="font-mono text-[11px] sm:text-xs">
          <span class="text-text-muted">{formatPeriod(planet)}</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- Compact Control & Planet Selector Bar -->
  <div
    class="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-3.5 py-1.5 text-xs shadow-xl backdrop-blur-md"
  >
    <!-- Live J2000 vs Time-Lapse Toggle -->
    <button
      type="button"
      onclick={toggleMode}
      class="flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold transition-all duration-200 {isTimeLapse
        ? 'bg-primary/20 text-primary border-primary/30 border'
        : 'text-text-strong border border-transparent bg-white/5 hover:bg-white/10'}"
    >
      <span
        class="h-2 w-2 rounded-full {isTimeLapse
          ? 'bg-primary animate-ping'
          : 'bg-emerald-400 shadow-[0_0_6px_#34d399]'}"
      ></span>
      <span>{isTimeLapse ? labels.timeLapse : labels.liveJ2000}</span>
      <span class="text-text-muted ml-1 hidden sm:inline">({simulatedDateStr})</span>
    </button>

    <div class="h-3.5 w-px bg-white/10"></div>

    <!-- Quick Planet Inspector Dots -->
    <div class="flex items-center gap-1.5 px-1">
      {#each PLANETS as planet (planet.id)}
        {@const isSelected = activePlanetId === planet.id}
        <button
          type="button"
          title={labels.planets[planet.id]}
          aria-label={labels.planets[planet.id]}
          onmouseenter={() => (activePlanetId = planet.id)}
          onmouseleave={() => {
            if (activePlanetId === planet.id) activePlanetId = null;
          }}
          onclick={() =>
            (activePlanetId = activePlanetId === planet.id ? null : planet.id)}
          class="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-transform duration-200 {isSelected
            ? 'scale-125 bg-white/15 ring-1 ring-white/40'
            : 'hover:scale-115 hover:bg-white/10'}"
        >
          <span
            class="block rounded-full"
            style="width: {Math.max(
              6,
              Math.min(11, planet.sizePx * 0.75)
            )}px; height: {Math.max(
              6,
              Math.min(11, planet.sizePx * 0.75)
            )}px; background: {planet.gradient}; box-shadow: 0 0 6px {planet.glowColor};"
          ></span>
        </button>
      {/each}
    </div>

    {#if isTimeLapse}
      <button
        type="button"
        onclick={() => {
          isTimeLapse = false;
          simulatedOffsetDays = 0;
          currentEpochMs = Date.now();
        }}
        title={labels.liveJ2000}
        class="text-text-muted hover:text-text-strong flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <Icon name="bi-arrow-counterclockwise" class="text-xs" />
      </button>
    {/if}
  </div>
</div>
