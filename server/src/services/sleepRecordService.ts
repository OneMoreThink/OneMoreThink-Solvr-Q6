import { getDb } from '../db'
import { sleepRecords, type NewSleepRecord, type UpdateSleepRecord } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'

export const sleepRecordService = {
  // 모든 수면 기록 조회
  async getAllSleepRecords(userId: number) {
    const db = await getDb()
    return await db
      .select()
      .from(sleepRecords)
      .where(eq(sleepRecords.userId, userId))
      .orderBy(desc(sleepRecords.date))
  },

  // 특정 수면 기록 조회
  async getSleepRecordById(id: number, userId: number) {
    const db = await getDb()
    const records = await db
      .select()
      .from(sleepRecords)
      .where(and(eq(sleepRecords.id, id), eq(sleepRecords.userId, userId)))
    return records[0]
  },

  // 새로운 수면 기록 생성
  async createSleepRecord(record: NewSleepRecord) {
    // 수면시간 24시간 제한
    if (record.sleepHours > 24) {
      throw new Error('수면시간은 24시간을 초과할 수 없습니다.')
    }

    // 미래 날짜 제한
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const recordDate = new Date(record.date)
    recordDate.setHours(0, 0, 0, 0)
    if (recordDate > today) {
      throw new Error('미래 날짜는 선택할 수 없습니다.')
    }

    const db = await getDb()
    const result = await db.insert(sleepRecords).values(record).returning()
    return result[0]
  },

  // 수면 기록 수정
  async updateSleepRecord(id: number, userId: number, record: UpdateSleepRecord) {
    // 수면시간 24시간 제한
    if (record.sleepHours && record.sleepHours > 24) {
      throw new Error('수면시간은 24시간을 초과할 수 없습니다.')
    }

    // 미래 날짜 제한
    if (record.date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const recordDate = new Date(record.date)
      recordDate.setHours(0, 0, 0, 0)
      if (recordDate > today) {
        throw new Error('미래 날짜는 선택할 수 없습니다.')
      }
    }

    const db = await getDb()
    const result = await db
      .update(sleepRecords)
      .set({ ...record, updatedAt: new Date().toISOString() })
      .where(and(eq(sleepRecords.id, id), eq(sleepRecords.userId, userId)))
      .returning()
    return result[0]
  },

  // 수면 기록 삭제
  async deleteSleepRecord(id: number, userId: number) {
    const db = await getDb()
    const result = await db
      .delete(sleepRecords)
      .where(and(eq(sleepRecords.id, id), eq(sleepRecords.userId, userId)))
      .returning()
    return result[0]
  }
} 