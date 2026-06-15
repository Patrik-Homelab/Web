import { gatherTranslationsAll } from '$/lib/server/functions';
import { Server } from '$/lib/server/server';
import { conn } from '$/lib/server/variables';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
  const equipmentData = await conn.selectFrom('equipment').selectAll().execute();
  const objectsData = await conn.selectFrom('astronomical_object').selectAll().execute();

  const baseData = {
    equipment: equipmentData,
    objects: objectsData
  };

  if (params.id === 'new')
    return {
      article: {
        title: '',
        description: '',
        content_md: '',
        images: [],
        exposures: [],
        equipment: [],
        object_id: null,
        ra: null,
        dec: null,
        fov_width: null,
        fov_height: null,
        fov_rotation: null
      } as unknown as Record<string, unknown>,
      ...baseData,
      dynamicTranslations: await gatherTranslationsAll(
        objectsData.map((o) => o.name as string)
      )
    };

  const article = await conn
    .selectFrom('article')
    .selectAll()
    .where('id', '=', params.id)
    .executeTakeFirst();

  if (!article) {
    redirect(302, `/${params.lang ?? 'cs'}/admin/article`);
  }

  const images = await conn
    .selectFrom('gallery_image')
    .selectAll()
    .where('article_id', '=', params.id)
    .orderBy('id', 'asc')
    .execute();

  const exposures = await conn
    .selectFrom('exposure')
    .selectAll()
    .where('article_id', '=', params.id)
    .orderBy('id', 'asc')
    .execute();

  const equipment = await conn
    .selectFrom('article_equipment')
    .select(['equipment_id'])
    .where('article_equipment.article_id', '=', params.id)
    .orderBy('article_equipment.id', 'asc')
    .execute();

  return {
    article: {
      ...article,
      images,
      exposures,
      equipment: equipment.map((e) => e.equipment_id)
    },
    ...baseData,
    dynamicTranslations: await gatherTranslationsAll([
      article.title,
      article.description,
      article.content_md,
      ...images.map((image) => image.alt_text),
      ...objectsData.map((o) => o.name as string)
    ])
  };
}) satisfies PageServerLoad;

export const actions = {
  create: Server.actions.article.POST,
  edit: Server.actions.article.PUT
} satisfies Actions;
