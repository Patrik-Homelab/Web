import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const data = await parent();
  const isCs = data.selectedLang === 'cs';

  return {
    meta: {
      title: isCs ? 'Hlavní stránka' : 'Home',
      description: data.lang.default_desc
    }
  };
}) satisfies PageServerLoad;
