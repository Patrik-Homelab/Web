import { getStaticProjects, type ProjectItem } from '$/lib/data/projectsData';
import { gatherTranslations } from '$/lib/server/functions';
import { conn } from '$/lib/server/variables';
import type { PageServerLoad } from './$types';

function parseStringArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // Fallback to comma-separated string
  }
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export const load = (async ({ parent }) => {
  const parentData = await parent();
  const lang = (parentData.selectedLang as 'cs' | 'en') || 'cs';
  const isAdmin = Boolean(parentData.userState?.logged);

  const meta = {
    title: parentData.lang.navigation.projects,
    description:
      lang === 'cs'
        ? 'Přehled webových aplikací, nástrojů, Discord botů a open-source projektů, na kterých jsem pracoval.'
        : 'A showcase of web applications, tools, Discord bots, and open-source projects I have worked on.'
  };

  try {
    const totalProjects = await conn
      .selectFrom('project')
      .select((eb) => eb.fn.count<number>('id').as('count'))
      .executeTakeFirst();

    const count = Number(totalProjects?.count || 0);

    if (count > 0) {
      let query = conn
        .selectFrom('project')
        .selectAll()
        .orderBy('date', 'desc')
        .orderBy('id', 'desc');

      if (!isAdmin) {
        query = query.where('hidden', '=', 0);
      }

      const dbProjects = await query.execute();

      if (dbProjects.length === 0) {
        return {
          projects: [],
          meta
        };
      }

      const keys = [
        ...dbProjects.map((p) => p.name),
        ...dbProjects.map((p) => p.description)
      ];
      const dynamicTranslations = await gatherTranslations(keys, lang);

      const projects: ProjectItem[] = dbProjects.map((p) => ({
        id: p.id,
        uuid: p.uuid,
        name: dynamicTranslations[p.name] || '',
        description: dynamicTranslations[p.description] || '',
        date:
          p.date instanceof Date
            ? p.date.toISOString().split('T')[0]
            : String(p.date).split('T')[0],
        preview: p.preview || null,
        images: parseStringArray(p.images),
        tags: parseStringArray(p.tags),
        hidden: Boolean(p.hidden)
      }));

      return {
        projects,
        meta
      };
    }
  } catch {
    // Fallback to static data below
  }

  const staticProjects = getStaticProjects(lang);
  return {
    projects: isAdmin ? staticProjects : staticProjects.filter((p) => !p.hidden),
    meta
  };
}) satisfies PageServerLoad;
