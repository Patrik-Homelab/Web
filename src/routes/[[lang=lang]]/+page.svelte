<script lang="ts">
  import RichText from '$/components/utility/RichText.svelte';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import Icon from '$/components/utility/Icon.svelte';

  const _state = getState();

  const birthday = new Date(2003, 4, 1, 7);

  const getAge = () => {
    const diff = Date.now() - birthday.getTime();
    const age = diff / (1000 * 60 * 60 * 24 * 365.25);
    return age.toFixed(12);
  };

  let age = $state(getAge());

  // Reactively split the age into integer and decimal parts for styling
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
        }, 50);
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
  class="mx-auto flex w-[90%] max-w-7xl flex-col items-center justify-center gap-10 pt-10 pb-12 md:pt-16 lg:flex-row lg:gap-16 xl:gap-24"
>
  <!-- Left Side: Profile Picture with Orbital Rings -->
  <div class="relative flex items-center justify-center">
    <!-- Outer orbiting dot pathway -->
    <div
      class="border-primary/10 animate-spin-slow absolute h-[360px] w-[360px] rounded-full border border-dashed sm:h-[440px] sm:w-[440px]"
    >
      <div
        class="bg-primary absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full shadow-[0_0_10px_var(--color-primary)]"
      ></div>
    </div>

    <!-- Medium glow pathway -->
    <div
      class="border-secondary/20 absolute h-[320px] w-[320px] animate-[spin_10s_linear_infinite_reverse] rounded-full border border-dashed sm:h-[390px] sm:w-[390px]"
    >
      <div
        class="bg-secondary absolute top-1/2 -left-1.5 h-2 w-2 -translate-y-1/2 rounded-full shadow-[0_0_8px_var(--color-secondary)]"
      ></div>
    </div>

    <!-- Inner pulsing gradient glow backdrop -->
    <div
      class="from-primary to-secondary animate-pulse-slow absolute h-[280px] w-[280px] rounded-full bg-gradient-to-tr opacity-20 blur-xl sm:h-[350px] sm:w-[350px]"
    ></div>

    <!-- Actual profile image frame -->
    <div
      class="relative z-10 h-[280px] w-[280px] overflow-hidden rounded-full border-4 border-white/10 bg-slate-900 shadow-2xl transition-transform duration-500 hover:scale-102 sm:h-[340px] sm:w-[340px]"
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
          width="340"
          height="340"
          class="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
        />
      </picture>
    </div>
  </div>

  <!-- Right Side: Info Panel -->
  <div
    class="flex w-full flex-col items-center text-center lg:w-[62%] lg:items-start lg:text-left"
  >
    <!-- Name Signature -->
    <h1
      class="font-poppins from-primary-400 via-secondary to-primary-text bg-gradient-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
    >
      Patrik Mintěl
    </h1>

    <!-- Precision Age Ticker (Telemetry Card) -->
    <div
      class="my-6 flex w-full max-w-sm items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono shadow-2xl backdrop-blur-md"
    >
      <div class="flex items-baseline gap-0.5">
        <span class="text-text-strong text-2xl font-bold sm:text-3xl"
          >{ageParts.integer}</span
        >
        <span class="text-primary text-2xl font-medium">.</span>
        <span class="text-text-muted text-lg font-medium tracking-tight sm:text-xl"
          >{ageParts.decimal}</span
        >
      </div>
    </div>

    <!-- Bio / Description -->
    <div
      class="font-ubuntu text-text-muted text-lg leading-relaxed md:text-xl lg:text-2xl"
    >
      <RichText text={_state.lang.main.text} />
    </div>

    <!-- Call to Actions -->
    <div class="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
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
