<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { getState } from '$/lib/state.svelte';
  import { moviesPageData } from '$/lib/data/aboutData';

  const _state = getState();
  const currentLang = $derived(_state.selectedLang);
  const data = $derived(moviesPageData[currentLang as 'cs' | 'en'] || moviesPageData.en);
</script>

<section
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 md:px-8"
>
  <div class="mb-12 text-center">
    <H1>{data.title}</H1>
    <p class="text-text-muted mt-3 text-base md:text-lg max-w-2xl mx-auto italic">
      {data.description}
    </p>
    <div
      class="from-primary to-secondary mx-auto mt-4 h-1 w-24 rounded bg-gradient-to-r"
    ></div>
  </div>

  <!-- Movies Grid -->
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.movies as movie}
      <div
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-red-500/30 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
      >
        <!-- Background Gradient Aura -->
        <div
          class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-red-600/5 to-rose-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        ></div>

        <div class="flex items-start justify-between gap-4">
          <div>
            <span
              class="text-xs font-semibold tracking-wider text-red-400 uppercase"
              >{movie.type}</span
            >
            <h4 class="text-text-strong text-2xl font-bold mt-1">{movie.title}</h4>
            <p class="text-text-muted text-sm mt-0.5">{movie.year}</p>
          </div>
          <span
            class="flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-sm font-bold text-red-300 border border-red-500/20 shadow-sm"
          >
            <i class="bi bi-star-fill text-amber-400"></i>
            {movie.rating}
          </span>
        </div>
        <p class="text-text-muted mt-4 flex-1 text-base italic leading-relaxed">
          "{movie.review}"
        </p>
      </div>
    {/each}
  </div>
</section>
