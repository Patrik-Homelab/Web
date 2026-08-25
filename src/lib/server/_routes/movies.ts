import type { ErrorPath } from '$/lib/lang';
import { movieSchema as _movieSchema } from '$/types/schemes';
import type { Response } from '$/types/types';
import { AnyFormDataInput } from '@patrick115/sveltekitapi';
import { z } from 'zod';
import { loggedProcedure } from '../api';
import { insertTranslations, parseFormData, updateTranslations } from '../functions';
import { conn } from '../variables';

const movieSchema = _movieSchema();
const TRANSLATION_FIELDS = ['title', 'review'] as const;

export default [
  loggedProcedure.POST.input(AnyFormDataInput).query(async ({ input: _input }) => {
    let parsed;
    try {
      parsed = parseFormData(_input, movieSchema);
    } catch {
      return {
        status: false,
        code: 400,
        message: 'movies.form' satisfies ErrorPath
      };
    }

    const input = parsed.cs;
    const trx = await conn.startTransaction().execute();

    try {
      const translations = await insertTranslations(trx, parsed, [...TRANSLATION_FIELDS]);

      await trx
        .insertInto('movie')
        .values({
          title: translations.title,
          type: input.type,
          release_year: input.release_year,
          rating: input.rating,
          review: translations.review,
          image: input.image ?? null,
          added_at: input.added_at
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
      parsed = parseFormData(_input, movieSchema);
    } catch {
      return {
        status: false,
        code: 400,
        message: 'movies.form' satisfies ErrorPath
      };
    }

    const input = parsed.cs;
    if (!input.id) {
      return {
        status: false,
        code: 400,
        message: 'movies.notFound' satisfies ErrorPath
      };
    }

    const movie = await conn
      .selectFrom('movie')
      .selectAll()
      .where('id', '=', input.id)
      .executeTakeFirst();

    if (!movie) {
      return {
        status: false,
        code: 404,
        message: 'movies.notFound' satisfies ErrorPath
      };
    }

    const trx = await conn.startTransaction().execute();

    try {
      await updateTranslations(
        trx,
        {
          title: movie.title,
          review: movie.review
        },
        parsed,
        TRANSLATION_FIELDS
      );

      await trx
        .updateTable('movie')
        .set({
          type: input.type,
          release_year: input.release_year,
          rating: input.rating,
          image: input.image ?? null,
          added_at: input.added_at,
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
        message: 'movies.notFound' satisfies ErrorPath
      };
    }

    const movie = await conn
      .selectFrom('movie')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!movie) {
      return {
        status: false,
        code: 404,
        message: 'movies.notFound' satisfies ErrorPath
      };
    }

    const trx = await conn.startTransaction().execute();

    try {
      await trx.deleteFrom('movie').where('id', '=', id).execute();

      await trx
        .deleteFrom('translations')
        .where('key', 'in', [movie.title, movie.review])
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
  })
];
