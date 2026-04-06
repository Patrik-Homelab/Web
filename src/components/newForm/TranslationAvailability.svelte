<script lang="ts">
  import { languages } from '$/lib/lang';
  import Icon from '../utility/Icon.svelte';
  import type { MultiLangFormContext } from './Form.svelte';

  type TranslationAvailabilityProps = {
    context: MultiLangFormContext;
    path: string;
  };

  const { context, path }: TranslationAvailabilityProps = $props();

  const errors = $derived.by(() => context.errors());
  const data = $derived.by(() => context.data);
  const defaultValue = $derived.by(() => context.defaultData);
  const languageCode = (lang: string) => lang.toUpperCase();
</script>

<div class="flex items-center justify-center gap-2 pb-2">
  {#each Object.entries(languages) as [lang, langData] (lang)}
    {@const langErrors = (errors as unknown as Record<string, Record<string, string>>)[
      lang
    ]}
    {@const error = langErrors?.[path]}
    {@const langData_ = (data as Record<string, Record<string, unknown>>)[lang]}
    {@const value = langData_?.[path]}
    {@const langDefault = (defaultValue as Record<string, Record<string, unknown>>)[lang]}
    {@const defaultVal = langDefault?.[path]}
    {@const isDefaultValue = defaultVal === '' || defaultVal === null}
    {@const isValid =
      error === undefined && (isDefaultValue ? value !== defaultVal : true)}
    <div
      class="border-text inline-flex items-center gap-1 rounded-full border-2 px-2 py-1"
    >
      <Icon
        name={isValid ? 'bi-check' : 'bi-x'}
        class={isValid ? 'text-green-500' : 'text-red-500'}
      />
      {#if langData.flagIcon}
        <img src={langData.flagIcon} alt="" class="h-3.5 w-5 rounded-xs object-cover" />
      {:else}
        <span>{languageCode(lang)}</span>
      {/if}
    </div>
  {/each}
</div>
