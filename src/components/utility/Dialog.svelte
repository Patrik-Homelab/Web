<script lang="ts">
  import type { Snippet } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import ClickOutside from './clickOutside.svelte';

  type DialogProps = {
    children: Snippet;
    opened: boolean;
    onClose?: () => void;
    class?: string;
  };

  let {
    children,
    opened = $bindable(false),
    onClose = () => {},
    class: cls = ''
  }: DialogProps = $props();
</script>

{#if opened}
  <div class="bg-background/80 fixed top-0 left-0 z-10 flex h-screen w-screen">
    <ClickOutside
      clickoutside={() => {
        opened = false;
        onClose();
      }}
      class={twMerge(
        'border-text bg-background/80 m-auto flex max-w-[90%] flex-col rounded-md border-2 p-4',
        cls
      )}
    >
      {@render children()}
    </ClickOutside>
  </div>
{/if}
