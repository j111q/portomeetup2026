'use client'

import { useState, useEffect } from 'react'
import Avatar from './Avatar'

interface Activity {
  id: string
  title: string
  description: string
  createdBy: string
  startsAt: string
  createdAt: string
  signups: string[]
}

function useCountdown(iso: string) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(interval)
  }, [])

  const target = new Date(iso).getTime()
  const diffMs = target - now
  const diffMin = Math.round(diffMs / 60000)

  if (diffMs < -60000) return { label: 'ended', isPast: true, isSoon: false }
  if (diffMin <= 0) return { label: 'happening now', isPast: false, isSoon: true }
  if (diffMin <= 5) return { label: `in ${diffMin} min`, isPast: false, isSoon: true }
  if (diffMin <= 120) return { label: `in ${diffMin} min`, isPast: false, isSoon: false }

  const hours = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  if (hours < 24) {
    return { label: `in ${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim(), isPast: false, isSoon: false }
  }

  return {
    label: new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' }),
    isPast: false,
    isSoon: false,
  }
}

export default function ActivityCard({
  activity,
  currentUser,
  onJoin,
  onLeave,
  onDelete,
}: {
  activity: Activity
  currentUser: string
  onJoin: (id: string) => void
  onLeave: (id: string) => void
  onDelete: (id: string) => void
}) {
  const hasJoined = activity.signups.includes(currentUser)
  const isCreator = activity.createdBy === currentUser
  const { label: timeLabel, isPast, isSoon } = useCountdown(activity.startsAt)

  return (
    <div className={`rounded-xl border p-4 transition-opacity ${
      isPast ? 'bg-gray-50/50 border-porto-black/5 opacity-60' : 'bg-gray-50/80 border-porto-black/10'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold">{activity.title}</h3>
          {activity.description && (
            <p className="text-sm text-porto-black/60 mt-0.5">{activity.description}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-porto-black/50">
            <span className={isSoon ? 'text-porto-red font-bold' : isPast ? 'line-through' : ''}>
              🕐 {timeLabel}
            </span>
            <span className="flex items-center gap-1"><Avatar name={activity.createdBy} size={14} /> {activity.createdBy}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-2xl font-black ${isPast ? 'text-porto-black/30' : 'text-porto-blue'}`}>
            {activity.signups.length}
          </div>
          <div className="text-xs text-porto-black/30 font-medium">{isPast ? 'went' : 'going'}</div>
        </div>
      </div>

      {activity.signups.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {activity.signups.map((name) => (
            <span
              key={name}
              className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                name === currentUser
                  ? 'bg-porto-blue/15 text-porto-blue'
                  : 'bg-porto-black/5 text-porto-black/60'
              }`}
            >
              <Avatar name={name} size={14} />
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div>
          {isPast ? (
            <span className="text-xs text-porto-black/30 font-medium">This activity has ended</span>
          ) : isCreator ? (
            <button
              onClick={() => { if (confirm('Delete this side quest?')) onDelete(activity.id) }}
              className="text-sm text-porto-red hover:text-porto-red/80 font-bold"
            >
              Cancel side quest
            </button>
          ) : hasJoined ? (
            <button
              onClick={() => onLeave(activity.id)}
              className="text-sm text-porto-red hover:text-porto-red/80 font-bold"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={() => onJoin(activity.id)}
              className="bg-porto-red text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-porto-red/90 transition-colors"
            >
              I'm into this
            </button>
          )}
        </div>
        {!isPast && (
          <button
            onClick={() => alert('Slack integration coming soon!')}
            className="flex items-center gap-1.5 text-xs text-porto-black/35 hover:text-porto-black/60 transition-colors"
            title="Share to #design-meetup-watercooler"
          >
            <svg width="14" height="14" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.7 43.3c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1 2.3-5.1 5.1-5.1h5.1v5.1zm2.6 0c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1v12.8c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1V43.3z" fill="#E01E5A"/>
              <path d="M27.4 19.7c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1 5.1 2.3 5.1 5.1v5.1h-5.1zm0 2.6c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1H14.6c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1h12.8z" fill="#36C5F0"/>
              <path d="M51 27.4c0-2.8-2.3-5.1-5.1-5.1s-5.1 2.3-5.1 5.1 2.3 5.1 5.1 5.1H51v-5.1zm-2.6 0c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1V14.6c0-2.8 2.3-5.1 5.1-5.1s5.1 2.3 5.1 5.1v12.8z" fill="#2EB67D"/>
              <path d="M27.4 51c2.8 0 5.1-2.3 5.1-5.1s-2.3-5.1-5.1-5.1-5.1 2.3-5.1 5.1v5.1h5.1zm0-2.6c-2.8 0-5.1-2.3-5.1-5.1s2.3-5.1 5.1-5.1h12.8c2.8 0 5.1 2.3 5.1 5.1s-2.3 5.1-5.1 5.1H27.4z" fill="#ECB22E"/>
            </svg>
            <span>Share to #design-meetup-watercooler</span>
          </button>
        )}
      </div>
    </div>
  )
}
