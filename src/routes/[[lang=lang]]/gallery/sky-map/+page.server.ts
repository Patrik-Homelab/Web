import { gatherTranslations } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, url }) => {
  const parentData = await parent();

  const articles = await conn
    .selectFrom('article')
    .select([
      'id',
      'title',
      'description',
      'created_at',
      'ra',
      'dec',
      'fov_width',
      'fov_height',
      'fov_rotation'
    ])
    .where('ra', 'is not', null)
    .where('dec', 'is not', null)
    .orderBy('created_at', 'desc')
    .execute();

  const articleIds = articles.map((a) => a.id);

  let images: Array<{ article_id: string; name: string; alt_text: string }> = [];
  let exposures: Array<{
    article_id: string;
    count: number;
    exposure_time_s: number;
    type: string;
  }> = [];
  let objectLinks: Array<{ article_id: string; object_id: string; name: string }> = [];
  let equipmentLinks: Array<{ article_id: string; name: string }> = [];

  if (articleIds.length > 0) {
    [images, exposures, objectLinks, equipmentLinks] = await Promise.all([
      conn
        .selectFrom('gallery_image')
        .select(['article_id', 'name', 'alt_text'])
        .where('article_id', 'in', articleIds)
        .orderBy('id', 'asc')
        .execute(),
      conn
        .selectFrom('exposure')
        .select(['article_id', 'count', 'exposure_time_s', 'type'])
        .where('article_id', 'in', articleIds)
        .where('type', '=', 'light')
        .execute(),
      conn
        .selectFrom('article_object')
        .innerJoin(
          'astronomical_object',
          'article_object.object_id',
          'astronomical_object.id'
        )
        .select([
          'article_object.article_id',
          'article_object.object_id',
          'astronomical_object.name'
        ])
        .where('article_object.article_id', 'in', articleIds)
        .orderBy('article_object.id', 'asc')
        .execute(),
      conn
        .selectFrom('article_equipment')
        .innerJoin('equipment', 'article_equipment.equipment_id', 'equipment.id')
        .innerJoin('equipment_type', 'equipment.type_id', 'equipment_type.id')
        .select(['article_equipment.article_id', 'equipment.name'])
        .where('article_equipment.article_id', 'in', articleIds)
        .orderBy('equipment_type.priority', 'desc')
        .execute()
    ]);
  }

  const captures = articles.map((article) => {
    const firstImg = images.find((img) => img.article_id === article.id);
    const lightSeconds = exposures
      .filter((ex) => ex.article_id === article.id)
      .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0);
    const objects = objectLinks
      .filter((o) => o.article_id === article.id)
      .map((o) => ({ id: o.object_id, nameKey: o.name }));
    const equipment = equipmentLinks
      .filter((eq) => eq.article_id === article.id)
      .map((eq) => eq.name);

    return {
      id: article.id,
      titleKey: article.title,
      descriptionKey: article.description,
      created_at: article.created_at,
      ra: article.ra as number,
      dec: article.dec as number,
      fov_width: article.fov_width,
      fov_height: article.fov_height,
      fov_rotation: article.fov_rotation,
      imageName: firstImg?.name ?? null,
      imageAltKey: firstImg?.alt_text ?? null,
      lightSeconds,
      objects,
      equipment
    };
  });

  const translationKeys = Array.from(
    new Set(
      [
        ...captures.map((c) => c.titleKey),
        ...captures.map((c) => c.descriptionKey),
        ...captures.map((c) => c.imageAltKey).filter((k): k is string => Boolean(k)),
        ...objectLinks.map((o) => o.name)
      ].filter(Boolean)
    )
  );

  const dynamicTranslations =
    translationKeys.length > 0
      ? await gatherTranslations(translationKeys, parentData.selectedLang)
      : {};

  return {
    captures,
    dynamicTranslations,
    meta: {
      title: parentData.lang.gallery.skyMapTitle,
      description: parentData.lang.gallery.skyMapSubtitle,
      image:
        images.length > 0
          ? `${url.origin}/image/${images[0].name}?format=jpg&quality=75`
          : undefined
    }
  };
}) satisfies PageServerLoad;
