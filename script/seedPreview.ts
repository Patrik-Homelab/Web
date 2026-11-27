/* eslint-disable no-console */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import sharp from 'sharp';

dotenv.config();

const SAMPLE_IMAGE_PATH = path.resolve(
  import.meta.dirname,
  './seed-assets/sample-astro.jpg'
);

interface LocalizedText {
  cs: string;
  en: string;
}

interface SeedArticle {
  object: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  contentMd: LocalizedText;
  ra: number;
  dec: number;
  fovWidth: number;
  fovHeight: number;
  fovRotation: number;
  exposures: Array<{
    type: 'light' | 'dark' | 'flat';
    count: number;
    exposureTimeS: number;
  }>;
  imageVariants: Array<{
    alt: LocalizedText;
    extract?: { left: number; top: number; width: number; height: number };
    modulate?: { hue?: number; saturation?: number; brightness?: number };
  }>;
}

const ARTICLES: SeedArticle[] = [
  {
    object: { cs: 'IC 1396 (Sloní chobot)', en: "IC 1396 (Elephant's Trunk Nebula)" },
    title: {
      cs: 'Mlhovina Sloní chobot v Cepheu',
      en: "Elephant's Trunk Nebula in Cepheus"
    },
    description: {
      cs: 'Ukázkový snímek emisní mlhoviny IC 1396 v souhvězdí Cefea.',
      en: 'Sample wide-field capture of emission nebula IC 1396 in Cepheus.'
    },
    contentMd: {
      cs: 'Ukázkový článek vygenerovaný pro preview prostředí. Snímek zachycuje ionizovaný plyn a prachové sloupy v oblasti **IC 1396**.',
      en: 'Sample preview article. This capture highlights ionized hydrogen and dark dust pillars inside **IC 1396**.'
    },
    ra: 324.75,
    dec: 57.5,
    fovWidth: 2.8,
    fovHeight: 1.6,
    fovRotation: 12.0,
    exposures: [
      { type: 'light', count: 60, exposureTimeS: 180 },
      { type: 'dark', count: 20, exposureTimeS: 180 }
    ],
    imageVariants: [
      {
        alt: { cs: 'IC 1396 širokoúhlý snímek', en: 'IC 1396 wide-field view' }
      },
      {
        alt: { cs: 'IC 1396 detail jádra', en: 'IC 1396 core crop' },
        extract: { left: 220, top: 100, width: 580, height: 340 }
      }
    ]
  },
  {
    object: { cs: 'M31 (Galaxie v Andromedě)', en: 'M31 (Andromeda Galaxy)' },
    title: {
      cs: 'Galaxie v Andromedě (M31)',
      en: 'Andromeda Galaxy (M31)'
    },
    description: {
      cs: 'Ukázkový článek pro testování galerie a mapy oblohy.',
      en: 'Sample article for testing gallery cards and the sky map.'
    },
    contentMd: {
      cs: 'Testovací článek pro **M31** s ukázkovými expozičními daty a vybavením.',
      en: 'Test preview entry for **M31** with sample exposure logs and equipment.'
    },
    ra: 10.6847,
    dec: 41.2687,
    fovWidth: 3.1,
    fovHeight: 2.0,
    fovRotation: 45.0,
    exposures: [
      { type: 'light', count: 90, exposureTimeS: 120 },
      { type: 'flat', count: 30, exposureTimeS: 2 }
    ],
    imageVariants: [
      {
        alt: { cs: 'M31 ukázkový snímek', en: 'M31 sample view' },
        modulate: { hue: 210, saturation: 1.15, brightness: 1.05 }
      }
    ]
  },
  {
    object: { cs: 'M42 (Velká mlhovina v Orionu)', en: 'M42 (Orion Nebula)' },
    title: {
      cs: 'Velká mlhovina v Orionu (M42)',
      en: 'Great Orion Nebula (M42)'
    },
    description: {
      cs: 'Zimní klasika v souhvězdí Oriona — ukázkový záznam.',
      en: 'Winter classic in Orion — sample preview entry.'
    },
    contentMd: {
      cs: 'Krátký popis pro ukázkový snímek **M42** v preview databázi.',
      en: 'Short description for the **M42** sample entry in the preview database.'
    },
    ra: 83.8221,
    dec: -5.3911,
    fovWidth: 2.1,
    fovHeight: 1.4,
    fovRotation: 88.0,
    exposures: [{ type: 'light', count: 120, exposureTimeS: 60 }],
    imageVariants: [
      {
        alt: { cs: 'M42 ukázkový snímek', en: 'M42 sample view' },
        modulate: { hue: 300, saturation: 1.2, brightness: 1.08 }
      }
    ]
  },
  {
    object: { cs: 'NGC 7000 (Severní Amerika)', en: 'NGC 7000 (North America Nebula)' },
    title: {
      cs: 'Mlhovina Severní Amerika v Labuti',
      en: 'North America Nebula in Cygnus'
    },
    description: {
      cs: 'Emisní mlhovina NGC 7000 poblíž hvězdy Deneb.',
      en: 'Emission nebula NGC 7000 near Deneb in Cygnus.'
    },
    contentMd: {
      cs: 'Ukázkový obsah článku pro **NGC 7000**.',
      en: 'Sample article body for **NGC 7000**.'
    },
    ra: 314.75,
    dec: 44.33,
    fovWidth: 3.4,
    fovHeight: 2.2,
    fovRotation: 0,
    exposures: [{ type: 'light', count: 45, exposureTimeS: 240 }],
    imageVariants: [
      {
        alt: { cs: 'NGC 7000 ukázkový snímek', en: 'NGC 7000 sample view' },
        modulate: { hue: 35, saturation: 1.1, brightness: 0.95 }
      }
    ]
  }
];

async function addTranslation(
  conn: mysql.Connection,
  text: LocalizedText
): Promise<string> {
  const key = crypto.randomUUID();
  await conn.query(
    'INSERT INTO translations (`key`, lang, text) VALUES (?, ?, ?), (?, ?, ?)',
    [key, 'cs', text.cs, key, 'en', text.en]
  );
  return key;
}

async function createImageVariant(
  fileFolder: string,
  variant: SeedArticle['imageVariants'][number]
): Promise<string> {
  const filename = `${crypto.randomBytes(16).toString('hex')}.jpg`;
  const destPath = path.join(fileFolder, filename);

  let pipeline = sharp(SAMPLE_IMAGE_PATH);
  if (variant.extract) {
    pipeline = pipeline.extract(variant.extract);
  }
  if (variant.modulate) {
    pipeline = pipeline.modulate(variant.modulate);
  }
  await pipeline.jpeg({ quality: 88 }).toFile(destPath);
  return filename;
}

async function seed() {
  const conn = await mysql.createConnection({
    host: process.env.DATABASE_IP || '127.0.0.1',
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  try {
    const [existing] = await conn.query<mysql.RowDataPacket[]>(
      'SELECT COUNT(*) AS cnt FROM article'
    );
    if (existing[0].cnt > 0) {
      console.log('Preview seed already applied (articles exist), skipping.');
      return;
    }

    const fileFolder = process.env.FILE_FOLDER || './uploads';
    await fs.mkdir(fileFolder, { recursive: true });

    const [articleObjectTables] = await conn.query<mysql.RowDataPacket[]>(
      "SHOW TABLES LIKE 'article_object'"
    );
    const usesMultiObjectTable = articleObjectTables.length > 0;

    // Ensure sample equipment exists
    const [eqTypes] = await conn.query<mysql.RowDataPacket[]>(
      'SELECT id, lang_key FROM equipment_type ORDER BY priority DESC'
    );
    const equipmentIds: number[] = [];
    if (eqTypes.length > 0) {
      const telescopeType =
        eqTypes.find((t) => String(t.lang_key).includes('telescope'))?.id ??
        eqTypes[0].id;
      const cameraType =
        eqTypes.find((t) => String(t.lang_key).includes('camera'))?.id ?? eqTypes[0].id;

      const [res1] = await conn.query<mysql.ResultSetHeader>(
        'INSERT INTO equipment (type_id, name, link, focal_length, aperture) VALUES (?, ?, ?, ?, ?)',
        [
          telescopeType,
          'William Optics RedCat 51 WIFD',
          'https://williamoptics.com',
          250,
          51
        ]
      );
      const [res2] = await conn.query<mysql.ResultSetHeader>(
        'INSERT INTO equipment (type_id, name, link, pixel_size, sensor_width, sensor_height) VALUES (?, ?, ?, ?, ?, ?)',
        [
          cameraType,
          'ZWO ASI2600MC Pro',
          'https://astronomy-imaging-camera.com',
          3.76,
          23.5,
          15.7
        ]
      );
      equipmentIds.push(res1.insertId, res2.insertId);
    }

    // Seed gallery articles, astronomical objects, exposures, and image variants
    for (const item of ARTICLES) {
      const objectId = crypto.randomUUID();
      const objectNameKey = await addTranslation(conn, item.object);
      await conn.query('INSERT INTO astronomical_object (id, name) VALUES (?, ?)', [
        objectId,
        objectNameKey
      ]);

      const articleId = crypto.randomUUID();
      const titleKey = await addTranslation(conn, item.title);
      const descKey = await addTranslation(conn, item.description);
      const contentKey = await addTranslation(conn, item.contentMd);

      if (usesMultiObjectTable) {
        await conn.query(
          'INSERT INTO article (id, title, description, content_md, ra, `dec`, fov_width, fov_height, fov_rotation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            articleId,
            titleKey,
            descKey,
            contentKey,
            item.ra,
            item.dec,
            item.fovWidth,
            item.fovHeight,
            item.fovRotation
          ]
        );
        await conn.query(
          'INSERT INTO article_object (article_id, object_id) VALUES (?, ?)',
          [articleId, objectId]
        );
      } else {
        await conn.query(
          'INSERT INTO article (id, title, description, content_md, object_id, ra, `dec`, fov_width, fov_height, fov_rotation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            articleId,
            titleKey,
            descKey,
            contentKey,
            objectId,
            item.ra,
            item.dec,
            item.fovWidth,
            item.fovHeight,
            item.fovRotation
          ]
        );
      }

      for (const eqId of equipmentIds) {
        await conn.query(
          'INSERT INTO article_equipment (article_id, equipment_id) VALUES (?, ?)',
          [articleId, eqId]
        );
      }

      for (const exp of item.exposures) {
        await conn.query(
          'INSERT INTO exposure (article_id, date, type, count, exposure_time_s) VALUES (?, ?, ?, ?, ?)',
          [articleId, '2026-09-15', exp.type, exp.count, exp.exposureTimeS]
        );
      }

      for (const variant of item.imageVariants) {
        const filename = await createImageVariant(fileFolder, variant);
        const altKey = await addTranslation(conn, variant.alt);
        await conn.query(
          'INSERT INTO gallery_image (name, article_id, alt_text) VALUES (?, ?, ?)',
          [filename, articleId, altKey]
        );
      }
    }

    // Seed sample projects
    const projectPreview = await createImageVariant(fileFolder, {
      alt: { cs: 'Ukázkový projekt', en: 'Sample project' }
    });
    const projNameKey = await addTranslation(conn, {
      cs: 'Preview-Deployer',
      en: 'Preview-Deployer'
    });
    const projDescKey = await addTranslation(conn, {
      cs: 'Izolovaná PR preview prostředí na Proxmox LXC.',
      en: 'Isolated PR preview environments on Proxmox LXC.'
    });
    await conn.query(
      'INSERT INTO project (uuid, name, description, date, preview, images, tags, hidden) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        crypto.randomUUID(),
        projNameKey,
        projDescKey,
        '2026-11-27',
        projectPreview,
        JSON.stringify([projectPreview]),
        JSON.stringify(['SvelteKit', 'TypeScript', 'Linux']),
        0
      ]
    );

    // Seed sample movie
    const movieTitleKey = await addTranslation(conn, {
      cs: 'Interstellar',
      en: 'Interstellar'
    });
    const movieReviewKey = await addTranslation(conn, {
      cs: 'Ukázková recenze pro preview prostředí.',
      en: 'Sample review for the preview environment.'
    });
    await conn.query(
      'INSERT INTO movie (title, type, release_year, rating, review, added_at) VALUES (?, ?, ?, ?, ?, ?)',
      [movieTitleKey, 'movie', 2014, '5.0', movieReviewKey, '2026-11-27']
    );

    console.log(
      `Preview seed applied: ${ARTICLES.length} gallery articles, 1 project, 1 movie.`
    );
  } finally {
    await conn.end();
  }
}

seed().catch((err) => {
  console.error('Preview seed failed:', err);
  process.exit(1);
});
