import { conn } from '$/lib/server/variables';
import { sql } from 'kysely';
import type { PageServerLoad } from './$types';

export const load = (async () => {
  const todayResult = await conn
    .selectFrom('visitors')
    .select(sql<number>`COUNT(DISTINCT ip)`.as('count'))
    .where('date', '>=', sql<Date>`CURDATE()`)
    .where('date', '<', sql<Date>`DATE_ADD(CURDATE(), INTERVAL 1 DAY)`)
    .executeTakeFirst();

  const weekResult = await conn
    .selectFrom('visitors')
    .select(sql<number>`COUNT(DISTINCT ip)`.as('count'))
    .where('date', '>=', sql<Date>`DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)`)
    .where('date', '<', sql<Date>`DATE_ADD(CURDATE(), INTERVAL 1 DAY)`)
    .executeTakeFirst();

  const weekGraph = await conn
    .selectFrom((eb) =>
      eb
        .selectFrom('visitors')
        .select([
          'ip',
          sql<number>`WEEK(date, 1)`.as('WEEK'),
          sql<number>`YEAR(date)`.as('YEAR')
        ])
        .groupBy([sql`WEEK(date, 1)`, sql`YEAR(date)`, 'ip'])
        .as('t')
    )
    .select(['YEAR', 'WEEK', sql<number>`COUNT(WEEK)`.as('COUNT')])
    .groupBy(['YEAR', 'WEEK'])
    .execute();

  return {
    today: Number(todayResult?.count ?? 0),
    week: Number(weekResult?.count ?? 0),
    weekGraph
  };
}) satisfies PageServerLoad;
