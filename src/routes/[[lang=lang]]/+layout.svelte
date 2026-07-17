<script lang="ts">
  import '../../app.css';
  import '../../fonts.css';
  import 'bootstrap-icons/font/bootstrap-icons.css';

  import { API } from '$/lib/api';
  import { onMount } from 'svelte';
  import type { LayoutProps } from './$types';
  import Navigation from '$/components/Navigation.svelte';
  import { page } from '$app/state';
  import { setState, getState } from '$/lib/state.svelte';
  import { getPath } from '$/lib/lang';
  import Footer from '$/components/Footer.svelte';
  import Starback from 'starback';

  let { children, data }: LayoutProps = $props();

  const _state = getState();

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

  let canvas: HTMLCanvasElement;

  const resizeCanvas = () => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  onMount(() => {
    const localStars = localStorage.getItem('starsEnabled') !== 'false';
    setState({ starsEnabled: localStars });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  });

  $effect(() => {
    const enabled = _state.starsEnabled !== false;
    let starbackInstance: { destroy: () => void } | null = null;

    if (enabled && canvas) {
      starbackInstance = Starback.create(canvas, {
        type: 'dot',
        quantity: 250,
        direction: 225,
        randomOpacity: true,
        starSize: [0.1, 0.2, 0.3, 0.4],
        speed: [0.3, 0.5],
        backgroundColor: '#030304',
        width: window.innerWidth,
        height: window.innerHeight
      });
      resizeCanvas();
    }

    return () => {
      if (starbackInstance) {
        starbackInstance.destroy();
      }
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  });
</script>

<canvas bind:this={canvas} class="fixed inset-0 -z-10 h-full w-full overflow-hidden"
></canvas>

<section
  class="text-text font-ubuntu flex h-full min-h-screen w-full min-w-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/30 via-slate-950 to-black text-lg lg:text-xl"
>
  <Navigation />

  <main class="flex flex-1 flex-col pt-24 pb-8 md:pt-28">
    {@render children()}
  </main>

  <Footer />
</section>
