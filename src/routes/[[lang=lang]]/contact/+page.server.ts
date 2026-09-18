import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const data = await parent();
  const isCs = data.selectedLang === 'cs';

  return {
    meta: {
      title: data.lang.navigation.contact,
      description: isCs
        ? 'Kontaktujte mě - Discord, GitHub, email a sociální sítě.'
        : 'Contact me - Discord, GitHub, email, and social networks.'
    }
  };
}) satisfies PageServerLoad;
