'use client'

import { useState, useEffect } from 'react'
import NamePrompt from '@/components/NamePrompt'
import Agenda from '@/components/Agenda'
import Activities from '@/components/Activities'
import PhotoWall from '@/components/PhotoWall'

const TABS = ['Agenda', 'Activities', 'Photos'] as const
type Tab = (typeof TABS)[number]

export default function Home() {
  const [name, setName] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('Activities')
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

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Meetup Buddy</h1>
          {name && (
            <button
              onClick={handleChangeName}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Hi, <span className="font-medium">{name}</span> (change)
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'Agenda' && <Agenda />}
        {tab === 'Activities' && name && <Activities currentUser={name} />}
        {tab === 'Photos' && name && <PhotoWall currentUser={name} />}
      </div>
    </>
  )
}
