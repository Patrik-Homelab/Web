<script lang="ts">
  import { getState } from '$/lib/state.svelte';
  import type { BootstrapIcon } from '$/types/bootstrap_icons';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import Icon from './utility/Icon.svelte';

  type NavItem = {
    name: string;
    icon: BootstrapIcon;
    path: string;
    matchStart?: boolean;
    hidden?: boolean;
    admin?: boolean;
  };

  type AdminItem = Omit<NavItem, 'admin'>;

  const _state = getState();

  const Navigation = $derived([
    {
      name: _state.lang.navigation.home,
      icon: 'bi-house-fill',
      path: '/'
    },
    {
      name: _state.lang.navigation.gallery,
      icon: 'bi-image-fill',
      path: '/gallery',
      matchStart: true
    },
    {
      name: _state.lang.navigation.contact,
      icon: 'bi-envelope-fill',
      path: '/contact'
    },
    {
      name: _state.lang.navigation.live,
      icon: 'bi-circle-fill',
      path: '/live-photo'
    },
    {
      name: _state.lang.navigation.login,
      icon: 'bi-person-fill',
      path: '/login',
      hidden: true
    },
    {
      name: _state.lang.navigation.admin,
      icon: 'bi-hdd-rack',
      path: '/admin',
      admin: true
    }
  ] satisfies NavItem[]);

  const AdminNavigation = $derived([
    {
      name: _state.lang.adminNavigation.home,
      icon: 'bi-clipboard-data',
      path: '/admin'
    },
    {
      name: _state.lang.adminNavigation.equipment,
      icon: 'bi-moon-stars-fill',
      path: '/admin/equipment'
    },
    {
      name: _state.lang.adminNavigation.articles,
      icon: 'bi-journal-text',
      path: '/admin/article',
      matchStart: true
    }
  ] satisfies AdminItem[]);

  const getNavItem = (path: string): NavItem | AdminItem | null => {
    const mainNav =
      Navigation.find((item) => {
        if (item.matchStart) {
          return path.startsWith(item.path);
        }
        return item.path === path;
      }) || null;
    if (mainNav) {
      return mainNav;
    }

    const adminNav = AdminNavigation.find((item) => {
      if (item.matchStart) {
        return path.startsWith(item.path);
      }
      return path === item.path;
    });

    if (adminNav) {
      return adminNav;
    }

    return null;
  };

  const currentItem = $derived(getNavItem(_state.path));

  let selectedLanguage = $state(_state.selectedLang);
  $effect(() => {
    let target = `/${selectedLanguage}${_state.path}`;
    untrack(() => {
      if (page.url.pathname !== target) {
        const queryParams = page.url.searchParams.toString();
        if (queryParams) {
          target += `?${queryParams}`;
        }

        goto(target, {
          replaceState: true
        });
      }
    });
  });

  let mobileOpened = $state(false);

  const filteredNavigation = $derived(
    Navigation.filter((item) => {
      const isLogged = _state.userState.logged;
      if (item.admin) {
        return isLogged;
      }
      if (item.hidden) {
        return false;
      }
      return true;
    })
  );
  const filteredAdminNavigation = $derived(
    AdminNavigation.filter(() => {
      return true;
    })
  );

  const _isActive = (item: NavItem | AdminItem) => {
    if (item.matchStart) {
      return _state.path.startsWith(item.path);
    }
    return _state.path === item.path;
  };

  const meta = $derived(page.data.meta ?? _state.meta);

  const title = $derived.by(() => {
    if (meta?.title) {
      return `${meta.title} | ${page.url.host}`;
    }
    if (currentItem) {
      return `${currentItem.name} | ${page.url.host}`;
    }
    return undefined;
  });
  const description = $derived(meta?.description ?? _state.lang.default_desc);
</script>

<svelte:head>
  {#if title}
    <title>{title}</title>
    <meta property="og:title" content={title} />
  {/if}
  <meta name="description" content={description} />
  <meta property="og:type" content={meta?.type ?? 'website'} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={page.url.toString()} />
  <meta
    property="og:image"
    content={meta?.image ?? `${page.url.origin}/images/PFP.jpg`}
  />
</svelte:head>

<!-- Floating Glassmorphic Header Container -->
<header class="fixed top-4 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2 px-2 md:px-4">
  <div
    class="flex h-16 w-full items-center justify-between rounded-full border border-white/10 bg-slate-950/60 px-6 shadow-2xl backdrop-blur-xl transition-all duration-300"
  >
    <!-- Left: Brand / Title -->
    <a
      href="/{selectedLanguage}/"
      class="flex items-center gap-2 transition-opacity duration-200 hover:opacity-90"
    >
      <span class="font-ephesis text-primary-text text-3xl font-bold tracking-wide"
        >Patrik Mintěl</span
      >
    </a>

    <!-- Center: Desktop Navigation -->
    <nav
      class="font-poppins hidden items-center gap-1 text-sm font-semibold md:flex lg:gap-2 lg:text-base"
    >
      {#each filteredNavigation as item, index (index)}
        {@const isActive = _isActive(item)}
        <a
          href="/{selectedLanguage}{item.path}"
          class={[
            'flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 ease-in-out',
            isActive
              ? 'bg-primary/15 text-primary border-primary/25 shadow-[0_0_15px_rgba(var(--color-primary-500),0.1)]'
              : 'text-text-muted hover:text-text border-transparent hover:bg-white/5'
          ].join(' ')}
        >
          <Icon name={item.icon} class="text-lg" />
          <span>{item.name}</span>
        </a>
      {/each}
    </nav>

    <!-- Right: Language Picker & Mobile Menu Trigger -->
    <div class="flex items-center gap-4">
      <!-- Language Picker -->
      <div class="relative flex items-center">
        <select
          bind:value={selectedLanguage}
          class="text-text-strong cursor-pointer rounded-full border border-white/10 bg-slate-900/80 px-4 py-1.5 text-xs font-bold transition-all hover:bg-slate-800/80 focus:outline-none md:text-sm"
        >
          {#each Object.entries(_state.languages) as [langKey, langData] (langKey)}
            <option value={langKey} class="text-text bg-slate-950"
              >{langData.flag} {langData.name}</option
            >
          {/each}
        </select>
      </div>

      <!-- Hamburger Menu (Mobile Only) -->
      <button
        onclick={() => (mobileOpened = true)}
        aria-label="Toggle Menu"
        class="text-text flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-2xl transition-colors duration-200 hover:bg-white/5 md:hidden"
      >
        <Icon name="bi-list" />
      </button>
    </div>
  </div>

  <!-- Admin Sub-Navigation (if logged in and on admin path) -->
  {#if _state.userState.logged && _state.path.startsWith('/admin')}
    <div
      class="mx-auto mt-2 flex max-w-max items-center justify-center gap-2 rounded-full border border-white/5 bg-slate-950/45 p-1 shadow-lg backdrop-blur-md"
    >
      {#each filteredAdminNavigation as item, index (index)}
        {@const isActive = _isActive(item)}
        <a
          href="/{selectedLanguage}{item.path}"
          class={[
            'flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-300 md:text-sm',
            isActive
              ? 'bg-primary/20 text-primary border-primary/20'
              : 'text-text-muted hover:text-text border-transparent hover:bg-white/5'
          ].join(' ')}
        >
          <Icon name={item.icon} class="text-sm" />
          <span>{item.name}</span>
        </a>
      {/each}
    </div>
  {/if}
</header>

<!-- Mobile Fullscreen / Slide Drawer overlay -->
{#if mobileOpened}
  <!-- Backdrop -->
  <div
    role="presentation"
    onclick={() => (mobileOpened = false)}
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
  ></div>

  <!-- Drawer -->
  <div
    class="fixed top-0 right-0 z-50 flex h-screen w-80 flex-col border-l border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl md:hidden"
  >
    <div class="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
      <span class="font-ephesis text-primary-text text-3xl font-bold">Patrik Mintěl</span>
      <button
        onclick={() => (mobileOpened = false)}
        aria-label="Close Menu"
        class="text-text flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl transition-colors duration-200 hover:bg-white/5"
      >
        <Icon name="bi-x-lg" />
      </button>
    </div>

    <!-- Mobile Navigation Items -->
    <nav class="font-poppins flex flex-col gap-3">
      {#each filteredNavigation as item, index (index)}
        {@const isActive = _isActive(item)}
        <a
          onclick={() => (mobileOpened = false)}
          href="/{selectedLanguage}{item.path}"
          class={[
            'flex items-center gap-3 rounded-xl border px-4 py-3 text-lg font-bold transition-all',
            isActive
              ? 'bg-primary/15 text-primary border-primary/25 shadow-lg'
              : 'text-text-muted hover:text-text border-transparent hover:bg-white/5'
          ].join(' ')}
        >
          <Icon name={item.icon} class="text-xl" />
          <span>{item.name}</span>
        </a>
      {/each}

      {#if _state.userState.logged && _state.path.startsWith('/admin')}
        <div class="my-4 border-t border-white/10 pt-4">
          <span class="text-text-muted px-4 text-xs font-bold tracking-wider uppercase"
            >Admin Panel</span
          >
          <div class="mt-2 flex flex-col gap-2">
            {#each filteredAdminNavigation as item, index (index)}
              {@const isActive = _isActive(item)}
              <a
                onclick={() => (mobileOpened = false)}
                href="/{selectedLanguage}{item.path}"
                class={[
                  'flex items-center gap-3 rounded-xl border px-4 py-2.5 text-base font-bold transition-all',
                  isActive
                    ? 'bg-primary/20 text-primary border-primary/20'
                    : 'text-text-muted hover:text-text border-transparent hover:bg-white/5'
                ].join(' ')}
              >
                <Icon name={item.icon} class="text-lg" />
                <span>{item.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </nav>
  </div>
{/if}
