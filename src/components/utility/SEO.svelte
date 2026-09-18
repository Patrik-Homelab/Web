<script lang="ts">
  import { page } from '$app/state';
  import { getState } from '$/lib/state.svelte';

  const _state = getState();

  const meta = $derived(page.data.meta ?? _state.meta);

  const title = $derived.by(() => {
    if (meta?.title) {
      return `${meta.title} | Patrik Mintěl`;
    }
    const navKey = _state.path?.slice(1) as keyof typeof _state.lang.navigation;
    const navName = _state.lang?.navigation?.[navKey];
    if (navName) {
      return `${navName} | Patrik Mintěl`;
    }
    if (!_state.path || _state.path === '' || _state.path === '/') {
      return `Patrik Mintěl | Web Developer & Astrophotographer`;
    }
    return `Patrik Mintěl`;
  });

  const description = $derived(meta?.description ?? _state.lang?.default_desc ?? '');

  const origin = $derived(page.url.origin);
  const currentPathWithoutLang = $derived(_state.path || '/');

  const canonicalUrl = $derived(
    `${origin}/${_state.selectedLang || 'cs'}${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`
  );

  const csUrl = $derived(
    `${origin}/cs${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`
  );

  const enUrl = $derived(
    `${origin}/en${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`
  );

  const imageUrl = $derived(meta?.image ?? `${origin}/images/PFP.jpg`);

  const pageType = $derived(meta?.type ?? 'website');

  const structuredData = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: 'Patrik Mintěl',
          inLanguage: [_state.selectedLang === 'cs' ? 'cs-CZ' : 'en-US']
        },
        {
          '@type': 'Person',
          '@id': `${origin}/#person`,
          name: 'Patrik Mintěl',
          url: origin,
          image: `${origin}/images/PFP.jpg`,
          jobTitle: 'Software Developer & Astrophotographer',
          sameAs: [
            'https://github.com/patrick115',
            'https://astrobin.com/users/patrick115'
          ]
        }
      ]
    })
  );

  const jsonLdScript = $derived(
    `<script type="application/ld+json">${structuredData}</` + `script>`
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Hreflang alternates -->
  <link rel="alternate" hreflang="cs" href={csUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="x-default" href={csUrl} />

  <!-- Open Graph -->
  <meta property="og:type" content={pageType} />
  <meta property="og:site_name" content="Patrik Mintěl" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:locale" content={_state.selectedLang === 'cs' ? 'cs_CZ' : 'en_US'} />
  <meta
    property="og:locale:alternate"
    content={_state.selectedLang === 'cs' ? 'en_US' : 'cs_CZ'}
  />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />

  <!-- Schema.org Structured Data -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonLdScript}
</svelte:head>
