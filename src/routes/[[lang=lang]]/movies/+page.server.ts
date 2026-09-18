import { moviesPageData } from '$/lib/data/aboutData';
import { gatherTranslations } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const parentData = await parent();
  const lang = (parentData.selectedLang as 'cs' | 'en') || 'cs';

  try {
    const movies = await conn
      .selectFrom('movie')
      .selectAll()
      .orderBy('added_at', 'desc')
      .orderBy('id', 'desc')
      .execute();

    if (movies.length > 0) {
      const keys = [...movies.map((m) => m.title), ...movies.map((m) => m.review)];

      const dynamicTranslations = await gatherTranslations(keys, lang);

      return {
        movies: movies.map((m) => ({
          id: m.id,
          title: dynamicTranslations[m.title] || '',
          type: m.type as 'movie' | 'series',
          release_year: m.release_year,
          rating: Number(m.rating),
          review: dynamicTranslations[m.review] || '',
          image: m.image,
          added_at:
            m.added_at instanceof Date
              ? m.added_at.toISOString().split('T')[0]
              : String(m.added_at).split('T')[0]
        })),
        meta: {
          title: parentData.lang.navigation.movies,
          description:
            lang === 'cs'
              ? 'Filmy a seriály, které jsem viděl, včetně hodnocení a recenzí.'
              : 'Movies and TV series I have watched, including personal reviews and ratings.'
        }
      };
    }
  } catch {
    // Fallback to static data below
  }

  // Fallback to static data
  const fallback = moviesPageData[lang] || moviesPageData.en;
  return {
    movies: fallback.movies.map((m, idx) => ({
      id: idx + 1,
      title: m.title,
      type: (m.type === 'Seriál' || m.type === 'Series' ? 'series' : 'movie') as
        | 'movie'
        | 'series',
      release_year: typeof m.year === 'number' ? m.year : parseInt(m.year) || 2020,
      rating: typeof m.rating === 'number' ? m.rating : parseFloat(m.rating) || 4.0,
      review: m.review,
      image: null as string | null,
      added_at: m.added_at || '2022-09-10'
    })),
    meta: {
      title: parentData.lang.navigation.movies,
      description:
        lang === 'cs'
          ? 'Filmy a seriály, které jsem viděl, včetně hodnocení a recenzí.'
          : 'Movies and TV series I have watched, including personal reviews and ratings.'
    }
  };
}) satisfies PageServerLoad;
