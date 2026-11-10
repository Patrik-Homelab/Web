import { gatherTranslationsAll } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  try {
    const projects = await conn
      .selectFrom('project')
      .selectAll()
      .orderBy('date', 'desc')
      .orderBy('id', 'desc')
      .execute();

    const allTranslationKeys = [
      ...projects.map((p) => p.name),
      ...projects.map((p) => p.description)
    ];

    const dynamicTranslations = await gatherTranslationsAll(allTranslationKeys);

    return {
      projects,
      dynamicTranslations
    };
  } catch {
    return {
      projects: [],
      dynamicTranslations: { cs: {}, en: {} }
    };
  }
}) satisfies PageServerLoad;
