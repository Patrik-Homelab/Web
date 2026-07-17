<script lang="ts">
  import H1 from '$/components/headers/H1.svelte';
  import Icon from '$/components/utility/Icon.svelte';
  import { resolveTranslation, type LanguagePath } from '$/lib/lang';
  import { getState } from '$/lib/state.svelte';
  import type { BootstrapIcon } from '$/types/bootstrap_icons';

  type Platform = {
    icon: BootstrapIcon;
    name: string;
    button: 'visit' | 'send';
    tag: string;
    url: string;
    descriptionKey: LanguagePath;
    glowClass: string;
    brandColorText: string;
  };

  const _state = getState();
  const lang = $derived(_state.lang.contact);

  const platforms = [
    {
      icon: 'bi-github',
      name: 'GitHub',
      button: 'visit',
      tag: '@patrick11514',
      url: 'https://github.com/patrick11514',
      descriptionKey: 'contact.descriptions.github',
      glowClass:
        'hover:border-slate-500/35 hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]',
      brandColorText: 'group-hover:text-slate-300 text-slate-400'
    },
    {
      icon: 'bi-envelope',
      name: 'Email',
      button: 'send',
      tag: 'info@patrick115.eu',
      url: 'mailto:info@patrick115.eu',
      descriptionKey: 'contact.descriptions.email',
      glowClass:
        'hover:border-primary/35 hover:shadow-[0_0_30px_rgba(var(--color-primary-500),0.15)]',
      brandColorText: 'group-hover:text-primary-text text-primary/70'
    },
    {
      icon: 'bi-linkedin',
      name: 'LinkedIn',
      button: 'visit',
      tag: '/in/patrick115',
      url: 'https://www.linkedin.com/in/patrick115/',
      descriptionKey: 'contact.descriptions.linkedin',
      glowClass: 'hover:border-blue-500/35 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      brandColorText: 'group-hover:text-blue-400 text-blue-500/70'
    },
    {
      icon: 'bi-instagram',
      name: 'Instagram',
      button: 'visit',
      tag: '@patrikmintel',
      url: 'https://www.instagram.com/patrikmintel/',
      descriptionKey: 'contact.descriptions.instagram',
      glowClass: 'hover:border-pink-500/35 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]',
      brandColorText: 'group-hover:text-pink-400 text-pink-500/70'
    },
    {
      icon: 'bi-twitch',
      name: 'Twitch',
      button: 'visit',
      tag: '@PatrikMint',
      url: 'https://www.twitch.tv/patrikmint',
      descriptionKey: 'contact.descriptions.twitch',
      glowClass:
        'hover:border-purple-500/35 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
      brandColorText: 'group-hover:text-purple-400 text-purple-500/70'
    },
    {
      icon: 'bi-discord',
      name: 'Discord',
      button: 'send',
      tag: 'patrik.',
      url: 'https://discord.com/users/620266881227423745',
      descriptionKey: 'contact.descriptions.discord',
      glowClass:
        'hover:border-indigo-500/35 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]',
      brandColorText: 'group-hover:text-indigo-400 text-indigo-500/70'
    },
    {
      icon: 'bi-discord',
      name: 'Discord Server',
      button: 'visit',
      tag: 'Patrikovo Království',
      url: 'https://discord.patrick115.eu/',
      descriptionKey: 'contact.descriptions.discordServer',
      glowClass:
        'hover:border-indigo-400/35 hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]',
      brandColorText: 'group-hover:text-indigo-300 text-indigo-400/70'
    }
  ] as const satisfies Platform[];
</script>

<section class="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-6 md:pt-16">
  <!-- Section Title -->
  <H1 class="mx-auto mb-10 text-center">{lang.title}</H1>

  <!-- Platforms Grid -->
  <div class="flex w-full flex-wrap items-stretch justify-center gap-6">
    {#each platforms as platform (`${platform.name}-${platform.tag}`)}
      <a
        href={platform.url}
        target="_blank"
        class={[
          'group flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-slate-950/40 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]',
          'sm:w-[45%] md:w-[30%] lg:w-[22%]',
          platform.glowClass
        ].join(' ')}
      >
        <!-- Platform Icon -->
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-slate-950 shadow-md transition-all duration-300 group-hover:border-white/10"
        >
          <Icon
            name={platform.icon}
            class={[
              'text-3xl transition-colors duration-300',
              platform.brandColorText
            ].join(' ')}
          />
        </div>

        <!-- Platform Info -->
        <div class="flex w-full flex-col items-center gap-1.5 text-center">
          <h2
            class="font-poppins text-text-strong text-lg font-bold transition-colors group-hover:text-white"
          >
            {platform.name}
          </h2>
          <div
            class="text-text-muted group-hover:text-text-strong rounded-full border border-white/10 bg-white/5 px-3 py-0.5 font-mono text-xs font-bold transition-all duration-300 group-hover:bg-white/10"
          >
            {platform.tag}
          </div>
        </div>

        <!-- Description Paragraph -->
        <h3 class="text-text-muted max-w-[180px] text-center text-xs leading-relaxed">
          {resolveTranslation(platform.descriptionKey, _state.lang)}
        </h3>

        <!-- Call to Action Indicator -->
        <div
          class="text-text-muted group-hover:text-primary mt-2 flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
        >
          <span>
            {platform.button === 'visit'
              ? _state.selectedLang === 'cs'
                ? 'Navštívit'
                : 'Visit Profile'
              : _state.selectedLang === 'cs'
                ? 'Kontaktovat'
                : 'Send Message'}
          </span>
          <Icon
            name="bi-arrow-right"
            class="text-[8px] transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </a>
    {/each}
  </div>
</section>
