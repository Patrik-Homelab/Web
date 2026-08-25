/*eslint-disable @typescript-eslint/no-explicit-any*/
import { Kysely, sql } from 'kysely';
import { v4 as uuidv4 } from 'uuid';

export const up = async (conn: Kysely<any>) => {
  // 1. Create movie table
  await conn.schema
    .createTable('movie')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('title', 'uuid', (col) => col.notNull())
    .addColumn('type', 'varchar(16)', (col) => col.notNull())
    .addColumn('release_year', 'integer', (col) => col.notNull())
    .addColumn('rating', 'decimal(2, 1)', (col) => col.notNull())
    .addColumn('review', 'uuid', (col) => col.notNull())
    .addColumn('image', 'varchar(255)')
    .addColumn('added_at', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();

  await conn.schema
    .alterTable('movie')
    .addForeignKeyConstraint('movie_title_fk', ['title'], 'translations', ['key'])
    .execute();

  await conn.schema
    .alterTable('movie')
    .addForeignKeyConstraint('movie_review_fk', ['review'], 'translations', ['key'])
    .execute();

  // 2. Seed initial movie entries
  const moviesSeed = [
    {
      title: { cs: 'Falcon a Winter Soldier', en: 'The Falcon and the Winter Soldier' },
      type: 'series',
      release_year: 2021,
      rating: 3.0,
      review: { cs: 'No comment', en: 'No comment' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'WandaVision', en: 'WandaVision' },
      type: 'series',
      release_year: 2021,
      rating: 4.5,
      review: { cs: 'No comment', en: 'No comment' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Loki', en: 'Loki' },
      type: 'series',
      release_year: 2021,
      rating: 5.0,
      review: { cs: 'Peak', en: 'Peak' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Hawkeye', en: 'Hawkeye' },
      type: 'series',
      release_year: 2021,
      rating: 4.0,
      review: {
        cs: 'Škoda že nemělo pokračování :/',
        en: "Pity it didn't have a sequel :/"
      },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Moon Knight', en: 'Moon Knight' },
      type: 'series',
      release_year: 2022,
      rating: 3.0,
      review: { cs: 'No comment', en: 'No comment' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Captain Marvel', en: 'Captain Marvel' },
      type: 'movie',
      release_year: 2019,
      rating: 4.0,
      review: { cs: 'No comment', en: 'No comment' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Ms.Marvel', en: 'Ms. Marvel' },
      type: 'series',
      release_year: 2022,
      rating: 3.0,
      review: {
        cs: 'Líbí se mi schopnosti Ms.Marvel, příběh je průměrný',
        en: "I like Ms. Marvel's abilities, the story is average"
      },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Městečko Záhad', en: 'Gravity Falls' },
      type: 'series',
      release_year: 2012,
      rating: 4.8,
      review: { cs: 'See you next summer', en: 'See you next summer' },
      added_at: '2022-09-10'
    },
    {
      title: {
        cs: 'Kouzelná Beruška a Černý kocour',
        en: 'Miraculous: Tales of Ladybug & Cat Noir'
      },
      type: 'series',
      release_year: 2015,
      rating: 4.2,
      review: { cs: 'Gabiel Agreste = Ladybug', en: 'Gabriel Agreste = Ladybug' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Star Proti silám zla', en: 'Star vs. the Forces of Evil' },
      type: 'series',
      release_year: 2015,
      rating: 4.5,
      review: {
        cs: 'Mega peak intro a celkový vibe seriálu je mega nice, škoda že finále bylo uspěchané (nesnáším tě Disney...)',
        en: 'Mega peak intro and overall vibe of the series is mega nice, pity the finale was rushed (hate you Disney...)'
      },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Milo Murphyho zákon', en: "Milo Murphy's Law" },
      type: 'series',
      release_year: 2016,
      rating: 3.8,
      review: { cs: 'No comment', en: 'No comment' },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Stranger Things', en: 'Stranger Things' },
      type: 'series',
      release_year: 2016,
      rating: 4.8,
      review: {
        cs: 'Super seriál :) libí se mi zpracování postavy, vibe atd.. škoda u poslední série, že dost věcí nedávalo hlavu a patu :/ ale když to opomenu, tak',
        en: "Super series :) I like the character development, vibe etc.. pity about the last season, that quite a few things didn't make much sense :/ but leaving that aside, so"
      },
      added_at: '2022-09-10'
    },
    {
      title: { cs: 'Wednesday', en: 'Wednesday' },
      type: 'series',
      release_year: 2022,
      rating: 4.8,
      review: { cs: 'Jenna Ortega <3', en: 'Jenna Ortega <3' },
      added_at: '2022-12-02'
    },
    {
      title: { cs: 'Soví dům', en: 'The Owl House' },
      type: 'series',
      release_year: 2020,
      rating: 4.9,
      review: {
        cs: 'Mega peak seriál <3. Poslední 3 epizody (zvláště S03E03) byly úžasné :)',
        en: 'Mega peak series <3. The last 3 episodes (especially S03E03) were amazing :)'
      },
      added_at: '2023-04-21'
    },
    {
      title: { cs: 'Anna Mezi Obojživelníky', en: 'Amphibia' },
      type: 'series',
      release_year: 2019,
      rating: 4.6,
      review: {
        cs: 'Další peak seriál, sice jsem se k dokoukání musel dokopat, ale když se člověk přežene přes nudnější epizody, tak se jedná o super seriál se super příběhem.',
        en: "Another peak series, though I had to push myself to finish it, but once you get through the slower episodes, it's a super series with a super story."
      },
      added_at: '2024-01-26'
    },
    {
      title: {
        cs: 'Můj malý pony: Přátelství je magické',
        en: 'My Little Pony: Friendship is Magic'
      },
      type: 'series',
      release_year: 2010,
      rating: 4.5,
      review: {
        cs: '9 Sérií, 221 dílů dohromady, přestože ne všechny díly byly záživné, další jeden z mých oblíbených seriálů',
        en: '9 Seasons, 221 episodes total, although not all episodes were exciting, another one of my favorite series'
      },
      added_at: '2024-03-30'
    },
    {
      title: {
        cs: 'Miraculous World: London, At the Edge of Time',
        en: 'Miraculous World: London, At the Edge of Time'
      },
      type: 'movie',
      release_year: 2024,
      rating: 4.5,
      review: {
        cs: 'Další menší filmík ze světa Kouzelné Berušky a Černého Kocoura, který navazuje na konec poslední série. Koukal jsem na to asi ve 4 ráno, takže moc objektivně nemůžu hodnotit, ale nenudil jsem se u toho, takže super 😄',
        en: "Another short movie from the Miraculous Ladybug universe following the end of the last season. Watched it at around 4 AM so I can't review it very objectively, but wasn't bored at all, so super 😄"
      },
      added_at: '2024-10-06'
    },
    {
      title: { cs: 'LoliRok', en: 'LoliRock' },
      type: 'series',
      release_year: 2014,
      rating: 4.2,
      review: {
        cs: 'Takový basic seriál podobný WinxClubu. Některé epizody jsou nudné, kde se nic moc neděje, ale většina epizod přispívá k příběhu a je zajímavá.',
        en: 'A basic series similar to Winx Club. Some episodes are boring where not much happens, but most episodes contribute to the story and are interesting.'
      },
      added_at: '2025-05-07'
    },
    {
      title: {
        cs: 'Miraculous World: Tokio - Stellar Force',
        en: 'Miraculous World: Tokyo - Stellar Force'
      },
      type: 'movie',
      release_year: 2025,
      rating: 4.9,
      review: {
        cs: 'Opět další díl ze série Berušky a Černého Kocoura, mega se mi líbí anime style kresba <3',
        en: 'Yet another installment from the Ladybug and Cat Noir series, I love the anime-style drawing <3'
      },
      added_at: '2025-12-24'
    },
    {
      title: {
        cs: 'The Amazing Digital Circus',
        en: 'The Amazing Digital Circus'
      },
      type: 'series',
      release_year: 2023,
      rating: 4.8,
      review: {
        cs: 'Super seriál se super příběhem, na to že jsem se random uprostřed dne rozhodl zkouknout první epizodu a v jednom běhu stihl zkouknout všechny (kromě poslední co ješté neexistovala), tak musím říct, že to umí vtáhnout. Dokonce jsem byl na finále v kině, takže PEAK',
        en: "Super series with a super story, considering I randomly decided to watch the first episode in the middle of the day and binge-watched all of them in one run (except the last one that didn't exist yet), I must say it really pulls you in. I even went to the cinema for the finale, so PEAK"
      },
      added_at: '2026-06-07'
    }
  ];

  for (const m of moviesSeed) {
    const titleUuid = uuidv4();
    const reviewUuid = uuidv4();

    // Insert title translations
    await conn
      .insertInto('translations')
      .values([
        { key: titleUuid, lang: 'cs', text: m.title.cs },
        { key: titleUuid, lang: 'en', text: m.title.en }
      ])
      .execute();

    // Insert review translations
    await conn
      .insertInto('translations')
      .values([
        { key: reviewUuid, lang: 'cs', text: m.review.cs },
        { key: reviewUuid, lang: 'en', text: m.review.en }
      ])
      .execute();

    // Insert movie
    await conn
      .insertInto('movie')
      .values({
        title: titleUuid,
        type: m.type,
        release_year: m.release_year,
        rating: m.rating,
        review: reviewUuid,
        image: null,
        added_at: m.added_at
      })
      .execute();
  }
};

export const down = async (conn: Kysely<any>) => {
  await sql`ALTER TABLE movie DROP FOREIGN KEY movie_title_fk`.execute(conn);
  await sql`ALTER TABLE movie DROP FOREIGN KEY movie_review_fk`.execute(conn);
  await conn.schema.dropTable('movie').execute();
};
