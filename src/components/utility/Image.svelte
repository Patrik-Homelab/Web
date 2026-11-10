<script lang="ts">
  import type { ImageExtension } from '$/types/types';
  import type { ClassValue } from 'svelte/elements';

  type ImageProps = {
    class?: ClassValue;
    alt: string;
    name: string;
    quality?: number;
    format?: ImageExtension;
    loading?: 'lazy' | 'eager';
    fetchpriority?: 'auto' | 'high' | 'low';
    width?: number | string;
    height?: number | string;
  };

  const {
    class: cls,
    alt,
    name,
    quality = 75,
    format = 'jpg',
    loading = 'lazy',
    fetchpriority = 'low',
    width,
    height
  }: ImageProps = $props();

  const isFullUrl = $derived(name.includes('/') || name.startsWith('http'));
  const ext = $derived(name.split('.').pop()?.toLowerCase());
  const effectiveFormat = $derived(
    format !== 'jpg' ? format : ext === 'gif' ? 'gif' : 'jpg'
  );
  const isGif = $derived(effectiveFormat === 'gif');

  const src = $derived(
    isFullUrl
      ? name
      : isGif
        ? `/image/${name}`
        : `/image/${name}?format=${effectiveFormat}&quality=${quality}`
  );

  const getSourceSrc = (scale?: number) => {
    if (isFullUrl) return name;
    return scale
      ? `/image/${name}?format=${effectiveFormat}&quality=${quality}&scale=${scale}`
      : `/image/${name}?format=${effectiveFormat}&quality=${quality}`;
  };
</script>

<picture>
  {#if !isFullUrl && !isGif}
    <!--mobile - screens up to 640px!-->
    <source
      srcset={getSourceSrc(50)}
      type="image/{effectiveFormat}"
      media="(max-width: 640px)"
    />
    <!--tablet - screens up to 1024px!-->
    <source
      srcset={getSourceSrc(75)}
      type="image/{effectiveFormat}"
      media="(max-width: 1024px)"
    />
    <!--desktop - larger screens!-->
    <source srcset={getSourceSrc()} type="image/{effectiveFormat}" />
  {/if}
  <!--fallback!-->
  <img
    class={cls}
    {alt}
    {src}
    {loading}
    decoding="async"
    {fetchpriority}
    {width}
    {height}
  />
</picture>
