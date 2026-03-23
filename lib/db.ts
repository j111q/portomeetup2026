import { sql } from '@vercel/postgres'

let initialized = false

export async function ensureSchema() {
  if (initialized) return
  initialized = true

  await sql`
    CREATE TABLE IF NOT EXISTS agenda_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      start_time TEXT NOT NULL,
      end_time TEXT DEFAULT '',
      location TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      links JSONB DEFAULT '[]'
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_by TEXT NOT NULL,
      starts_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS activity_signups (
      activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      PRIMARY KEY (activity_id, name)
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS snacks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      location TEXT DEFAULT '',
      country TEXT DEFAULT '',
      lat DOUBLE PRECISION DEFAULT 0,
      lng DOUBLE PRECISION DEFAULT 0,
      data_url TEXT DEFAULT '',
      brought_by TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
}
