<script lang="ts">
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';
  import BaseInput from '../form/Input.svelte';
  import { getError, getFormContext, getValue, setValue } from './Form.svelte';
  import FormItem from './FormItem.svelte';
  import TranslationAvailability from './TranslationAvailability.svelte';

  import type { SvelteHTMLElements } from 'svelte/elements';

  type InputProps = SvelteHTMLElements['input'] & {
    name: string;
    label: string;
    placeholder?: string;
    class?: string;
    type?: 'text' | 'email' | 'password' | 'number';
    variant?: 'small' | 'normal';
    right?: Snippet;
  };

  let {
    name,
    label,
    placeholder,
    class: cls = '',
    type,
    variant,
    right: _right,
    // the id is unused
    // eslint-disable-next-line
    id: _,
    ...props
  }: InputProps = $props();

  const context = getFormContext();
  const id = `form-${name}`;

  let formValue = $state<unknown>(getValue(context, name));

  $effect(() => {
    formValue = getValue(context, name);
  });

  $effect(() => {
    setValue(context, name, formValue);
  });

  //eslint-disable-next-line
  const ILoveTypes = props as any;
</script>

<FormItem for={id} error={getError(context, name)} {label} {variant}>
  {#snippet right()}
    {#if _right}
      {@render _right()}
    {/if}
    {#if context.multiLang}
      <TranslationAvailability {context} path={name} />
    {/if}
  {/snippet}

  <BaseInput
    {id}
    {name}
    {type}
    bind:value={formValue}
    {placeholder}
    error={getError(context, name)}
    class={clsx(cls)}
    {...ILoveTypes}
  />
</FormItem>
