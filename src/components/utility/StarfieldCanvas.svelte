<script lang="ts">
  import { getState, setState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';

  const _state = getState();

  interface Star {
    x: number;
    y: number;
    radius: number;
    paletteIdx: number;
    color: string;
    baseAlpha: number;
    twinkleAmp: number;
    twinkleSpeed: number;
    twinklePhase: number;
    layer: number; // 0 = far, 1 = mid, 2 = near
    hasSpikes: boolean;
    vx: number;
    vy: number;
  }

  interface ShootingStar {
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
  }

  // Realistic Harvard spectral classification star colors (O, B, A, F, G, K, M)
  const SPECTRAL_PALETTE = [
    { color: '#9bb0ff', glow: 'rgba(155, 176, 255, 0.45)', weight: 0.1 }, // O/B blue-white
    { color: '#cad7ff', glow: 'rgba(202, 215, 255, 0.45)', weight: 0.22 }, // B/A white-blue
    { color: '#f8f7ff', glow: 'rgba(248, 247, 255, 0.4)', weight: 0.32 }, // A/F pure white
    { color: '#fff4ea', glow: 'rgba(255, 244, 234, 0.4)', weight: 0.2 }, // G yellow-white
    { color: '#ffd2a1', glow: 'rgba(255, 210, 161, 0.45)', weight: 0.11 }, // K warm orange
    { color: '#ffbd7f', glow: 'rgba(255, 189, 127, 0.45)', weight: 0.05 } // M amber-red
  ];

  let canvas: HTMLCanvasElement;
  let isVisible = $state(true);

  function pickSpectralColorIndex(): number {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < SPECTRAL_PALETTE.length; i++) {
      acc += SPECTRAL_PALETTE[i].weight;
      if (r <= acc) return i;
    }
    return 2;
  }

  onMount(() => {
    const localStars = localStorage.getItem('starsEnabled') !== 'false';
    setState({ starsEnabled: localStars });

    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  });

  $effect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enabled = _state.starsEnabled !== false && !prefersReducedMotion && isVisible;

    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!enabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    // Cap background starfield DPR at 1.5 to save massive mobile fill-rate without losing sharpness
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let starSprites: HTMLCanvasElement[] = [];

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Pre-render 6 tiny spectral star sprites (core + halo) once so per-frame star rendering uses fast blits
    const buildStarSprites = () => {
      const spriteRadiusCss = 8; // covers halo up to 2.6x radius
      const sizePx = Math.ceil(spriteRadiusCss * 2 * dpr);
      starSprites = SPECTRAL_PALETTE.map((item) => {
        const sCanvas = document.createElement('canvas');
        sCanvas.width = sizePx;
        sCanvas.height = sizePx;
        const sCtx = sCanvas.getContext('2d');
        if (!sCtx) return sCanvas;

        sCtx.setTransform(dpr, 0, 0, dpr, spriteRadiusCss * dpr, spriteRadiusCss * dpr);

        // Soft halo
        const haloGrad = sCtx.createRadialGradient(0, 0, 0.5, 0, 0, 5.2);
        haloGrad.addColorStop(0, item.glow);
        haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
        sCtx.fillStyle = haloGrad;
        sCtx.beginPath();
        sCtx.arc(0, 0, 5.2, 0, Math.PI * 2);
        sCtx.fill();

        // Crisp core
        sCtx.fillStyle = item.color;
        sCtx.beginPath();
        sCtx.arc(0, 0, 2.0, 0, Math.PI * 2);
        sCtx.fill();

        return sCanvas;
      });
    };

    const createStars = () => {
      const count = Math.min(180, Math.max(70, Math.floor((width * height) / 11000)));
      stars = Array.from({ length: count }, (_, idx) => {
        const layerRoll = Math.random();
        const layer = layerRoll < 0.58 ? 0 : layerRoll < 0.86 ? 1 : 2;
        const paletteIdx = pickSpectralColorIndex();
        const spectral = SPECTRAL_PALETTE[paletteIdx];
        const isBright = layer === 2 && idx % 7 === 0;
        const radius =
          layer === 0
            ? 0.55 + Math.random() * 0.55
            : layer === 1
              ? 0.85 + Math.random() * 0.7
              : isBright
                ? 1.65 + Math.random() * 0.8
                : 1.15 + Math.random() * 0.6;

        const driftSpeed = (layer + 1) * 0.04;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius,
          paletteIdx,
          color: spectral.color,
          baseAlpha:
            layer === 0 ? 0.35 + Math.random() * 0.35 : 0.6 + Math.random() * 0.35,
          twinkleAmp: 0.15 + Math.random() * 0.3,
          twinkleSpeed: 0.8 + Math.random() * 2.2,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          hasSpikes: isBright,
          vx: -driftSpeed * 0.75,
          vy: driftSpeed * 0.55
        };
      });
    };

    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStarSprites();
      createStars();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      targetMouseX = e.clientX / Math.max(1, width) - 0.5;
      targetMouseY = e.clientY / Math.max(1, height) - 0.5;
    };

    const spawnShootingStar = () => {
      const goLeft = Math.random() > 0.25;
      const startX = goLeft
        ? width * (0.25 + Math.random() * 0.75)
        : width * (Math.random() * 0.75);
      const startY = height * (Math.random() * 0.45);
      const angle = goLeft
        ? (Math.PI * (135 + (Math.random() * 22 - 11))) / 180
        : (Math.PI * (35 + (Math.random() * 22 - 11))) / 180;
      const speed = 13 + Math.random() * 9;
      const palette = ['#f8fafc', '#bae6fd', '#fde68a'];
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 85 + Math.random() * 75,
        life: 0,
        maxLife: 32 + Math.floor(Math.random() * 22),
        color: palette[Math.floor(Math.random() * palette.length)],
        size: 1.4 + Math.random() * 0.9
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();
    let lastDrawTime = 0;
    let nextMeteorTimer = 2.0 + Math.random() * 3.5;

    // Cap background starfield at ~30 FPS to avoid unnecessary mobile GPU composites
    const minFrameInterval = 1000 / 30;

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);

      const elapsed = now - lastDrawTime;
      if (elapsed < minFrameInterval) {
        return;
      }

      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;
      lastDrawTime = now;
      const timeSec = now * 0.001;

      // Smooth mouse parallax interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      // Clear transparent canvas (nebula & deep-space backdrop live on static CSS background!)
      ctx.clearRect(0, 0, width, height);

      // 1. Render multi-temperature twinkling stars
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        const parallaxShift = (star.layer + 1) * 14;
        const drawX =
          ((((star.x - currentMouseX * parallaxShift) % (width + 20)) + (width + 20)) %
            (width + 20)) -
          10;
        const drawY =
          ((((star.y - currentMouseY * parallaxShift) % (height + 20)) + (height + 20)) %
            (height + 20)) -
          10;

        const twinkle = Math.sin(timeSec * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(
          0.08,
          Math.min(1, star.baseAlpha + twinkle * star.twinkleAmp)
        );
        ctx.globalAlpha = alpha;

        if (star.layer === 0) {
          // Fast sub-pixel square for tiny distant background stars (avoids trig arc paths)
          const d = star.radius * 1.8;
          ctx.fillStyle = star.color;
          ctx.fillRect(drawX - d * 0.5, drawY - d * 0.5, d, d);
        } else {
          // Pre-rendered spectral sprite (halo + core in single drawImage)
          const sprite = starSprites[star.paletteIdx];
          if (sprite) {
            const halfSpan = star.radius * 4;
            ctx.drawImage(
              sprite,
              drawX - halfSpan,
              drawY - halfSpan,
              halfSpan * 2,
              halfSpan * 2
            );
          }

          // Subtle astrophotography Newtonian diffraction spikes on bright foreground stars
          if (star.hasSpikes) {
            const spikeLen = star.radius * (4.2 + twinkle * 1.1);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.65;
            ctx.globalAlpha = alpha * 0.55;
            ctx.beginPath();
            ctx.moveTo(drawX - spikeLen, drawY);
            ctx.lineTo(drawX + spikeLen, drawY);
            ctx.moveTo(drawX, drawY - spikeLen);
            ctx.lineTo(drawX, drawY + spikeLen);
            ctx.stroke();
          }
        }
      }

      // 2. Spawn & render shooting stars / meteors
      nextMeteorTimer -= dt;
      if (nextMeteorTimer <= 0 && shootingStars.length < 2) {
        spawnShootingStar();
        nextMeteorTimer = 3.5 + Math.random() * 5.5;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const m = shootingStars[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;

        const progress = m.life / m.maxLife;
        const opacity =
          progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);

        const speed = Math.hypot(m.vx, m.vy) || 1;
        const tailX = m.x - (m.vx / speed) * m.length;
        const tailY = m.y - (m.vy / speed) * m.length;

        const tailGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        tailGrad.addColorStop(0, m.color);
        tailGrad.addColorStop(0.35, 'rgba(186, 230, 253, 0.45)');
        tailGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');

        ctx.save();
        ctx.globalAlpha = opacity * 0.9;
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = m.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (
          m.life >= m.maxLife ||
          m.x < -200 ||
          m.x > width + 200 ||
          m.y > height + 200
        ) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('pointermove', handlePointerMove);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  });
</script>

<canvas
  bind:this={canvas}
  style="contain: strict; background: radial-gradient(circle at 22% 32%, rgba(234, 88, 12, 0.045), transparent 42%), radial-gradient(circle at 78% 26%, rgba(56, 189, 248, 0.04), transparent 45%), radial-gradient(circle at 55% 75%, rgba(168, 85, 247, 0.035), transparent 48%), #030305;"
  class="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden"
></canvas>
