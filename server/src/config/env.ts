import { config } from 'dotenv-safe'

config()

// 환경 변수 타입 정의
interface Env {
  PORT: number
  HOST: string
  NODE_ENV: 'development' | 'production' | 'test'
  DATABASE_URL: string
  CORS_ORIGIN: string
  LOG_LEVEL: string
}

// 환경 변수 기본값 설정
const env: Env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite.db',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
}

export default env
