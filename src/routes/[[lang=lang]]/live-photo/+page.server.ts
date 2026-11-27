import { gatherTranslations } from '$/lib/server/functions';
import { nina } from '$/lib/server/nina';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

type FrameType = 'light' | 'dark' | 'flat' | 'bias';

export const load = (async ({ parent, url }) => {
  const data = await parent();

  const [
    articles,
    images,
    exposures,
    articleObjects,
    objects,
    articleEquipment,
    equipment
  ] = await Promise.all([
    conn.selectFrom('article').select(['id']).execute(),
    conn.selectFrom('gallery_image').select(['id']).execute(),
    conn
      .selectFrom('exposure')
      .select(['article_id', 'type', 'count', 'exposure_time_s'])
      .execute(),
    conn.selectFrom('article_object').select(['article_id', 'object_id']).execute(),
    conn.selectFrom('astronomical_object').select(['id', 'name']).execute(),
    conn.selectFrom('article_equipment').select(['article_id', 'equipment_id']).execute(),
    conn.selectFrom('equipment').select(['id', 'name']).execute()
  ]);

  const framesByType: Record<FrameType, { count: number; seconds: number }> = {
    light: { count: 0, seconds: 0 },
    dark: { count: 0, seconds: 0 },
    flat: { count: 0, seconds: 0 },
    bias: { count: 0, seconds: 0 }
  };

  const lightSecondsByArticle = new Map<string, number>();

  for (const ex of exposures) {
    const type = ex.type as FrameType;
    const totalSec = ex.count * ex.exposure_time_s;
    if (type in framesByType) {
      framesByType[type].count += ex.count;
      framesByType[type].seconds += totalSec;
    }
    if (type === 'light') {
      lightSecondsByArticle.set(
        ex.article_id,
        (lightSecondsByArticle.get(ex.article_id) ?? 0) + totalSec
      );
    }
  }

  const totalFrames = Object.values(framesByType).reduce((acc, f) => acc + f.count, 0);
  const totalExposureSeconds = Object.values(framesByType).reduce(
    (acc, f) => acc + f.seconds,
    0
  );

  // Aggregate object statistics
  const objectStatsMap = new Map<
    string,
    { id: string; nameKey: string; articlesCount: number; lightSeconds: number }
  >();
  for (const link of articleObjects) {
    const obj = objects.find((o) => o.id === link.object_id);
    if (!obj) continue;
    const existing = objectStatsMap.get(obj.id) ?? {
      id: obj.id,
      nameKey: obj.name,
      articlesCount: 0,
      lightSeconds: 0
    };
    existing.articlesCount += 1;
    existing.lightSeconds += lightSecondsByArticle.get(link.article_id) ?? 0;
    objectStatsMap.set(obj.id, existing);
  }

  const topObjects = Array.from(objectStatsMap.values())
    .sort((a, b) => b.lightSeconds - a.lightSeconds || b.articlesCount - a.articlesCount)
    .slice(0, 5);

  // Aggregate equipment usage statistics
  const equipStatsMap = new Map<
    number,
    { id: number; name: string; articlesCount: number; lightSeconds: number }
  >();
  for (const link of articleEquipment) {
    const eq = equipment.find((e) => e.id === link.equipment_id);
    if (!eq) continue;
    const existing = equipStatsMap.get(eq.id) ?? {
      id: eq.id,
      name: eq.name,
      articlesCount: 0,
      lightSeconds: 0
    };
    existing.articlesCount += 1;
    existing.lightSeconds += lightSecondsByArticle.get(link.article_id) ?? 0;
    equipStatsMap.set(eq.id, existing);
  }

  const topEquipment = Array.from(equipStatsMap.values())
    .sort((a, b) => b.articlesCount - a.articlesCount || b.lightSeconds - a.lightSeconds)
    .slice(0, 5);

  const objectNameKeys = topObjects.map((o) => o.nameKey);
  const dynamicTranslations =
    objectNameKeys.length > 0
      ? await gatherTranslations(objectNameKeys, data.selectedLang)
      : {};

  return {
    observatoryStats: {
      totalArticles: articles.length,
      totalImages: images.length,
      uniqueObjects: objectStatsMap.size,
      totalFrames,
      totalExposureSeconds,
      totalLightSeconds: framesByType.light.seconds,
      framesByType,
      topObjects,
      topEquipment
    },
    dynamicTranslations,
    meta: {
      title: data.lang.live_photo.title,
      description: data.lang.live_photo.description,
      image: nina.haveImage() ? `${url.origin}/api/live-image` : undefined
    }
  };
}) satisfies PageServerLoad;
