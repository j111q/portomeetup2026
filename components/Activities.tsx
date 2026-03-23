'use client'

import { useState, useEffect, useCallback } from 'react'
import ActivityCard from './ActivityCard'

interface Activity {
  id: string
  title: string
  description: string
  createdBy: string
  startsAt: string
  createdAt: string
  signups: string[]
}

export default function Activities({ currentUser }: { currentUser: string }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [quickTime, setQuickTime] = useState<number | null>(null)

  const fetchActivities = useCallback(async () => {
    const res = await fetch('/api/activities')
    setActivities(await res.json())
  }, [])

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }, [fetchActivities])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    let time = startsAt
    if (quickTime !== null) {
      const d = new Date()
      d.setMinutes(d.getMinutes() + quickTime)
      time = d.toISOString()
    }
    if (!time) return

    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, createdBy: currentUser, startsAt: time }),
    })
    setTitle('')
    setDescription('')
    setStartsAt('')
    setQuickTime(null)
    setShowForm(false)
    fetchActivities()
  }

  const handleJoin = async (id: string) => {
    await fetch(`/api/activities/${id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: currentUser }),
    })
    fetchActivities()
  }

  const handleLeave = async (id: string) => {
    await fetch(`/api/activities/${id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: currentUser, leave: true }),
    })
    fetchActivities()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Activities</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Create Activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border p-4 mb-6 space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="What's the activity?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <label className="text-xs text-gray-500 mb-2 block">When?</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[5, 10, 15, 30, 60].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => {
                    setQuickTime(min)
                    setStartsAt('')
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    quickTime === min
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  in {min} min
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400 mb-1">or pick a specific time:</div>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => {
                setStartsAt(e.target.value)
                setQuickTime(null)
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim() || (!startsAt && quickTime === null)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Create Activity
          </button>
        </form>
      )}

      {activities.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🎯</p>
          <p>No activities yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              currentUser={currentUser}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          ))}
        </div>
      )}
    </div>
  )
}
