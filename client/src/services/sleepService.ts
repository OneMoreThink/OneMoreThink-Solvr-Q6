import { API_BASE_URL } from '../config';
import axios from 'axios';

export interface SleepStats {
  totalRecords: number;
  averageSleepHours: number;
  last7Days: {
    date: string;
    sleepHours: number;
  }[];
}

const API_URL = 'http://localhost:3000/api';

export const sleepService = {
  async getSleepStats(): Promise<SleepStats> {
    try {
      const response = await axios.get(`${API_URL}/sleep-records/stats`);
      return response.data;
    } catch (error) {
      console.error('수면 통계 요청 중 오류 발생:', error);
      throw error;
    }
  },

  async getSleepAnalysis() {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze/1`); // 임시로 userId 1 사용
      return response.data;
    } catch (error) {
      console.error('수면 분석 요청 중 오류 발생:', error);
      throw error;
    }
  }
}; 