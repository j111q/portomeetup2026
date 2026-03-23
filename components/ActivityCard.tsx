'use client'

interface Activity {
  id: string
  title: string
  description: string
  createdBy: string
  startsAt: string
  createdAt: string
  signups: string[]
}

export default function ActivityCard({
  activity,
  currentUser,
  onJoin,
  onLeave,
}: {
  activity: Activity
  currentUser: string
  onJoin: (id: string) => void
  onLeave: (id: string) => void
}) {
  const hasJoined = activity.signups.includes(currentUser)
  const isCreator = activity.createdBy === currentUser

  const formatTime = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diffMs = d.getTime() - now.getTime()
    const diffMin = Math.round(diffMs / 60000)

    if (diffMin > 0 && diffMin <= 120) {
      return `in ${diffMin} min`
    }
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{activity.title}</h3>
          {activity.description && (
            <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
            <span>🕐 {formatTime(activity.startsAt)}</span>
            <span>👤 {activity.createdBy}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-blue-600">
            {activity.signups.length}
          </div>
          <div className="text-xs text-gray-400">going</div>
        </div>
      </div>

      {activity.signups.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {activity.signups.map((name) => (
            <span
              key={name}
              className={`text-xs px-2 py-1 rounded-full ${
                name === currentUser
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3">
        {hasJoined ? (
          <button
            onClick={() => onLeave(activity.id)}
            disabled={isCreator}
            className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            title={isCreator ? "You created this activity" : "Leave activity"}
          >
            {isCreator ? "You're the organizer" : 'Leave'}
          </button>
        ) : (
          <button
            onClick={() => onJoin(activity.id)}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Join
          </button>
        )}
      </div>
    </div>
  )
}
