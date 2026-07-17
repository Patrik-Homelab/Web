<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import type { PageProps } from './$types';
  import { getState } from '$/lib/state.svelte';
  import Image from '$/components/utility/Image.svelte';
  import H2 from '$/components/headers/H2.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { formatDate, sToHHMM } from '$/lib/functions';

  const { data }: PageProps = $props();
  const _state = getState();
  const _lang = $derived(_state.lang.gallery);
  const _langDynamic = $derived(data.dynamicTranslations);

  let viewMode = $state<'all' | 'byObject'>('all');
  let expandedGroups = $state<Record<string, boolean>>({});

  const groupsList = $derived.by(() => {
    const groups: Array<{
      id: string | null;
      name: string;
      posts: typeof data.posts;
    }> = [];

    for (const obj of data.objects) {
      const objPosts = data.posts.filter((p) => p.object_id === obj.id);
      if (objPosts.length > 0) {
        groups.push({
          id: obj.id as string,
          name: _langDynamic[obj.name as string] || 'Unknown Object',
          posts: objPosts
        });
      }
    }

    const uncategorizedPosts = data.posts.filter((p) => !p.object_id);
    if (uncategorizedPosts.length > 0) {
      groups.push({
        id: null,
        name: _state.selectedLang === 'cs' ? 'Bez přiřazeného objektu' : 'Uncategorized',
        posts: uncategorizedPosts
      });
    }

    return groups;
  });

  const toggleGroup = (id: string | null) => {
    const key = id || 'uncategorized';
    expandedGroups[key] = !expandedGroups[key];
  };
</script>

{#snippet badge(text: string)}
  <div
    class="text-text-muted hover:text-text rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200 hover:bg-white/10"
  >
    {text}
  </div>
{/snippet}

{#snippet postCard(post: (typeof data.posts)[number])}
  <a
    href="/{_state.selectedLang}/gallery/{post.id}"
    class="group hover:border-primary/30 flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,0,0,0.5),_0_0_20px_rgba(var(--color-primary-500),0.1)] sm:w-[calc(50%_-_0.5rem)] lg:w-md xl:w-lg"
  >
    <!-- Card Image Header -->
    <div class="relative h-1/2 flex-1/2 overflow-hidden">
      <Image
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        name={post.images[0].name}
        alt={_langDynamic[post.images[0].alt_text]}
      />
      <!-- Top Badges Overlay -->
      <div
        class="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4"
      >
        {#if post.object_id}
          {@const obj = data.objects.find((o) => o.id === post.object_id)}
          {#if obj}
            <span
              class="bg-primary/20 text-primary border-primary/30 rounded-full border px-3 py-0.5 text-xs font-bold tracking-wide backdrop-blur-md"
            >
              {_langDynamic[obj.name as string]}
            </span>
          {/if}
        {/if}
        <div
          class="text-text-strong flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/75 px-2.5 py-1 text-xs font-bold shadow-lg backdrop-blur-md"
        >
          <Icon name="bi-clock" class="text-primary text-[10px]" />
          <span
            >{sToHHMM(
              post.exposures
                .filter((ex) => ex.type === 'light')
                .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
            )}</span
          >
        </div>
      </div>
    </div>

    <!-- Card Description Details -->
    <div class="flex flex-1/2 flex-col gap-3 p-5">
      <H2
        class="group-hover:text-primary truncate font-bold transition-colors duration-200"
        >{_langDynamic[post.title]}</H2
      >

      <p class="text-text-muted line-clamp-2 text-sm leading-relaxed">
        {_langDynamic[post.description]}
      </p>

      <!-- Badges row -->
      <div class="flex w-full flex-wrap gap-1.5 py-1">
        {#each post.equipment.slice(0, 3) as equipment (equipment.id)}
          {@render badge(equipment.name)}
        {/each}
        {#if post.equipment.length > 3}
          {@render badge(`+${post.equipment.length - 3} ${_lang.more}`)}
        {/if}
      </div>

      <!-- Footer Info -->
      <div
        class="text-text-muted mt-auto flex items-center justify-between border-t border-white/5 pt-3 text-xs"
      >
        <div>
          <Icon name="bi-calendar" class="mr-1" />
          {#if post.created_at.getTime() === post.updated_at.getTime()}
            {_lang.created} {formatDate(post.created_at, false)}
          {:else}
            {_lang.updated} {formatDate(post.updated_at, false)}
          {/if}
        </div>
        <div
          class="group-hover:text-primary flex items-center gap-1 font-bold transition-colors duration-200"
        >
          <span>{_lang.readMore}</span>
          <Icon
            name="bi-arrow-right"
            class="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </div>
  </a>
{/snippet}

{#snippet smallPostCard(post: (typeof data.posts)[number])}
  <a
    href="/{_state.selectedLang}/gallery/{post.id}"
    class="group hover:border-primary/25 flex w-full flex-col overflow-hidden rounded-xl border border-white/5 bg-slate-950/40 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] sm:w-[calc(50%_-_0.5rem)] md:w-[calc(33.33%_-_0.75rem)] lg:max-w-[280px]"
  >
    <div class="relative h-36 overflow-hidden">
      <Image
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        name={post.images[0].name}
        alt={_langDynamic[post.images[0].alt_text]}
      />
      <div class="absolute top-2 right-2">
        <div
          class="text-text-strong flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[10px] font-bold shadow-md backdrop-blur-md"
        >
          <Icon name="bi-clock" class="text-primary text-[9px]" />
          <span
            >{sToHHMM(
              post.exposures
                .filter((ex) => ex.type === 'light')
                .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
            )}</span
          >
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1.5 p-3.5">
      <h3
        class="text-text-strong group-hover:text-primary truncate text-sm font-bold transition-colors duration-200"
      >
        {_langDynamic[post.title]}
      </h3>
      <div
        class="text-text-muted mt-1 flex items-center justify-between border-t border-white/5 pt-2 text-[11px] font-medium"
      >
        <span>
          <Icon name="bi-calendar" class="mr-0.5" />
          {formatDate(post.created_at, false)}
        </span>
        <span class="text-primary flex items-center gap-0.5 group-hover:underline">
          {_lang.readMore}
          <Icon name="bi-arrow-right" class="text-[9px]" />
        </span>
      </div>
    </div>
  </a>
{/snippet}

<section class="flex h-full flex-1 flex-col px-4 pt-10 pb-6 md:pt-16">
  <H1 class="mx-auto mb-6 text-center">{_lang.title}</H1>

  <!-- View Mode Switcher: Segmented Capsule Control -->
  <div
    class="mx-auto mb-10 flex rounded-full border border-white/15 bg-slate-950/60 p-1 font-semibold shadow-2xl backdrop-blur-md"
  >
    <button
      onclick={() => (viewMode = 'all')}
      class={[
        'font-poppins flex cursor-pointer items-center gap-1.5 rounded-full px-6 py-2 text-xs font-bold transition-all duration-300 md:text-sm',
        viewMode === 'all'
          ? 'bg-primary shadow-primary/20 text-slate-950 shadow-lg'
          : 'text-text-muted hover:text-text hover:bg-white/5'
      ].join(' ')}
    >
      <Icon name="bi-grid" />
      <span>{_lang.all}</span>
    </button>
    <button
      onclick={() => (viewMode = 'byObject')}
      class={[
        'font-poppins flex cursor-pointer items-center gap-1.5 rounded-full px-6 py-2 text-xs font-bold transition-all duration-300 md:text-sm',
        viewMode === 'byObject'
          ? 'bg-primary shadow-primary/20 text-slate-950 shadow-lg'
          : 'text-text-muted hover:text-text hover:bg-white/5'
      ].join(' ')}
    >
      <Icon name="bi-folder" />
      <span>{_lang.byObject}</span>
    </button>
  </div>

  {#if viewMode === 'all'}
    <!-- Normal Grid View -->
    <div class="flex flex-wrap justify-center gap-6 p-2 md:p-4">
      {#each data.posts as post (post.id)}
        {@render postCard(post)}
      {/each}
    </div>
  {:else}
    <!-- Grouped by Object Accordion View -->
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-5 p-2 md:p-4">
      {#each groupsList as group (group.id || 'uncategorized')}
        {@const groupKey = group.id || 'uncategorized'}
        {@const isExpanded = !!expandedGroups[groupKey]}

        <div
          class="flex w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-950/30 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-white/10"
        >
          <!-- Accordion Header Trigger -->
          <button
            onclick={() => toggleGroup(group.id)}
            class="flex w-full cursor-pointer items-center justify-between p-4 transition-colors duration-200 hover:bg-white/5"
          >
            <div class="flex items-center gap-3 overflow-hidden">
              <Icon
                name={group.id ? 'bi-star-fill' : 'bi-question-circle-fill'}
                class="text-primary flex-shrink-0 text-lg"
              />
              <H2
                class="text-text-strong m-0 truncate text-left text-base font-bold md:text-lg"
                >{group.name}</H2
              >
              <span
                class="text-text-muted flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-bold"
              >
                {group.posts.length}
              </span>
            </div>
            <Icon
              name="bi-chevron-down"
              class={[
                'text-text-muted flex-shrink-0 text-base transition-transform duration-300',
                isExpanded ? 'text-primary rotate-180' : ''
              ].join(' ')}
            />
          </button>

          <!-- Accordion Expanded Body -->
          {#if isExpanded}
            {@const years = group.posts.map((p) => new Date(p.created_at).getFullYear())}
            {@const latestYear =
              years.length > 0 ? Math.max(...years) : new Date().getFullYear()}
            {@const sortedPosts = [...group.posts].sort(
              (a, b) => b.created_at.getTime() - a.created_at.getTime()
            )}
            {@const latestPosts = sortedPosts.filter(
              (p) => new Date(p.created_at).getFullYear() === latestYear
            )}
            {@const olderPosts = sortedPosts.filter(
              (p) => new Date(p.created_at).getFullYear() < latestYear
            )}

            <div class="flex flex-col gap-6 border-t border-white/5 bg-slate-950/20 p-6">
              <!-- Latest Year Section -->
              <div class="flex flex-col gap-3">
                <h3
                  class="text-text-strong font-poppins text-primary flex items-center gap-2 border-b border-white/5 pb-1.5 text-sm font-bold tracking-wider uppercase"
                >
                  <Icon name="bi-calendar-check" />
                  <span>{latestYear}</span>
                </h3>
                <div class="flex flex-wrap gap-4">
                  {#each latestPosts as post (post.id)}
                    {@render smallPostCard(post)}
                  {/each}
                </div>
              </div>

              <!-- Older Section -->
              {#if olderPosts.length > 0}
                <div class="flex flex-col gap-3">
                  <h3
                    class="text-text-strong font-poppins text-text-muted flex items-center gap-2 border-b border-white/5 pb-1.5 text-sm font-bold tracking-wider uppercase"
                  >
                    <Icon name="bi-calendar-minus" />
                    <span>{_lang.older}</span>
                  </h3>
                  <div class="flex flex-wrap gap-4">
                    {#each olderPosts as post (post.id)}
                      {@render smallPostCard(post)}
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
