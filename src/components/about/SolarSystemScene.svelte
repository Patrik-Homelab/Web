<script lang="ts">
  import { Dialog, Image } from '$/components/utility';
  import type { AboutStory, StoryEntry, StoryVisualTheme } from '$/lib/about/types';

  type SolarSystemLabels = {
    openDetails: string;
    close: string;
    showMore: string;
    showLess: string;
    images: string;
    imageCounter: string;
  };

  type SolarSystemSceneProps = {
    story: AboutStory;
    labels: SolarSystemLabels;
  };

  const { story, labels }: SolarSystemSceneProps = $props();

  const entriesById = $derived.by(() => {
    const next: Record<string, StoryEntry> = {};

    for (const entry of story.entries) {
      next[entry.id] = entry;
    }

    return next;
  });

  const sun = $derived(story.entries.find((entry) => entry.kind === 'sun'));
  const planets = $derived.by(() =>
    story.entries
      .filter((entry) => entry.kind === 'planet')
      .toSorted((a, b) => a.visual.orbit - b.visual.orbit)
  );
  const maxPlanetOrbit = $derived(
    Math.max(...planets.map((planet) => planet.visual.orbit), 1)
  );

  const moonsByParent = $derived.by(() => {
    const map: Record<string, StoryEntry[]> = {};

    for (const entry of story.entries) {
      if (entry.kind !== 'moon' || !entry.parentId) {
        continue;
      }

      const children = map[entry.parentId] ?? [];
      children.push(entry);
      map[entry.parentId] = children;
    }

    for (const parentId of Object.keys(map)) {
      map[parentId] = map[parentId].toSorted((a, b) => a.visual.orbit - b.visual.orbit);
    }

    return map;
  });

  const ORBIT_SLOWDOWN = 2.4;
  const fillerOrbitRaw = [8, 12, 16, 20, 26, 32, 38, 44];

  const fillerOrbits = $derived.by(() =>
    fillerOrbitRaw.map((orbit) => (orbit / maxPlanetOrbit) * 47)
  );

  let selectedId = $state<string | null>(null);
  let selectedImage = $state(0);
  let expanded = $state(false);

  const selectedEntry = $derived(selectedId ? entriesById[selectedId] : undefined);

  const formatImageCounter = (index: number, total: number) =>
    labels.imageCounter.replace('%1', String(index + 1)).replace('%2', String(total));

  const openEntry = (entryId: string) => {
    selectedId = entryId;
    selectedImage = 0;
    expanded = false;
  };

  const closeDialog = () => {
    selectedId = null;
    selectedImage = 0;
    expanded = false;
  };

  const themeClass = (theme: StoryVisualTheme) => `theme-${theme}`;

  const onWindowKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedEntry) {
      closeDialog();
    }
  };
</script>

<svelte:window onkeydown={onWindowKeydown} />

<section class="relative w-full overflow-hidden px-1 py-2 sm:px-2 sm:py-4 lg:px-4">
  <div class="mx-auto mb-6 max-w-4xl text-center">
    <h2 class="font-poppins text-primary-200 text-2xl font-semibold sm:text-3xl">
      {story.title}
    </h2>
    <p class="text-text-muted mt-2 text-base sm:text-lg">{story.subtitle}</p>
    <p class="text-text-muted/80 mt-3 text-sm sm:text-base">{story.hint}</p>
  </div>

  <div class="orbit-stage" role="img" aria-label={story.subtitle}>
    {#each fillerOrbits as orbit (orbit)}
      <div class="empty-orbit" style={`--orbit:${orbit}%`}></div>
    {/each}

    {#if sun}
      <button
        type="button"
        class={`space-node node-sun ${themeClass(sun.visual.theme)}`}
        style={`--size:${sun.visual.size}rem`}
        onclick={() => openEntry(sun.id)}
        title={`${sun.title} - ${sun.subtitle}`}
        aria-label={`${labels.openDetails}: ${sun.title}`}
      >
        <span class="node-core"></span>
      </button>
    {/if}

    {#each planets as planet (planet.id)}
      <div
        class="planet-orbit"
        style={`--orbit:${(planet.visual.orbit / maxPlanetOrbit) * 47}%;--period:${planet.visual.period * ORBIT_SLOWDOWN}s;--start-angle:${planet.visual.startAngle}deg`}
      >
        <div class="planet-anchor">
          <button
            type="button"
            class={`space-node node-planet ${themeClass(planet.visual.theme)}`}
            style={`--size:${planet.visual.size}rem`}
            onclick={() => openEntry(planet.id)}
            title={`${planet.title} - ${planet.subtitle}`}
            aria-label={`${labels.openDetails}: ${planet.title}`}
          >
            <span class="node-core"></span>
          </button>

          {#each moonsByParent[planet.id] ?? [] as moon (moon.id)}
            <div
              class="moon-orbit"
              style={`--moon-orbit:${moon.visual.orbit * 0.42}rem;--moon-period:${moon.visual.period * ORBIT_SLOWDOWN}s;--start-angle:${moon.visual.startAngle}deg`}
            >
              <button
                type="button"
                class={`space-node node-moon ${themeClass(moon.visual.theme)}`}
                style={`--size:${moon.visual.size}rem`}
                onclick={() => openEntry(moon.id)}
                title={`${moon.title} - ${moon.subtitle}`}
                aria-label={`${labels.openDetails}: ${moon.title}`}
              >
                <span class="node-core"></span>
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <Dialog opened={Boolean(selectedEntry)} onClose={closeDialog}>
    {#if selectedEntry}
      <article
        class="solar-dialog text-text max-h-[85vh] w-[min(56rem,95vw)] overflow-y-auto"
      >
        <header class="mb-4 border-b border-white/10 pb-4">
          <p class="text-text-muted text-sm font-semibold tracking-[0.18em] uppercase">
            {selectedEntry.subtitle}
          </p>
          <h3
            class="font-poppins text-primary-100 mt-2 text-2xl font-semibold sm:text-3xl"
          >
            {selectedEntry.title}
          </h3>
        </header>

        <section class="mb-5">
          <p class="text-base leading-relaxed sm:text-lg">{selectedEntry.preview}</p>
          {#if expanded}
            <p class="text-text-muted mt-3 text-base leading-relaxed sm:text-lg">
              {selectedEntry.full}
            </p>
          {/if}
          <button
            class="solar-link mt-3"
            type="button"
            onclick={() => (expanded = !expanded)}
          >
            {expanded ? labels.showLess : labels.showMore}
          </button>
        </section>

        {#if selectedEntry.images.length > 0}
          <section>
            <div class="mb-3 flex items-center justify-between gap-3">
              <h4 class="text-lg font-semibold">{labels.images}</h4>
              <span class="text-text-muted text-sm">
                {formatImageCounter(selectedImage, selectedEntry.images.length)}
              </span>
            </div>

            <div
              class="border-text/30 mb-3 overflow-hidden rounded-xl border bg-gray-950/70"
            >
              <Image
                name={selectedEntry.images[selectedImage].src}
                alt={selectedEntry.images[selectedImage].alt}
                class="aspect-[16/10] w-full object-cover"
                format="webp"
              />
            </div>

            {#if selectedEntry.images[selectedImage].caption}
              <p class="text-text-muted mb-3 text-sm italic">
                {selectedEntry.images[selectedImage].caption}
              </p>
            {/if}

            {#if selectedEntry.images.length > 1}
              <div class="flex flex-wrap gap-2">
                {#each selectedEntry.images as image, idx (image.src + idx)}
                  <button
                    type="button"
                    class="thumb-btn"
                    data-active={idx === selectedImage}
                    onclick={() => (selectedImage = idx)}
                    aria-label={`${labels.openDetails}: ${selectedEntry.title} (${idx + 1})`}
                  >
                    <Image
                      name={image.src}
                      alt={image.alt}
                      class="h-16 w-24 rounded-md object-cover"
                      format="webp"
                      quality={70}
                    />
                  </button>
                {/each}
              </div>
            {/if}
          </section>
        {/if}

        <div class="mt-6 flex justify-end">
          <button type="button" class="close-btn" onclick={closeDialog}
            >{labels.close}</button
          >
        </div>
      </article>
    {/if}
  </Dialog>
</section>

<style>
  .orbit-stage {
    position: relative;
    margin-inline: auto;
    width: min(100%, 90rem);
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 1rem;
    background: transparent;
  }

  .empty-orbit,
  .planet-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 999px;
    pointer-events: none;
  }

  .empty-orbit {
    width: calc(var(--orbit) * 2);
    height: calc(var(--orbit) * 2);
    transform: translate(-50%, -50%);
    border: 1px dashed rgb(255 255 255 / 0.1);
  }

  .planet-orbit {
    width: calc(var(--orbit) * 2);
    height: calc(var(--orbit) * 2);
    transform: translate(-50%, -50%) rotate(var(--start-angle));
    border: 1px solid rgb(255 255 255 / 0.18);
    animation: orbit-spin var(--period) linear infinite;
  }

  .planet-anchor {
    position: absolute;
    top: 50%;
    right: -0.35rem;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .moon-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    width: calc(var(--moon-orbit) * 2);
    height: calc(var(--moon-orbit) * 2);
    transform: translate(-50%, -50%) rotate(var(--start-angle));
    border: 1px dashed rgb(255 255 255 / 0.18);
    border-radius: 999px;
    animation: orbit-spin var(--moon-period) linear infinite reverse;
    pointer-events: none;
  }

  .moon-orbit > .space-node {
    position: absolute;
    top: calc(50% - (var(--size) / 2));
    right: calc(0rem - (var(--size) / 2));
  }

  .space-node {
    position: relative;
    width: var(--size);
    height: var(--size);
    border-radius: 999px;
    border: 1px solid rgb(255 255 255 / 0.35);
    box-shadow: 0 0 0.8rem rgb(255 255 255 / 0.25);
    transition: transform 220ms ease;
    cursor: pointer;
    pointer-events: auto;
  }

  .space-node:hover {
    transform: scale(1.08);
  }

  .space-node:focus-visible {
    outline: 2px solid rgb(255 216 153 / 0.95);
    outline-offset: 2px;
  }

  .node-sun {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow:
      0 0 2rem rgb(255 168 56 / 0.55),
      0 0 4.5rem rgb(255 96 16 / 0.35);
  }

  .node-core {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    animation: self-spin 58s linear infinite;
    background-size: cover;
    background-position: center;
  }

  .theme-sun .node-core {
    background-image: radial-gradient(
      circle at 32% 30%,
      rgb(255 247 198),
      rgb(255 183 64) 52%,
      rgb(255 112 32)
    );
  }

  .theme-mercury .node-core {
    background-image: radial-gradient(
      circle at 35% 28%,
      rgb(218 209 193),
      rgb(168 156 141) 58%,
      rgb(120 109 96)
    );
  }

  .theme-venus .node-core {
    background-image: radial-gradient(
      circle at 35% 26%,
      rgb(245 218 158),
      rgb(207 156 77) 58%,
      rgb(143 98 42)
    );
  }

  .theme-earth .node-core {
    background-image: radial-gradient(
      circle at 35% 28%,
      rgb(132 202 255),
      rgb(47 123 208) 52%,
      rgb(28 93 58) 74%,
      rgb(16 61 117)
    );
  }

  .theme-moon .node-core {
    background-image: radial-gradient(
      circle at 35% 26%,
      rgb(236 236 237),
      rgb(174 176 183) 56%,
      rgb(120 124 136)
    );
  }

  .theme-mars .node-core {
    background-image: radial-gradient(
      circle at 35% 26%,
      rgb(255 190 146),
      rgb(212 108 75) 56%,
      rgb(126 55 41)
    );
  }

  .theme-jupiter .node-core {
    background-image: linear-gradient(
      165deg,
      rgb(228 197 160) 0%,
      rgb(195 151 108) 24%,
      rgb(156 114 79) 48%,
      rgb(208 171 127) 72%,
      rgb(132 92 62) 100%
    );
  }

  .theme-saturn .node-core {
    background-image: linear-gradient(
      165deg,
      rgb(235 219 177) 0%,
      rgb(205 181 132) 32%,
      rgb(174 145 99) 66%,
      rgb(132 111 80) 100%
    );
  }

  .theme-uranus .node-core {
    background-image: radial-gradient(
      circle at 35% 26%,
      rgb(198 247 255),
      rgb(116 201 224) 58%,
      rgb(74 148 168)
    );
  }

  .theme-neptune .node-core {
    background-image: radial-gradient(
      circle at 35% 26%,
      rgb(171 198 255),
      rgb(75 117 224) 58%,
      rgb(42 69 155)
    );
  }

  .solar-dialog {
    border-radius: 1rem;
    border: 1px solid rgb(255 255 255 / 0.16);
    background:
      radial-gradient(circle at top right, rgb(255 202 129 / 12%), transparent 35%),
      rgb(11 13 22 / 96%);
    box-shadow:
      0 0 0 1px rgb(255 255 255 / 0.05),
      0 1.2rem 3rem rgb(0 0 0 / 0.55);
    padding: 1.1rem;
  }

  .solar-link {
    color: rgb(255 213 146 / 0.95);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }

  .thumb-btn {
    border-radius: 0.55rem;
    border: 1px solid rgb(255 255 255 / 0.2);
    padding: 0.12rem;
    transition:
      transform 150ms ease,
      border-color 150ms ease;
  }

  .thumb-btn:hover {
    transform: translateY(-1px);
    border-color: rgb(255 216 153 / 0.7);
  }

  .thumb-btn[data-active='true'] {
    border-color: rgb(255 216 153 / 0.95);
    box-shadow: 0 0 0.8rem rgb(255 174 83 / 0.35);
  }

  .close-btn {
    border: 1px solid rgb(255 255 255 / 0.28);
    background: rgb(255 255 255 / 0.05);
    border-radius: 0.6rem;
    padding: 0.38rem 0.8rem;
    cursor: pointer;
    transition: background-color 180ms ease;
  }

  .close-btn:hover {
    background: rgb(255 255 255 / 0.14);
  }

  @keyframes orbit-spin {
    to {
      transform: translate(-50%, -50%) rotate(calc(var(--start-angle, 0deg) + 360deg));
    }
  }

  @keyframes self-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    .orbit-stage {
      width: min(100%, 96vw);
    }

    .planet-orbit,
    .empty-orbit {
      opacity: 0.86;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .planet-orbit,
    .moon-orbit,
    .node-core {
      animation-duration: 120s;
    }
  }
</style>
