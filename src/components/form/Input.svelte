<script lang="ts">
  import type { FormElement } from '$/types/types';
  import { clsx } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  type InputProps = FormElement<{
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
    value?: string | number | undefined;
    min?: number;
    max?: number;
    step?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
  }>;

  let {
    value = $bindable(),
    id,
    name,
    placeholder,
    type = 'text',
    class: cls,
    error = undefined,
    required = false,
    ...props
  }: InputProps = $props();
</script>

<input
  {id}
  {type}
  {name}
  {placeholder}
  {required}
  {...props}
  {value}
  oninput={(e) => (value = e.currentTarget.value)}
  class={twMerge(
    'border-secondary focus:border-primary font-roboto placeholder:font-roboto placeholder:text-text rounded-md border-2 px-2 py-1 text-xl font-bold transition-colors duration-200 outline-none placeholder:font-bold lg:text-2xl',
    error !== undefined ? 'border-red-500' : '',
    clsx(cls)
  )}
/>
