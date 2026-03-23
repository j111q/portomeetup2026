'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Avatar from './Avatar'

interface Snack {
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

// Simple location presets for quick selection
const LOCATION_PRESETS = [
  { label: '🇧🇷 Brazil', country: 'Brazil', lat: -14.2, lng: -51.9 },
  { label: '🇺🇸 USA', country: 'USA', lat: 39.8, lng: -98.6 },
  { label: '🇬🇧 UK', country: 'UK', lat: 51.5, lng: -0.1 },
  { label: '🇩🇪 Germany', country: 'Germany', lat: 51.2, lng: 10.4 },
  { label: '🇫🇷 France', country: 'France', lat: 46.2, lng: 2.2 },
  { label: '🇪🇸 Spain', country: 'Spain', lat: 40.5, lng: -3.7 },
  { label: '🇵🇹 Portugal', country: 'Portugal', lat: 39.4, lng: -8.2 },
  { label: '🇮🇹 Italy', country: 'Italy', lat: 41.9, lng: 12.6 },
  { label: '🇳🇱 Netherlands', country: 'Netherlands', lat: 52.1, lng: 5.3 },
  { label: '🇯🇵 Japan', country: 'Japan', lat: 36.2, lng: 138.3 },
  { label: '🇰🇷 South Korea', country: 'South Korea', lat: 35.9, lng: 127.8 },
  { label: '🇮🇳 India', country: 'India', lat: 20.6, lng: 79.0 },
  { label: '🇦🇺 Australia', country: 'Australia', lat: -25.3, lng: 133.8 },
  { label: '🇨🇦 Canada', country: 'Canada', lat: 56.1, lng: -106.3 },
  { label: '🇲🇽 Mexico', country: 'Mexico', lat: 23.6, lng: -102.6 },
  { label: '🇿🇦 South Africa', country: 'South Africa', lat: -30.6, lng: 22.9 },
  { label: '🇹🇷 Turkey', country: 'Turkey', lat: 39.9, lng: 32.9 },
  { label: '🇵🇱 Poland', country: 'Poland', lat: 51.9, lng: 19.1 },
  { label: '🇸🇪 Sweden', country: 'Sweden', lat: 60.1, lng: 18.6 },
  { label: '🇳🇴 Norway', country: 'Norway', lat: 60.5, lng: 8.5 },
  { label: '🇵🇭 Philippines', country: 'Philippines', lat: 12.9, lng: 121.8 },
  { label: '🇮🇱 Israel', country: 'Israel', lat: 31.0, lng: 34.9 },
  { label: '🇨🇴 Colombia', country: 'Colombia', lat: 4.6, lng: -74.1 },
  { label: '🇦🇷 Argentina', country: 'Argentina', lat: -38.4, lng: -63.6 },
  { label: '🇮🇩 Indonesia', country: 'Indonesia', lat: -0.8, lng: 113.9 },
  { label: '🇳🇬 Nigeria', country: 'Nigeria', lat: 9.1, lng: 8.7 },
  { label: '🇬🇷 Greece', country: 'Greece', lat: 39.1, lng: 21.8 },
]

// Map SVG viewBox dimensions
const MAP_W = 3596
const MAP_H = 1860

function latLngToXY(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * MAP_W
  const y = ((90 - lat) / 180) * MAP_H
  return { x, y }
}

export default function SnackExchange({ currentUser }: { currentUser: string }) {
  const [snacks, setSnacks] = useState<Snack[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATION_PRESETS[0] | null>(null)
  const [uploading, setUploading] = useState(false)
  const [hoveredSnack, setHoveredSnack] = useState<Snack | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchSnacks = useCallback(async () => {
    const res = await fetch('/api/snacks')
    setSnacks(await res.json())
  }, [])

  const handleDeleteSnack = async (id: string) => {
    await fetch('/api/snacks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchSnacks()
  }

  useEffect(() => {
    fetchSnacks()
    const interval = setInterval(fetchSnacks, 5000)
    return () => clearInterval(interval)
  }, [fetchSnacks])

  const handleUpload = (file: File) => {
    if (!name.trim() || !selectedLocation) return
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      await fetch('/api/snacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          location: selectedLocation.label,
          country: selectedLocation.country,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          dataUrl: reader.result,
          broughtBy: currentUser,
        }),
      })
      setName('')
      setDescription('')
      setSelectedLocation(null)
      setUploading(false)
      setShowForm(false)
      fetchSnacks()
    }
    reader.readAsDataURL(file)
  }

  const pinR = 25

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black">Snack Exchange</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-porto-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-porto-red/90 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add snack'}
        </button>
      </div>
      <p className="text-xs text-porto-black/40 mb-5">A world tour of taste, one carry-on at a time</p>

      {showForm && (
        <div className="bg-gray-50 rounded-xl border border-porto-black/10 p-4 mb-6 space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="What snack did you bring?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-white"
          />
          <textarea
            placeholder="Tell us about it (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-white"
          />
          <div>
            <label className="text-xs text-porto-black/50 mb-2 block font-medium">Where is it from?</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {LOCATION_PRESETS.map((loc) => (
                <button
                  key={loc.country}
                  type="button"
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-2 py-1 rounded-md text-xs border transition-colors ${
                    selectedLocation?.country === loc.country
                      ? 'bg-porto-red text-white border-porto-red'
                      : 'border-porto-black/20 hover:bg-porto-black/5'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-porto-black/50 mb-2 block font-medium">Photo of the snack</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
                e.target.value = ''
              }}
              className="text-sm"
            />
          </div>
          {uploading && <p className="text-porto-black/50 text-sm">Uploading...</p>}
        </div>
      )}

      {/* World map */}
      <div className="rounded-xl overflow-hidden mb-6 bg-[#5378FF]">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full">
          {/* Map SVG as background */}
          <image href="/map.svg" width={MAP_W} height={MAP_H} />

          {/* Porto marker */}
          {(() => {
            const porto = latLngToXY(41.15, -8.61)
            return (
              <g>
                <circle cx={porto.x} cy={porto.y} r={pinR * 2} fill="white" opacity="0.25" />
                <circle cx={porto.x} cy={porto.y} r={pinR} fill="white" />
                <text x={porto.x + pinR * 2} y={porto.y + 6} fontSize="36" fill="white" fontWeight="bold" opacity="0.9">Porto</text>
              </g>
            )
          })()}

          {/* Snack pins */}
          {snacks.map((snack) => {
            const { x, y } = latLngToXY(snack.lat, snack.lng)
            const porto = latLngToXY(41.15, -8.61)
            return (
              <g
                key={snack.id}
                onMouseEnter={() => setHoveredSnack(snack)}
                onMouseLeave={() => setHoveredSnack(null)}
                className="cursor-pointer"
              >
                <line
                  x1={x} y1={y}
                  x2={porto.x} y2={porto.y}
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray="12,12"
                  opacity="0.3"
                />
                <circle cx={x} cy={y} r={pinR * 2} fill="white" opacity="0.2" />
                <circle cx={x} cy={y} r={pinR} fill="white" />
              </g>
            )
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredSnack && (
          <div className="bg-[#5378FF] px-4 py-2 flex gap-2 items-center border-t border-white/10">
            <img src={hoveredSnack.dataUrl} alt={hoveredSnack.name} className="w-10 h-10 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{hoveredSnack.name}</p>
              <p className="text-xs text-white/60">{hoveredSnack.location} &middot; {hoveredSnack.broughtBy}</p>
            </div>
          </div>
        )}
      </div>

      {/* Snack list */}
      {snacks.length === 0 ? (
        <div className="text-center py-8 text-porto-black/30">
          <p className="text-4xl mb-2">🍪</p>
          <p className="font-bold">No snacks on the map yet</p>
          <p className="text-xs mt-1">Be the first to pin your snack to the world. Extra points for obscure regional treats.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {snacks.map((snack) => (
            <div key={snack.id} className="bg-gray-50 rounded-xl border border-porto-black/10 overflow-hidden">
              <div className="aspect-square relative">
                <img src={snack.dataUrl} alt={snack.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2.5">
                <p className="font-bold text-sm truncate">{snack.name}</p>
                <p className="text-xs text-porto-black/50 truncate">{snack.location}</p>
                <p className="text-xs text-porto-black/30 mt-0.5 flex items-center gap-1"><Avatar name={snack.broughtBy} size={12} /> {snack.broughtBy}</p>
                {snack.description && (
                  <p className="text-xs text-porto-black/50 mt-1 line-clamp-2">{snack.description}</p>
                )}
                <button
                  onClick={() => { if (confirm('Remove this snack?')) handleDeleteSnack(snack.id) }}
                  className="text-[10px] text-porto-black/25 hover:text-porto-red mt-1.5 font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
