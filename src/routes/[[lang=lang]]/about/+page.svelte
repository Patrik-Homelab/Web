<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import { aboutCards } from '$/lib/data/aboutData';
  import { slide } from 'svelte/transition';

  const _state = getState();
  const lang = $derived(_state.lang.about);
  const currentLang = $derived(_state.selectedLang);

  // Modal/Inline state
  let activeCategory = $state<'education' | 'programming' | 'astrophotography' | null>(
    null
  );
  let fullscreenImage = $state<string | null>(null);

  // Keyboard navigation for closing lightbox
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

  const activeCard = $derived(cards.find((c) => c.id === activeCategory));

  // Sequence category selection: close active one first, then open new one
  function selectCategory(id: 'education' | 'programming' | 'astrophotography') {
    if (activeCategory === id) {
      activeCategory = null;
    } else if (activeCategory !== null) {
      activeCategory = null;
      setTimeout(() => {
        activeCategory = id;
      }, 300); // Wait for the exit slide animation (300ms)
    } else {
      activeCategory = id;
    }
  }
</script>

<section
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 pt-24 pb-12 md:px-8 md:pt-28"
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
      {@const isActive = activeCategory === card.id}
      <button
        onclick={() => selectCategory(card.id)}
        class="group relative flex flex-col items-center rounded-2xl border bg-black/40 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 {isActive
          ? 'border-white/40 bg-white/5'
          : card.colors.border} {card.colors.glow}"
      >
        <!-- Background Gradient Aura -->
        <div
          class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 {card
            .colors.bg}"
        ></div>

        <!-- Category Showcase Graphic -->
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

          {#if card.id === 'education'}
            <div class="education-visual">
              <div class="cap-board"></div>
              <div class="cap-under"></div>
              <div class="cap-tassel"></div>
              <div class="diploma-scroll"></div>
            </div>
          {:else if card.id === 'programming'}
            <div class="terminal-visual">
              <div class="terminal-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="terminal-body font-mono">
                <div class="line">
                  <span class="c">const</span> web = <span class="v">init</span>();
                </div>
                <div class="line">web.<span class="f">build</span>();</div>
                <div class="line comment">
                  // Running...<span class="term-cursor">|</span>
                </div>
              </div>
            </div>
          {:else if card.id === 'astrophotography'}
            <div class="galaxy-visual">
              <div class="galaxy-core"></div>
              <div class="galaxy-arm arm-1"></div>
              <div class="galaxy-arm arm-2"></div>
              <div class="galaxy-star star-1"></div>
              <div class="galaxy-star star-2"></div>
              <div class="galaxy-star star-3"></div>
            </div>
          {/if}
        </div>

        <!-- Category Heading (Name removed as requested, category promoted) -->
        <h3
          class="group-hover:text-text-strong mt-1 text-3xl font-bold tracking-wide transition-colors duration-300 {card
            .colors.text}"
        >
          {card.translation.category}
        </h3>

        <p class="text-text-muted mt-3 text-sm leading-relaxed">
          {card.translation.shortDesc}
        </p>

        <!-- Click Action Indicator -->
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

  <!-- INLINE TIMELINE VIEW -->
  {#if activeCategory && activeCard}
    <div
      transition:slide={{ duration: 300 }}
      class="mt-16 w-full border-t border-white/10 pt-16"
    >
      <div class="mb-12 text-center">
        <h2
          class="text-3xl font-extrabold tracking-wide md:text-4xl {activeCard.colors
            .text}"
        >
          {activeCard.translation.category}
        </h2>
        <p
          class="text-text-muted mx-auto mt-2 max-w-2xl text-base leading-relaxed italic md:text-lg"
        >
          {activeCard.translation.shortDesc}
        </p>
      </div>

      <div class="relative mx-auto max-w-6xl py-8 pl-8 md:pl-0">
        <!-- Glowing Neon Line -->
        <div
          class="absolute top-0 bottom-0 left-4 w-1 rounded-full bg-gradient-to-b to-transparent md:left-1/2 md:-translate-x-1/2
          {activeCard.id === 'education'
            ? 'from-amber-500/80 via-amber-600/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            : ''}
          {activeCard.id === 'programming'
            ? 'from-cyan-500/80 via-cyan-600/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            : ''}
          {activeCard.id === 'astrophotography'
            ? 'from-purple-500/80 via-purple-600/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
            : ''}"
        ></div>

        {#each activeCard.translation.timeline as event, idx (idx)}
          <!-- Timeline item container -->
          <div
            class="relative mb-16 flex flex-col justify-between md:flex-row md:items-center"
          >
            <!-- Center pulsing node -->
            <div
              class="absolute left-4 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2"
            >
              <div class="relative flex h-8 w-8 items-center justify-center">
                <div
                  class="absolute h-full w-full animate-ping rounded-full opacity-75
                  {activeCard.id === 'education' ? 'bg-amber-500/20' : ''}
                  {activeCard.id === 'programming' ? 'bg-cyan-500/20' : ''}
                  {activeCard.id === 'astrophotography' ? 'bg-purple-500/20' : ''}"
                ></div>
                <div
                  class="h-4 w-4 rounded-full border-2 border-white shadow-[0_0_8px_currentColor]
                  {activeCard.id === 'education' ? 'bg-amber-400 text-amber-400' : ''}
                  {activeCard.id === 'programming' ? 'bg-cyan-400 text-cyan-400' : ''}
                  {activeCard.id === 'astrophotography'
                    ? 'bg-purple-400 text-purple-400'
                    : ''}"
                ></div>
              </div>
            </div>

            {#if idx % 2 === 0}
              <!-- Left Card -->
              <div class="w-full pl-8 md:w-[47%] md:pr-8 md:pl-0 md:text-right">
                <div
                  class="group/item relative rounded-2xl border border-white/5 bg-slate-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-slate-950/65 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                >
                  <span
                    class="mb-3 inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-widest shadow-sm {activeCard
                      .colors.badge}"
                  >
                    {event.year}
                  </span>
                  <h4 class="text-text-strong mb-3 text-xl font-bold md:text-2xl">
                    {event.title}
                  </h4>
                  <p class="text-text-muted text-base leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>

              <!-- Right Image (or empty spacer) -->
              <div class="mt-4 w-full pl-8 md:mt-0 md:w-[47%] md:pl-8">
                {#if event.image}
                  <div
                    class="group-all relative overflow-hidden rounded-xl border border-white/10"
                  >
                    <button
                      onclick={() => (fullscreenImage = event.image || null)}
                      class="relative flex w-full cursor-zoom-in items-center justify-center overflow-hidden transition-transform duration-200 active:scale-[0.98]"
                    >
                      <img
                        src={event.thumbnail || event.image}
                        alt={event.title}
                        class="h-auto max-h-64 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <i class="bi bi-zoom-in animate-pulse text-2xl"></i>
                        <span class="text-xs font-semibold tracking-widest uppercase"
                          >Click to zoom</span
                        >
                      </div>
                    </button>
                  </div>
                {/if}
              </div>
            {:else}
              <!-- Left Image (or empty spacer) -->
              <div class="order-2 mt-4 w-full pl-8 md:order-1 md:mt-0 md:w-[47%] md:pr-8">
                {#if event.image}
                  <div
                    class="group-all relative overflow-hidden rounded-xl border border-white/10"
                  >
                    <button
                      onclick={() => (fullscreenImage = event.image || null)}
                      class="relative flex w-full cursor-zoom-in items-center justify-center overflow-hidden transition-transform duration-200 active:scale-[0.98]"
                    >
                      <img
                        src={event.thumbnail || event.image}
                        alt={event.title}
                        class="h-auto max-h-64 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        <i class="bi bi-zoom-in animate-pulse text-2xl"></i>
                        <span class="text-xs font-semibold tracking-widest uppercase"
                          >Click to zoom</span
                        >
                      </div>
                    </button>
                  </div>
                {/if}
              </div>

              <!-- Right Card -->
              <div class="order-1 w-full pl-8 md:order-2 md:w-[47%] md:pl-8">
                <div
                  class="group/item relative rounded-2xl border border-white/5 bg-slate-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/10 hover:bg-slate-950/65 hover:shadow-[0_0_20px_rgba(255,255,255,0.02)]"
                >
                  <span
                    class="mb-3 inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-widest shadow-sm {activeCard
                      .colors.badge}"
                  >
                    {event.year}
                  </span>
                  <h4 class="text-text-strong mb-3 text-xl font-bold md:text-2xl">
                    {event.title}
                  </h4>
                  <p class="text-text-muted text-base leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- FULLSCREEN LIGHTBOX -->
  {#if fullscreenImage}
    <div
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={() => (fullscreenImage = null)}
      onkeydown={(e) => {
        if (e.key === 'Escape') fullscreenImage = null;
      }}
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all duration-300"
    >
      <button
        onclick={() => (fullscreenImage = null)}
        aria-label="Close fullscreen view"
        class="text-text-muted hover:text-text-strong absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10"
      >
        <i class="bi bi-x-lg text-2xl"></i>
      </button>
      <img
        src={fullscreenImage}
        alt="Fullscreen preview"
        class="max-h-[90vh] max-w-[90vw] cursor-zoom-out rounded-xl object-contain shadow-2xl transition-transform duration-300"
      />
    </div>
  {/if}
</section>

<style>
  /* 1. Global float keyframe */
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

  /* 2. Education Visuals */
  .education-visual {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: float 6s ease-in-out infinite;
  }
  .cap-board {
    position: relative;
    width: 70px;
    height: 35px;
    background: radial-gradient(ellipse at center, #fbbf24 10%, #d97706 90%);
    transform: rotateX(55deg) rotateZ(45deg);
    border-radius: 4px;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.4),
      inset 0 0 10px rgba(255, 255, 255, 0.3);
    z-index: 2;
  }
  .cap-under {
    position: absolute;
    width: 28px;
    height: 15px;
    background: #78350f;
    border-radius: 50%;
    top: 42px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  .cap-tassel {
    position: absolute;
    top: 25px;
    right: 15px;
    width: 2px;
    height: 30px;
    background: #fff;
    transform-origin: top center;
    animation: tassel-swing 4s ease-in-out infinite;
    z-index: 3;
  }
  .cap-tassel::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: -3px;
    width: 8px;
    height: 8px;
    background: #fbbf24;
    border-radius: 50%;
  }
  .diploma-scroll {
    position: absolute;
    bottom: 5px;
    width: 50px;
    height: 12px;
    background: linear-gradient(to right, #fef3c7, #fde68a, #fef3c7);
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(251, 191, 36, 0.2);
    transform: rotate(-10deg);
  }
  .diploma-scroll::after {
    content: '';
    position: absolute;
    left: 22px;
    top: -2px;
    width: 6px;
    height: 16px;
    background: #ef4444;
    border-radius: 2px;
  }
  @keyframes tassel-swing {
    0%,
    100% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(10deg);
    }
  }

  /* 3. Programming Terminal Visuals */
  .terminal-visual {
    width: 140px;
    height: 95px;
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(6, 182, 212, 0.3);
    border-radius: 8px;
    box-shadow:
      0 12px 24px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(6, 182, 212, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: float 5.5s ease-in-out infinite;
  }
  .terminal-header {
    height: 20px;
    background: rgba(30, 41, 59, 0.9);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 8px;
  }
  .terminal-header .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  .terminal-header .red {
    background: #ef4444;
  }
  .terminal-header .yellow {
    background: #f59e0b;
  }
  .terminal-header .green {
    background: #10b981;
  }
  .terminal-body {
    flex: 1;
    padding: 8px;
    font-size: 9px;
    line-height: 1.4;
    color: #cbd5e1;
    text-align: left;
  }
  .terminal-body .line {
    white-space: nowrap;
    overflow: hidden;
  }
  .terminal-body .c {
    color: #22d3ee;
  }
  .terminal-body .v {
    color: #fde047;
  }
  .terminal-body .f {
    color: #38bdf8;
  }
  .terminal-body .comment {
    color: #64748b;
  }
  .term-cursor {
    animation: blink 1s step-end infinite;
    color: #22d3ee;
    font-weight: bold;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  /* 4. Astrophotography Galaxy Visuals */
  .galaxy-visual {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: float 6.5s ease-in-out infinite;
  }
  .galaxy-core {
    width: 24px;
    height: 24px;
    background: radial-gradient(circle, #fff 10%, #a855f7 60%, transparent 100%);
    border-radius: 50%;
    filter: blur(1px);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
    z-index: 2;
  }
  .galaxy-arm {
    position: absolute;
    width: 80px;
    height: 25px;
    background: radial-gradient(
      ellipse at center,
      rgba(168, 85, 247, 0.4) 0%,
      transparent 80%
    );
    border-radius: 50%;
    transform-origin: center center;
    filter: blur(2px);
    animation: rotate 15s linear infinite;
  }
  .galaxy-arm.arm-1 {
    transform: rotate(45deg);
  }
  .galaxy-arm.arm-2 {
    transform: rotate(225deg);
  }
  .galaxy-star {
    position: absolute;
    width: 3px;
    height: 3px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px #fff;
    animation: rotate-stars 20s linear infinite;
  }
  .galaxy-star.star-1 {
    top: 25px;
    left: 20px;
    animation-duration: 8s;
  }
  .galaxy-star.star-2 {
    bottom: 20px;
    right: 25px;
    animation-duration: 12s;
  }
  .galaxy-star.star-3 {
    top: 40px;
    right: 15px;
    animation-duration: 10s;
  }
  @keyframes rotate-stars {
    from {
      transform: rotate(0deg) translate(25px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translate(25px) rotate(-360deg);
    }
  }
</style>
