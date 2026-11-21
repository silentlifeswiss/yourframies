import { Pool } from 'pg'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Portable PostgreSQL migration runner.
 * Reads database/schema.sql and executes it against DATABASE_URL.
 */
export async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.warn('⚠️ DATABASE_URL is not set. Skipping schema migration.')
    return
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  })

  try {
    const schemaPath = path.resolve(process.cwd(), 'database', 'schema.sql')
    const sql = fs.readFileSync(schemaPath, 'utf-8')
    console.log('🔄 Applying PostgreSQL schema migrations...')
    await pool.query(sql)
    console.log('✅ PostgreSQL schema migrations applied successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await pool.end()
  }
}
