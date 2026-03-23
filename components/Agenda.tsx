'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface AgendaLink {
  label: string
  url: string
}

interface AgendaItem {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  links?: AgendaLink[]
}

const MEETUP_START = '2026-03-22T09:00+00:00'
const MEETUP_END = '2026-03-27T18:00+00:00'

const FUN_MESSAGES = [
  'Porto, but in auto layout',
  'of your AI ninja training complete',
  'through the meetup magic',
  'Figma open. Slack ignored.',
  'to design mastery',
]

export default function Agenda() {
  const [items, setItems] = useState<AgendaItem[]>([])
  const [now, setNow] = useState(new Date())
  const [markerVisible, setMarkerVisible] = useState(true)
  const [markerAbove, setMarkerAbove] = useState(false)
  const markerRef = useRef<HTMLDivElement>(null)

  // Track whether the "you are here" marker is on screen and its direction
  useEffect(() => {
    if (!markerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setMarkerVisible(entry.isIntersecting)
        if (!entry.isIntersecting) {
          setMarkerAbove(entry.boundingClientRect.top < 0)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(markerRef.current)
    return () => observer.disconnect()
  })

  const scrollToMarker = () => {
    markerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/agenda')
    setItems(await res.json())
  }, [])

  useEffect(() => {
    fetchItems()
    const interval = setInterval(fetchItems, 5000)
    const clock = setInterval(() => setNow(new Date()), 60000)
    return () => { clearInterval(interval); clearInterval(clock) }
  }, [fetchItems])

  const formatTime = (iso: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' })
  }

  const formatDay = (iso: string) => {
    return new Date(iso).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'Europe/Lisbon' })
  }

  // Progress calculation
  const nowMs = now.getTime()
  const meetupStartMs = new Date(MEETUP_START).getTime()
  const meetupEndMs = new Date(MEETUP_END).getTime()
  const percent = Math.round(
    Math.max(0, Math.min(100, ((nowMs - meetupStartMs) / (meetupEndMs - meetupStartMs)) * 100))
  )
  const funMessage = FUN_MESSAGES[Math.floor((percent / 100) * FUN_MESSAGES.length) % FUN_MESSAGES.length]

  // Determine item status
  const getItemStatus = (item: AgendaItem): 'past' | 'current' | 'future' => {
    const start = new Date(item.startTime).getTime()
    const end = new Date(item.endTime).getTime()
    if (nowMs >= end) return 'past'
    if (nowMs >= start && nowMs < end) return 'current'
    return 'future'
  }

  // Find where to insert the "you are here" marker (after the last past/current item in a day)
  const shouldShowMarkerAfter = (item: AgendaItem, nextItem: AgendaItem | null): boolean => {
    const status = getItemStatus(item)
    if (status === 'current') return true
    if (status === 'past' && nextItem) {
      return getItemStatus(nextItem) === 'future'
    }
    return false
  }

  // Group items by day (Porto timezone)
  const grouped: Record<string, AgendaItem[]> = {}
  for (const item of items) {
    const day = new Date(item.startTime).toLocaleDateString('en-US', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit' })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(item)
  }

  // Flatten to find if marker should appear in this day
  const allItems = Object.values(grouped).flat()

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-xl font-black">Agenda</h2>
      </div>
      <p className="text-xs text-porto-black/40 mb-5">Everything happening, neatly stacked like layers should be</p>

      {items.length === 0 ? (
        <div className="text-center py-12 text-porto-black/30">
          <p className="text-4xl mb-2">📋</p>
          <p>No agenda items yet. Add the first one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dayKey, dayItems]) => (
            <div key={dayKey}>
              <h3 className="text-sm font-black uppercase tracking-wide text-porto-red mb-2">
                {formatDay(dayItems[0].startTime)}
              </h3>
              <div className="space-y-2">
                {dayItems.map((item, idx) => {
                  const status = getItemStatus(item)
                  const nextItem = dayItems[idx + 1] || null
                  const showMarker = shouldShowMarkerAfter(item, nextItem)
                  const globalIdx = allItems.indexOf(item)
                  const nextGlobal = allItems[globalIdx + 1] || null

                  // If this is last item in this day but next day starts with future, show marker
                  const showMarkerGlobal = !showMarker && !nextItem && status !== 'future' && nextGlobal && getItemStatus(nextGlobal) === 'future'

                  return (
                    <div key={item.id}>
                      {/* Agenda card with gradient wash for past items */}
                      <div
                        className={`rounded-xl border p-3 flex gap-3 transition-all duration-500 ${
                          status === 'past'
                            ? 'bg-porto-blue/8 border-porto-blue/15 opacity-60'
                            : status === 'current'
                            ? 'bg-porto-red/8 border-porto-red/20 ring-2 ring-porto-red/20'
                            : 'bg-gray-50 border-porto-black/10'
                        }`}
                      >
                        <div className={`text-xs font-bold whitespace-nowrap pt-0.5 w-20 shrink-0 ${
                          status === 'current' ? 'text-porto-red' : 'text-porto-black/50'
                        }`}>
                          {formatTime(item.startTime)}
                          {item.endTime && (
                            <>
                              <br />
                              <span className={status === 'current' ? 'text-porto-red/50' : 'text-porto-black/25'}>
                                {formatTime(item.endTime)}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm">{item.title}</h4>
                          {item.location && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location + ', Porto, Portugal')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-porto-black/50 hover:text-porto-blue transition-colors inline-flex items-center gap-0.5"
                            >
                              📍 <span className="underline underline-offset-2 decoration-porto-black/20">{item.location}</span>
                            </a>
                          )}
                          {item.description && (
                            <p className="text-xs text-porto-black/60 mt-0.5">{item.description}</p>
                          )}
                          {item.links && item.links.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {item.links.map((link) => (
                                <a
                                  key={link.label}
                                  href={link.url}
                                  onClick={(e) => { e.preventDefault(); alert('Link coming soon!') }}
                                  className="text-xs text-porto-blue hover:text-porto-blue/80 underline underline-offset-2 decoration-porto-blue/30"
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* "You are here" marker */}
                      {(showMarker || showMarkerGlobal) && (
                        <div ref={markerRef} className="flex items-center gap-3 my-3">
                          <div className="flex-1 h-px bg-gradient-to-r from-porto-red/40 to-transparent" />
                          <div className="flex items-center gap-2 bg-porto-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-porto-red/20">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                            You are here &mdash; {percent}% {funMessage}
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-l from-porto-red/40 to-transparent" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating "scroll to here" pin */}
      {items.length > 0 && !markerVisible && (
        <button
          onClick={scrollToMarker}
          className={`fixed inset-x-0 mx-auto w-fit z-40 flex flex-col items-center gap-1.5 animate-bounce ${
            markerAbove ? 'top-4' : 'bottom-6'
          }`}
        >
          {/* Pin above text when marker is below */}
          {!markerAbove && (
            <div className="bg-porto-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-porto-red/25 whitespace-nowrap">
              You are here
            </div>
          )}
          {/* Map pin — flipped when pointing up */}
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className={`drop-shadow-lg ${markerAbove ? 'rotate-180' : ''}`}>
            <path d="M8 0C3.6 0 0 3.6 0 8c0 5.4 7 11.5 7.3 11.8.2.1.3.2.5.2h.4c.3-.3 7.3-6.4 7.3-11.8C16 3.6 12.4 0 8 0z" fill="#E53312"/>
            <circle cx="8" cy="8" r="3" fill="white"/>
          </svg>
          {/* Text below pin when marker is above */}
          {markerAbove && (
            <div className="bg-porto-red text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-porto-red/25 whitespace-nowrap">
              You are here
            </div>
          )}
        </button>
      )}
    </div>
  )
}
