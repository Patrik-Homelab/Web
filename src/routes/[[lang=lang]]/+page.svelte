<script lang="ts">
  import RichText from '$/components/utility/RichText.svelte';
  import SolarSystemHero from '$/components/home/SolarSystemHero.svelte';
  import type { r } from '$/lib/lang/_template';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import type { z } from 'zod';
  import Icon from '$/components/utility/Icon.svelte';

  type RichTextArray = z.infer<typeof r>;

  const _state = getState();

  let pointerX = $state(0);
  let pointerY = $state(0);

  function handlePointerMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    }
  }

  function handlePointerLeave() {
    pointerX = 0;
    pointerY = 0;
  }

  // Split _state.lang.main.text by '%%SPACE%%' into individual topic paragraphs
  const bioParagraphs = $derived.by(() => {
    const chunks: RichTextArray[] = [];
    let current: RichTextArray = [];

    for (const item of _state.lang.main.text) {
      if (item === '%%SPACE%%') {
        if (current.length > 0) {
          chunks.push(current);
          current = [];
        }
      } else {
        current.push(item);
      }
    }
    if (current.length > 0) {
      chunks.push(current);
    }
    return chunks;
  });

  const birthday = new Date(2003, 4, 1, 7);

  const getAge = () => {
    const diff = Date.now() - birthday.getTime();
    const age = diff / (1000 * 60 * 60 * 24 * 365.25);
    return age.toFixed(12);
  };

  let age = $state(getAge());

  const ageParts = $derived.by(() => {
    const parts = age.split('.');
    return {
      integer: parts[0] || '',
      decimal: parts[1] || ''
    };
  });

  onMount(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startTicker = () => {
      if (!intervalId) {
        age = getAge();
        intervalId = setInterval(() => {
          age = getAge();
        }, 110);
      }
    };

    const stopTicker = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTicker();
      } else {
        startTicker();
      }
    };

    startTicker();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTicker();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });
</script>

<svelte:head>
  <link rel="preload" as="image" href="/images/Image-400.webp" type="image/webp" />
</svelte:head>

<div
  role="presentation"
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  class="mx-auto flex w-[92%] max-w-7xl flex-col items-center justify-center pt-4 pb-16 md:pt-8"
>
  <!-- 1. CENTERED HEADER: Name -> Age Ticker -->
  <div class="flex flex-col items-center text-center">
    <h1
      style="contain: layout paint;"
      class="font-poppins from-primary-400 via-secondary to-primary-text bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
    >
      Patrik Mintěl
    </h1>

    <div
      aria-label="{ageParts.integer} years"
      style="contain: layout paint;"
      class="mt-4 flex w-full max-w-xs items-center justify-center rounded-2xl border border-white/10 bg-slate-950/85 px-5 py-3 font-mono shadow-2xl sm:max-w-sm"
    >
      <div aria-hidden="true" class="flex items-baseline gap-0.5 tabular-nums">
        <span class="text-text-strong text-2xl font-bold sm:text-3xl"
          >{ageParts.integer}</span
        >
        <span class="text-primary text-2xl font-medium">.</span>
        <span
          class="text-text-muted inline-block w-[12ch] text-left text-lg font-medium tracking-tight sm:text-xl"
          >{ageParts.decimal}</span
        >
      </div>
    </div>
  </div>

  <!-- 2. SATELLITE BIO CARDS FRAMING THE 2.5D SOLAR SYSTEM -->
  <div
    class="mt-6 grid w-full grid-cols-1 items-center gap-6 xl:grid-cols-[1fr_auto_1fr] xl:gap-2"
  >
    <!-- Left Satellite Cards (Education & Core Web Stack) -->
    <div class="order-2 flex flex-col gap-4 xl:order-1">
      {#each bioParagraphs.slice(0, 2) as paragraph, idx (idx)}
        <div
          style="contain: layout paint;"
          class="font-ubuntu text-text-muted rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-base leading-relaxed shadow-xl transition-colors duration-300 hover:border-white/20 hover:bg-slate-950/90 {idx ===
          0
            ? 'xl:translate-x-4'
            : 'xl:-translate-x-1'}"
        >
          <RichText text={paragraph} />
        </div>
      {/each}
    </div>

    <!-- Centerpiece: 2.5D Solar System with Sun Portrait -->
    <div class="order-1 flex justify-center xl:order-2">
      <SolarSystemHero {pointerX} {pointerY} />
    </div>

    <!-- Right Satellite Cards (Frameworks & Node.js/Bots) -->
    <div class="order-3 flex flex-col gap-4">
      {#each bioParagraphs.slice(2, 4) as paragraph, idx (idx)}
        <div
          style="contain: layout paint;"
          class="font-ubuntu text-text-muted rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-base leading-relaxed shadow-xl transition-colors duration-300 hover:border-white/20 hover:bg-slate-950/90 {idx ===
          0
            ? 'xl:-translate-x-4'
            : 'xl:translate-x-1'}"
        >
          <RichText text={paragraph} />
        </div>
      {/each}
    </div>
  </div>

  <!-- 3. BOTTOM CENTERED ASTROPHOTOGRAPHY CARD + CTA BUTTONS -->
  <div class="mt-6 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
    {#if bioParagraphs[4]}
      <div
        style="contain: layout paint;"
        class="font-ubuntu text-text-muted w-full rounded-2xl border border-white/10 bg-slate-950/80 px-6 py-4 text-base leading-relaxed shadow-xl sm:text-lg"
      >
        <RichText text={bioParagraphs[4]} />
      </div>
    {/if}

    <div class="flex flex-wrap items-center justify-center gap-4">
      <a
        href="/{_state.selectedLang}/gallery"
        class="bg-primary hover:bg-primary-600 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(var(--color-primary-500),0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(var(--color-primary-500),0.5)]"
      >
        <Icon name="bi-image-fill" />
        <span>{_state.lang.navigation.gallery}</span>
      </a>
      <a
        href="/{_state.selectedLang}/contact"
        class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10"
      >
        <Icon name="bi-envelope-fill" />
        <span>{_state.lang.navigation.contact}</span>
      </a>
    </div>
  </div>
</div>
