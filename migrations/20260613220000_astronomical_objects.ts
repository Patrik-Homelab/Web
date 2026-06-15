/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Kysely, sql } from 'kysely';
import { v4 as uuidv4 } from 'uuid';

export const up = async (conn: Kysely<any>) => {
  // 1. Create astronomical_object table
  await conn.schema
    .createTable('astronomical_object')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('name', 'uuid', (col) => col.notNull())
    .execute();

  await conn.schema
    .alterTable('astronomical_object')
    .addForeignKeyConstraint('astronomical_object_name_fk', ['name'], 'translations', [
      'key'
    ])
    .execute();

  // 2. Add columns to article table
  await conn.schema
    .alterTable('article')
    .addColumn('object_id', 'uuid')
    .addColumn('ra', 'real')
    .addColumn('dec', 'real')
    .addColumn('fov_width', 'real')
    .addColumn('fov_height', 'real')
    .addColumn('fov_rotation', 'real')
    .execute();

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

  // 3. Seed default astronomical objects
  const defaultObjects = [
    { cs: 'Galaxie v Andromedě', en: 'Andromeda Galaxy' },
    { cs: 'Mlhovina v Orionu', en: 'Orion Nebula' },
    { cs: 'Galaxie v Trojúhelníku', en: 'Triangulum Galaxy' },
    { cs: 'Plejády', en: 'Pleiades' },
    { cs: 'Orlí mlhovina', en: 'Eagle Nebula' },
    { cs: 'Mlhovina Bublina', en: 'Bubble Nebula' },
    { cs: 'Krabí mlhovina', en: 'Crab Nebula' }
  ];

  for (const obj of defaultObjects) {
    const objectUuid = uuidv4();
    const nameTranslationUuid = uuidv4();

    // Insert translation for Czech
    await conn
      .insertInto('translations')
      .values({
        key: nameTranslationUuid,
        lang: 'cs',
        text: obj.cs
      })
      .execute();

    // Insert translation for English
    await conn
      .insertInto('translations')
      .values({
        key: nameTranslationUuid,
        lang: 'en',
        text: obj.en
      })
      .execute();

    // Insert the astronomical object referencing the name translation key
    await conn
      .insertInto('astronomical_object')
      .values({
        id: objectUuid,
        name: nameTranslationUuid
      })
      .execute();
  }
};

export const down = async (conn: Kysely<any>) => {
  // Drop foreign key constraints and tables
  await sql`ALTER TABLE article DROP FOREIGN KEY article_object_id_fk`.execute(conn);

  await conn.schema
    .alterTable('article')
    .dropColumn('object_id')
    .dropColumn('ra')
    .dropColumn('dec')
    .dropColumn('fov_width')
    .dropColumn('fov_height')
    .dropColumn('fov_rotation')
    .execute();

  // Fetch translation keys of astronomical objects to delete them from translation table
  const objects = await conn.selectFrom('astronomical_object').select('name').execute();
  const translationKeys = objects.map((obj: any) => obj.name);

  await sql`ALTER TABLE astronomical_object DROP FOREIGN KEY astronomical_object_name_fk`.execute(
    conn
  );
  await conn.schema.dropTable('astronomical_object').execute();

  if (translationKeys.length > 0) {
    await conn.deleteFrom('translations').where('key', 'in', translationKeys).execute();
  }
};
