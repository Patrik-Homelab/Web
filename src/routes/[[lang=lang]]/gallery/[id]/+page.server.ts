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
    return redirect(302, '/gallery', params.lang);
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

  const objects = await conn
    .selectFrom('article_object')
    .innerJoin(
      'astronomical_object',
      'article_object.object_id',
      'astronomical_object.id'
    )
    .select(['astronomical_object.id', 'astronomical_object.name'])
    .where('article_object.article_id', '=', post.id)
    .orderBy('article_object.id', 'asc')
    .execute();

  const objectIds = objects.map((o) => o.id);
  let relatedPosts: Array<{
    id: string;
    title: string;
    created_at: Date;
    imageName: string | null;
    imageAlt: string | null;
    lightSeconds: number;
  }> = [];

  if (objectIds.length > 0) {
    const relatedLinks = await conn
      .selectFrom('article_object')
      .select('article_id')
      .where('object_id', 'in', objectIds)
      .where('article_id', '!=', post.id)
      .distinct()
      .execute();

    const relatedIds = relatedLinks.map((r) => r.article_id);
    if (relatedIds.length > 0) {
      const [relArticles, relImages, relExposures] = await Promise.all([
        conn
          .selectFrom('article')
          .select(['id', 'title', 'created_at'])
          .where('id', 'in', relatedIds)
          .orderBy('created_at', 'desc')
          .execute(),
        conn
          .selectFrom('gallery_image')
          .select(['article_id', 'name', 'alt_text'])
          .where('article_id', 'in', relatedIds)
          .orderBy('id', 'asc')
          .execute(),
        conn
          .selectFrom('exposure')
          .select(['article_id', 'count', 'exposure_time_s', 'type'])
          .where('article_id', 'in', relatedIds)
          .where('type', '=', 'light')
          .execute()
      ]);

      relatedPosts = relArticles.map((ra) => {
        const firstImg = relImages.find((img) => img.article_id === ra.id);
        const lightSeconds = relExposures
          .filter((ex) => ex.article_id === ra.id)
          .reduce((acc, ex) => acc + ex.count * ex.exposure_time_s, 0);
        return {
          id: ra.id,
          title: ra.title,
          created_at: ra.created_at,
          imageName: firstImg?.name ?? null,
          imageAlt: firstImg?.alt_text ?? null,
          lightSeconds
        };
      });
    }
  }

  const translationKeys = [
    post.title,
    post.description,
    post.content_md,
    ...images.map((image) => image.alt_text),
    ...objects.map((o) => o.name),
    ...relatedPosts.map((rp) => rp.title),
    ...relatedPosts.map((rp) => rp.imageAlt).filter((a): a is string => Boolean(a))
  ];

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
    objects,
    relatedPosts,
    dynamicTranslations,
    meta: {
      title: dynamicTranslations[post.title],
      description: dynamicTranslations[post.description] || undefined,
      type: 'article',
      image:
        images.length > 0
          ? `${url.origin}/image/${images[0].name}?format=jpg&quality=75`
          : undefined
    }
  };
}) satisfies PageServerLoad;
