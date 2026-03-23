'use client'

import { useState } from 'react'

export default function NamePrompt({
  onSubmit,
}: {
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState('')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4">
        <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
        <p className="text-gray-500 mb-6">What should we call you?</p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Join Meetup
          </button>
        </form>
      </div>
    </div>
  )
}
