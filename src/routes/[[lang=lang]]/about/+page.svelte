<script lang="ts">
  import { SolarSystemScene } from '$/components/about';
  import H1 from '$/components/headers/H1.svelte';
  import { aboutStories, type AboutStoryLanguage } from '$/lib/about';
  import { getState } from '$/lib/state.svelte';

  const _state = getState();
  const lang = $derived(_state.lang.about);
  const selectedLang = $derived((_state.selectedLang as AboutStoryLanguage) ?? 'en');
  const story = $derived(aboutStories[selectedLang] ?? aboutStories.en);
</script>

<section class="flex h-full w-full flex-1 flex-col items-center gap-4 px-3 py-6 lg:py-8">
  <H1>{lang.title}</H1>
  <SolarSystemScene {story} labels={lang.ui} />
</section>
