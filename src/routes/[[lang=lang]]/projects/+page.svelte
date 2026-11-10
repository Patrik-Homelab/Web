<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import H2 from '$/components/headers/H2.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import Markdown from '$/components/utility/Markdown.svelte';
  import {
    extractLinksFromMarkdown,
    getTagStyle,
    resolveProjectImageUrl,
    type ProjectItem
  } from '$/lib/data/projectsData';
  import { formatDate } from '$/lib/functions';
  import { getState } from '$/lib/state.svelte';
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';

  const { data }: PageProps = $props();

  const _state = getState();
  const _lang = $derived(_state.lang.projects);

  let searchQuery = $state('');
  let selectedTag = $state<string>('all');
  let selectedYear = $state<string>('all');
  let sortBy = $state<'date_desc' | 'date_asc' | 'name_asc'>('date_desc');
  let showAllTags = $state(false);

  // Detail modal & Lightbox state
  let activeProject = $state<ProjectItem | null>(null);
  let activeGalleryIndex = $state<number>(0);
  let lightboxImage = $state<string | null>(null);

  const TOP_TAGS_LIMIT = 8;

  const availableTags = $derived.by(() => {
    const counts = new Map<string, number>();
    for (const p of data.projects) {
      for (const tag of p.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  });

  const visibleTags = $derived(
    showAllTags ? availableTags : availableTags.slice(0, TOP_TAGS_LIMIT)
  );

  const hiddenTagsCount = $derived(Math.max(0, availableTags.length - TOP_TAGS_LIMIT));

  const availableYears = $derived(
    Array.from(
      new Set(
        data.projects.map((p) => new Date(p.date).getFullYear()).filter((y) => !isNaN(y))
      )
    ).sort((a, b) => b - a)
  );

  const filteredProjects = $derived.by(() => {
    let list = [...data.projects];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedTag !== 'all') {
      list = list.filter((p) => p.tags.includes(selectedTag));
    }

    if (selectedYear !== 'all') {
      const y = parseInt(selectedYear, 10);
      list = list.filter((p) => new Date(p.date).getFullYear() === y);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id;
        case 'date_asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime() || a.id - b.id;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return list;
  });

  const hasActiveFilters = $derived(
    searchQuery.trim().length > 0 ||
      selectedTag !== 'all' ||
      selectedYear !== 'all' ||
      sortBy !== 'date_desc'
  );

  const resetFilters = () => {
    searchQuery = '';
    selectedTag = 'all';
    selectedYear = 'all';
    sortBy = 'date_desc';
  };

  const toggleTag = (tag: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    selectedTag = selectedTag === tag ? 'all' : tag;
  };

  function getCleanExcerpt(md: string): string {
    return md
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        if (/^(\[.*?\]\(https?:\/\/.*?\)\s*[•|,-]?\s*)+$/.test(trimmed)) {
          return false;
        }
        return true;
      })
      .join(' ')
      .replace(/\[([^\]|]+?)\s*(?:\|[^\]]*)?\]\([^)]+\)/g, '$1')
      .replace(/[*_`#>-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getProjectAllImages(project: ProjectItem): string[] {
    const urls: string[] = [];
    const previewUrl = resolveProjectImageUrl(project.preview);
    if (previewUrl) urls.push(previewUrl);
    for (const img of project.images) {
      const resolved = resolveProjectImageUrl(img);
      if (resolved && !urls.includes(resolved)) {
        urls.push(resolved);
      }
    }
    return urls;
  }

  const activeModalImages = $derived(
    activeProject ? getProjectAllImages(activeProject) : []
  );

  function openProjectModal(project: ProjectItem) {
    activeProject = project;
    activeGalleryIndex = 0;
  }

  function closeProjectModal() {
    activeProject = null;
    activeGalleryIndex = 0;
  }

  function stepGallery(delta: number) {
    if (activeModalImages.length <= 1) return;
    activeGalleryIndex =
      (activeGalleryIndex + delta + activeModalImages.length) % activeModalImages.length;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (lightboxImage) {
        lightboxImage = null;
      } else if (activeProject) {
        closeProjectModal();
      }
    } else if (activeProject && !lightboxImage && activeModalImages.length > 1) {
      if (e.key === 'ArrowRight') stepGallery(1);
      if (e.key === 'ArrowLeft') stepGallery(-1);
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<section
  class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-24 pb-12 md:px-8 md:pt-28"
>
  <!-- Page Header (Matching gallery, movies, and about) -->
  <div class="mb-10 text-center">
    <H1>{_lang.title}</H1>
    <div
      class="from-primary to-secondary mx-auto mt-2 h-1 w-24 rounded bg-gradient-to-r"
    ></div>
    <p class="text-text-muted mx-auto mt-3 max-w-2xl text-lg italic md:text-xl">
      {_lang.description}
    </p>
  </div>

  <!-- Interactive Controls & Filters (Matching movies and gallery style) -->
  <div
    class="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-md"
  >
    <!-- Top Search & Sort Row -->
    <div class="grid grid-cols-1 gap-3 md:grid-cols-12">
      <!-- Search Input -->
      <div class="relative md:col-span-6">
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

      <!-- Year Filter Dropdown -->
      <div class="relative md:col-span-3">
        <select
          bind:value={selectedYear}
          aria-label={_lang.allYears}
          class="focus:border-primary/50 focus:ring-primary/20 text-text w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 py-2.5 pr-8 pl-3 text-sm backdrop-blur-sm transition-all focus:ring-2 focus:outline-none"
        >
          <option value="all" class="bg-slate-900">{_lang.allYears}</option>
          {#each availableYears as year (year)}
            <option value={year.toString()} class="bg-slate-900">{year}</option>
          {/each}
        </select>
        <i
          class="bi bi-chevron-down text-text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs"
        ></i>
      </div>

      <!-- Sort By Dropdown -->
      <div class="relative md:col-span-3">
        <select
          bind:value={sortBy}
          aria-label={_lang.sortBy}
          class="focus:border-primary/50 focus:ring-primary/20 text-text w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 py-2.5 pr-8 pl-3 text-sm backdrop-blur-sm transition-all focus:ring-2 focus:outline-none"
        >
          <option value="date_desc" class="bg-slate-900">{_lang.sortDateDesc}</option>
          <option value="date_asc" class="bg-slate-900">{_lang.sortDateAsc}</option>
          <option value="name_asc" class="bg-slate-900">{_lang.sortNameAsc}</option>
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
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onclick={() => (selectedTag = 'all')}
          class="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200 {selectedTag ===
          'all'
            ? 'bg-primary border-primary font-bold text-slate-950'
            : 'text-text-muted hover:text-text border-white/10 bg-white/5 hover:bg-white/10'}"
        >
          {_lang.allTags}
        </button>

        {#each visibleTags as tag (tag.name)}
          {@const isSelected = selectedTag === tag.name}
          <button
            type="button"
            onclick={() => toggleTag(tag.name)}
            class="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-colors duration-200 {isSelected
              ? 'bg-primary border-primary font-bold text-slate-950'
              : 'text-text-muted hover:text-text border-white/10 bg-white/5 hover:bg-white/10'}"
          >
            {tag.name}
          </button>
        {/each}

        {#if !showAllTags && selectedTag !== 'all' && !visibleTags.some((t) => t.name === selectedTag)}
          <button
            type="button"
            onclick={() => toggleTag(selectedTag)}
            class="bg-primary border-primary cursor-pointer rounded-full border px-3 py-1 text-xs font-bold text-slate-950 transition-colors"
          >
            {selectedTag}
          </button>
        {/if}

        {#if hiddenTagsCount > 0}
          <button
            type="button"
            onclick={() => (showAllTags = !showAllTags)}
            class="text-text-muted hover:text-text cursor-pointer rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-white/10"
          >
            {showAllTags ? '−' : `+${hiddenTagsCount}`}
          </button>
        {/if}
      </div>

      <!-- Results Count & Reset Button -->
      <div class="flex items-center gap-3">
        <span class="text-text-muted font-mono text-xs">
          {filteredProjects.length} / {data.projects.length}
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

  <!-- Projects Grid (Matching gallery and movies layout) -->
  {#if filteredProjects.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-950/30 py-20 text-center backdrop-blur-md"
    >
      <i class="bi bi-code-slash text-text-muted mb-3 text-4xl"></i>
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
      {#each filteredProjects as project (project.uuid)}
        {@const primaryTag = project.tags[0] || 'Code'}
        {@const primaryStyle = getTagStyle(primaryTag)}
        {@const allImages = getProjectAllImages(project)}
        {@const coverImage = allImages[0] || null}
        {@const links = extractLinksFromMarkdown(project.description)}
        {@const excerpt = getCleanExcerpt(project.description)}
        {@const year = new Date(project.date).getFullYear()}

        <div
          role="button"
          tabindex="0"
          onclick={() => openProjectModal(project)}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openProjectModal(project);
            }
          }}
          class="group hover:border-primary/30 relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 text-left shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-slate-900/60 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_0_20px_rgba(var(--color-primary-500),0.1)]"
        >
          <!-- Background Gradient Aura (Matching movies & about) -->
          <div
            class="from-primary/5 to-secondary/5 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          ></div>

          <div>
            <!-- Card Image Header -->
            <div
              class="relative h-48 w-full overflow-hidden border-b border-white/5 bg-slate-950/80"
            >
              {#if coverImage}
                <img
                  src={coverImage}
                  alt={project.name}
                  loading="lazy"
                  class="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30"
                ></div>
              {:else}
                <div
                  class="flex h-full w-full items-center justify-center bg-slate-900/50"
                >
                  <div
                    class="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110"
                  >
                    <Icon
                      name={primaryStyle.icon}
                      class="text-primary/60 group-hover:text-primary text-3xl transition-colors duration-200"
                    />
                  </div>
                </div>
              {/if}

              <!-- Top Badges Overlay (Matching gallery) -->
              <div
                class="absolute inset-x-0 top-0 flex items-center justify-between p-3.5"
              >
                <div class="flex items-center gap-1.5">
                  <span
                    class="bg-primary/20 text-primary border-primary/30 rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide backdrop-blur-md"
                  >
                    {primaryTag}
                  </span>
                  {#if project.hidden}
                    <span
                      class="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 backdrop-blur-md"
                    >
                      <Icon name="bi-eye-slash-fill" class="text-[10px]" />
                      <span>{_lang.draftBadge}</span>
                    </span>
                  {/if}
                </div>

                <div class="flex items-center gap-1.5">
                  {#if allImages.length > 1}
                    <span
                      class="text-text-strong flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-xs font-bold shadow-lg backdrop-blur-md"
                    >
                      <Icon name="bi-images" class="text-primary text-[10px]" />
                      <span>{allImages.length}</span>
                    </span>
                  {/if}

                  <span
                    class="text-text-strong flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-xs font-bold shadow-lg backdrop-blur-md"
                  >
                    <Icon name="bi-calendar" class="text-primary text-[10px]" />
                    <span>{year}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Card Description Details (Matching gallery) -->
            <div class="flex flex-col gap-3 p-5">
              <H2
                class="group-hover:text-primary truncate text-lg font-bold transition-colors duration-200 md:text-xl"
              >
                {project.name}
              </H2>

              <p class="text-text-muted line-clamp-2 text-base leading-relaxed">
                {excerpt}
              </p>

              <!-- Badges row -->
              <div class="flex w-full flex-wrap gap-1.5 py-1">
                {#each project.tags as tag (tag)}
                  <button
                    type="button"
                    onclick={(e) => toggleTag(tag, e)}
                    class="text-text-muted hover:text-text rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200 hover:bg-white/10 {selectedTag ===
                    tag
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : ''}"
                  >
                    {tag}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Footer Info (Matching gallery) -->
          <div
            class="text-text-muted mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-5 py-3.5 text-sm"
          >
            <div class="flex flex-wrap items-center gap-2">
              {#each links.slice(0, 2) as link (link.url)}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onclick={(e) => e.stopPropagation()}
                  class="text-text-muted hover:text-text flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs transition-colors hover:border-white/20 hover:bg-white/10"
                >
                  <Icon name={link.icon} class="text-xs" />
                  <span class="whitespace-nowrap">{link.label}</span>
                </a>
              {/each}
            </div>

            <div
              class="group-hover:text-primary ml-auto flex shrink-0 items-center gap-1 font-bold transition-colors duration-200"
            >
              <span>{_lang.viewDetails}</span>
              <Icon
                name="bi-arrow-right"
                class="transition-transform duration-200 group-hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- GitHub Footer Callout -->
  <div
    class="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-6 text-center shadow-xl backdrop-blur-md sm:flex-row sm:text-left"
  >
    <div class="flex flex-col gap-1">
      <h2 class="text-text-strong text-lg font-bold md:text-xl">
        {_lang.moreProjectsGithub}
      </h2>
      <p class="text-text-muted text-sm md:text-base">
        github.com/patrick11514 • github.com/Patrik-Homelab
      </p>
    </div>
    <a
      href="https://github.com/patrick11514"
      target="_blank"
      rel="noopener noreferrer"
      class="bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-all"
    >
      <Icon name="bi-github" class="text-lg" />
      <span>{_lang.visitGithub}</span>
    </a>
  </div>
</section>

<!-- PROJECT DETAIL MODAL -->
{#if activeProject}
  {@const modalLinks = extractLinksFromMarkdown(activeProject.description)}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => {
      if (e.target === e.currentTarget) closeProjectModal();
    }}
    onkeydown={(e) => {
      if (e.key === 'Escape') closeProjectModal();
    }}
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
  >
    <div
      role="document"
      class="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl md:p-8"
    >
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div class="text-text-muted mb-2 flex items-center gap-2 font-mono text-xs">
            <Icon name="bi-calendar3" class="text-primary" />
            <span>{formatDate(activeProject.date, false)}</span>
            {#if activeProject.hidden}
              <span
                class="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300"
              >
                <Icon name="bi-eye-slash-fill" class="text-[10px]" />
                {_lang.draftBadge}
              </span>
            {/if}
          </div>
          <h2 class="text-text-strong text-2xl font-extrabold md:text-3xl">
            {activeProject.name}
          </h2>

          {#if activeProject.tags.length > 0}
            <div class="mt-3 flex flex-wrap gap-1.5">
              {#each activeProject.tags as tag (tag)}
                <span
                  class="text-text-muted rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs font-semibold"
                >
                  {tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>

        <button
          type="button"
          onclick={closeProjectModal}
          aria-label={_lang.close}
          class="text-text-muted hover:text-text-strong flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
        >
          <Icon name="bi-x-lg" class="text-lg" />
        </button>
      </div>

      <!-- External Links Bar -->
      {#if modalLinks.length > 0}
        <div class="mt-5 flex flex-wrap gap-2.5">
          {#each modalLinks as link (link.url)}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              class="bg-primary/15 text-primary border-primary/30 hover:bg-primary/25 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all"
            >
              <Icon name={link.icon} />
              <span>{link.label}</span>
              <Icon name="bi-box-arrow-up-right" class="text-xs opacity-75" />
            </a>
          {/each}
        </div>
      {/if}

      <!-- Full Markdown Description -->
      <div class="mt-6 rounded-xl border border-white/10 bg-black/40 p-5">
        <h3 class="text-text-muted mb-3 text-xs font-bold tracking-wider uppercase">
          {_lang.projectDescription}
        </h3>
        <Markdown
          content={activeProject.description}
          class="text-text prose-invert max-w-none text-base leading-relaxed md:text-lg"
        />
      </div>

      <!-- Screenshots Gallery -->
      {#if activeModalImages.length > 0}
        <div class="mt-6 flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h3
              class="text-text-muted flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
            >
              <Icon name="bi-images" class="text-primary" />
              <span>{_lang.screenshots} ({activeModalImages.length})</span>
            </h3>
            {#if activeModalImages.length > 1}
              <span class="text-text-muted font-mono text-xs">
                {activeGalleryIndex + 1} / {activeModalImages.length}
              </span>
            {/if}
          </div>

          <!-- Active Image Stage -->
          <div
            class="relative flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/60 p-2"
          >
            {#if activeModalImages.length > 1}
              <button
                type="button"
                onclick={() => stepGallery(-1)}
                aria-label="Previous image"
                class="text-text hover:bg-primary absolute left-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-slate-950/80 shadow-lg backdrop-blur-md transition-all hover:text-slate-950"
              >
                <Icon name="bi-chevron-left" />
              </button>
            {/if}

            <button
              type="button"
              onclick={() => (lightboxImage = activeModalImages[activeGalleryIndex])}
              class="group relative flex max-h-[420px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-lg"
            >
              <img
                src={activeModalImages[activeGalleryIndex]}
                alt="{activeProject.name} screenshot {activeGalleryIndex + 1}"
                class="max-h-[400px] w-auto rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.01]"
              />
            </button>

            {#if activeModalImages.length > 1}
              <button
                type="button"
                onclick={() => stepGallery(1)}
                aria-label="Next image"
                class="text-text hover:bg-primary absolute right-3 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-slate-950/80 shadow-lg backdrop-blur-md transition-all hover:text-slate-950"
              >
                <Icon name="bi-chevron-right" />
              </button>
            {/if}
          </div>

          <!-- Thumbnails Strip -->
          {#if activeModalImages.length > 1}
            <div class="flex gap-2.5 overflow-x-auto pb-2">
              {#each activeModalImages as imgUrl, idx (imgUrl)}
                <button
                  type="button"
                  onclick={() => (activeGalleryIndex = idx)}
                  class="relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all {idx ===
                  activeGalleryIndex
                    ? 'border-primary scale-105 opacity-100'
                    : 'border-white/10 opacity-60 hover:opacity-90'}"
                >
                  <img
                    src={imgUrl}
                    alt="Thumbnail {idx + 1}"
                    class="h-full w-full object-cover"
                  />
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- FULLSCREEN IMAGE LIGHTBOX -->
{#if lightboxImage}
  <div
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={() => (lightboxImage = null)}
    onkeydown={(e) => {
      if (e.key === 'Escape') lightboxImage = null;
    }}
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
  >
    <button
      type="button"
      onclick={() => (lightboxImage = null)}
      aria-label={_lang.close}
      class="text-text-muted hover:text-text-strong absolute top-6 right-6 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20"
    >
      <Icon name="bi-x-lg" class="text-2xl" />
    </button>
    <img
      src={lightboxImage}
      alt="Fullscreen preview"
      class="max-h-[92vh] max-w-[92vw] cursor-zoom-out rounded-xl object-contain shadow-2xl"
    />
  </div>
{/if}
