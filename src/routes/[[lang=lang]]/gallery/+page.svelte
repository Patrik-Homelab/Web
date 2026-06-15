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
    class="border-text font-poppins rounded-full border px-2 py-0.5 text-base font-medium"
  >
    {text}
  </div>
{/snippet}

{#snippet postCard(post: (typeof data.posts)[number])}
  <a
    href="/{_state.selectedLang}/gallery/{post.id}"
    class="group border-text flex aspect-[4/5] w-full flex-col rounded-md border-2 sm:w-[calc(50%_-_0.5rem)] lg:w-md xl:w-lg"
  >
    <div class="relative h-1/2 flex-1/2 overflow-hidden">
      <Image
        class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        name={post.images[0].name}
        alt={_langDynamic[post.images[0].alt_text]}
      />
      <div class="absolute top-0 left-0 flex w-full justify-end p-4">
        <div class="bg-background/75 rounded-full px-2 py-1 text-base font-medium">
          <Icon name="bi-clock" />
          {sToHHMM(
            post.exposures
              .filter((ex) => ex.type === 'light')
              .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
          )}
        </div>
      </div>
    </div>
    <div class="bg-background flex flex-1/2 flex-col gap-2 p-4">
      <div class="flex items-start justify-between gap-2">
        <H2 class="truncate">{_langDynamic[post.title]}</H2>
        {#if post.object_id}
          {@const obj = data.objects.find((o) => o.id === post.object_id)}
          {#if obj}
            <span
              class="bg-primary/20 text-primary border-primary/30 rounded-full border px-2 py-0.5 text-xs font-semibold whitespace-nowrap"
            >
              {_langDynamic[obj.name as string]}
            </span>
          {/if}
        {/if}
      </div>
      <p class="text-text-muted line-clamp-2">{_langDynamic[post.description]}</p>
      <div class="flex w-full flex-wrap gap-2">
        {#each post.equipment.slice(0, 3) as equipment (equipment.id)}
          {@render badge(equipment.name)}
        {/each}
        {#if post.equipment.length > 3}
          {@render badge(`+${post.equipment.length - 3} ${_lang.more}`)}
        {/if}
      </div>
      <div class="mt-auto flex justify-between">
        <div class="text-text-muted">
          <Icon name="bi-calendar" />
          {#if post.created_at.getTime() === post.updated_at.getTime()}
            {_lang.created} {formatDate(post.created_at, false)}
          {:else}
            {_lang.updated}
            {formatDate(post.updated_at, false)}
          {/if}
        </div>
        <button class="cursor-pointer font-medium"
          >{_lang.readMore} <Icon name="bi-arrow-right" /></button
        >
      </div>
    </div>
  </a>
{/snippet}

{#snippet smallPostCard(post: (typeof data.posts)[number])}
  <a
    href="/{_state.selectedLang}/gallery/{post.id}"
    class="group border-text bg-background/50 flex w-full flex-col overflow-hidden rounded-md border-2 sm:w-[calc(50%_-_0.5rem)] md:w-[calc(33.33%_-_0.75rem)] lg:max-w-[280px]"
  >
    <div class="relative h-36 overflow-hidden">
      <Image
        class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        name={post.images[0].name}
        alt={_langDynamic[post.images[0].alt_text]}
      />
      <div class="absolute top-0 right-0 p-2">
        <div class="bg-background/80 rounded-full px-2 py-0.5 text-xs font-medium">
          <Icon name="bi-clock" />
          {sToHHMM(
            post.exposures
              .filter((ex) => ex.type === 'light')
              .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0)
          )}
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-1 p-3">
      <h3
        class="text-text-strong group-hover:text-primary truncate text-base font-bold transition-colors duration-200"
      >
        {_langDynamic[post.title]}
      </h3>
      <div class="text-text-muted mt-1 flex items-center justify-between text-xs">
        <span>
          <Icon name="bi-calendar" class="mr-0.5" />
          {formatDate(post.created_at, false)}
        </span>
        <span class="text-primary text-xs font-medium">
          {_lang.readMore}
          <Icon name="bi-arrow-right" class="text-xs" />
        </span>
      </div>
    </div>
  </a>
{/snippet}

<section class="flex h-full flex-1 flex-col">
  <H1 class="mx-auto mb-4">{_lang.title}</H1>

  <!-- View Mode Switcher -->
  <div class="mx-auto mb-8 flex rounded-md bg-gray-800 p-1">
    <button
      onclick={() => (viewMode = 'all')}
      class={[
        'font-poppins cursor-pointer rounded-md px-6 py-1.5 text-base font-medium transition-all duration-200',
        viewMode === 'all'
          ? 'bg-primary text-background shadow'
          : 'text-text-muted hover:text-text'
      ]}
    >
      <Icon name="bi-grid" class="mr-1" />
      {_lang.all}
    </button>
    <button
      onclick={() => (viewMode = 'byObject')}
      class={[
        'font-poppins cursor-pointer rounded-md px-6 py-1.5 text-base font-medium transition-all duration-200',
        viewMode === 'byObject'
          ? 'bg-primary text-background shadow'
          : 'text-text-muted hover:text-text'
      ]}
    >
      <Icon name="bi-folder" class="mr-1" />
      {_lang.byObject}
    </button>
  </div>

  {#if viewMode === 'all'}
    <!-- Normal Grid View -->
    <div class="flex flex-wrap justify-center gap-4 p-4">
      {#each data.posts as post (post.id)}
        {@render postCard(post)}
      {/each}
    </div>
  {:else}
    <!-- Grouped by Object Accordion View -->
    <div class="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      {#each groupsList as group (group.id || 'uncategorized')}
        {@const groupKey = group.id || 'uncategorized'}
        {@const isExpanded = !!expandedGroups[groupKey]}

        <div
          class="border-text bg-surface flex w-full flex-col overflow-hidden rounded-lg border-2 transition-all duration-200"
        >
          <button
            onclick={() => toggleGroup(group.id)}
            class="flex w-full cursor-pointer items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-800/50"
          >
            <div class="flex items-center gap-3 overflow-hidden">
              <Icon
                name={group.id ? 'bi-star-fill' : 'bi-question-circle-fill'}
                class="text-primary flex-shrink-0 text-xl"
              />
              <H2 class="m-0 truncate text-left text-lg font-bold md:text-xl"
                >{group.name}</H2
              >
              <span
                class="text-text-muted flex-shrink-0 rounded-full bg-gray-800 px-2.5 py-0.5 text-xs font-semibold"
              >
                {group.posts.length}
              </span>
            </div>
            <Icon
              name={isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}
              class="text-text-muted flex-shrink-0 text-xl"
            />
          </button>

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
            <!-- Big Card Body -->
            <div class="border-divider bg-background/25 flex flex-col gap-6 border-t p-6">
              <!-- Latest Year Section -->
              <div class="flex flex-col gap-3">
                <h3
                  class="text-text-strong font-poppins flex items-center gap-2 border-b border-gray-800 pb-1 text-lg font-bold"
                >
                  <Icon name="bi-calendar-check" class="text-primary" />
                  {latestYear}
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
                    class="text-text-strong font-poppins flex items-center gap-2 border-b border-gray-800 pb-1 text-lg font-bold"
                  >
                    <Icon name="bi-calendar-minus" class="text-text-muted" />
                    {_lang.older}
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
