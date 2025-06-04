import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db';
import { sleepRecords } from '../db/schema';
import { sql } from 'drizzle-orm';
import { differenceInHours, parseISO } from 'date-fns';

export async function getSleepStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    // Get average sleep duration and quality for the last 30 days
    const stats = await db
      .select({
        avgDuration: sql<number>`AVG(
          (strftime('%s', ${sleepRecords.endTime}) - strftime('%s', ${sleepRecords.startTime})) / 3600.0
        )`,
        avgQuality: sql<number>`AVG(${sleepRecords.quality})`,
        totalRecords: sql<number>`COUNT(*)`,
      })
      .from(sleepRecords)
      .where(
        sql`${sleepRecords.createdAt} >= datetime('now', '-30 days')`
      );

    // Get sleep quality distribution
    const qualityDistribution = await db
      .select({
        quality: sleepRecords.quality,
        count: sql<number>`COUNT(*)`,
      })
      .from(sleepRecords)
      .groupBy(sleepRecords.quality)
      .orderBy(sleepRecords.quality);

    // Get sleep duration trend
    const durationTrend = await db
      .select({
        date: sql<string>`date(${sleepRecords.startTime})`,
        avgDuration: sql<number>`AVG(
          (strftime('%s', ${sleepRecords.endTime}) - strftime('%s', ${sleepRecords.startTime})) / 3600.0
        )`,
      })
      .from(sleepRecords)
      .groupBy(sql`date(${sleepRecords.startTime})`)
      .orderBy(sql`date(${sleepRecords.startTime}) DESC`)
      .limit(7);

    return reply.send({
      stats: stats[0],
      qualityDistribution,
      durationTrend,
    });
  } catch (error) {
    console.error('Error fetching sleep stats:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
} 