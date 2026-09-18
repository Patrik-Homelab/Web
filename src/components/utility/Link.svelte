<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  type LinkProps = {
    link: string;
    target?: HTMLAnchorAttributes['target'];
    rel?: HTMLAnchorAttributes['rel'];
    class?: string;
    children: Snippet;
  };

  const {
    link,
    target = null,
    rel = null,
    class: cls = '',
    children
  }: LinkProps = $props();

  const computedRel = $derived(
    rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
  );
</script>

<a href={link} {target} rel={computedRel} class={twMerge('text-primary-text', cls)}>
  {@render children()}
</a>
