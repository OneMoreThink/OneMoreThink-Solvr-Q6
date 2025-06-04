import { FastifyRequest, FastifyReply } from 'fastify'
import { sleepRecordService } from '../services/sleepRecordService'
import { type NewSleepRecord, type UpdateSleepRecord } from '../db/schema'

export const sleepRecordController = {
  // 모든 수면 기록 조회
  async getAllSleepRecords(request: FastifyRequest, reply: FastifyReply) {
    try {
      // const userId = (request.user as any).id
      const userId = 1 // 임시: 인증 없이 userId를 1로 고정
      const records = await sleepRecordService.getAllSleepRecords(userId)
      return reply.send(records)
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch sleep records' })
    }
  },

  // 특정 수면 기록 조회
  async getSleepRecordById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      // const userId = (request.user as any).id
      const userId = 1 // 임시: 인증 없이 userId를 1로 고정
      const record = await sleepRecordService.getSleepRecordById(
        parseInt(request.params.id),
        userId
      )
      if (!record) {
        return reply.status(404).send({ error: 'Sleep record not found' })
      }
      return reply.send(record)
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch sleep record' })
    }
  },

  // 새로운 수면 기록 생성
  async createSleepRecord(
    request: FastifyRequest<{ Body: NewSleepRecord }>,
    reply: FastifyReply
  ) {
    try {
      // const userId = (request.user as any).id
      const userId = 1 // 임시: 인증 없이 userId를 1로 고정
      const record = await sleepRecordService.createSleepRecord({
        ...request.body,
        userId
      })
      return reply.status(201).send(record)
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Failed to create sleep record' })
    }
  },

  // 수면 기록 수정
  async updateSleepRecord(
    request: FastifyRequest<{
      Params: { id: string }
      Body: UpdateSleepRecord
    }>,
    reply: FastifyReply
  ) {
    try {
      // const userId = (request.user as any).id
      const userId = 1 // 임시: 인증 없이 userId를 1로 고정
      const record = await sleepRecordService.updateSleepRecord(
        parseInt(request.params.id),
        userId,
        request.body
      )
      if (!record) {
        return reply.status(404).send({ error: 'Sleep record not found' })
      }
      return reply.send(record)
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({ error: error.message })
      }
      return reply.status(500).send({ error: 'Failed to update sleep record' })
    }
  },

  // 수면 기록 삭제
  async deleteSleepRecord(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      // const userId = (request.user as any).id
      const userId = 1 // 임시: 인증 없이 userId를 1로 고정
      const record = await sleepRecordService.deleteSleepRecord(
        parseInt(request.params.id),
        userId
      )
      if (!record) {
        return reply.status(404).send({ error: 'Sleep record not found' })
      }
      return reply.status(204).send()
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to delete sleep record' })
    }
  }
} 