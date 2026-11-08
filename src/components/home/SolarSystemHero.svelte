<script lang="ts">
  import {
    ASTEROID_BELT,
    getDaysSinceJ2000,
    getPlanetLongitudeDeg,
    normalizeDegrees,
    PLANETS
  } from '$/lib/solarSystem';
  import { onMount } from 'svelte';

  interface Props {
    pointerX?: number; // normalized [-0.5, 0.5]
    pointerY?: number; // normalized [-0.5, 0.5]
  }

  let { pointerX = 0, pointerY = 0 }: Props = $props();

  let stageEl: HTMLDivElement;
  let backCanvas: HTMLCanvasElement;
  let frontCanvas: HTMLCanvasElement;

  onMount(() => {
    if (!stageEl || !backCanvas || !frontCanvas) return;

    const ctxBack = backCanvas.getContext('2d');
    const ctxFront = frontCanvas.getContext('2d');
    if (!ctxBack || !ctxFront) return;

    let width = 700;
    let height = 437.5;
    let dpr = 1;

    const resize = () => {
      width = stageEl.clientWidth || 700;
      height = stageEl.clientHeight || 437.5;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      backCanvas.width = Math.floor(width * dpr);
      backCanvas.height = Math.floor(height * dpr);
      frontCanvas.width = Math.floor(width * dpr);
      frontCanvas.height = Math.floor(height * dpr);

      ctxBack.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxFront.setTransform(dpr, 0, 0, dpr, 0, 0);
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
      if (document.hidden) {
        isVisible = false;
      } else {
        isVisible = true;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let rafId = 0;
    let ambientSeconds = 0;
    let smoothX = 0;
    let smoothY = 0;
    let lastTime = performance.now();
    let lastDrawTime = 0;
    const epochMs = Date.now();
    const daysSinceJ2000 = getDaysSinceJ2000(epochMs);

    // Target ~45 FPS: butter-smooth for tranquil orbits while halving CPU/GPU wakeups on mobile
    const minFrameInterval = 1000 / 45;

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

      ambientSeconds += dt;

      // Smooth pointer parallax tilt (disabled if reduced motion requested)
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const targetX = prefersReducedMotion ? 0 : pointerX;
      const targetY = prefersReducedMotion ? 0 : pointerY;
      smoothX += (targetX - smoothX) * 0.08;
      smoothY += (targetY - smoothY) * 0.08;

      const cx = width / 2;
      const cy = height / 2;

      // 2.5D perspective inclination and roll
      const tiltRatio = 0.36 - smoothY * 0.05;
      const rollDeg = -9 + smoothX * 4.5;
      const rollRad = (rollDeg * Math.PI) / 180;
      const cosRoll = Math.cos(rollRad);
      const sinRoll = Math.sin(rollRad);

      // Clear both layers
      ctxBack.clearRect(0, 0, width, height);
      ctxFront.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. ORBIT ELLIPSES (Back dashed in ctxBack, Front glowing in ctxFront)
      // -------------------------------------------------------------
      for (const planet of PLANETS) {
        const rx = (planet.orbitPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        // --- Back Arc: upper half (y <= 0 in rotated coords) ---
        ctxBack.save();
        ctxBack.translate(cx, cy);
        ctxBack.rotate(rollRad);
        ctxBack.beginPath();
        ctxBack.ellipse(0, 0, rx, ry, 0, Math.PI, 0); // Math.PI to 0 (top half)
        ctxBack.setLineDash([4, 6]);
        ctxBack.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctxBack.lineWidth = 1.2;
        ctxBack.stroke();
        ctxBack.restore();

        // --- Front Arc: lower half (y >= 0 in rotated coords) ---
        ctxFront.save();
        ctxFront.translate(cx, cy);
        ctxFront.rotate(rollRad);

        // Dark contrast under-stroke to pop over portrait
        ctxFront.beginPath();
        ctxFront.ellipse(0, 0, rx, ry, 0, 0, Math.PI); // 0 to Math.PI (bottom half)
        ctxFront.setLineDash([]);
        ctxFront.strokeStyle = 'rgba(2, 6, 23, 0.75)';
        ctxFront.lineWidth = 3.6;
        ctxFront.stroke();

        // High-contrast luminous front orbit line
        const frontGrad = ctxFront.createLinearGradient(-rx, 0, rx, 0);
        frontGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        frontGrad.addColorStop(0.25, 'rgba(254, 240, 138, 0.75)');
        frontGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.95)');
        frontGrad.addColorStop(0.75, 'rgba(254, 240, 138, 0.75)');
        frontGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        ctxFront.beginPath();
        ctxFront.ellipse(0, 0, rx, ry, 0, 0, Math.PI);
        ctxFront.strokeStyle = frontGrad;
        ctxFront.lineWidth = 1.6;
        ctxFront.stroke();
        ctxFront.restore();
      }

      // -------------------------------------------------------------
      // 2. ASTEROID BELT PARTICLES
      // -------------------------------------------------------------
      for (const rock of ASTEROID_BELT) {
        const deg = normalizeDegrees(
          rock.angleDeg - ambientSeconds * rock.speedDegPerSec
        );
        const rad = (-deg * Math.PI) / 180;
        const sinVal = Math.sin(rad);
        const cosVal = Math.cos(rad);

        const rx = (rock.radiusPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        const unX = cosVal * rx;
        const unY = sinVal * ry;
        const x = cx + unX * cosRoll - unY * sinRoll;
        const y = cy + unX * sinRoll + unY * cosRoll;

        const isFront = sinVal >= 0;
        const targetCtx = isFront ? ctxFront : ctxBack;
        const scale = 1 + 0.22 * sinVal;
        const opacity = rock.opacity * (0.65 + 0.35 * sinVal);

        targetCtx.beginPath();
        targetCtx.arc(x, y, (rock.sizePx / 2) * scale, 0, Math.PI * 2);
        targetCtx.fillStyle = `rgba(254, 243, 199, ${opacity.toFixed(2)})`;
        targetCtx.fill();
      }

      // -------------------------------------------------------------
      // 3. ORBITING PLANETS, MOONS & RINGS
      // -------------------------------------------------------------
      for (const planet of PLANETS) {
        const longitudeDeg = getPlanetLongitudeDeg(
          planet,
          daysSinceJ2000,
          ambientSeconds
        );
        const rad = (-longitudeDeg * Math.PI) / 180;
        const sinVal = Math.sin(rad);
        const cosVal = Math.cos(rad);

        const rx = (planet.orbitPct / 100) * (width / 2);
        const ry = rx * tiltRatio;

        const unX = cosVal * rx;
        const unY = sinVal * ry;
        const x = cx + unX * cosRoll - unY * sinRoll;
        const y = cy + unX * sinRoll + unY * cosRoll;

        const isFront = sinVal >= 0;
        const targetCtx = isFront ? ctxFront : ctxBack;

        const depthScale = 1 + 0.25 * sinVal;
        const depthOpacity = 0.75 + 0.25 * sinVal;
        const pRadius = (planet.sizePx / 2) * depthScale;

        targetCtx.save();
        targetCtx.translate(x, y);
        targetCtx.globalAlpha = depthOpacity;

        // A. True Elliptical Ring — BACK ARC (behind planet)
        if (planet.rings) {
          const {
            rx: ringRx,
            ry: ringRy,
            tiltDeg,
            outerColor,
            innerColor
          } = planet.rings;
          const scaledRx = ringRx * depthScale;
          const scaledRy = ringRy * depthScale;
          const ringTiltRad = (tiltDeg * Math.PI) / 180;

          targetCtx.save();
          targetCtx.rotate(ringTiltRad);

          // Outer ring back arc (Math.PI to 0)
          targetCtx.beginPath();
          targetCtx.ellipse(0, 0, scaledRx, scaledRy, 0, Math.PI, 0);
          targetCtx.strokeStyle = outerColor;
          targetCtx.lineWidth = 2.2 * depthScale;
          targetCtx.stroke();

          // Inner ring back arc
          if (innerColor) {
            targetCtx.beginPath();
            targetCtx.ellipse(0, 0, scaledRx * 0.76, scaledRy * 0.76, 0, Math.PI, 0);
            targetCtx.strokeStyle = innerColor;
            targetCtx.lineWidth = 1.4 * depthScale;
            targetCtx.stroke();
          }
          targetCtx.restore();
        }

        // B. Moons — BACK ARC
        if (planet.moons) {
          for (const moon of planet.moons) {
            const moonDeg = normalizeDegrees(
              moon.initialPhaseDeg -
                ambientSeconds * (360 / Math.max(3, moon.periodDays * 0.35))
            );
            const moonRad = (moonDeg * Math.PI) / 180;
            const moonSin = Math.sin(moonRad);
            if (moonSin < 0) {
              const mX = Math.cos(moonRad) * moon.radiusPx * depthScale;
              const mY = moonSin * moon.radiusPx * 0.45 * depthScale;
              targetCtx.beginPath();
              targetCtx.arc(mX, mY, (moon.sizePx / 2) * depthScale, 0, Math.PI * 2);
              targetCtx.fillStyle = moon.color;
              targetCtx.fill();
            }
          }
        }

        // C. Planet Atmosphere Glow
        targetCtx.beginPath();
        targetCtx.arc(0, 0, pRadius * 1.8, 0, Math.PI * 2);
        const glowGrad = targetCtx.createRadialGradient(
          0,
          0,
          pRadius * 0.4,
          0,
          0,
          pRadius * 1.8
        );
        glowGrad.addColorStop(0, planet.glowColor);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        targetCtx.fillStyle = glowGrad;
        targetCtx.fill();

        // D. Planet Sphere (Radial 3D shading)
        const sphereGrad = targetCtx.createRadialGradient(
          -pRadius * 0.32,
          -pRadius * 0.32,
          pRadius * 0.1,
          0,
          0,
          pRadius
        );
        sphereGrad.addColorStop(0, planet.colors.light);
        sphereGrad.addColorStop(0.55, planet.colors.mid);
        sphereGrad.addColorStop(1, planet.colors.dark);

        targetCtx.beginPath();
        targetCtx.arc(0, 0, pRadius, 0, Math.PI * 2);
        targetCtx.fillStyle = sphereGrad;
        targetCtx.fill();

        // Jupiter subtle atmospheric bands
        if (planet.id === 'jupiter') {
          targetCtx.save();
          targetCtx.beginPath();
          targetCtx.arc(0, 0, pRadius, 0, Math.PI * 2);
          targetCtx.clip();
          targetCtx.fillStyle = 'rgba(120, 53, 15, 0.45)';
          targetCtx.fillRect(-pRadius, -pRadius * 0.28, pRadius * 2, pRadius * 0.2);
          targetCtx.fillRect(-pRadius, pRadius * 0.16, pRadius * 2, pRadius * 0.22);
          targetCtx.restore();
        }

        // E. True Elliptical Ring — FRONT ARC (in front of planet)
        if (planet.rings) {
          const {
            rx: ringRx,
            ry: ringRy,
            tiltDeg,
            outerColor,
            innerColor
          } = planet.rings;
          const scaledRx = ringRx * depthScale;
          const scaledRy = ringRy * depthScale;
          const ringTiltRad = (tiltDeg * Math.PI) / 180;

          targetCtx.save();
          targetCtx.rotate(ringTiltRad);

          // Outer ring front arc (0 to Math.PI)
          targetCtx.beginPath();
          targetCtx.ellipse(0, 0, scaledRx, scaledRy, 0, 0, Math.PI);
          targetCtx.strokeStyle = outerColor;
          targetCtx.lineWidth = 2.4 * depthScale;
          targetCtx.stroke();

          // Inner ring front arc
          if (innerColor) {
            targetCtx.beginPath();
            targetCtx.ellipse(0, 0, scaledRx * 0.76, scaledRy * 0.76, 0, 0, Math.PI);
            targetCtx.strokeStyle = innerColor;
            targetCtx.lineWidth = 1.5 * depthScale;
            targetCtx.stroke();
          }
          targetCtx.restore();
        }

        // F. Moons — FRONT ARC
        if (planet.moons) {
          for (const moon of planet.moons) {
            const moonDeg = normalizeDegrees(
              moon.initialPhaseDeg -
                ambientSeconds * (360 / Math.max(3, moon.periodDays * 0.35))
            );
            const moonRad = (moonDeg * Math.PI) / 180;
            const moonSin = Math.sin(moonRad);
            if (moonSin >= 0) {
              const mX = Math.cos(moonRad) * moon.radiusPx * depthScale;
              const mY = moonSin * moon.radiusPx * 0.45 * depthScale;
              targetCtx.beginPath();
              targetCtx.arc(mX, mY, (moon.sizePx / 2) * depthScale, 0, Math.PI * 2);
              targetCtx.fillStyle = moon.color;
              targetCtx.fill();
            }
          }
        }

        targetCtx.restore();
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
</script>

<!-- Non-Interactive 2.5D Solar System Container -->
<div
  bind:this={stageEl}
  aria-hidden="true"
  class="pointer-events-none relative flex aspect-[16/10] w-[350px] max-w-[96vw] items-center justify-center select-none sm:w-[560px] md:w-[680px] xl:w-[740px]"
>
  <!-- Ambient Elliptical Solar Corona Backdrop -->
  <div
    class="from-primary/25 via-secondary/10 pointer-events-none absolute h-[45%] w-[78%] -rotate-9 rounded-full bg-gradient-to-r to-transparent blur-3xl"
  ></div>

  <!-- 1. BACK CANVAS LAYER (z-0: Behind Sun Portrait) -->
  <canvas
    bind:this={backCanvas}
    class="pointer-events-none absolute inset-0 z-0 h-full w-full"
  ></canvas>

  <!-- 2. CENTRAL SOLAR CORE / SUN PORTRAIT (z-10) -->
  <div
    class="relative z-10 flex h-[80px] w-[80px] items-center justify-center rounded-full sm:h-[105px] sm:w-[105px] md:h-[120px] md:w-[120px]"
  >
    <!-- Outer Solar Corona Aura -->
    <div
      class="from-primary/50 to-secondary/30 animate-pulse-slow absolute -inset-5 rounded-full bg-gradient-to-tr via-amber-400/35 blur-xl"
    ></div>
    <!-- Rotating Solar Prominence Rim -->
    <div
      class="animate-spin-slow absolute -inset-2 rounded-full border border-dashed border-amber-300/45"
    ></div>
    <!-- Inner Chromosphere Rim -->
    <div
      class="from-primary to-secondary absolute -inset-1 rounded-full bg-gradient-to-tr via-amber-300 opacity-60 blur-xs"
    ></div>

    <!-- Upright Circular Sun Portrait Frame -->
    <div
      class="relative h-full w-full overflow-hidden rounded-full border-2 border-amber-200/75 bg-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.6)]"
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

  <!-- 3. FRONT CANVAS LAYER (z-20: In Front of Sun Portrait) -->
  <canvas
    bind:this={frontCanvas}
    class="pointer-events-none absolute inset-0 z-20 h-full w-full"
  ></canvas>
</div>
