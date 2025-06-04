export interface SleepRecord {
  id: number
  userId: number
  date: string
  sleepHours: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface NewSleepRecord {
  date: string
  sleepHours: number
  notes?: string
}

export interface UpdateSleepRecord {
  date?: string
  sleepHours?: number
  notes?: string
} 