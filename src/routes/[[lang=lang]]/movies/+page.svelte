<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';
  import { moviesPageData } from '$/lib/data/aboutData';

  const _state = getState();
  const currentLang = $derived(_state.selectedLang);
  const data = $derived(moviesPageData[currentLang as 'cs' | 'en'] || moviesPageData.en);
</script>

<section
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-24 pb-12 md:px-8 md:pt-28"
>
  <div class="mb-12 text-center">
    <H1>{data.title}</H1>
    <p class="text-text-muted mx-auto mt-3 max-w-2xl text-lg italic md:text-xl">
      {data.description}
    </p>
    <div
      class="from-primary to-secondary mx-auto mt-4 h-1 w-24 rounded bg-gradient-to-r"
    ></div>
  </div>

  <!-- Movies Grid -->
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.movies as movie (movie.title)}
      <div
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]"
      >
        <!-- Background Gradient Aura -->
        <div
          class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-red-600/5 to-rose-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        ></div>

        <div class="flex items-start justify-between gap-4">
          <div>
            <span
              class="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-bold tracking-widest text-red-400 uppercase lg:text-sm"
              >{movie.type}</span
            >
            <h4
              class="text-text-strong group-hover:text-primary mt-2.5 text-xl leading-tight font-bold transition-colors duration-200"
            >
              {movie.title}
            </h4>
            <p class="text-text-muted mt-1 font-mono text-sm lg:text-base">
              {movie.year}
            </p>
          </div>
          <span
            class="flex shrink-0 items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 text-sm font-bold text-amber-300 shadow-sm lg:text-base"
          >
            <i class="bi bi-star-fill text-amber-400"></i>
            {movie.rating}
          </span>
        </div>
        <p
          class="text-text-muted mt-5 flex-1 border-t border-white/5 pt-4 text-lg leading-relaxed italic"
        >
          "{movie.review}"
        </p>
      </div>
    {/each}
  </div>
</section>
