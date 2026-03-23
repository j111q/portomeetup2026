'use client'

import { useState, useEffect, useCallback } from 'react'

interface AgendaItem {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
}

export default function Agenda() {
  const [items, setItems] = useState<AgendaItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/agenda')
    setItems(await res.json())
  }, [])

  useEffect(() => {
    fetchItems()
    const interval = setInterval(fetchItems, 5000)
    return () => clearInterval(interval)
  }, [fetchItems])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !startTime) return
    await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, startTime, endTime, description, location }),
    })
    setTitle('')
    setStartTime('')
    setEndTime('')
    setDescription('')
    setLocation('')
    setShowForm(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    await fetch('/api/agenda', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchItems()
  }

  const formatTime = (iso: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Agenda</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border p-4 mb-6 space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!title.trim() || !startTime}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Add to Agenda
          </button>
        </form>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">📋</p>
          <p>No agenda items yet. Add the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border p-4 flex gap-4"
            >
              <div className="text-sm text-blue-600 font-medium whitespace-nowrap pt-0.5">
                {formatTime(item.startTime)}
                {item.endTime && (
                  <>
                    <br />
                    <span className="text-gray-400">to {formatTime(item.endTime)}</span>
                  </>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{item.title}</h3>
                {item.location && (
                  <p className="text-sm text-gray-500">📍 {item.location}</p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-gray-300 hover:text-red-500 transition-colors self-start"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
