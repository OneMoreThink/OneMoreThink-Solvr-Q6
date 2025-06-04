import { FastifyInstance } from 'fastify';
import { analyzeSleepPattern } from './controllers/aiController';

export async function createRoutes(fastify: FastifyInstance) {
  // AI 분석 엔드포인트
  fastify.post('/ai/analyze/:userId', analyzeSleepPattern);

  // 기존 라우트들...
  fastify.get('/sleep-records', async (request, reply) => {
    // ... existing code ...
  });

  fastify.get('/sleep-records/stats', async (request, reply) => {
    // ... existing code ...
  });

  fastify.post('/sleep-records', async (request, reply) => {
    // ... existing code ...
  });

  fastify.put('/sleep-records/:id', async (request, reply) => {
    // ... existing code ...
  });

  fastify.delete('/sleep-records/:id', async (request, reply) => {
    // ... existing code ...
  });
} 