import { v4 as uuid } from 'uuid'

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

export interface Photo {
  id: string
  dataUrl: string
  caption: string
  uploadedBy: string
  createdAt: string
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

interface Store {
  agenda: AgendaItem[]
  activities: Activity[]
  photos: Photo[]
  snacks: Snack[]
}

// March 23, 2026 = Monday in Porto
// Schedule: Sun 22 (arrival) → Fri 27 (departure)
let sortCounter = 0
const sessionLinks: AgendaLink[] = [{ label: '📄 Link to presentation', url: '#' }, { label: '📝 Shared Google Doc for audience notes', url: '#' }]

const seedAgenda: AgendaItem[] = [
  // ── Sunday, March 22 ──
  { id: uuid(), title: '✈️ Arrival Day', description: '', startTime: '2026-03-22T09:00+00:00', endTime: '2026-03-22T20:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🥂 Welcome Reception', description: '', startTime: '2026-03-22T20:30+00:00', endTime: '2026-03-22T22:00+00:00', location: 'Lobby Bar, Boeira Hotel', sortOrder: sortCounter++ },

  // ── Monday, March 23 ──
  { id: uuid(), title: '🥐 Breakfast / Flex Time', description: '', startTime: '2026-03-23T09:00+00:00', endTime: '2026-03-23T11:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '👋 Intro Session', description: '', startTime: '2026-03-23T11:00+00:00', endTime: '2026-03-23T14:00+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '🍽️ Lunch Break', description: '', startTime: '2026-03-23T14:00+00:00', endTime: '2026-03-23T15:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🤖 AI Atelier \u2013 Set Up', description: '', startTime: '2026-03-23T15:30+00:00', endTime: '2026-03-23T16:00+00:00', location: '', sortOrder: sortCounter++, links: [{ label: '📄 Setup guide', url: '#' }] },
  { id: uuid(), title: '☕ Break', description: '', startTime: '2026-03-23T16:00+00:00', endTime: '2026-03-23T16:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🤖 AI Atelier \u2013 Foundations', description: '', startTime: '2026-03-23T16:30+00:00', endTime: '2026-03-23T18:30+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '🌇 Flex Time', description: '', startTime: '2026-03-23T18:30+00:00', endTime: '2026-03-23T19:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🍷 Dinner', description: '', startTime: '2026-03-23T19:30+00:00', endTime: '2026-03-23T22:00+00:00', location: 'Canopy, Boeira Hotel', sortOrder: sortCounter++ },

  // ── Tuesday, March 24 ──
  { id: uuid(), title: '🥐 Breakfast / Flex Time', description: '', startTime: '2026-03-24T09:00+00:00', endTime: '2026-03-24T11:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🔬 Research Training', description: '', startTime: '2026-03-24T11:00+00:00', endTime: '2026-03-24T14:00+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '🍽️ Lunch Break', description: '', startTime: '2026-03-24T14:00+00:00', endTime: '2026-03-24T15:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🤖 AI Atelier \u2013 MCPs, Context A8', description: '', startTime: '2026-03-24T15:30+00:00', endTime: '2026-03-24T16:00+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '☕ Break', description: '', startTime: '2026-03-24T16:00+00:00', endTime: '2026-03-24T16:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🤖 AI Atelier \u2013 Break Out Session', description: '', startTime: '2026-03-24T16:30+00:00', endTime: '2026-03-24T18:30+00:00', location: '', sortOrder: sortCounter++, links: [{ label: '📝 Shared Google Doc for audience notes', url: '#' }] },
  { id: uuid(), title: '🌇 Flex Time', description: '', startTime: '2026-03-24T18:30+00:00', endTime: '2026-03-24T19:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🚌 Transfer', description: '', startTime: '2026-03-24T19:30+00:00', endTime: '2026-03-24T20:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🍷 Dinner', description: '', startTime: '2026-03-24T20:00+00:00', endTime: '2026-03-24T22:00+00:00', location: 'T&C Restaurant', sortOrder: sortCounter++ },

  // ── Wednesday, March 25 ──
  { id: uuid(), title: '🥐 Breakfast', description: '', startTime: '2026-03-25T09:00+00:00', endTime: '2026-03-25T10:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🧪 AI Atelier \u2013 Experimenting', description: '', startTime: '2026-03-25T10:00+00:00', endTime: '2026-03-25T11:00+00:00', location: '', sortOrder: sortCounter++, links: [{ label: '📝 Shared Google Doc for audience notes', url: '#' }] },
  { id: uuid(), title: '☕ Break', description: '', startTime: '2026-03-25T11:00+00:00', endTime: '2026-03-25T11:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🧪 AI Atelier \u2013 Experimenting', description: '', startTime: '2026-03-25T11:30+00:00', endTime: '2026-03-25T14:00+00:00', location: '', sortOrder: sortCounter++, links: [{ label: '📝 Shared Google Doc for audience notes', url: '#' }] },
  { id: uuid(), title: '🍽️ Lunch Break', description: '', startTime: '2026-03-25T14:00+00:00', endTime: '2026-03-25T15:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '📸 Group Photo & Transfer', description: '', startTime: '2026-03-25T15:00+00:00', endTime: '2026-03-25T15:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🏛️ Visit at Serralves Foundation', description: '', startTime: '2026-03-25T15:30+00:00', endTime: '2026-03-25T18:30+00:00', location: 'Serralves Foundation', sortOrder: sortCounter++ },
  { id: uuid(), title: '🌇 Flex Time', description: '', startTime: '2026-03-25T18:30+00:00', endTime: '2026-03-25T20:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🍷 Dinner', description: '', startTime: '2026-03-25T20:00+00:00', endTime: '2026-03-25T22:00+00:00', location: 'Raizes Restaurant, Boeira Hotel', sortOrder: sortCounter++ },

  // ── Thursday, March 26 ──
  { id: uuid(), title: '🥐 Breakfast / Flex Time', description: '', startTime: '2026-03-26T09:00+00:00', endTime: '2026-03-26T11:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🎬 AI Atelier \u2013 Playback', description: '', startTime: '2026-03-26T11:00+00:00', endTime: '2026-03-26T14:00+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '🍽️ Lunch Break', description: '', startTime: '2026-03-26T14:00+00:00', endTime: '2026-03-26T15:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '⚡ Flash Talks', description: '', startTime: '2026-03-26T15:30+00:00', endTime: '2026-03-26T16:00+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '☕ Break', description: '', startTime: '2026-03-26T16:00+00:00', endTime: '2026-03-26T16:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🎤 DC Talk / Wrap Up', description: '', startTime: '2026-03-26T16:30+00:00', endTime: '2026-03-26T18:30+00:00', location: '', sortOrder: sortCounter++, links: sessionLinks },
  { id: uuid(), title: '🌇 Flex Time', description: '', startTime: '2026-03-26T18:30+00:00', endTime: '2026-03-26T19:30+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🚌 Transfer', description: '', startTime: '2026-03-26T19:30+00:00', endTime: '2026-03-26T20:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '🍷 Dinner', description: '', startTime: '2026-03-26T20:00+00:00', endTime: '2026-03-26T22:00+00:00', location: 'Bras\u00e3o Coliseu', sortOrder: sortCounter++ },

  // ── Friday, March 27 ──
  { id: uuid(), title: '🥐 Breakfast', description: '', startTime: '2026-03-27T09:00+00:00', endTime: '2026-03-27T11:00+00:00', location: '', sortOrder: sortCounter++ },
  { id: uuid(), title: '👋 Departure Day / Free Time', description: '', startTime: '2026-03-27T11:00+00:00', endTime: '2026-03-27T18:00+00:00', location: '', sortOrder: sortCounter++ },
]

const store: Store = {
  agenda: seedAgenda,
  activities: [],
  photos: [],
  snacks: [],
}

// --- Agenda ---
export function getAgenda(): AgendaItem[] {
  return store.agenda.sort((a, b) => a.sortOrder - b.sortOrder)
}

export function addAgendaItem(item: Omit<AgendaItem, 'id'>): AgendaItem {
  const newItem = { ...item, id: uuid() }
  store.agenda.push(newItem)
  return newItem
}

export function deleteAgendaItem(id: string): boolean {
  const idx = store.agenda.findIndex((a) => a.id === id)
  if (idx === -1) return false
  store.agenda.splice(idx, 1)
  return true
}

// --- Activities ---
export function getActivities(): Activity[] {
  return store.activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function addActivity(
  activity: Pick<Activity, 'title' | 'description' | 'createdBy' | 'startsAt'>
): Activity {
  const newActivity: Activity = {
    ...activity,
    id: uuid(),
    createdAt: new Date().toISOString(),
    signups: [activity.createdBy],
  }
  store.activities.push(newActivity)
  return newActivity
}

export function joinActivity(id: string, name: string): Activity | null {
  const activity = store.activities.find((a) => a.id === id)
  if (!activity) return null
  if (!activity.signups.includes(name)) {
    activity.signups.push(name)
  }
  return activity
}

export function deleteActivity(id: string): boolean {
  const idx = store.activities.findIndex((a) => a.id === id)
  if (idx === -1) return false
  store.activities.splice(idx, 1)
  return true
}

export function leaveActivity(id: string, name: string): Activity | null {
  const activity = store.activities.find((a) => a.id === id)
  if (!activity) return null
  activity.signups = activity.signups.filter((n) => n !== name)
  return activity
}

// --- Photos ---
export function getPhotos(): Photo[] {
  return store.photos.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function addPhoto(photo: Pick<Photo, 'dataUrl' | 'caption' | 'uploadedBy'>): Photo {
  const newPhoto: Photo = {
    ...photo,
    id: uuid(),
    createdAt: new Date().toISOString(),
  }
  store.photos.push(newPhoto)
  return newPhoto
}

export function deletePhoto(id: string): boolean {
  const idx = store.photos.findIndex((p) => p.id === id)
  if (idx === -1) return false
  store.photos.splice(idx, 1)
  return true
}

// --- Snacks ---
export function getSnacks(): Snack[] {
  return store.snacks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function addSnack(snack: Omit<Snack, 'id' | 'createdAt'>): Snack {
  const newSnack: Snack = {
    ...snack,
    id: uuid(),
    createdAt: new Date().toISOString(),
  }
  store.snacks.push(newSnack)
  return newSnack
}

export function deleteSnack(id: string): boolean {
  const idx = store.snacks.findIndex((s) => s.id === id)
  if (idx === -1) return false
  store.snacks.splice(idx, 1)
  return true
}
