<script lang="ts">
  import Icon from '$/components/utility/Icon.svelte';
  import Link from '$/components/utility/Link.svelte';
  import { getState } from '$/lib/state.svelte';
  import { page } from '$app/state';

  const _state = getState();

  const title = $derived.by(
    () =>
      `${page.status === 404 ? _state.lang?.error?.title || '404' : 'Error'} | ${page.url.host}`
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="m-auto text-center">
  <h1 class="text-4xl font-bold lg:text-5xl">
    <Icon name="bi-code-slash" />
    {page.status === 404
      ? _state.lang?.error?.message || 'Stránka nenalezena'
      : page.status}
  </h1>
  <h2 class="text-3xl font-bold lg:text-4xl">
    {page.status === 404
      ? _state.lang?.error?.sub_message || 'Tato stránka neexistuje'
      : page.error?.message || 'Došlo k chybě'}
  </h2>
  <Link link="/{_state.selectedLang || 'cs'}" class="text-xl font-bold lg:text-2xl">
    {_state.lang?.error?.go_home || 'Zpět na hlavní stránku'}
  </Link>
</div>
