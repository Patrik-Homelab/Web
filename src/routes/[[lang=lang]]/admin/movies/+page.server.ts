import { gatherTranslationsAll } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  try {
    const movies = await conn
      .selectFrom('movie')
      .selectAll()
      .orderBy('added_at', 'desc')
      .orderBy('id', 'desc')
      .execute();

    const allTranslationKeys = [
      ...movies.map((m) => m.title),
      ...movies.map((m) => m.review)
    ];

    const dynamicTranslations = await gatherTranslationsAll(allTranslationKeys);

    return {
      movies,
      dynamicTranslations
    };
  } catch {
    return {
      movies: [],
      dynamicTranslations: { cs: {}, en: {} }
    };
  }
}) satisfies PageServerLoad;
