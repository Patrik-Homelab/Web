import type { ErrorPath } from '$/lib/lang';
import type { ActionsResponse, Response } from '$/types/types';
import { createFormDataInput, type ErrorApiResponse } from '@patrick115/sveltekitapi';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { loggedProcedure } from '../api';
import { conn } from '../variables';

const equipmentSchema = z.object({
  name: z.string().min(1, 'equipment.form.name'),
  type: z.string().min(1, 'equipment.form.type'),
  link: z.url('equipment.form.link'),
  focal_length: z.coerce.number().nullable().optional(),
  aperture: z.coerce.number().nullable().optional(),
  pixel_size: z.coerce.number().nullable().optional(),
  sensor_width: z.coerce.number().int().nullable().optional(),
  sensor_height: z.coerce.number().int().nullable().optional()
});

export default [
  loggedProcedure.POST.input(createFormDataInput(equipmentSchema)).query(
    async ({ input }) => {
      const name = input.get('name') as string;
      const type = input.get('type') as string;
      const link = input.get('link') as string;

      const focalLengthVal = input.get('focal_length');
      const focal_length =
        focalLengthVal !== null && focalLengthVal !== undefined && focalLengthVal !== ''
          ? Number(focalLengthVal)
          : null;

      const apertureVal = input.get('aperture');
      const aperture =
        apertureVal !== null && apertureVal !== undefined && apertureVal !== ''
          ? Number(apertureVal)
          : null;

      const pixelSizeVal = input.get('pixel_size');
      const pixel_size =
        pixelSizeVal !== null && pixelSizeVal !== undefined && pixelSizeVal !== ''
          ? Number(pixelSizeVal)
          : null;

      const sensorWidthVal = input.get('sensor_width');
      const sensor_width =
        sensorWidthVal !== null && sensorWidthVal !== undefined && sensorWidthVal !== ''
          ? Number(sensorWidthVal)
          : null;

      const sensorHeightVal = input.get('sensor_height');
      const sensor_height =
        sensorHeightVal !== null &&
        sensorHeightVal !== undefined &&
        sensorHeightVal !== ''
          ? Number(sensorHeightVal)
          : null;

      if (!name || !type || !link || isNaN(Number(type))) {
        return fail(400, {
          status: false,
          message: 'equipment.form' satisfies ErrorPath
        } satisfies ActionsResponse);
      }

      try {
        const equipmentType = await conn
          .selectFrom('equipment_type')
          .select('id')
          .where('id', '=', Number(type))
          .executeTakeFirst();
        if (!equipmentType) {
          return fail(400, {
            status: false,
            message: 'equipment.form' satisfies ErrorPath
          } satisfies ActionsResponse);
        }

        await conn
          .insertInto('equipment')
          .values({
            name,
            type_id: Number(type),
            link,
            focal_length,
            aperture,
            pixel_size,
            sensor_width,
            sensor_height
          })
          .executeTakeFirst();

        return {
          status: true
        } satisfies Response;
      } catch (err) {
        console.error(err);
        return fail(500, {
          status: false,
          message: 'internal' satisfies ErrorPath
        } satisfies ActionsResponse);
      }
    }
  ),
  loggedProcedure.PATCH.input(createFormDataInput(equipmentSchema.partial())).query(
    async ({ input }) => {
      const id = input.get('id') as string | null;
      const name = input.get('name') as string | null;
      const type = input.get('type') as string | null;
      const link = input.get('link') as string | null;

      const focalLengthVal = input.get('focal_length');
      const focal_length =
        focalLengthVal !== null && focalLengthVal !== undefined && focalLengthVal !== ''
          ? Number(focalLengthVal)
          : null;

      const apertureVal = input.get('aperture');
      const aperture =
        apertureVal !== null && apertureVal !== undefined && apertureVal !== ''
          ? Number(apertureVal)
          : null;

      const pixelSizeVal = input.get('pixel_size');
      const pixel_size =
        pixelSizeVal !== null && pixelSizeVal !== undefined && pixelSizeVal !== ''
          ? Number(pixelSizeVal)
          : null;

      const sensorWidthVal = input.get('sensor_width');
      const sensor_width =
        sensorWidthVal !== null && sensorWidthVal !== undefined && sensorWidthVal !== ''
          ? Number(sensorWidthVal)
          : null;

      const sensorHeightVal = input.get('sensor_height');
      const sensor_height =
        sensorHeightVal !== null &&
        sensorHeightVal !== undefined &&
        sensorHeightVal !== ''
          ? Number(sensorHeightVal)
          : null;

      if (!id || isNaN(Number(id))) {
        return fail(401, {
          status: false,
          message: 'internal' satisfies ErrorPath
        } satisfies ActionsResponse);
      }

      if (!name || !type || !link || isNaN(Number(type))) {
        return fail(401, {
          status: false,
          message: 'equipment.form' satisfies ErrorPath
        } satisfies ActionsResponse);
      }

      try {
        const equipmentType = await conn
          .selectFrom('equipment_type')
          .select('id')
          .where('id', '=', Number(type))
          .executeTakeFirst();
        if (!equipmentType) {
          return fail(400, {
            status: false,
            message: 'equipment.form' satisfies ErrorPath
          } satisfies ActionsResponse);
        }

        await conn
          .updateTable('equipment')
          .set({
            name,
            type_id: Number(type),
            link,
            focal_length,
            aperture,
            pixel_size,
            sensor_width,
            sensor_height
          })
          .where('id', '=', Number(id))
          .executeTakeFirst();

        return {
          status: true
        } satisfies Response;
      } catch (err) {
        console.error(err);
        return fail(500, {
          status: false,
          message: 'internal' satisfies ErrorPath
        } satisfies ActionsResponse);
      }
    }
  ),
  loggedProcedure.DELETE.input(z.number()).query(async ({ input }) => {
    if (!input || isNaN(Number(input))) {
      return {
        status: false,
        code: 400,
        message: 'internal' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }

    try {
      await conn
        .deleteFrom('equipment')
        .where('id', '=', Number(input))
        .executeTakeFirst();

      return {
        status: true
      } satisfies Response;
    } catch (err) {
      console.error(err);
      return {
        status: false,
        code: 500,
        message: 'internal' satisfies ErrorPath
      } satisfies ErrorApiResponse;
    }
  })
];
