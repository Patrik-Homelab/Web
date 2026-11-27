/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Kysely, sql } from 'kysely';

export const up = async (conn: Kysely<any>) => {
  await conn.schema
    .createTable('article_object')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('article_id', 'uuid', (col) => col.notNull())
    .addColumn('object_id', 'uuid', (col) => col.notNull())
    .execute();

  await conn.schema
    .alterTable('article_object')
    .addForeignKeyConstraint(
      'article_object_article_fk',
      ['article_id'],
      'article',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .execute();

  await conn.schema
    .alterTable('article_object')
    .addForeignKeyConstraint(
      'article_object_object_fk',
      ['object_id'],
      'astronomical_object',
      ['id'],
      (cb) => cb.onDelete('cascade')
    )
    .execute();

  await conn.schema
    .alterTable('article_object')
    .addUniqueConstraint('article_object_unique', ['article_id', 'object_id'])
    .execute();

  await sql`
    INSERT IGNORE INTO article_object (article_id, object_id)
    SELECT id, object_id FROM article WHERE object_id IS NOT NULL
  `.execute(conn);

  await sql`ALTER TABLE article DROP FOREIGN KEY article_object_id_fk`.execute(conn);

  await conn.schema.alterTable('article').dropColumn('object_id').execute();
};

export const down = async (conn: Kysely<any>) => {
  await conn.schema.alterTable('article').addColumn('object_id', 'uuid').execute();

  await conn.schema
    .alterTable('article')
    .addForeignKeyConstraint(
      'article_object_id_fk',
      ['object_id'],
      'astronomical_object',
      ['id'],
      (cb) => cb.onDelete('set null')
    )
    .execute();

  await sql`
    UPDATE article a
    JOIN (
      SELECT article_id, MIN(object_id) AS object_id
      FROM article_object
      GROUP BY article_id
    ) ao ON a.id = ao.article_id
    SET a.object_id = ao.object_id
  `.execute(conn);

  await conn.schema.dropTable('article_object').execute();
};
