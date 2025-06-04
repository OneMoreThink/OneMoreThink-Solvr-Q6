import axios from 'axios'
import { type SleepRecord, type NewSleepRecord, type UpdateSleepRecord } from '../types/sleepRecord'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const sleepRecordService = {
  // 모든 수면 기록 조회
  async getAllSleepRecords(): Promise<SleepRecord[]> {
    const response = await axios.get(`${API_URL}/api/sleep-records`)
    return response.data
  },

  // 특정 수면 기록 조회
  async getSleepRecordById(id: number): Promise<SleepRecord> {
    const response = await axios.get(`${API_URL}/api/sleep-records/${id}`)
    return response.data
  },

  // 새로운 수면 기록 생성
  async createSleepRecord(record: NewSleepRecord): Promise<SleepRecord> {
    const response = await axios.post(`${API_URL}/api/sleep-records`, record)
    return response.data
  },

  // 수면 기록 수정
  async updateSleepRecord(id: number, record: UpdateSleepRecord): Promise<SleepRecord> {
    const response = await axios.put(`${API_URL}/api/sleep-records/${id}`, record)
    return response.data
  },

  // 수면 기록 삭제
  async deleteSleepRecord(id: number): Promise<void> {
    await axios.delete(`${API_URL}/api/sleep-records/${id}`)
  }
} 