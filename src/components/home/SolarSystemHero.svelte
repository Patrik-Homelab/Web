<script lang="ts">
  import {
    ASTEROID_BELT,
    getDaysSinceJ2000,
    getPlanetLongitudeDeg,
    normalizeDegrees,
    PLANETS,
    SUN_CONFIG,
    type CelestialBodyInfo,
    type PlanetConfig
  } from '$/lib/solarSystem';
  import { getState } from '$/lib/state.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { onMount } from 'svelte';

  interface Props {
    pointerX?: number; // normalized [-0.5, 0.5]
    pointerY?: number; // normalized [-0.5, 0.5]
  }

  let { pointerX = 0, pointerY = 0 }: Props = $props();

  const _state = getState();
  const currentLang = $derived((_state.selectedLang || 'cs') as 'cs' | 'en');

  let stageEl: HTMLDivElement;
  let sunEl: HTMLDivElement;
  let sceneCanvas: HTMLCanvasElement;

  // Interactive state
  let hoveredBody = $state<CelestialBodyInfo | null>(null);
  let selectedBody = $state<CelestialBodyInfo | null>(null);
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let isPaused = $state(false);
  let simSpeed = $state<1 | 5 | 10>(1);
  let isDragging = $state(false);
  let manualTiltOffset = $state(0);

  // Stored screen positions for hit-testing
  interface ScreenBody {
    info: CelestialBodyInfo;
    x: number;
    y: number;
    radius: number;
    isFront: boolean;
  }
  let screenBodies: ScreenBody[] = [];

  interface PlanetSprite {
    canvas: HTMLCanvasElement;
    halfSpanCss: number;
  }

  function resetView() {
    manualTiltOffset = 0;
    simSpeed = 1;
    isPaused = false;
    selectedBody = null;
  }

  function toggleSpeed() {
    if (simSpeed === 1) simSpeed = 5;
    else if (simSpeed === 5) simSpeed = 10;
    else simSpeed = 1;
  }

  onMount(() => {
    if (!stageEl || !sunEl || !sceneCanvas) return;

    const ctx = sceneCanvas.getContext('2d');
    if (!ctx) return;

    let width = 700;
    let height = 437.5;
    let sunRadius = 52;
    let dpr = 1;

    // Cached offscreen canvas for the static/semi-static orbit ellipses + solar corona
    const orbitCanvas = document.createElement('canvas');
    const orbitCtx = orbitCanvas.getContext('2d');
    let cachedRollRad = NaN;
    let cachedTiltRatio = NaN;
    let orbitCacheDirty = true;

    // Pre-rendered planet sprites (eliminates all per-frame createRadialGradient & ring strokes)
    const planetSprites = new Map<string, PlanetSprite>();

    const buildPlanetSprites = () => {
      planetSprites.clear();
      const maxScale = 1.3;
      const spriteScale = dpr * maxScale;

      for (const planet of PLANETS) {
        const baseRadius = planet.sizePx / 2;
        const glowExtent = baseRadius * 1.85;
        const ringExtent = planet.rings ? planet.rings.rx + 4 : 0;
        const halfSpanCss = Math.ceil(Math.max(glowExtent, ringExtent) + 2);
        const pixelSize = Math.ceil(halfSpanCss * 2 * spriteScale);

        const sCanvas = document.createElement('canvas');
        sCanvas.width = pixelSize;
        sCanvas.height = pixelSize;
        const sCtx = sCanvas.getContext('2d');
        if (!sCtx) continue;

        sCtx.setTransform(
          spriteScale,
          0,
          0,
          spriteScale,
          halfSpanCss * spriteScale,
          halfSpanCss * spriteScale
        );

        // 1. Back Ring Arc (behind planet sphere)
        if (planet.rings) {
          drawPlanetRingHalf(sCtx, planet, true);
        }

        // 2. Atmosphere Glow (baked once!)
        sCtx.beginPath();
        sCtx.arc(0, 0, baseRadius * 1.8, 0, Math.PI * 2);
        const glowGrad = sCtx.createRadialGradient(
          0,
          0,
          baseRadius * 0.4,
          0,
          0,
          baseRadius * 1.8
        );
        glowGrad.addColorStop(0, planet.glowColor);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        sCtx.fillStyle = glowGrad;
        sCtx.fill();

        // 3. 3D Shaded Planet Sphere (baked once!)
        const sphereGrad = sCtx.createRadialGradient(
          -baseRadius * 0.32,
          -baseRadius * 0.32,
          baseRadius * 0.1,
          0,
          0,
          baseRadius
        );
        sphereGrad.addColorStop(0, planet.colors.light);
        sphereGrad.addColorStop(0.55, planet.colors.mid);
        sphereGrad.addColorStop(1, planet.colors.dark);

        sCtx.beginPath();
        sCtx.arc(0, 0, baseRadius, 0, Math.PI * 2);
        sCtx.fillStyle = sphereGrad;
        sCtx.fill();

        // Jupiter atmospheric bands
        if (planet.id === 'jupiter') {
          sCtx.save();
          sCtx.beginPath();
          sCtx.arc(0, 0, baseRadius, 0, Math.PI * 2);
          sCtx.clip();
          sCtx.fillStyle = 'rgba(120, 53, 15, 0.45)';
          sCtx.fillRect(
            -baseRadius,
            -baseRadius * 0.28,
            baseRadius * 2,
            baseRadius * 0.2
          );
          sCtx.fillRect(
            -baseRadius,
            baseRadius * 0.16,
            baseRadius * 2,
            baseRadius * 0.22
          );
          sCtx.restore();
        }

        // 4. Front Ring Arc (in front of planet sphere)
        if (planet.rings) {
          drawPlanetRingHalf(sCtx, planet, false);
        }

        planetSprites.set(planet.id, { canvas: sCanvas, halfSpanCss });
      }
    };

    function drawPlanetRingHalf(
      sCtx: CanvasRenderingContext2D,
      planet: PlanetConfig,
      isBack: boolean
    ) {
      if (!planet.rings) return;
      const { rx, ry, tiltDeg, outerColor, innerColor } = planet.rings;
      const startAngle = isBack ? Math.PI : 0;
      const endAngle = isBack ? 0 : Math.PI;

      sCtx.save();
      sCtx.rotate((tiltDeg * Math.PI) / 180);

      sCtx.beginPath();
      sCtx.ellipse(0, 0, rx, ry, 0, startAngle, endAngle);
      sCtx.strokeStyle = outerColor;
      sCtx.lineWidth = isBack ? 2.2 : 2.4;
      sCtx.stroke();

      if (innerColor) {
        sCtx.beginPath();
        sCtx.ellipse(0, 0, rx * 0.76, ry * 0.76, 0, startAngle, endAngle);
        sCtx.strokeStyle = innerColor;
        sCtx.lineWidth = isBack ? 1.4 : 1.5;
        sCtx.stroke();
      }
      sCtx.restore();
    }

    const updateOrbitCache = (rollRad: number, tiltRatio: number) => {
      if (!orbitCtx) return;
      cachedRollRad = rollRad;
      cachedTiltRatio = tiltRatio;
      orbitCacheDirty = false;

      orbitCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      orbitCtx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Clip out the central Sun portrait circle for the back orbit arcs
      orbitCtx.save();
      orbitCtx.beginPath();
      orbitCtx.rect(0, 0, width, height);
      orbitCtx.arc(cx, cy, sunRadius, 0, Math.PI * 2, true);
      orbitCtx.clip('evenodd');

      // Back Orbit Arcs (dashed, behind Sun)
      for (const planet of PLANETS) {
        const rx = (planet.orbitPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        orbitCtx.save();
        orbitCtx.translate(cx, cy);
        orbitCtx.rotate(rollRad);
        orbitCtx.beginPath();
        orbitCtx.ellipse(0, 0, rx, ry, 0, Math.PI, 0);
        orbitCtx.setLineDash([4, 6]);
        orbitCtx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        orbitCtx.lineWidth = 1.2;
        orbitCtx.stroke();
        orbitCtx.restore();
      }
      orbitCtx.restore();

      // Front Orbit Arcs (luminous, in front of Sun)
      for (const planet of PLANETS) {
        const rx = (planet.orbitPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        orbitCtx.save();
        orbitCtx.translate(cx, cy);
        orbitCtx.rotate(rollRad);

        // Dark contrast under-stroke to pop over portrait
        orbitCtx.beginPath();
        orbitCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
        orbitCtx.setLineDash([]);
        orbitCtx.strokeStyle = 'rgba(2, 6, 23, 0.75)';
        orbitCtx.lineWidth = 3.6;
        orbitCtx.stroke();

        // High-contrast luminous front orbit line
        const frontGrad = orbitCtx.createLinearGradient(-rx, 0, rx, 0);
        frontGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        frontGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.75)');
        frontGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.95)');
        frontGrad.addColorStop(0.75, 'rgba(254, 240, 138, 0.75)');
        frontGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        orbitCtx.beginPath();
        orbitCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
        orbitCtx.strokeStyle = frontGrad;
        orbitCtx.lineWidth = 1.6;
        orbitCtx.stroke();
        orbitCtx.restore();
      }
    };

    const resize = () => {
      width = stageEl.clientWidth || 700;
      height = stageEl.clientHeight || 437.5;
      sunRadius = Math.max(36, (sunEl.offsetWidth || 80) / 2);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      sceneCanvas.width = Math.floor(width * dpr);
      sceneCanvas.height = Math.floor(height * dpr);
      orbitCanvas.width = Math.floor(width * dpr);
      orbitCanvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPlanetSprites();
      orbitCacheDirty = true;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stageEl);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(stageEl);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const prefersReducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let rafId = 0;
    let ambientSeconds = 0;
    let smoothX = 0;
    let smoothY = 0;
    let lastTime = performance.now();
    let lastDrawTime = 0;
    const epochMs = Date.now();
    const daysSinceJ2000 = getDaysSinceJ2000(epochMs);

    // Target ~36 FPS: silky orbital motion while cutting mobile GPU load
    const minFrameInterval = 1000 / 36;

    const drawPlanetPass = (
      isFrontPass: boolean,
      cx: number,
      cy: number,
      tiltRatio: number,
      cosRoll: number,
      sinRoll: number
    ) => {
      // 1. Asteroid belt particles
      ctx.fillStyle = 'rgba(254, 243, 199, 0.42)';
      ctx.beginPath();
      for (const rock of ASTEROID_BELT) {
        const deg = normalizeDegrees(
          rock.angleDeg - ambientSeconds * rock.speedDegPerSec
        );
        const rad = (-deg * Math.PI) / 180;
        const sinVal = Math.sin(rad);
        if (sinVal >= 0 !== isFrontPass) continue;

        const cosVal = Math.cos(rad);
        const rx = (rock.radiusPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        const unX = cosVal * rx;
        const unY = sinVal * ry;
        const x = cx + unX * cosRoll - unY * sinRoll;
        const y = cy + unX * sinRoll + unY * cosRoll;
        const r = (rock.sizePx / 2) * (1 + 0.22 * sinVal);

        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();

      // 2. Planets & Moons
      for (const planet of PLANETS) {
        const longitudeDeg = getPlanetLongitudeDeg(
          planet,
          daysSinceJ2000,
          ambientSeconds
        );
        const rad = (-longitudeDeg * Math.PI) / 180;
        const sinVal = Math.sin(rad);
        if (sinVal >= 0 !== isFrontPass) continue;

        const cosVal = Math.cos(rad);
        const rx = (planet.orbitPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        const unX = cosVal * rx;
        const unY = sinVal * ry;
        const x = cx + unX * cosRoll - unY * sinRoll;
        const y = cy + unX * sinRoll + unY * cosRoll;

        const depthScale = 1 + 0.25 * sinVal;
        const depthOpacity = 0.75 + 0.25 * sinVal;

        // Register screen coordinates for hit testing
        screenBodies.push({
          info: planet,
          x,
          y,
          radius: (planet.sizePx / 2) * depthScale,
          isFront: isFrontPass
        });

        ctx.globalAlpha = depthOpacity;

        // Back Moons
        if (planet.moons) {
          for (const moon of planet.moons) {
            const moonDeg = normalizeDegrees(
              moon.initialPhaseDeg -
                ambientSeconds * (360 / Math.max(3, moon.periodDays * 0.35))
            );
            const moonRad = (moonDeg * Math.PI) / 180;
            const moonSin = Math.sin(moonRad);
            if (moonSin < 0) {
              const mX = x + Math.cos(moonRad) * moon.radiusPx * depthScale;
              const mY = y + moonSin * moon.radiusPx * 0.45 * depthScale;
              ctx.beginPath();
              ctx.arc(mX, mY, (moon.sizePx / 2) * depthScale, 0, Math.PI * 2);
              ctx.fillStyle = moon.color;
              ctx.fill();
            }
          }
        }

        // Draw Interactive Selection / Hover Reticle Halo
        const isHovered = hoveredBody?.id === planet.id;
        const isSelected = selectedBody?.id === planet.id;

        if (isHovered || isSelected) {
          ctx.save();
          ctx.beginPath();
          const haloRadius = Math.max(14, (planet.sizePx / 2) * depthScale + 8);
          ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected
            ? 'rgba(253, 224, 71, 0.95)'
            : 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = isSelected ? 2 : 1.4;
          ctx.setLineDash(isSelected ? [4, 4] : [2, 3]);
          ctx.stroke();

          // Outer pulse glow
          ctx.beginPath();
          ctx.arc(x, y, haloRadius * 1.35, 0, Math.PI * 2);
          ctx.strokeStyle = planet.glowColor;
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.stroke();
          ctx.restore();
        }

        // Pre-rendered Planet Sprite
        const sprite = planetSprites.get(planet.id);
        if (sprite) {
          const drawHalf = sprite.halfSpanCss * depthScale;
          ctx.drawImage(
            sprite.canvas,
            x - drawHalf,
            y - drawHalf,
            drawHalf * 2,
            drawHalf * 2
          );
        }

        // Front Moons
        if (planet.moons) {
          for (const moon of planet.moons) {
            const moonDeg = normalizeDegrees(
              moon.initialPhaseDeg -
                ambientSeconds * (360 / Math.max(3, moon.periodDays * 0.35))
            );
            const moonRad = (moonDeg * Math.PI) / 180;
            const moonSin = Math.sin(moonRad);
            if (moonSin >= 0) {
              const mX = x + Math.cos(moonRad) * moon.radiusPx * depthScale;
              const mY = y + moonSin * moon.radiusPx * 0.45 * depthScale;
              ctx.beginPath();
              ctx.arc(mX, mY, (moon.sizePx / 2) * depthScale, 0, Math.PI * 2);
              ctx.fillStyle = moon.color;
              ctx.fill();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);

      if (!isVisible) {
        lastTime = now;
        return;
      }

      const elapsedSinceDraw = now - lastDrawTime;
      if (elapsedSinceDraw < minFrameInterval) {
        return;
      }

      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;
      lastDrawTime = now;

      // Advance time only if not paused
      if (!isPaused) {
        ambientSeconds += dt * simSpeed;
      }

      const prefersReducedMotion = prefersReducedMotionQuery.matches;
      const targetX = prefersReducedMotion ? 0 : pointerX;
      const targetY = prefersReducedMotion ? 0 : pointerY;
      smoothX += (targetX - smoothX) * 0.08;
      smoothY += (targetY - smoothY) * 0.08;

      const cx = width / 2;
      const cy = height / 2;

      const tiltRatio = Math.max(
        0.18,
        Math.min(0.55, 0.36 - smoothY * 0.05 + manualTiltOffset)
      );
      const rollDeg = -9 + smoothX * 4.5;
      const rollRad = (rollDeg * Math.PI) / 180;
      const cosRoll = Math.cos(rollRad);
      const sinRoll = Math.sin(rollRad);

      // Rebuild cached orbit layer when tilt/roll changes
      if (
        orbitCacheDirty ||
        Math.abs(rollRad - cachedRollRad) > 0.0015 ||
        Math.abs(tiltRatio - cachedTiltRatio) > 0.0015
      ) {
        updateOrbitCache(rollRad, tiltRatio);
      }

      ctx.clearRect(0, 0, width, height);

      // Reset screen coordinates before passes
      screenBodies = [
        {
          info: SUN_CONFIG,
          x: cx,
          y: cy,
          radius: sunRadius,
          isFront: true
        }
      ];

      // 1. Blit pre-rendered back + front orbit ellipses (masked around Sun)
      ctx.drawImage(orbitCanvas, 0, 0, width, height);

      // 2. Back-half asteroids & planets
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2, true);
      ctx.clip('evenodd');
      drawPlanetPass(false, cx, cy, tiltRatio, cosRoll, sinRoll);
      ctx.restore();

      // Highlight Sun if selected or hovered
      if (hoveredBody?.id === 'sun' || selectedBody?.id === 'sun') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.9)';
        ctx.lineWidth = 2.2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Front-half asteroids & planets
      drawPlanetPass(true, cx, cy, tiltRatio, cosRoll, sinRoll);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  // Pointer Interaction Handlers (Click, Hover, Drag to Rotate)
  let dragStartY = 0;
  let didDrag = false;

  function findBodyAtPoint(clientX: number, clientY: number): CelestialBodyInfo | null {
    if (!stageEl) return null;
    const rect = stageEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check planets first (top priority)
    for (let i = screenBodies.length - 1; i >= 0; i--) {
      const body = screenBodies[i];
      if (body.info.id === 'sun') continue;
      const hitRadius = Math.max(16, body.radius + 10);
      const dist = Math.hypot(x - body.x, y - body.y);
      if (dist <= hitRadius) {
        return body.info;
      }
    }

    // Check central Sun
    const sunBody = screenBodies.find((b) => b.info.id === 'sun');
    if (sunBody) {
      const dist = Math.hypot(x - sunBody.x, y - sunBody.y);
      if (dist <= sunBody.radius + 6) {
        return SUN_CONFIG;
      }
    }

    return null;
  }

  function handlePointerDown(e: PointerEvent) {
    if (e.button !== 0) return; // Only primary button
    isDragging = true;
    didDrag = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  }

  function handlePointerMove(e: PointerEvent) {
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();

    if (isDragging) {
      const dy = e.clientY - dragStartY;
      if (Math.abs(dy) > 3) {
        didDrag = true;
        manualTiltOffset = Math.max(-0.16, Math.min(0.2, manualTiltOffset + dy * 0.0016));
        dragStartY = e.clientY;
      }
      return;
    }

    const hit = findBodyAtPoint(e.clientX, e.clientY);
    hoveredBody = hit;
    if (hit) {
      tooltipX = e.clientX - rect.left;
      tooltipY = e.clientY - rect.top - 20;
    }
  }

  function handlePointerUp(e: PointerEvent) {
    if (!didDrag) {
      const hit = findBodyAtPoint(e.clientX, e.clientY);
      if (hit) {
        selectedBody = selectedBody?.id === hit.id ? null : hit;
      } else {
        selectedBody = null;
      }
    }
    isDragging = false;
  }

  function handlePointerLeave() {
    isDragging = false;
    hoveredBody = null;
  }
</script>

<div class="flex flex-col items-center">
  <!-- Interactive 2.5D Solar System Container -->
  <div
    bind:this={stageEl}
    role="region"
    aria-label="Interactive 2.5D Solar System"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointerleave={handlePointerLeave}
    style="contain: layout paint;"
    class="relative flex aspect-[16/10] w-[350px] max-w-[96vw] touch-none items-center justify-center select-none sm:w-[560px] md:w-[680px] xl:w-[740px] {isDragging
      ? 'cursor-grabbing'
      : hoveredBody
        ? 'cursor-pointer'
        : 'cursor-ns-resize'}"
  >
    <!-- 1. CENTRAL SOLAR CORE / SUN PORTRAIT (z-10) -->
    <div
      bind:this={sunEl}
      class="pointer-events-none relative z-10 flex h-[80px] w-[80px] items-center justify-center rounded-full sm:h-[105px] sm:w-[105px] md:h-[120px] md:w-[120px]"
    >
      <div
        class="relative h-full w-full overflow-hidden rounded-full border-2 border-amber-200/80 bg-slate-900 shadow-[0_0_45px_8px_rgba(251,191,36,0.45),0_0_90px_20px_rgba(234,88,12,0.25)] transition-transform duration-300 {selectedBody?.id ===
        'sun'
          ? 'scale-105 ring-4 ring-amber-400'
          : ''}"
      >
        <picture>
          <source
            srcset="/images/Image-400.webp 400w, /images/Image-800.webp 800w"
            type="image/webp"
            sizes="(max-width: 640px) 160px, 300px"
          />
          <source
            srcset="/images/Image-400.jpg 400w, /images/Image-800.jpg 800w"
            type="image/jpeg"
            sizes="(max-width: 640px) 160px, 300px"
          />
          <img
            src="/images/Image-400.jpg"
            alt="Patrik Mintěl Profile"
            loading="eager"
            decoding="async"
            fetchpriority="high"
            width="120"
            height="120"
            class="h-full w-full object-cover object-center"
          />
        </picture>
      </div>
    </div>

    <!-- 2. SINGLE COMPOSITED SOLAR SYSTEM CANVAS (z-20) -->
    <canvas
      bind:this={sceneCanvas}
      class="pointer-events-none absolute inset-0 z-20 h-full w-full"
    ></canvas>

    <!-- 3. INTERACTIVE FLOATING HOVER TOOLTIP -->
    {#if hoveredBody && !isDragging}
      <div
        class="pointer-events-none absolute z-30 flex -translate-x-1/2 -translate-y-full items-center rounded-full border border-white/15 bg-slate-950/90 px-3 py-1 font-mono text-xs font-bold text-white shadow-xl backdrop-blur-md transition-all duration-150"
        style="left: {tooltipX}px; top: {tooltipY}px;"
      >
        <span>{hoveredBody.name[currentLang]}</span>
      </div>
    {/if}

    <!-- 4. CONTROLS STRIP (Play/Pause, Speed, Reset view) -->
    <div
      class="absolute right-2 bottom-2 z-30 flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 p-1 shadow-lg backdrop-blur-md"
    >
      <button
        type="button"
        onclick={(e) => {
          e.stopPropagation();
          isPaused = !isPaused;
        }}
        title={isPaused ? 'Spustit simulaci' : 'Pozastavit simulaci'}
        aria-label="Pause/Resume simulation"
        class="text-text-muted hover:text-text flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <Icon name={isPaused ? 'bi-play-fill' : 'bi-pause-fill'} class="text-sm" />
      </button>

      <button
        type="button"
        onclick={(e) => {
          e.stopPropagation();
          toggleSpeed();
        }}
        title="Rychlost simulace"
        class="text-text-muted hover:text-text px-2 py-0.5 font-mono text-[11px] font-bold transition-colors hover:bg-white/10"
      >
        {simSpeed}x
      </button>

      <button
        type="button"
        onclick={(e) => {
          e.stopPropagation();
          resetView();
        }}
        title="Resetovat pohled"
        aria-label="Reset view"
        class="text-text-muted hover:text-text flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
      >
        <Icon name="bi-arrow-counterclockwise" class="text-xs" />
      </button>
    </div>
  </div>

  <!-- 5. SELECTED CELESTIAL BODY HUD CARD (Matching site's glass bio cards) -->
  {#if selectedBody}
    <div
      class="relative mt-4 flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300"
    >
      <!-- HUD Header -->
      <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h3 class="text-text-strong text-lg font-bold">
            {selectedBody.name[currentLang]}
          </h3>
          <span class="text-text-muted text-xs">
            {selectedBody.type[currentLang]}
          </span>
        </div>

        <button
          type="button"
          onclick={() => (selectedBody = null)}
          aria-label="Zavřít detail planety"
          class="text-text-muted hover:text-text flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <Icon name="bi-x-lg" class="text-sm" />
        </button>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-3 gap-2 py-1 text-center font-mono text-xs">
        <div class="rounded-xl border border-white/5 bg-white/5 p-2.5">
          <span class="text-text-muted block text-[10px] tracking-wider uppercase">
            {currentLang === 'cs' ? 'Oběh' : 'Orbit'}
          </span>
          <span class="text-text-strong mt-0.5 block font-bold">
            {selectedBody.orbitPeriod[currentLang]}
          </span>
        </div>

        <div class="rounded-xl border border-white/5 bg-white/5 p-2.5">
          <span class="text-text-muted block text-[10px] tracking-wider uppercase">
            {currentLang === 'cs' ? 'Vzdálenost' : 'Distance'}
          </span>
          <span class="text-text-strong mt-0.5 block font-bold">
            {selectedBody.distanceAu}
          </span>
        </div>

        <div class="rounded-xl border border-white/5 bg-white/5 p-2.5">
          <span class="text-text-muted block text-[10px] tracking-wider uppercase">
            {currentLang === 'cs' ? 'Měsíce' : 'Moons'}
          </span>
          <span class="text-text-strong mt-0.5 block font-bold">
            {selectedBody.moonsCount}
          </span>
        </div>
      </div>

      <!-- Description / Fun Fact -->
      <p class="text-text-muted text-sm leading-relaxed">
        {selectedBody.description[currentLang]}
      </p>
    </div>
  {/if}
</div>
