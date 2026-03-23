'use client'

import { useState, useEffect, useCallback } from 'react'

interface AgendaItem {
  id: string
  title: string
  startTime: string
  endTime: string
}

const MEETUP_START = '2026-03-22T09:00'
const MEETUP_END = '2026-03-27T18:00'

const FUN_MESSAGES = [
  'of your AI ninja training is complete',
  'of your Porto design adventure is done',
  'through the meetup magic',
  'of your creative journey complete',
  'of the way to design mastery',
]

export default function MeetupProgress() {
  const [items, setItems] = useState<AgendaItem[]>([])
  const [now, setNow] = useState(new Date())
  const [collapsed, setCollapsed] = useState(false)

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/agenda')
    setItems(await res.json())
  }, [])

  useEffect(() => {
    fetchItems()
    const dataInterval = setInterval(fetchItems, 30000)
    const clockInterval = setInterval(() => setNow(new Date()), 60000)
    return () => {
      clearInterval(dataInterval)
      clearInterval(clockInterval)
    }
  }, [fetchItems])

  const meetupStart = new Date(MEETUP_START).getTime()
  const meetupEnd = new Date(MEETUP_END).getTime()
  const nowMs = now.getTime()

  const totalDuration = meetupEnd - meetupStart
  const elapsed = Math.max(0, Math.min(nowMs - meetupStart, totalDuration))
  const percent = Math.round((elapsed / totalDuration) * 100)

  // Find current and next agenda items
  let currentItem: AgendaItem | null = null
  let nextItem: AgendaItem | null = null

  for (const item of items) {
    const start = new Date(item.startTime).getTime()
    const end = new Date(item.endTime).getTime()
    if (nowMs >= start && nowMs < end) {
      currentItem = item
    }
    if (!nextItem && start > nowMs) {
      nextItem = item
    }
  }

  const funMessage = FUN_MESSAGES[Math.floor(elapsed / (totalDuration / FUN_MESSAGES.length)) % FUN_MESSAGES.length]

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 flex justify-center pointer-events-none">
      <div
        className="pointer-events-auto bg-porto-black text-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full transition-all duration-300"
      >
        {/* Clickable header — always visible */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-4 py-3 flex items-center gap-3 text-left"
        >
          {/* Progress ring */}
          <div className="relative w-10 h-10 shrink-0">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="#E53312"
                strokeWidth="3"
                strokeDasharray={`${percent * 0.942} 94.2`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black">
              {percent}%
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">
              {currentItem ? currentItem.title : nextItem ? `Up next: ${nextItem.title}` : 'Meetup complete!'}
            </p>
            <p className="text-xs text-white/50 truncate">
              {percent}% {funMessage}
            </p>
          </div>

          <span className="text-white/30 text-xs shrink-0">
            {collapsed ? '▲' : '▼'}
          </span>
        </button>

        {/* Expanded details */}
        {!collapsed && (
          <div className="px-4 pb-3 border-t border-white/10">
            {/* Progress bar */}
            <div className="h-1.5 bg-white/10 rounded-full mt-3 mb-3 overflow-hidden">
              <div
                className="h-full bg-porto-red rounded-full transition-all duration-1000"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex gap-4 text-xs">
              {currentItem && (
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 uppercase tracking-wide text-[10px] font-bold mb-0.5">Now</p>
                  <p className="text-white/90 font-medium truncate">{currentItem.title}</p>
                  <p className="text-white/40">{formatTime(currentItem.startTime)} – {formatTime(currentItem.endTime)}</p>
                </div>
              )}
              {nextItem && (
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 uppercase tracking-wide text-[10px] font-bold mb-0.5">Up Next</p>
                  <p className="text-white/90 font-medium truncate">{nextItem.title}</p>
                  <p className="text-white/40">{formatTime(nextItem.startTime)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
