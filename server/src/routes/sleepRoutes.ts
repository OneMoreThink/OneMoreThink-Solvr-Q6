import { FastifyInstance } from 'fastify';
import { getSleepStats } from '../controllers/sleepController';

export default async function sleepRoutes(fastify: FastifyInstance) {
  // ... existing routes ...

  fastify.get('/sleep-records/stats', getSleepStats);
} 