import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import env from '../config/env'
import * as schema from './schema'
import { Database as DrizzleDatabase } from '../types/database'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const sqlite = new Database(env.DATABASE_URL)
export const db = drizzle(sqlite, { schema }) as DrizzleDatabase

export async function getDb(): Promise<DrizzleDatabase> {
  return db
}

export async function initializeDatabase(): Promise<DrizzleDatabase> {
  return getDb()
}

export default { initializeDatabase, getDb }
