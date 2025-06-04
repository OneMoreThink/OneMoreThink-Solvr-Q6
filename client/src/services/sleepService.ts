import { API_BASE_URL } from '../config';

export interface SleepStats {
  totalRecords: number;
  averageSleepHours: number;
  last7Days: {
    date: string;
    sleepHours: number;
  }[];
}

export async function getSleepStats(): Promise<SleepStats> {
  const response = await fetch(`${API_BASE_URL}/sleep-records/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch sleep statistics');
  }
  return response.json();
} 