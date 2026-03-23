'use client'

import { useState, useEffect } from 'react'
import NamePrompt from '@/components/NamePrompt'
import Agenda from '@/components/Agenda'
import Activities from '@/components/Activities'
import PhotoWall from '@/components/PhotoWall'
import SnackExchange from '@/components/SnackExchange'
import Avatar from '@/components/Avatar'

const TABS = ['Agenda', 'Activities', 'Snacks', 'Photos'] as const
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

  if (!loaded) return null

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
        {tab === 'Photos' && name && <PhotoWall currentUser={name} />}
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
