<script lang="ts">
  import '../../app.css';
  import '../../fonts.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';

  import { API } from '$/lib/api';
  import type { LayoutProps } from './$types';
  import Navigation from '$/components/Navigation.svelte';
  import SEO from '$/components/utility/SEO.svelte';
  import StarfieldCanvas from '$/components/utility/StarfieldCanvas.svelte';
  import { page } from '$app/state';
  import { setState } from '$/lib/state.svelte';
  import { getPath } from '$/lib/lang';
  import Footer from '$/components/Footer.svelte';

  let { children, data }: LayoutProps = $props();

  API.hydrateFromServer(data.api);

  setState({
    lang: data.lang,
    selectedLang: data.selectedLang,
    languages: data.languageList,
    path: getPath(page.url.pathname, Object.keys(data.languageList)),
    userState: data.userState
  });

  $effect(() => {
    setState({
      lang: data.lang,
      selectedLang: data.selectedLang,
      path: getPath(page.url.pathname, Object.keys(data.languageList)),
      userState: data.userState
    });
  });
</script>

<SEO />

<StarfieldCanvas />

<section
  class="text-text font-ubuntu flex h-full min-h-screen w-full min-w-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/30 via-slate-950 to-black text-lg lg:text-xl"
>
  <Navigation />

  <main class="flex flex-1 flex-col pt-24 pb-8 md:pt-28">
    {@render children()}
  </main>

  <Footer />
</section>
