import { v4 as uuid } from 'uuid'

export interface AgendaItem {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  sortOrder: number
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

interface Store {
  agenda: AgendaItem[]
  activities: Activity[]
  photos: Photo[]
}

const store: Store = {
  agenda: [],
  activities: [],
  photos: [],
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
