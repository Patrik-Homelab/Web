<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import { formatDate } from '$/lib/functions';
  import { getState } from '$/lib/state.svelte';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const _state = getState();
  const _lang = $derived(_state.lang.movies);

  let searchQuery = $state('');
  let selectedType = $state<'all' | 'series' | 'movie'>('all');
  let minRating = $state<number>(0);
  let selectedYear = $state<string>('all');
  let sortBy = $state<
    | 'added_desc'
    | 'added_asc'
    | 'rating_desc'
    | 'rating_asc'
    | 'year_desc'
    | 'year_asc'
    | 'title_asc'
  >('added_desc');

  const availableYears = $derived(
    Array.from(new Set(data.movies.map((m) => m.release_year))).sort((a, b) => b - a)
  );

  const filteredMovies = $derived.by(() => {
    let list = [...data.movies];

    // Search filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) => m.title.toLowerCase().includes(q) || m.review.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      list = list.filter((m) => m.type === selectedType);
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter((m) => m.rating >= minRating);
    }

    // Year filter
    if (selectedYear !== 'all') {
      const y = parseInt(selectedYear, 10);
      list = list.filter((m) => m.release_year === y);
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'added_desc':
          return (
            new Date(b.added_at).getTime() - new Date(a.added_at).getTime() || b.id - a.id
          );
        case 'added_asc':
          return (
            new Date(a.added_at).getTime() - new Date(b.added_at).getTime() || a.id - b.id
          );
        case 'rating_desc':
          return b.rating - a.rating;
        case 'rating_asc':
          return a.rating - b.rating;
        case 'year_desc':
          return b.release_year - a.release_year;
        case 'year_asc':
          return a.release_year - b.release_year;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return list;
  });

  const resetFilters = () => {
    searchQuery = '';
    selectedType = 'all';
    minRating = 0;
    selectedYear = 'all';
    sortBy = 'added_desc';
  };

  const hasActiveFilters = $derived(
    searchQuery.trim().length > 0 ||
      selectedType !== 'all' ||
      minRating > 0 ||
      selectedYear !== 'all' ||
      sortBy !== 'added_desc'
  );
</script>

<section
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-24 pb-12 md:px-8 md:pt-28"
>
  <!-- Page Header -->
  <div class="mb-10 text-center">
    <H1>{_lang.title}</H1>
    <p class="text-text-muted mx-auto mt-3 max-w-2xl text-lg italic md:text-xl">
      {_lang.description}
    </p>
    <div
      class="from-primary to-secondary mx-auto mt-4 h-1 w-24 rounded bg-gradient-to-r"
    ></div>
  </div>

  <!-- Interactive Controls & Filters -->
  <div
    class="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-md"
  >
    <!-- Top Search & Sort Row -->
    <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
      <!-- Search Input -->
      <div class="relative md:col-span-8">
        <i
          class="bi bi-search text-text-muted absolute top-1/2 left-3.5 -translate-y-1/2 text-sm"
        ></i>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder={_lang.searchPlaceholder}
          class="focus:border-primary/50 focus:ring-primary/20 text-text w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pr-4 pl-10 text-sm placeholder-slate-400 backdrop-blur-sm transition-all focus:ring-2 focus:outline-none"
        />
        {#if searchQuery}
          <button
            type="button"
            onclick={() => (searchQuery = '')}
            class="text-text-muted hover:text-text-strong absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            aria-label="Clear search"
          >
            <i class="bi bi-x-circle-fill"></i>
          </button>
        {/if}
      </div>

      <!-- Sort By Dropdown -->
      <div class="relative md:col-span-4">
        <select
          bind:value={sortBy}
          class="focus:border-primary/50 focus:ring-primary/20 text-text w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 py-2.5 pr-8 pl-3 text-sm backdrop-blur-sm transition-all focus:ring-2 focus:outline-none"
        >
          <option value="added_desc" class="bg-slate-900">{_lang.sortAddedDesc}</option>
          <option value="added_asc" class="bg-slate-900">{_lang.sortAddedAsc}</option>
          <option value="rating_desc" class="bg-slate-900">{_lang.sortRatingDesc}</option>
          <option value="rating_asc" class="bg-slate-900">{_lang.sortRatingAsc}</option>
          <option value="year_desc" class="bg-slate-900">{_lang.sortYearDesc}</option>
          <option value="year_asc" class="bg-slate-900">{_lang.sortYearAsc}</option>
          <option value="title_asc" class="bg-slate-900">{_lang.sortTitleAsc}</option>
        </select>
        <i
          class="bi bi-chevron-down text-text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs"
        ></i>
      </div>
    </div>

    <!-- Filter Pills Row -->
    <div
      class="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-3"
    >
      <div class="flex flex-wrap items-center gap-2">
        <!-- Type Filter Buttons -->
        <div class="flex items-center rounded-lg border border-white/10 bg-black/30 p-1">
          <button
            type="button"
            onclick={() => (selectedType = 'all')}
            class="cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition-all {selectedType ===
            'all'
              ? 'bg-primary font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-text'}"
          >
            {_lang.allTypes}
          </button>
          <button
            type="button"
            onclick={() => (selectedType = 'series')}
            class="cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition-all {selectedType ===
            'series'
              ? 'bg-primary font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-text'}"
          >
            {_lang.series}
          </button>
          <button
            type="button"
            onclick={() => (selectedType = 'movie')}
            class="cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition-all {selectedType ===
            'movie'
              ? 'bg-primary font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-text'}"
          >
            {_lang.movie}
          </button>
        </div>

        <!-- Star Rating Filter Buttons -->
        <div class="flex items-center rounded-lg border border-white/10 bg-black/30 p-1">
          <button
            type="button"
            onclick={() => (minRating = 0)}
            class="cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-all {minRating ===
            0
              ? 'bg-amber-500 font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-amber-400'}"
          >
            {_lang.allRatings}
          </button>
          <button
            type="button"
            onclick={() => (minRating = 4.8)}
            class="flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all {minRating ===
            4.8
              ? 'bg-amber-500 font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-amber-400'}"
          >
            <i class="bi bi-star-fill text-[10px]"></i> 4.8+
          </button>
          <button
            type="button"
            onclick={() => (minRating = 4.5)}
            class="flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all {minRating ===
            4.5
              ? 'bg-amber-500 font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-amber-400'}"
          >
            <i class="bi bi-star-fill text-[10px]"></i> 4.5+
          </button>
          <button
            type="button"
            onclick={() => (minRating = 4.0)}
            class="flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all {minRating ===
            4.0
              ? 'bg-amber-500 font-bold text-slate-950 shadow'
              : 'text-text-muted hover:text-amber-400'}"
          >
            <i class="bi bi-star-fill text-[10px]"></i> 4.0+
          </button>
        </div>

        <!-- Release Year Filter -->
        <div class="relative">
          <select
            bind:value={selectedYear}
            class="focus:border-primary/50 text-text cursor-pointer appearance-none rounded-lg border border-white/10 bg-black/40 py-1.5 pr-7 pl-3 text-xs backdrop-blur-sm transition-all focus:outline-none"
          >
            <option value="all" class="bg-slate-900">{_lang.allYears}</option>
            {#each availableYears as year (year)}
              <option value={year.toString()} class="bg-slate-900">{year}</option>
            {/each}
          </select>
          <i
            class="bi bi-chevron-down text-text-muted pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[10px]"
          ></i>
        </div>
      </div>

      <!-- Results Count & Reset Button -->
      <div class="flex items-center gap-3">
        <span class="text-text-muted font-mono text-xs">
          {filteredMovies.length} / {data.movies.length}
        </span>
        {#if hasActiveFilters}
          <button
            type="button"
            onclick={resetFilters}
            class="hover:text-primary-text flex cursor-pointer items-center gap-1 text-xs font-medium text-red-400 transition-colors"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
            {_lang.resetFilters}
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Movies Grid -->
  {#if filteredMovies.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-950/30 py-20 text-center backdrop-blur-md"
    >
      <i class="bi bi-film text-text-muted mb-3 text-4xl"></i>
      <p class="text-text-muted text-lg font-medium">{_lang.emptySearch}</p>
      <button
        type="button"
        onclick={resetFilters}
        class="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 mt-4 cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
      >
        {_lang.resetFilters}
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredMovies as movie (movie.id)}
        <div
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]"
        >
          <!-- Background Gradient Aura -->
          <div
            class="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-red-600/5 to-rose-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          ></div>

          <div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <span
                  class="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-bold tracking-widest text-red-400 uppercase"
                >
                  {movie.type === 'movie' ? _lang.movie : _lang.series}
                </span>
                <h2
                  class="text-text-strong group-hover:text-primary mt-2.5 text-xl leading-tight font-bold transition-colors duration-200"
                >
                  {movie.title}
                </h2>
                <div
                  class="text-text-muted mt-1.5 flex items-center gap-3 font-mono text-xs"
                >
                  <span>{movie.release_year}</span>
                  <span>•</span>
                  <span title={_lang.addedOn} class="flex items-center gap-1">
                    <i class="bi bi-calendar-event text-[10px]"></i>
                    {formatDate(movie.added_at)}
                  </span>
                </div>
              </div>

              <!-- Rating Badge -->
              <span
                class="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 text-sm font-bold text-amber-300 shadow-sm"
              >
                <i class="bi bi-star-fill text-xs text-amber-400"></i>
                {movie.rating}/5
              </span>
            </div>

            <!-- Review Body -->
            <p
              class="text-text-muted mt-5 flex-1 border-t border-white/5 pt-4 text-base leading-relaxed italic"
            >
              "{movie.review}"
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
