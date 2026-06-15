/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Kysely } from 'kysely';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .alterTable('equipment')
    .addColumn('focal_length', 'real')
    .addColumn('aperture', 'real')
    .addColumn('pixel_size', 'real')
    .addColumn('sensor_width', 'integer')
    .addColumn('sensor_height', 'integer')
    .execute();
};

export const down = async (conn: Kysely<any>) => {
  await conn.schema
    .alterTable('equipment')
    .dropColumn('focal_length')
    .dropColumn('aperture')
    .dropColumn('pixel_size')
    .dropColumn('sensor_width')
    .dropColumn('sensor_height')
    .execute();
};
