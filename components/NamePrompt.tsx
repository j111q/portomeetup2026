'use client'

import { useState } from 'react'

export default function NamePrompt({
  onSubmit,
}: {
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState('')

  return (
    <div className="fixed inset-0 bg-porto-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 border border-porto-black/10">
        <p className="text-xs font-bold uppercase tracking-wide text-porto-red mb-2">Welcome to Design Meetup 2026</p>
        <h2 className="text-2xl font-black mb-1">You made it out of Figma</h2>
        <p className="text-porto-black/50 mb-6 text-sm leading-relaxed">
          This app has the agenda, the activities, and photographic proof that designers do occasionally touch grass.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (name.trim()) onSubmit(name.trim())
          }}
        >
          <input
            autoFocus
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-porto-black/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-porto-red bg-gray-50 text-lg"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-4 w-full bg-porto-red text-white py-3 rounded-lg font-bold hover:bg-porto-red/90 disabled:opacity-40 transition-colors"
          >
            Let's prototype this day
          </button>
        </form>
      </div>
    </div>
  )
}
