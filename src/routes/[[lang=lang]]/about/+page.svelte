<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import { aboutCards } from '$/lib/data/aboutData';

  const _state = getState();
  const lang = $derived(_state.lang.about);
  const currentLang = $derived(_state.selectedLang);

  // Modal state
  let activeCategory = $state<'education' | 'programming' | 'astrophotography' | null>(null);

  let fullscreenImage = $state<string | null>(null);

  // Keyboard navigation for closing modal
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (fullscreenImage) {
        fullscreenImage = null;
      } else {
        activeCategory = null;
      }
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const cards = $derived(
    aboutCards.map((c) => ({
      ...c,
      translation: c.translations[currentLang as 'cs' | 'en'] || c.translations.en
    }))
  );

  const activeCard = $derived(
    cards.find((c) => c.id === activeCategory)
  );
</script>

<section
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-12 md:px-8"
>
  <div class="mb-12 text-center">
    <H1>{lang.title}</H1>
    <div
      class="from-primary to-secondary mx-auto mt-2 h-1 w-24 rounded bg-gradient-to-r"
    ></div>
  </div>

  <!-- Cards Grid -->
  <div class="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {#each cards as card (card.id)}
      <button
        onclick={() => (activeCategory = card.id)}
        class="group relative flex flex-col items-center rounded-2xl border bg-black/40 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 {card.colors.border} {card.colors.glow}"
      >
        <!-- Background Gradient Aura -->
        <div
          class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 {card.colors.bg}"
        ></div>

        <!-- Planet Showcase -->
        <div
          class="relative flex h-48 w-full items-center justify-center overflow-visible"
        >
          <!-- Ambient glow -->
          <div
            class="absolute h-24 w-24 rounded-full blur-xl filter transition-all duration-500 group-hover:scale-125
            {card.id === 'education' ? 'bg-amber-500/20' : ''}
            {card.id === 'programming' ? 'bg-cyan-500/20' : ''}
            {card.id === 'astrophotography' ? 'bg-purple-500/20' : ''}"
          ></div>

          <!-- Planet Renderings -->
          {#if card.planetClass === 'planet-earth'}
            <div class="planet-earth">
              <div class="land"></div>
            </div>
          {:else if card.planetClass === 'planet-saturn'}
            <div class="planet-saturn">
              <div class="saturn-ring"></div>
            </div>
          {:else if card.planetClass === 'planet-programming'}
            <div class="planet-programming">
              <div class="tech-grid"></div>
            </div>
          {:else if card.planetClass === 'planet-nebula'}
            <div class="planet-nebula">
              <div class="nebula-cloud"></div>
              <div class="moon moon-1"></div>
              <div class="moon moon-2"></div>
            </div>
          {/if}
        </div>

        <!-- Meta Information -->
        <span class="text-text-muted text-sm font-semibold tracking-wider uppercase"
          >{card.translation.category}</span
        >
        <h3
          class="group-hover:text-text-strong mt-1 text-3xl font-bold tracking-wide transition-colors duration-300 {card.colors.text}"
        >
          {card.translation.name}
        </h3>

        <p class="text-text-muted mt-3 text-sm">
          {card.translation.shortDesc}
        </p>

        <div class="mt-4 flex flex-wrap justify-center gap-2">
          {#each card.translation.tags as tag (tag)}
            <span
              class="rounded-full border px-3 py-0.5 text-xs transition-colors duration-300 group-hover:bg-white/5 {card.colors.badge}"
            >
              {tag}
            </span>
          {/each}
        </div>

        <div
          class="text-text-muted group-hover:text-text-strong mt-6 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-300"
        >
          <span>{lang.clickToExplore}</span>
          <i
            class="bi bi-arrow-right transition-transform duration-300 group-hover:translate-x-1"
          ></i>
        </div>
      </button>
    {/each}
  </div>

  <!-- POPUP MODAL -->
  {#if activeCategory && activeCard}
    <!-- Backdrop -->
    <div
      role="dialog"
      aria-modal="true"
      onclick={() => (activeCategory = null)}
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-all duration-300"
      tabindex="-1"
      onkeydown={void 0}
    >
      <!-- Modal Content Wrapper -->
      <div
        onclick={(e) => e.stopPropagation()}
        class="relative flex h-[92vh] w-full max-w-6xl flex-col rounded-3xl border border-white/10 bg-gray-950/90 p-6 shadow-2xl backdrop-blur-2xl md:p-10"
        role="button"
        onkeydown={void 0}
        tabindex="0"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div class="flex items-center gap-4">
            <span
              class="rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wider uppercase {activeCard.colors.badge}"
            >
              {activeCard.translation.category}
            </span>
            <h2
              class="text-4xl font-extrabold tracking-wide md:text-5xl {activeCard.colors.text}"
            >
              {activeCard.translation.name}
            </h2>
          </div>
          <button
            onclick={() => (activeCategory = null)}
            aria-label="Close modal"
            class="text-text-muted hover:text-text-strong flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10"
          >
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="flex-1 overflow-y-auto py-6 pr-2">
          <p class="mb-8 text-base md:text-lg text-text-muted leading-relaxed italic border-l-2 border-white/20 pl-4">
            {activeCard.translation.shortDesc}
          </p>

          <!-- TIMELINE VIEW -->
          <div class="relative mx-auto max-w-4xl pl-8 md:pl-0">
            <!-- Central Line -->
            <div
              class="from-primary/80 to-secondary/80 absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b md:left-1/2 md:-translate-x-1/2"
            ></div>

            {#each activeCard.translation.timeline as event, idx (idx)}
              <!-- Timeline item container -->
              <div class="relative mb-12 flex flex-col md:flex-row md:items-center">
                <!-- Central Badge -->
                <div
                  class="absolute left-4 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2"
                >
                  <span
                    class="border-primary/50 text-text-strong rounded-full border bg-gray-950 px-4 py-1.5 text-sm font-bold tracking-wider whitespace-nowrap shadow-lg"
                  >
                    {event.year}
                  </span>
                </div>

                <!-- Alternating Cards Layout -->
                <div
                  class="w-full md:w-1/2 {idx % 2 === 0
                    ? 'md:pr-24 md:text-right'
                    : 'md:order-2 md:pl-24'} pl-4 md:pl-0"
                >
                  <div
                    class="inline-block w-full rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/10"
                  >
                    <h4 class="text-text-strong text-xl font-bold md:text-2xl">
                      {event.title}
                    </h4>
                    <p
                      class="text-text-muted mt-3 text-base leading-relaxed md:text-lg"
                    >
                      {event.desc}
                    </p>
                    {#if event.image}
                      <button
                        onclick={() => fullscreenImage = event.image || null}
                        class="mt-4 md:hidden w-full overflow-hidden rounded-xl border border-white/10 cursor-zoom-in active:scale-95 transition-transform duration-200"
                      >
                        <img src={event.image} alt={event.title} class="w-full h-auto object-cover max-h-60" />
                      </button>
                    {/if}
                  </div>
                </div>

                <!-- Image or Empty Spacer for desktop alignment -->
                <div class="hidden md:flex md:w-1/2 {idx % 2 === 0 ? 'md:order-2 md:pl-24' : 'md:pr-24'}">
                  {#if event.image}
                    <button
                      onclick={() => fullscreenImage = event.image || null}
                      class="w-full h-full rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-white/15 hover:bg-white/10 flex items-center justify-center cursor-zoom-in"
                    >
                      <img src={event.image} alt={event.title} class="w-full h-64 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300" />
                    </button>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- FULLSCREEN LIGHTBOX -->
  {#if fullscreenImage}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      role="dialog"
      aria-modal="true"
      onclick={() => fullscreenImage = null}
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all duration-300"
    >
      <button
        onclick={() => fullscreenImage = null}
        aria-label="Close fullscreen view"
        class="absolute top-6 right-6 text-text-muted hover:text-text-strong bg-white/5 hover:bg-white/10 flex h-12 w-12 items-center justify-center rounded-full transition-all"
      >
        <i class="bi bi-x-lg text-2xl"></i>
      </button>
      <img
        src={fullscreenImage}
        alt="Fullscreen preview"
        class="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl transition-transform duration-300 cursor-zoom-out"
      />
    </div>
  {/if}
</section>

<style>
  /* 1. Global Planet properties & keyframes */
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg) scaleY(0.25) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) scaleY(0.25) rotate(-360deg);
    }
  }

  /* 2. Earth Planet Styling */
  .planet-earth {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #4f46e5, #0284c7, #0f172a);
    box-shadow:
      inset -15px -15px 30px rgba(0, 0, 0, 0.8),
      0 0 30px rgba(14, 165, 233, 0.4);
    animation: float 6s ease-in-out infinite;
    overflow: hidden;
  }
  .planet-earth .land {
    position: absolute;
    width: 200%;
    height: 100%;
    background-image:
      radial-gradient(circle at 15% 40%, #10b981 12%, transparent 13%),
      radial-gradient(circle at 45% 60%, #10b981 18%, transparent 19%),
      radial-gradient(circle at 75% 30%, #10b981 15%, transparent 16%),
      radial-gradient(circle at 115% 40%, #10b981 12%, transparent 13%),
      radial-gradient(circle at 145% 60%, #10b981 18%, transparent 19%),
      radial-gradient(circle at 175% 30%, #10b981 15%, transparent 16%);
    opacity: 0.8;
    animation: rotate-land 20s linear infinite;
  }
  @keyframes rotate-land {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  /* 3. Saturn Planet Styling */
  .planet-saturn {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f59e0b, #d97706, #451a03);
    box-shadow:
      inset -12px -12px 24px rgba(0, 0, 0, 0.8),
      0 0 25px rgba(245, 158, 11, 0.3);
    animation: float 5s ease-in-out infinite;
  }
  .saturn-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150px;
    height: 30px;
    margin-left: -75px;
    margin-top: -15px;
    border: 8px solid rgba(217, 119, 6, 0.5);
    border-top-color: transparent;
    border-radius: 50%;
    transform: rotate(-15deg);
    pointer-events: none;
  }

  /* 5. Programming Core Planet Styling */
  .planet-programming {
    position: relative;
    width: 85px;
    height: 85px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #06b6d4, #0891b2, #0f172a);
    box-shadow:
      inset -10px -10px 20px rgba(0, 0, 0, 0.9),
      0 0 35px rgba(6, 182, 212, 0.5);
    animation: float 5.5s ease-in-out infinite;
    overflow: hidden;
  }
  .tech-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(rgba(6, 182, 212, 0.15) 2px, transparent 2px),
      linear-gradient(90deg, rgba(6, 182, 212, 0.15) 2px, transparent 2px);
    background-size: 10px 10px;
    animation: rotate 25s linear infinite;
  }

  /* 6. Nebula Planet with Moons Styling */
  .planet-nebula {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #a855f7, #6b21a8, #1e1b4b);
    box-shadow:
      inset -15px -15px 30px rgba(0, 0, 0, 0.8),
      0 0 30px rgba(168, 85, 247, 0.4);
    animation: float 6.5s ease-in-out infinite;
  }
  .nebula-cloud {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.3), transparent);
    mix-blend-mode: screen;
  }
  .moon {
    position: absolute;
    border-radius: 50%;
    background-color: #e2e8f0;
  }
  .moon-1 {
    width: 12px;
    height: 12px;
    top: -10px;
    right: -10px;
    background: radial-gradient(circle at 30% 30%, #cbd5e1, #64748b);
    box-shadow: 0 0 10px rgba(226, 232, 240, 0.4);
  }
  .moon-2 {
    width: 8px;
    height: 8px;
    bottom: -5px;
    left: -15px;
    background: radial-gradient(circle at 30% 30%, #94a3b8, #475569);
  }
</style>
