import { gatherTranslations, gatherTranslationsAll } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import { matchSolarBodyId, type SolarArticleLink } from '$/lib/solarSystem';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const data = await parent();
  const isCs = data.selectedLang === 'cs';

  const objects = await conn
    .selectFrom('astronomical_object')
    .select(['id', 'name'])
    .execute();

  const planetArticles: Record<string, SolarArticleLink[]> = {};

  if (objects.length > 0) {
    const objectTranslationsAll = await gatherTranslationsAll(objects.map((o) => o.name));

    const objectToSolarBody = new Map<string, { bodyId: string; nameKey: string }>();
    for (const obj of objects) {
      const candidateNames = Object.values(objectTranslationsAll)
        .map((langMap) => langMap[obj.name])
        .filter((v): v is string => Boolean(v));
      const bodyId = matchSolarBodyId(candidateNames);
      if (bodyId) {
        objectToSolarBody.set(obj.id, { bodyId, nameKey: obj.name });
      }
    }

    if (objectToSolarBody.size > 0) {
      const matchedObjectIds = Array.from(objectToSolarBody.keys());
      const links = await conn
        .selectFrom('article_object')
        .innerJoin('article', 'article_object.article_id', 'article.id')
        .select([
          'article.id',
          'article.title',
          'article.created_at',
          'article_object.object_id'
        ])
        .where('article_object.object_id', 'in', matchedObjectIds)
        .orderBy('article.created_at', 'desc')
        .execute();

      const keysToTranslate = Array.from(
        new Set([
          ...links.map((l) => l.title),
          ...Array.from(objectToSolarBody.values()).map((v) => v.nameKey)
        ])
      );

      const translations =
        keysToTranslate.length > 0
          ? await gatherTranslations(keysToTranslate, data.selectedLang)
          : {};

      const seenPerBody = new Map<string, Set<string>>();

      for (const link of links) {
        const meta = objectToSolarBody.get(link.object_id);
        if (!meta) continue;

        let seen = seenPerBody.get(meta.bodyId);
        if (!seen) {
          seen = new Set<string>();
          seenPerBody.set(meta.bodyId, seen);
        }
        if (seen.has(link.id)) continue;
        seen.add(link.id);

        if (!planetArticles[meta.bodyId]) {
          planetArticles[meta.bodyId] = [];
        }

        planetArticles[meta.bodyId].push({
          id: link.id,
          title: translations[link.title] || link.id,
          year: new Date(link.created_at).getFullYear(),
          objectName: translations[meta.nameKey] || meta.bodyId
        });
      }
    }
  }

  return {
    planetArticles,
    meta: {
      title: isCs ? 'Hlavní stránka' : 'Home',
      description: data.lang.default_desc
    }
  };
}) satisfies PageServerLoad;
