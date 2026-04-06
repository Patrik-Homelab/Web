<script lang="ts">
  import { SolarSystemScene } from '$/components/about';
  import { aboutStories, type AboutStoryLanguage } from '$/lib/about';
  import { getState } from '$/lib/state.svelte';

  const _state = getState();
  const lang = $derived(_state.lang.about);
  const selectedLang = $derived((_state.selectedLang as AboutStoryLanguage) ?? 'en');
  const story = $derived(aboutStories[selectedLang] ?? aboutStories.en);
</script>

<section class="flex h-full w-full flex-1 flex-col items-center gap-4 px-3 py-6 lg:py-8">
  <p class="text-text-muted max-w-2xl text-center text-sm sm:text-base">
    <span class="inline-block">👇 Roluj dolů a klikej na objekty</span>
  </p>
  <SolarSystemScene {story} labels={lang.ui} />
</section>
