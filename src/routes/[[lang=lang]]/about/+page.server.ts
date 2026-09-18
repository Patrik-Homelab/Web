import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const data = await parent();
  const isCs = data.selectedLang === 'cs';

  return {
    meta: {
      title: data.lang.navigation.about,
      description: isCs
        ? 'O mně - Patrik Mintěl. Vzdělání, programátorské projekty, astrofotografie, technologie a časová osa.'
        : 'About me - Patrik Mintěl. Education, programming projects, astrophotography, tech stack, and career timeline.'
    }
  };
}) satisfies PageServerLoad;
