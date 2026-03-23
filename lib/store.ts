import { sql } from '@vercel/postgres'
import { v4 as uuid } from 'uuid'
import { ensureSchema } from './db'

// ── Types (unchanged) ──

export interface AgendaLink {
  label: string
  url: string
}

export interface AgendaItem {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  sortOrder: number
  links?: AgendaLink[]
}

export interface Activity {
  id: string
  title: string
  description: string
  createdBy: string
  startsAt: string
  createdAt: string
  signups: string[]
}

export interface Snack {
  id: string
  name: string
  description: string
  location: string
  country: string
  lat: number
  lng: number
  dataUrl: string
  broughtBy: string
  createdAt: string
}

// ── Seed data ──

const sessionLinks: AgendaLink[] = [{ label: '📄 Link to presentation', url: '#' }, { label: '📝 Shared Google Doc for audience notes', url: '#' }]

const SEED_AGENDA: Omit<AgendaItem, 'id'>[] = [
  { title: '✈️ Arrival Day', description: '', startTime: '2026-03-22T09:00+00:00', endTime: '2026-03-22T20:00+00:00', location: '', sortOrder: 0 },
  { title: '🥂 Welcome Reception', description: '', startTime: '2026-03-22T20:30+00:00', endTime: '2026-03-22T22:00+00:00', location: 'Lobby Bar, Boeira Hotel', sortOrder: 1 },
  { title: '🥐 Breakfast / Flex Time', description: '', startTime: '2026-03-23T09:00+00:00', endTime: '2026-03-23T11:00+00:00', location: '', sortOrder: 2 },
  { title: '👋 Intro Session', description: '', startTime: '2026-03-23T11:00+00:00', endTime: '2026-03-23T14:00+00:00', location: '', sortOrder: 3, links: sessionLinks },
  { title: '🍽️ Lunch Break', description: '', startTime: '2026-03-23T14:00+00:00', endTime: '2026-03-23T15:30+00:00', location: '', sortOrder: 4 },
  { title: '🤖 AI Atelier \u2013 Set Up', description: '', startTime: '2026-03-23T15:30+00:00', endTime: '2026-03-23T16:00+00:00', location: '', sortOrder: 5, links: [{ label: '📄 Setup guide', url: '#' }] },
  { title: '☕ Break', description: '', startTime: '2026-03-23T16:00+00:00', endTime: '2026-03-23T16:30+00:00', location: '', sortOrder: 6 },
  { title: '🤖 AI Atelier \u2013 Foundations', description: '', startTime: '2026-03-23T16:30+00:00', endTime: '2026-03-23T18:30+00:00', location: '', sortOrder: 7, links: sessionLinks },
  { title: '🌇 Flex Time', description: '', startTime: '2026-03-23T18:30+00:00', endTime: '2026-03-23T19:30+00:00', location: '', sortOrder: 8 },
  { title: '🍷 Dinner', description: '', startTime: '2026-03-23T19:30+00:00', endTime: '2026-03-23T22:00+00:00', location: 'Canopy, Boeira Hotel', sortOrder: 9 },
  { title: '🥐 Breakfast / Flex Time', description: '', startTime: '2026-03-24T09:00+00:00', endTime: '2026-03-24T11:00+00:00', location: '', sortOrder: 10 },
  { title: '🔬 Research Training', description: '', startTime: '2026-03-24T11:00+00:00', endTime: '2026-03-24T14:00+00:00', location: '', sortOrder: 11, links: sessionLinks },
  { title: '🍽️ Lunch Break', description: '', startTime: '2026-03-24T14:00+00:00', endTime: '2026-03-24T15:30+00:00', location: '', sortOrder: 12 },
  { title: '🤖 AI Atelier \u2013 MCPs, Context A8', description: '', startTime: '2026-03-24T15:30+00:00', endTime: '2026-03-24T16:00+00:00', location: '', sortOrder: 13, links: sessionLinks },
  { title: '☕ Break', description: '', startTime: '2026-03-24T16:00+00:00', endTime: '2026-03-24T16:30+00:00', location: '', sortOrder: 14 },
  { title: '🤖 AI Atelier \u2013 Break Out Session', description: '', startTime: '2026-03-24T16:30+00:00', endTime: '2026-03-24T18:30+00:00', location: '', sortOrder: 15, links: [{ label: '📝 Shared Google Doc for audience notes', url: '#' }] },
  { title: '🌇 Flex Time', description: '', startTime: '2026-03-24T18:30+00:00', endTime: '2026-03-24T19:30+00:00', location: '', sortOrder: 16 },
  { title: '🚌 Transfer', description: '', startTime: '2026-03-24T19:30+00:00', endTime: '2026-03-24T20:00+00:00', location: '', sortOrder: 17 },
  { title: '🍷 Dinner', description: '', startTime: '2026-03-24T20:00+00:00', endTime: '2026-03-24T22:00+00:00', location: 'T&C Restaurant', sortOrder: 18 },
  { title: '🥐 Breakfast', description: '', startTime: '2026-03-25T09:00+00:00', endTime: '2026-03-25T10:00+00:00', location: '', sortOrder: 19 },
  { title: '🧪 AI Atelier \u2013 Experimenting', description: '', startTime: '2026-03-25T10:00+00:00', endTime: '2026-03-25T11:00+00:00', location: '', sortOrder: 20, links: [{ label: '📝 Shared Google Doc for audience notes', url: '#' }] },
  { title: '☕ Break', description: '', startTime: '2026-03-25T11:00+00:00', endTime: '2026-03-25T11:30+00:00', location: '', sortOrder: 21 },
  { title: '🧪 AI Atelier \u2013 Experimenting', description: '', startTime: '2026-03-25T11:30+00:00', endTime: '2026-03-25T14:00+00:00', location: '', sortOrder: 22, links: [{ label: '📝 Shared Google Doc for audience notes', url: '#' }] },
  { title: '🍽️ Lunch Break', description: '', startTime: '2026-03-25T14:00+00:00', endTime: '2026-03-25T15:00+00:00', location: '', sortOrder: 23 },
  { title: '📸 Group Photo & Transfer', description: '', startTime: '2026-03-25T15:00+00:00', endTime: '2026-03-25T15:30+00:00', location: '', sortOrder: 24 },
  { title: '🏛️ Visit at Serralves Foundation', description: '', startTime: '2026-03-25T15:30+00:00', endTime: '2026-03-25T18:30+00:00', location: 'Serralves Foundation', sortOrder: 25 },
  { title: '🌇 Flex Time', description: '', startTime: '2026-03-25T18:30+00:00', endTime: '2026-03-25T20:00+00:00', location: '', sortOrder: 26 },
  { title: '🍷 Dinner', description: '', startTime: '2026-03-25T20:00+00:00', endTime: '2026-03-25T22:00+00:00', location: 'Raizes Restaurant, Boeira Hotel', sortOrder: 27 },
  { title: '🥐 Breakfast / Flex Time', description: '', startTime: '2026-03-26T09:00+00:00', endTime: '2026-03-26T11:00+00:00', location: '', sortOrder: 28 },
  { title: '🎬 AI Atelier \u2013 Playback', description: '', startTime: '2026-03-26T11:00+00:00', endTime: '2026-03-26T14:00+00:00', location: '', sortOrder: 29, links: sessionLinks },
  { title: '🍽️ Lunch Break', description: '', startTime: '2026-03-26T14:00+00:00', endTime: '2026-03-26T15:30+00:00', location: '', sortOrder: 30 },
  { title: '⚡ Flash Talks', description: '', startTime: '2026-03-26T15:30+00:00', endTime: '2026-03-26T16:00+00:00', location: '', sortOrder: 31, links: sessionLinks },
  { title: '☕ Break', description: '', startTime: '2026-03-26T16:00+00:00', endTime: '2026-03-26T16:30+00:00', location: '', sortOrder: 32 },
  { title: '🎤 DC Talk / Wrap Up', description: '', startTime: '2026-03-26T16:30+00:00', endTime: '2026-03-26T18:30+00:00', location: '', sortOrder: 33, links: sessionLinks },
  { title: '🌇 Flex Time', description: '', startTime: '2026-03-26T18:30+00:00', endTime: '2026-03-26T19:30+00:00', location: '', sortOrder: 34 },
  { title: '🚌 Transfer', description: '', startTime: '2026-03-26T19:30+00:00', endTime: '2026-03-26T20:00+00:00', location: '', sortOrder: 35 },
  { title: '🍷 Dinner', description: '', startTime: '2026-03-26T20:00+00:00', endTime: '2026-03-26T22:00+00:00', location: 'Bras\u00e3o Coliseu', sortOrder: 36 },
  { title: '🥐 Breakfast', description: '', startTime: '2026-03-27T09:00+00:00', endTime: '2026-03-27T11:00+00:00', location: '', sortOrder: 37 },
  { title: '👋 Departure Day / Free Time', description: '', startTime: '2026-03-27T11:00+00:00', endTime: '2026-03-27T18:00+00:00', location: '', sortOrder: 38 },
]

async function seedAgendaIfEmpty() {
  const { rows } = await sql`SELECT COUNT(*) as count FROM agenda_items`
  if (parseInt(rows[0].count) > 0) return

  for (const item of SEED_AGENDA) {
    await sql`
      INSERT INTO agenda_items (id, title, description, start_time, end_time, location, sort_order, links)
      VALUES (${uuid()}, ${item.title}, ${item.description}, ${item.startTime}, ${item.endTime}, ${item.location}, ${item.sortOrder}, ${JSON.stringify(item.links || [])})
    `
  }
}

// ── Agenda ──

export async function getAgenda(): Promise<AgendaItem[]> {
  await ensureSchema()
  await seedAgendaIfEmpty()
  const { rows } = await sql`SELECT * FROM agenda_items ORDER BY sort_order`
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    startTime: r.start_time,
    endTime: r.end_time,
    location: r.location,
    sortOrder: r.sort_order,
    links: r.links || [],
  }))
}

// ── Activities ──

export async function getActivities(): Promise<Activity[]> {
  await ensureSchema()
  const { rows: actRows } = await sql`SELECT * FROM activities ORDER BY created_at DESC`
  const { rows: signupRows } = await sql`SELECT * FROM activity_signups`

  const signupMap: Record<string, string[]> = {}
  for (const s of signupRows) {
    if (!signupMap[s.activity_id]) signupMap[s.activity_id] = []
    signupMap[s.activity_id].push(s.name)
  }

  return actRows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    createdBy: r.created_by,
    startsAt: r.starts_at,
    createdAt: r.created_at,
    signups: signupMap[r.id] || [],
  }))
}

export async function addActivity(
  activity: Pick<Activity, 'title' | 'description' | 'createdBy' | 'startsAt'>
): Promise<Activity> {
  await ensureSchema()
  const id = uuid()
  const createdAt = new Date().toISOString()

  await sql`
    INSERT INTO activities (id, title, description, created_by, starts_at, created_at)
    VALUES (${id}, ${activity.title}, ${activity.description}, ${activity.createdBy}, ${activity.startsAt}, ${createdAt})
  `
  await sql`
    INSERT INTO activity_signups (activity_id, name) VALUES (${id}, ${activity.createdBy})
  `

  return {
    ...activity,
    id,
    createdAt,
    signups: [activity.createdBy],
  }
}

export async function joinActivity(id: string, name: string): Promise<Activity | null> {
  await ensureSchema()
  await sql`
    INSERT INTO activity_signups (activity_id, name) VALUES (${id}, ${name})
    ON CONFLICT DO NOTHING
  `
  const activities = await getActivities()
  return activities.find((a) => a.id === id) || null
}

export async function leaveActivity(id: string, name: string): Promise<Activity | null> {
  await ensureSchema()
  await sql`DELETE FROM activity_signups WHERE activity_id = ${id} AND name = ${name}`
  const activities = await getActivities()
  return activities.find((a) => a.id === id) || null
}

export async function deleteActivity(id: string): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await sql`DELETE FROM activities WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}

// ── Snacks ──

export async function getSnacks(): Promise<Snack[]> {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM snacks ORDER BY created_at DESC`
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    location: r.location,
    country: r.country,
    lat: r.lat,
    lng: r.lng,
    dataUrl: r.data_url,
    broughtBy: r.brought_by,
    createdAt: r.created_at,
  }))
}

export async function addSnack(snack: Omit<Snack, 'id' | 'createdAt'>): Promise<Snack> {
  await ensureSchema()
  const id = uuid()
  const createdAt = new Date().toISOString()

  await sql`
    INSERT INTO snacks (id, name, description, location, country, lat, lng, data_url, brought_by, created_at)
    VALUES (${id}, ${snack.name}, ${snack.description}, ${snack.location}, ${snack.country}, ${snack.lat}, ${snack.lng}, ${snack.dataUrl}, ${snack.broughtBy}, ${createdAt})
  `

  return { ...snack, id, createdAt }
}

export async function deleteSnack(id: string): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await sql`DELETE FROM snacks WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}
