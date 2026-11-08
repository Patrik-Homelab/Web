<script lang="ts">
  import RichText from '$/components/utility/RichText.svelte';
  import SolarSystemHero from '$/components/home/SolarSystemHero.svelte';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import Icon from '$/components/utility/Icon.svelte';

  const _state = getState();

  let pointerX = $state(0);
  let pointerY = $state(0);

  function handlePointerMove(event: PointerEvent) {
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
  role="presentation"
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
  class="mx-auto flex w-[90%] max-w-7xl flex-col items-center justify-center gap-10 pt-6 pb-12 md:pt-12 lg:flex-row lg:gap-12 xl:gap-20"
>
  <!-- Left Side: Interactive Solar System Hero with Profile Core -->
  <SolarSystemHero {pointerX} {pointerY} />

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
