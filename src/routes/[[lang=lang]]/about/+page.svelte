<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import { aboutCards } from '$/lib/data/aboutData';
  import { slide, fade } from 'svelte/transition';

  const _state = getState();
  const lang = $derived(_state.lang.about);
  const currentLang = $derived(_state.selectedLang);

  // Modal/Inline state
  let activeCategory = $state<'education' | 'programming' | 'astrophotography' | null>(null);
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

  const activeCard = $derived(
    cards.find((c) => c.id === activeCategory)
  );

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
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 py-12 md:px-8"
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
        class="group relative flex flex-col items-center rounded-2xl border bg-black/40 p-6 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-2 {isActive ? 'border-white/40 bg-white/5' : card.colors.border} {card.colors.glow}"
      >
        <!-- Background Gradient Aura -->
        <div
          class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 {card.colors.bg}"
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
                <div class="line"><span class="c">const</span> web = <span class="v">init</span>();</div>
                <div class="line">web.<span class="f">build</span>();</div>
                <div class="line comment">// Running...<span class="term-cursor">|</span></div>
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
          class="group-hover:text-text-strong mt-1 text-3xl font-bold tracking-wide transition-colors duration-300 {card.colors.text}"
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
      class="w-full mt-16 pt-16 border-t border-white/10"
    >
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-extrabold tracking-wide md:text-4xl {activeCard.colors.text}">
          {activeCard.translation.category}
        </h2>
        <p class="text-text-muted text-base md:text-lg leading-relaxed italic max-w-2xl mx-auto mt-2">
          {activeCard.translation.shortDesc}
        </p>
      </div>

      <div class="relative mx-auto max-w-4xl pl-8 md:pl-0 py-8">
        <!-- Glowing Neon Line -->
        <div
          class="from-primary/80 via-secondary/80 to-transparent absolute top-0 bottom-0 left-4 w-1 bg-gradient-to-b rounded-full shadow-[0_0_10px_rgba(59,130,246,0.2)] md:left-1/2 md:-translate-x-1/2"
        ></div>

        {#each activeCard.translation.timeline as event, idx (idx)}
          <!-- Timeline item container -->
          <div class="relative mb-16 flex flex-col md:flex-row md:items-center justify-between">
            <!-- Center pulsing node -->
            <div
              class="absolute left-4 z-10 flex -translate-x-1/2 items-center justify-center md:left-1/2"
            >
              <div class="relative flex h-8 w-8 items-center justify-center">
                <div class="absolute h-full w-full rounded-full bg-primary/20 animate-ping opacity-75"></div>
                <div class="h-4 w-4 rounded-full border-2 border-white bg-primary shadow-[0_0_8px_#3b82f6]"></div>
              </div>
            </div>

            {#if idx % 2 === 0}
              <!-- Left Card -->
              <div class="w-full md:w-[45%] pl-8 md:pl-0 md:pr-12 md:text-right">
                <div
                  class="group/item relative rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                  <span
                    class="inline-block px-3 py-1 text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full mb-3 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
                  >
                    {event.year}
                  </span>
                  <h4 class="text-text-strong text-xl font-bold md:text-2xl mb-3">
                    {event.title}
                  </h4>
                  <p class="text-text-muted text-base leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>

              <!-- Right Image (or empty spacer) -->
              <div class="w-full md:w-[45%] pl-8 md:pl-12 mt-4 md:mt-0">
                {#if event.image}
                  <div class="relative overflow-hidden rounded-xl border border-white/10 group-all">
                    <button
                      onclick={() => fullscreenImage = event.image || null}
                      class="w-full relative overflow-hidden flex items-center justify-center cursor-zoom-in active:scale-[0.98] transition-transform duration-200"
                    >
                      <img
                        src={event.thumbnail || event.image}
                        alt={event.title}
                        class="w-full h-auto max-h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white">
                        <i class="bi bi-zoom-in text-2xl animate-pulse"></i>
                        <span class="text-xs font-semibold tracking-widest uppercase">Click to zoom</span>
                      </div>
                    </button>
                  </div>
                {/if}
              </div>
            {:else}
              <!-- Left Image (or empty spacer) -->
              <div class="w-full md:w-[45%] pl-8 md:pr-12 md:order-1 order-2 mt-4 md:mt-0">
                {#if event.image}
                  <div class="relative overflow-hidden rounded-xl border border-white/10 group-all">
                    <button
                      onclick={() => fullscreenImage = event.image || null}
                      class="w-full relative overflow-hidden flex items-center justify-center cursor-zoom-in active:scale-[0.98] transition-transform duration-200"
                    >
                      <img
                        src={event.thumbnail || event.image}
                        alt={event.title}
                        class="w-full h-auto max-h-64 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 text-white">
                        <i class="bi bi-zoom-in text-2xl animate-pulse"></i>
                        <span class="text-xs font-semibold tracking-widest uppercase">Click to zoom</span>
                      </div>
                    </button>
                  </div>
                {/if}
              </div>

              <!-- Right Card -->
              <div class="w-full md:w-[45%] pl-8 md:pl-12 md:order-2 order-1">
                <div
                  class="group/item relative rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/15 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                >
                  <span
                    class="inline-block px-3 py-1 text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full mb-3 shadow-[0_0_8px_rgba(59,130,246,0.1)]"
                  >
                    {event.year}
                  </span>
                  <h4 class="text-text-strong text-xl font-bold md:text-2xl mb-3">
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
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(10deg); }
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
  .terminal-header .red { background: #ef4444; }
  .terminal-header .yellow { background: #f59e0b; }
  .terminal-header .green { background: #10b981; }
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
  .terminal-body .c { color: #22d3ee; }
  .terminal-body .v { color: #fde047; }
  .terminal-body .f { color: #38bdf8; }
  .terminal-body .comment { color: #64748b; }
  .term-cursor {
    animation: blink 1s step-end infinite;
    color: #22d3ee;
    font-weight: bold;
  }
  @keyframes blink {
    50% { opacity: 0; }
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
    background: radial-gradient(ellipse at center, rgba(168, 85, 247, 0.4) 0%, transparent 80%);
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
    from { transform: rotate(0deg) translate(25px) rotate(0deg); }
    to { transform: rotate(360deg) translate(25px) rotate(-360deg); }
  }
</style>
