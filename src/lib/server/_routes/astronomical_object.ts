import { loggedProcedure } from '../api';
import { z } from 'zod';
import { conn } from '../variables';
import { v4 as uuidv4 } from 'uuid';
import { insertTranslations } from '../functions';
import type { Response, ActionsResponse } from '$/types/types';
import type { ErrorPath } from '$/lib/lang';
import { fail } from '@sveltejs/kit';

export default {
  create: loggedProcedure.POST.input(
    z.object({
      cs: z.string().min(1),
      en: z.string().min(1)
    })
  ).query(async ({ input }) => {
    const trx = await conn.startTransaction().execute();
    try {
      const transObject = {
        cs: { name: input.cs },
        en: { name: input.en }
      };

      // Insert translations for the object name
      const transResult = await insertTranslations(trx, transObject, ['name']);

      const objectUuid = uuidv4();

      // Insert the object
      await trx
        .insertInto('astronomical_object')
        .values({
          id: objectUuid,
          name: transResult.name
        })
        .execute();

      await trx.commit().execute();

      return {
        status: true
      } satisfies Response;
    } catch (err) {
      console.error(err);
      await trx.rollback().execute();
      return fail(500, {
        status: false,
        message: 'internal' satisfies ErrorPath
      } satisfies ActionsResponse);
    }
  }),
  resolve: loggedProcedure.POST.input(
    z.object({
      name: z.string().min(1)
    })
  ).query(async ({ input }) => {
    try {
      const url = `https://cdsweb.u-strasbg.fr/cgi-bin/nph-sesame/-oc/A?${encodeURIComponent(input.name)}`;
      const res = await fetch(url);
      if (!res.ok) {
        return { status: false, message: 'failed_fetch' };
      }
      const text = await res.text();
      const match = text.match(/%J\s+([0-9.-]+)\s+([0-9.+-]+)/);
      if (match) {
        const ra = parseFloat(match[1]);
        const dec = parseFloat(match[2]);
        return {
          status: true,
          ra,
          dec
        };
      }
      return {
        status: false,
        message: 'not_found'
      };
    } catch (err) {
      console.error(err);
      return {
        status: false,
        message: 'error'
      };
    }
  }),
  delete: loggedProcedure.POST.input(
    z.object({
      id: z.string()
    })
  ).query(async ({ input }) => {
    const used = await conn
      .selectFrom('article')
      .select('id')
      .where('object_id', '=', input.id)
      .executeTakeFirst();
    if (used) {
      return {
        status: false,
        message: 'object_in_use'
      };
    }
    const obj = await conn
      .selectFrom('astronomical_object')
      .select('name')
      .where('id', '=', input.id)
      .executeTakeFirst();
    if (obj) {
      const trx = await conn.startTransaction().execute();
      try {
        await trx.deleteFrom('astronomical_object').where('id', '=', input.id).execute();
        await trx
          .deleteFrom('translations')
          .where('key', '=', obj.name as string)
          .execute();
        await trx.commit().execute();
        return { status: true };
      } catch (err) {
        await trx.rollback().execute();
        console.error(err);
        return { status: false, message: 'internal' };
      }
    }
    return { status: false, message: 'not_found' };
  })
};
