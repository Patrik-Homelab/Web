<script lang="ts">
  import { getState, setState } from '$/lib/state.svelte';
  import type { BootstrapIcon } from '$/types/bootstrap_icons';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import Icon from './utility/Icon.svelte';
  import ClickOutside from '$/components/utility/clickOutside.svelte';

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
  let dropdownOpen = $state(false);

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

  // Toggle background stars and save to localStorage
  const toggleStars = () => {
    const nextVal = _state.starsEnabled !== false ? false : true;
    setState({ starsEnabled: nextVal });
    localStorage.setItem('starsEnabled', String(nextVal));
  };
</script>

{#snippet flag(langKey: string)}
  {#if langKey === 'cs'}
    <svg class="inline-block h-3.5 w-5 rounded-xs shadow-sm" viewBox="0 0 3 2">
      <rect width="3" height="2" fill="#d7141a" />
      <rect width="3" height="1" fill="#fff" />
      <polygon points="0,0 1.5,1 0,2" fill="#11457e" />
    </svg>
  {:else if langKey === 'en'}
    <svg class="inline-block h-3.5 w-5 rounded-xs shadow-sm" viewBox="0 0 74 39">
      <rect width="74" height="39" fill="#b22234" />
      <path
        d="M0,3h74M0,9h74M0,15h74M0,21h74M0,27h74M0,33h74"
        stroke="#fff"
        stroke-width="3"
      />
      <rect width="29.6" height="21" fill="#3c3b6e" />
      <circle cx="5" cy="4" r="1" fill="#fff" />
      <circle cx="10" cy="4" r="1" fill="#fff" />
      <circle cx="15" cy="4" r="1" fill="#fff" />
      <circle cx="20" cy="4" r="1" fill="#fff" />
      <circle cx="25" cy="4" r="1" fill="#fff" />
      <circle cx="7.5" cy="8" r="1" fill="#fff" />
      <circle cx="12.5" cy="8" r="1" fill="#fff" />
      <circle cx="17.5" cy="8" r="1" fill="#fff" />
      <circle cx="22.5" cy="8" r="1" fill="#fff" />
      <circle cx="5" cy="12" r="1" fill="#fff" />
      <circle cx="10" cy="12" r="1" fill="#fff" />
      <circle cx="15" cy="12" r="1" fill="#fff" />
      <circle cx="20" cy="12" r="1" fill="#fff" />
      <circle cx="25" cy="12" r="1" fill="#fff" />
      <circle cx="7.5" cy="16" r="1" fill="#fff" />
      <circle cx="12.5" cy="16" r="1" fill="#fff" />
      <circle cx="17.5" cy="16" r="1" fill="#fff" />
      <circle cx="22.5" cy="16" r="1" fill="#fff" />
    </svg>
  {/if}
{/snippet}

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
<header class="fixed top-4 left-1/2 z-50 w-max max-w-[95%] -translate-x-1/2 px-2">
  <div
    class="flex h-16 items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-950/60 px-4 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:gap-6 sm:px-6"
  >
    <!-- Left: Brand / Title -->
    <a
      href="/{selectedLanguage}/"
      class="flex shrink-0 items-center gap-2 transition-opacity duration-200 hover:opacity-90"
    >
      <span
        class="font-ephesis text-primary-text text-3xl font-bold tracking-wide whitespace-nowrap"
        >Patrik Mintěl</span
      >
    </a>

    <!-- Center: Desktop Navigation -->
    <nav
      class="font-poppins hidden items-center gap-1.5 text-sm font-semibold lg:ml-8 lg:flex lg:gap-2.5 lg:text-base xl:ml-12"
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
          <span class="whitespace-nowrap">{item.name}</span>
        </a>
      {/each}
    </nav>

    <!-- Right: Stars Switch, Language Picker & Mobile Menu Trigger -->
    <div class="flex shrink-0 items-center gap-2.5 lg:gap-4">
      <!-- Stars Toggle Switch -->
      <button
        onclick={toggleStars}
        class="text-text flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-900/80 transition-all duration-200 hover:bg-slate-800/80"
        title={_state.starsEnabled === false
          ? 'Enable background stars'
          : 'Disable background stars'}
      >
        <Icon
          name={_state.starsEnabled === false ? 'bi-star' : 'bi-stars'}
          class={_state.starsEnabled === false
            ? 'text-text-muted text-sm'
            : 'text-primary animate-pulse-slow text-sm'}
        />
      </button>

      <!-- Custom Language Dropdown (SVG Flags) -->
      <ClickOutside clickoutside={() => (dropdownOpen = false)} class="relative shrink-0">
        <button
          onclick={() => (dropdownOpen = !dropdownOpen)}
          class="text-text-strong flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all hover:bg-slate-800/80 focus:outline-none md:text-sm"
        >
          {@render flag(selectedLanguage)}
          <span class="hidden sm:inline">{_state.languages[selectedLanguage].name}</span>
          <span class="inline uppercase sm:hidden">{selectedLanguage}</span>
          <Icon name="bi-chevron-down" class="text-text-muted text-[9px]" />
        </button>

        {#if dropdownOpen}
          <div
            class="absolute right-0 z-50 mt-2 flex w-36 origin-top-right flex-col gap-0.5 rounded-xl border border-white/10 bg-slate-950/95 p-1 shadow-2xl backdrop-blur-xl"
          >
            {#each Object.entries(_state.languages) as [langKey, langData] (langKey)}
              <button
                onclick={() => {
                  selectedLanguage = langKey;
                  dropdownOpen = false;
                }}
                class="text-text hover:text-text-strong flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold transition-all hover:bg-white/5"
              >
                {@render flag(langKey)}
                <span>{langData.name}</span>
              </button>
            {/each}
          </div>
        {/if}
      </ClickOutside>

      <!-- Hamburger Menu (Mobile Only) -->
      <button
        onclick={() => (mobileOpened = true)}
        aria-label="Toggle Menu"
        class="text-text flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl transition-colors duration-200 hover:bg-white/5 lg:hidden"
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
          <span class="whitespace-nowrap">{item.name}</span>
        </a>
      {/each}
    </div>
  {/if}
</header>

<!-- Mobile Fullscreen Slide Overlay -->
{#if mobileOpened}
  <div
    class="fixed inset-0 z-50 flex h-screen w-screen flex-col bg-slate-950/98 p-6 shadow-2xl backdrop-blur-2xl lg:hidden"
  >
    <div
      class="mx-auto mb-10 flex w-full max-w-xl items-center justify-between border-b border-white/10 pb-4"
    >
      <span class="font-ephesis text-primary-text text-3xl font-bold">Patrik Mintěl</span>
      <button
        onclick={() => (mobileOpened = false)}
        aria-label="Close Menu"
        class="text-text flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl transition-colors duration-200 hover:bg-white/5"
      >
        <Icon name="bi-x-lg" />
      </button>
    </div>

    <!-- Centered Fullscreen Mobile Menu Items -->
    <nav
      class="font-poppins mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-8 pb-16"
    >
      {#each filteredNavigation as item, index (index)}
        {@const isActive = _isActive(item)}
        <a
          onclick={() => (mobileOpened = false)}
          href="/{selectedLanguage}{item.path}"
          class={[
            'flex w-full max-w-xs items-center justify-center gap-3 rounded-full border px-8 py-3.5 text-center text-xl font-bold transition-all',
            isActive
              ? 'bg-primary/15 text-primary border-primary/25 shadow-lg'
              : 'text-text-muted hover:text-text border-transparent hover:bg-white/5'
          ].join(' ')}
        >
          <Icon name={item.icon} class="text-2xl" />
          <span>{item.name}</span>
        </a>
      {/each}

      {#if _state.userState.logged && _state.path.startsWith('/admin')}
        <div class="mt-4 w-full max-w-xs border-t border-white/10 pt-6 text-center">
          <span
            class="text-text-muted mb-3 block text-xs font-bold tracking-wider uppercase"
            >Admin Panel</span
          >
          <div class="flex flex-col items-center gap-3">
            {#each filteredAdminNavigation as item, index (index)}
              {@const isActive = _isActive(item)}
              <a
                onclick={() => (mobileOpened = false)}
                href="/{selectedLanguage}{item.path}"
                class={[
                  'flex w-full items-center justify-center gap-3 rounded-full border px-6 py-2.5 text-base font-bold transition-all',
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
