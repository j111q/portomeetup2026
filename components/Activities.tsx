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
  const [showPast, setShowPast] = useState(false)
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

  const handleDelete = async (id: string) => {
    await fetch('/api/activities', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchActivities()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black">Activities</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-porto-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-porto-red/90 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add side quest'}
        </button>
      </div>
      <p className="text-xs text-porto-black/40 mb-5">Side quests for people with strong visual opinions</p>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-50 rounded-xl border border-porto-black/10 p-4 mb-6 space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Name your side quest"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-white"
          />
          <textarea
            placeholder="Where to meet, what to bring, dress code... (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-white"
          />
          <div>
            <label className="text-xs text-porto-black/50 mb-2 block font-medium">When?</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {[5, 10, 15, 30, 60].map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => {
                    setQuickTime(min)
                    setStartsAt('')
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors ${
                    quickTime === min
                      ? 'bg-porto-red text-white border-porto-red'
                      : 'border-porto-black/50 hover:bg-porto-black/5'
                  }`}
                >
                  in {min} min
                </button>
              ))}
            </div>
            <div className="text-xs text-porto-black/30 mb-1">or pick a specific time:</div>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => {
                setStartsAt(e.target.value)
                setQuickTime(null)
              }}
              className="w-full px-3 py-2 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim() || (!startsAt && quickTime === null)}
            className="bg-porto-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-porto-red/90 disabled:opacity-40 transition-colors"
          >
            Add this side quest
          </button>
        </form>
      )}

      {/* Quick start suggestions */}
      {activities.length === 0 && !showForm && (
        <div className="mb-6">
          <p className="text-xs text-porto-black/40 font-medium uppercase tracking-wide mb-3">Beautifully timed detours</p>
          <div className="flex flex-wrap gap-2">
            {[
              { emoji: '🔤', label: 'Type spotting walk' },
              { emoji: '☕', label: 'Coffee run' },
              { emoji: '🏃', label: 'Touching grass (morning jog)' },
              { emoji: '🍺', label: 'After-hours drinks' },
              { emoji: '📷', label: 'Design walk around Porto' },
              { emoji: '🍦', label: 'Gelato expedition' },
              { emoji: '🏛️', label: 'Studio visit' },
              { emoji: '🎮', label: 'Game night for brave introverts' },
            ].map(({ emoji, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setTitle(`${emoji} ${label}`)
                  setShowForm(true)
                }}
                className="px-3 py-1.5 rounded-full text-sm border border-porto-black/15 text-porto-black/70 hover:bg-porto-blue/10 hover:border-porto-blue/30 transition-colors"
              >
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {(() => {
        const now = Date.now()
        const active = activities.filter((a) => new Date(a.startsAt).getTime() > now - 60000)
        const past = activities.filter((a) => new Date(a.startsAt).getTime() <= now - 60000)

        if (activities.length === 0 && !showForm) {
          return (
            <div className="text-center py-8 text-porto-black/30">
              <p>Your schedule is giving blank canvas. Start curating.</p>
            </div>
          )
        }

        return (
          <>
            {active.length > 0 && (
              <div className="space-y-3">
                {active.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    currentUser={currentUser}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowPast(!showPast)}
                  className="text-xs font-bold text-porto-black/30 hover:text-porto-black/50 transition-colors flex items-center gap-1"
                >
                  <span className={`transition-transform ${showPast ? 'rotate-90' : ''}`}>&#9654;</span>
                  {past.length} past {past.length === 1 ? 'activity' : 'activities'}
                </button>
                {showPast && (
                  <div className="space-y-3 mt-3">
                    {past.map((activity) => (
                      <ActivityCard
                        key={activity.id}
                        activity={activity}
                        currentUser={currentUser}
                        onJoin={handleJoin}
                        onLeave={handleLeave}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )
      })()}
    </div>
  )
}
