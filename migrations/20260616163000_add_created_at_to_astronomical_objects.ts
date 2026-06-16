/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Kysely, sql } from 'kysely';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .alterTable('astronomical_object')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
};

export const down = async (conn: Kysely<any>) => {
  await conn.schema.alterTable('astronomical_object').dropColumn('created_at').execute();
};
