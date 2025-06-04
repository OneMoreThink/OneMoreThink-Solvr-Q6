import { FastifyInstance } from 'fastify'
import { sleepRecordController } from '../controllers/sleepRecordController'

export async function sleepRecordRoutes(fastify: FastifyInstance) {
  // 모든 수면 기록 조회
  fastify.get('/sleep-records', sleepRecordController.getAllSleepRecords)

  // 특정 수면 기록 조회
  fastify.get('/sleep-records/:id', sleepRecordController.getSleepRecordById)

  // 새로운 수면 기록 생성
  fastify.post('/sleep-records', sleepRecordController.createSleepRecord)

  // 수면 기록 수정
  fastify.put('/sleep-records/:id', sleepRecordController.updateSleepRecord)

  // 수면 기록 삭제
  fastify.delete('/sleep-records/:id', sleepRecordController.deleteSleepRecord)

  // 통계 엔드포인트 추가
  fastify.get('/sleep-records/stats', sleepRecordController.getStats);
} 