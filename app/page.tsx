'use client'

import { useState, useEffect } from 'react'
import NamePrompt from '@/components/NamePrompt'
import Agenda from '@/components/Agenda'
import Activities from '@/components/Activities'
import SnackExchange from '@/components/SnackExchange'
import Avatar from '@/components/Avatar'

const TABS = ['Agenda', 'Activities', 'Snacks'] as const
type Tab = (typeof TABS)[number]

export default function Home() {
  const [name, setName] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Agenda')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('meetup-buddy-name')
    if (saved) setName(saved)
    setLoaded(true)
  }, [])

  const handleSetName = (n: string) => {
    localStorage.setItem('meetup-buddy-name', n)
    setName(n)
  }

  const handleChangeName = () => {
    localStorage.removeItem('meetup-buddy-name')
    setName(null)
  }

  if (!loaded) return (
    <>
      {/* Header skeleton */}
      <div className="bg-[#5378FF]">
        <div className="w-full max-w-4xl mx-auto h-48 sm:h-64" />
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab skeleton */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          {['', '', ''].map((_, i) => (
            <div key={i} className="flex-1 py-2 px-3 rounded-md bg-gray-200/50 animate-pulse h-9" />
          ))}
        </div>
        {/* Card skeletons */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl border border-porto-black/5 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-12" />
                  <div className="h-3 bg-gray-100 rounded w-10" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )

  return (
    <>
      {!name && <NamePrompt onSubmit={handleSetName} />}

      {/* Hero banner */}
      <div className="bg-[#5378FF]">
        <img
          src="/header.png"
          alt="Design Meetup — 23–26, March 2026"
          className="w-full max-w-4xl mx-auto"
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-bold uppercase tracking-wide transition-colors ${
                tab === t
                  ? 'bg-white text-porto-black shadow-sm'
                  : 'text-porto-black/40 hover:text-porto-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'Agenda' && <Agenda />}
        {tab === 'Activities' && name && <Activities currentUser={name} />}
        {tab === 'Snacks' && name && <SnackExchange currentUser={name} />}
      </div>

      {/* Footer */}
      {name && (
        <footer className="max-w-2xl mx-auto px-4 mt-4 mb-8">
          <hr className="border-porto-black/10 mb-4" />
          <div className="flex items-center justify-center">
            <button
              onClick={handleChangeName}
              className="text-sm text-porto-black/40 hover:text-porto-black transition-colors flex items-center gap-1.5"
            >
              <Avatar name={name} size={18} />
              Logged in as <span className="font-medium text-porto-black/60">{name}</span> &middot; change
            </button>
          </div>
        </footer>
      )}
    </>
  )
}
