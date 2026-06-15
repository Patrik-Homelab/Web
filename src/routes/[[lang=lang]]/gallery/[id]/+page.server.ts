import { gatherTranslations, redirect } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, parent, url }) => {
  const parentData = await parent();

  const post = await conn
    .selectFrom('article')
    .selectAll()
    .where('id', '=', params.id)
    .executeTakeFirst();
  if (!post) {
    return redirect(302, '/gallery');
  }

  const images = await conn
    .selectFrom('gallery_image')
    .selectAll()
    .where('article_id', '=', post.id)
    .orderBy('id', 'asc')
    .execute();
  const exposures = await conn
    .selectFrom('exposure')
    .selectAll()
    .where('article_id', '=', post.id)
    .orderBy('date', 'asc')
    .execute();
  const equipment = await conn
    .selectFrom('article_equipment')
    .innerJoin('equipment', 'equipment_id', 'equipment.id')
    .innerJoin('equipment_type', 'type_id', 'equipment_type.id')
    .selectAll()
    .where('article_id', '=', post.id)
    .execute();

  let objectTranslationUuid: string | undefined = undefined;
  if (post.object_id) {
    const obj = await conn
      .selectFrom('astronomical_object')
      .selectAll()
      .where('id', '=', post.object_id)
      .executeTakeFirst();
    if (obj) {
      objectTranslationUuid = obj.name as string;
    }
  }

  const translationKeys = [
    post.title,
    post.description,
    post.content_md,
    ...images.map((image) => image.alt_text)
  ];
  if (objectTranslationUuid) {
    translationKeys.push(objectTranslationUuid);
  }

  const dynamicTranslations = await gatherTranslations(
    translationKeys,
    parentData.selectedLang
  );

  return {
    post: {
      ...post,
      images,
      exposures,
      equipment
    },
    objectTranslationUuid,
    dynamicTranslations,
    meta: {
      title: dynamicTranslations[post.title],
      description: dynamicTranslations[post.description],
      type: 'article',
      image:
        images.length > 0
          ? `${url.origin}/image/${images[0].name}?format=jpg&quality=75`
          : undefined
    }
  };
}) satisfies PageServerLoad;
