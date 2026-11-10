import type { ErrorPath } from '$/lib/lang';
import { projectSchema as _projectSchema } from '$/types/schemes';
import type { Response } from '$/types/types';
import { AnyFormDataInput } from '@patrick115/sveltekitapi';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { loggedProcedure } from '../api';
import { insertTranslations, parseFormData, updateTranslations } from '../functions';
import { conn } from '../variables';

const projectSchema = _projectSchema();
const TRANSLATION_FIELDS = ['name', 'description'] as const;

function normalizeJsonArray(raw: string | undefined): string {
  if (!raw || !raw.trim()) return '[]';
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return JSON.stringify(
        parsed.map((item) => String(item).trim()).filter((item) => item.length > 0)
      );
    }
  } catch {
    // Fallback to comma-separated parsing
  }
  const items = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return JSON.stringify(items);
}

export default [
  loggedProcedure.POST.input(AnyFormDataInput).query(async ({ input: _input }) => {
    let parsed;
    try {
      parsed = parseFormData(_input, projectSchema);
    } catch {
      return {
        status: false,
        code: 400,
        message: 'projects.form' satisfies ErrorPath
      };
    }

    const input = parsed.cs;
    const trx = await conn.startTransaction().execute();

    try {
      const translations = await insertTranslations(trx, parsed, [...TRANSLATION_FIELDS]);

      await trx
        .insertInto('project')
        .values({
          uuid: uuidv4(),
          name: translations.name,
          description: translations.description,
          date: input.date,
          preview: input.preview && input.preview.trim() ? input.preview.trim() : null,
          images: normalizeJsonArray(input.images),
          tags: normalizeJsonArray(input.tags),
          hidden: input.hidden ? 1 : 0
        })
        .execute();

      await trx.commit().execute();

      return {
        status: true
      } satisfies Response;
    } catch (err) {
      await trx.rollback().execute();
      console.error(err);
      return {
        status: false,
        code: 500,
        message: 'internal' satisfies ErrorPath
      };
    }
  }),

  loggedProcedure.PUT.input(AnyFormDataInput).query(async ({ input: _input }) => {
    let parsed;
    try {
      parsed = parseFormData(_input, projectSchema);
    } catch {
      return {
        status: false,
        code: 400,
        message: 'projects.form' satisfies ErrorPath
      };
    }

    const input = parsed.cs;
    if (!input.id) {
      return {
        status: false,
        code: 400,
        message: 'projects.notFound' satisfies ErrorPath
      };
    }

    const project = await conn
      .selectFrom('project')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirst();

    if (!project) {
      return {
        status: false,
        code: 404,
        message: 'projects.notFound' satisfies ErrorPath
      };
    }

    const trx = await conn.startTransaction().execute();

    try {
      await updateTranslations(
        trx,
        {
          name: project.name,
          description: project.description
        },
        parsed,
        TRANSLATION_FIELDS
      );

      await trx
        .updateTable('project')
        .set({
          date: input.date,
          preview: input.preview && input.preview.trim() ? input.preview.trim() : null,
          images: normalizeJsonArray(input.images),
          tags: normalizeJsonArray(input.tags),
          hidden: input.hidden ? 1 : 0,
          updated_at: new Date()
        })
        .where('id', '=', input.id)
        .execute();

      await trx.commit().execute();

      return {
        status: true
      } satisfies Response;
    } catch (err) {
      await trx.rollback().execute();
      console.error(err);
      return {
        status: false,
        code: 500,
        message: 'internal' satisfies ErrorPath
      };
    }
  }),

  loggedProcedure.DELETE.input(z.number()).query(async ({ input: id }) => {
    if (isNaN(Number(id))) {
      return {
        status: false,
        code: 400,
        message: 'projects.notFound' satisfies ErrorPath
      };
    }

    const project = await conn
      .selectFrom('project')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!project) {
      return {
        status: false,
        code: 404,
        message: 'projects.notFound' satisfies ErrorPath
      };
    }

    const trx = await conn.startTransaction().execute();

    try {
      await trx.deleteFrom('project').where('id', '=', id).execute();

      await trx
        .deleteFrom('translations')
        .where('key', 'in', [project.name, project.description])
        .execute();

      await trx.commit().execute();

      return {
        status: true
      } satisfies Response;
    } catch (err) {
      await trx.rollback().execute();
      console.error(err);
      return {
        status: false,
        code: 500,
        message: 'internal' satisfies ErrorPath
      };
    }
  }),

  {
    toggle: loggedProcedure.POST.input(z.object({ id: z.number() })).query(
      async ({ input }) => {
        const project = await conn
          .selectFrom('project')
          .select(['id', 'hidden'])
          .where('id', '=', input.id)
          .executeTakeFirst();

        if (!project) {
          return {
            status: false,
            code: 404,
            message: 'projects.notFound' satisfies ErrorPath
          };
        }

        await conn
          .updateTable('project')
          .set({
            hidden: project.hidden ? 0 : 1,
            updated_at: new Date()
          })
          .where('id', '=', input.id)
          .execute();

        return {
          status: true
        } satisfies Response;
      }
    ),

    visibilityAll: loggedProcedure.POST.input(z.object({ hidden: z.boolean() })).query(
      async ({ input }) => {
        await conn
          .updateTable('project')
          .set({
            hidden: input.hidden ? 1 : 0,
            updated_at: new Date()
          })
          .execute();

        return {
          status: true
        } satisfies Response;
      }
    )
  }
];
