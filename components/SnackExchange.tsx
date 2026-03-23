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

interface CountryOption { country: string; lat: number; lng: number }

const COUNTRIES: CountryOption[] = [
  { country: 'Afghanistan', lat: 33.9, lng: 67.7 },
  { country: 'Albania', lat: 41.2, lng: 20.2 },
  { country: 'Algeria', lat: 28.0, lng: 1.7 },
  { country: 'Angola', lat: -11.2, lng: 17.9 },
  { country: 'Argentina', lat: -38.4, lng: -63.6 },
  { country: 'Armenia', lat: 40.1, lng: 45.0 },
  { country: 'Australia', lat: -25.3, lng: 133.8 },
  { country: 'Austria', lat: 47.5, lng: 14.6 },
  { country: 'Azerbaijan', lat: 40.1, lng: 47.6 },
  { country: 'Bahrain', lat: 26.0, lng: 50.6 },
  { country: 'Bangladesh', lat: 23.7, lng: 90.4 },
  { country: 'Belarus', lat: 53.7, lng: 27.6 },
  { country: 'Belgium', lat: 50.5, lng: 4.5 },
  { country: 'Bolivia', lat: -16.3, lng: -63.6 },
  { country: 'Bosnia & Herzegovina', lat: 43.9, lng: 17.7 },
  { country: 'Brazil', lat: -14.2, lng: -51.9 },
  { country: 'Bulgaria', lat: 42.7, lng: 25.5 },
  { country: 'Cambodia', lat: 12.6, lng: 105.0 },
  { country: 'Cameroon', lat: 7.4, lng: 12.4 },
  { country: 'Canada', lat: 56.1, lng: -106.3 },
  { country: 'Chile', lat: -35.7, lng: -71.5 },
  { country: 'China', lat: 35.9, lng: 104.2 },
  { country: 'Colombia', lat: 4.6, lng: -74.1 },
  { country: 'Costa Rica', lat: 9.7, lng: -83.8 },
  { country: 'Croatia', lat: 45.1, lng: 15.2 },
  { country: 'Cuba', lat: 21.5, lng: -78.0 },
  { country: 'Cyprus', lat: 35.1, lng: 33.4 },
  { country: 'Czech Republic', lat: 49.8, lng: 15.5 },
  { country: 'Denmark', lat: 56.3, lng: 9.5 },
  { country: 'Dominican Republic', lat: 18.7, lng: -70.2 },
  { country: 'Ecuador', lat: -1.8, lng: -78.2 },
  { country: 'Egypt', lat: 26.8, lng: 30.8 },
  { country: 'El Salvador', lat: 13.8, lng: -88.9 },
  { country: 'Estonia', lat: 58.6, lng: 25.0 },
  { country: 'Ethiopia', lat: 9.1, lng: 40.5 },
  { country: 'Finland', lat: 61.9, lng: 25.7 },
  { country: 'France', lat: 46.2, lng: 2.2 },
  { country: 'Georgia', lat: 42.3, lng: 43.4 },
  { country: 'Germany', lat: 51.2, lng: 10.4 },
  { country: 'Ghana', lat: 7.9, lng: -1.0 },
  { country: 'Greece', lat: 39.1, lng: 21.8 },
  { country: 'Guatemala', lat: 15.8, lng: -90.2 },
  { country: 'Honduras', lat: 15.2, lng: -86.2 },
  { country: 'Hong Kong', lat: 22.4, lng: 114.1 },
  { country: 'Hungary', lat: 47.2, lng: 19.5 },
  { country: 'Iceland', lat: 64.9, lng: -19.0 },
  { country: 'India', lat: 20.6, lng: 79.0 },
  { country: 'Indonesia', lat: -0.8, lng: 113.9 },
  { country: 'Iran', lat: 32.4, lng: 53.7 },
  { country: 'Iraq', lat: 33.2, lng: 43.7 },
  { country: 'Ireland', lat: 53.1, lng: -7.7 },
  { country: 'Israel', lat: 31.0, lng: 34.9 },
  { country: 'Italy', lat: 41.9, lng: 12.6 },
  { country: 'Jamaica', lat: 18.1, lng: -77.3 },
  { country: 'Japan', lat: 36.2, lng: 138.3 },
  { country: 'Jordan', lat: 30.6, lng: 36.2 },
  { country: 'Kazakhstan', lat: 48.0, lng: 68.0 },
  { country: 'Kenya', lat: -0.0, lng: 37.9 },
  { country: 'Kuwait', lat: 29.3, lng: 47.5 },
  { country: 'Latvia', lat: 56.9, lng: 24.1 },
  { country: 'Lebanon', lat: 33.9, lng: 35.9 },
  { country: 'Lithuania', lat: 55.2, lng: 23.9 },
  { country: 'Luxembourg', lat: 49.8, lng: 6.1 },
  { country: 'Malaysia', lat: 4.2, lng: 101.9 },
  { country: 'Malta', lat: 35.9, lng: 14.4 },
  { country: 'Mexico', lat: 23.6, lng: -102.6 },
  { country: 'Moldova', lat: 47.4, lng: 28.4 },
  { country: 'Mongolia', lat: 46.9, lng: 103.8 },
  { country: 'Morocco', lat: 31.8, lng: -7.1 },
  { country: 'Mozambique', lat: -18.7, lng: 35.5 },
  { country: 'Myanmar', lat: 21.9, lng: 96.0 },
  { country: 'Nepal', lat: 28.4, lng: 84.1 },
  { country: 'Netherlands', lat: 52.1, lng: 5.3 },
  { country: 'New Zealand', lat: -40.9, lng: 174.9 },
  { country: 'Nicaragua', lat: 12.9, lng: -85.2 },
  { country: 'Nigeria', lat: 9.1, lng: 8.7 },
  { country: 'North Macedonia', lat: 41.5, lng: 21.7 },
  { country: 'Norway', lat: 60.5, lng: 8.5 },
  { country: 'Oman', lat: 21.5, lng: 55.9 },
  { country: 'Pakistan', lat: 30.4, lng: 69.3 },
  { country: 'Palestine', lat: 31.9, lng: 35.2 },
  { country: 'Panama', lat: 8.5, lng: -80.8 },
  { country: 'Paraguay', lat: -23.4, lng: -58.4 },
  { country: 'Peru', lat: -9.2, lng: -75.0 },
  { country: 'Philippines', lat: 12.9, lng: 121.8 },
  { country: 'Poland', lat: 51.9, lng: 19.1 },
  { country: 'Portugal', lat: 39.4, lng: -8.2 },
  { country: 'Puerto Rico', lat: 18.2, lng: -66.6 },
  { country: 'Qatar', lat: 25.4, lng: 51.2 },
  { country: 'Romania', lat: 45.9, lng: 24.97 },
  { country: 'Russia', lat: 61.5, lng: 105.3 },
  { country: 'Rwanda', lat: -1.9, lng: 29.9 },
  { country: 'Saudi Arabia', lat: 23.9, lng: 45.1 },
  { country: 'Senegal', lat: 14.5, lng: -14.5 },
  { country: 'Serbia', lat: 44.0, lng: 21.0 },
  { country: 'Singapore', lat: 1.4, lng: 103.8 },
  { country: 'Slovakia', lat: 48.7, lng: 19.7 },
  { country: 'Slovenia', lat: 46.2, lng: 14.8 },
  { country: 'South Africa', lat: -30.6, lng: 22.9 },
  { country: 'South Korea', lat: 35.9, lng: 127.8 },
  { country: 'Spain', lat: 40.5, lng: -3.7 },
  { country: 'Sri Lanka', lat: 7.9, lng: 80.8 },
  { country: 'Sweden', lat: 60.1, lng: 18.6 },
  { country: 'Switzerland', lat: 46.8, lng: 8.2 },
  { country: 'Syria', lat: 35.0, lng: 38.5 },
  { country: 'Taiwan', lat: 23.7, lng: 121.0 },
  { country: 'Tanzania', lat: -6.4, lng: 34.9 },
  { country: 'Thailand', lat: 15.9, lng: 100.9 },
  { country: 'Trinidad & Tobago', lat: 10.7, lng: -61.2 },
  { country: 'Tunisia', lat: 33.9, lng: 9.5 },
  { country: 'Turkey', lat: 39.9, lng: 32.9 },
  { country: 'UAE', lat: 23.4, lng: 53.8 },
  { country: 'Uganda', lat: 1.4, lng: 32.3 },
  { country: 'UK', lat: 51.5, lng: -0.1 },
  { country: 'Ukraine', lat: 48.4, lng: 31.2 },
  { country: 'Uruguay', lat: -32.5, lng: -55.8 },
  { country: 'USA', lat: 39.8, lng: -98.6 },
  { country: 'Uzbekistan', lat: 41.4, lng: 64.6 },
  { country: 'Venezuela', lat: 6.4, lng: -66.6 },
  { country: 'Vietnam', lat: 14.1, lng: 108.3 },
  { country: 'Zimbabwe', lat: -19.0, lng: 29.2 },
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
  const [selectedLocation, setSelectedLocation] = useState<CountryOption | null>(null)
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
          location: selectedLocation.country,
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
            <select
              value={selectedLocation?.country || ''}
              onChange={(e) => {
                const c = COUNTRIES.find((c) => c.country === e.target.value)
                setSelectedLocation(c || null)
              }}
              className="w-full px-3 py-2 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-white text-sm"
            >
              <option value="">Select a country...</option>
              {COUNTRIES.map((c) => (
                <option key={c.country} value={c.country}>{c.country}</option>
              ))}
            </select>
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
