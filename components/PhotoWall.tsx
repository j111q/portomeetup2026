'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Avatar from './Avatar'

interface Photo {
  id: string
  dataUrl: string
  caption: string
  uploadedBy: string
  createdAt: string
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export default function PhotoWall({ currentUser }: { currentUser: string }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = useCallback(async () => {
    const res = await fetch('/api/photos')
    setPhotos(await res.json())
  }, [])

  useEffect(() => {
    fetchPhotos()
    const interval = setInterval(fetchPhotos, 5000)
    return () => clearInterval(interval)
  }, [fetchPhotos])

  const uploadFile = async (file: File) => {
    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl: reader.result,
          caption: '',
          uploadedBy: currentUser,
        }),
      })
      setUploading(false)
      fetchPhotos()
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) uploadFile(file)
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const downloadSelected = () => {
    photos
      .filter((p) => selected.has(p.id))
      .forEach((p, i) => {
        setTimeout(() => downloadDataUrl(p.dataUrl, `porto-meetup-${i + 1}.jpg`), i * 200)
      })
    setSelected(new Set())
    setSelectMode(false)
  }

  const downloadAll = () => {
    photos.forEach((p, i) => {
      setTimeout(() => downloadDataUrl(p.dataUrl, `porto-meetup-${i + 1}.jpg`), i * 200)
    })
  }

  const handleDeletePhoto = async (id: string) => {
    await fetch('/api/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setLightbox(null)
    fetchPhotos()
  }

  const handlePhotoClick = (photo: Photo) => {
    if (selectMode) {
      toggleSelect(photo.id)
    } else {
      setLightbox(photo)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1">Gallery</h2>
      <p className="text-xs text-porto-black/40 mb-5">A shared moodboard with better lighting</p>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-gray-50 rounded-xl border-2 border-dashed border-porto-black/50 p-6 mb-6 text-center hover:border-porto-red transition-colors cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <p className="text-porto-black/50">Uploading...</p>
        ) : (
          <>
            <p className="text-3xl mb-2">📸</p>
            <p className="text-porto-black/50 font-medium">Post the evidence</p>
            <p className="text-porto-black/30 text-xs mt-1">
              Drop a photo or <span className="text-porto-red font-bold">click to upload</span>. PNG, JPG, and elite taste supported.
            </p>
          </>
        )}
      </div>

      {/* Download controls */}
      {photos.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => { setSelectMode(!selectMode); setSelected(new Set()) }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
              selectMode
                ? 'bg-porto-blue text-white border-porto-blue'
                : 'border-porto-black/20 text-porto-black/50 hover:text-porto-black'
            }`}
          >
            {selectMode ? `${selected.size} selected` : 'Select photos'}
          </button>
          {selectMode && selected.size > 0 && (
            <button
              onClick={downloadSelected}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-porto-red text-white hover:bg-porto-red/90 transition-colors"
            >
              Download selected
            </button>
          )}
          {selectMode && (
            <button
              onClick={() => { setSelectMode(false); setSelected(new Set()) }}
              className="text-xs text-porto-black/40 hover:text-porto-black ml-auto"
            >
              Cancel
            </button>
          )}
          {!selectMode && (
            <button
              onClick={downloadAll}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-porto-black/20 text-porto-black/50 hover:text-porto-black transition-colors"
            >
              Download all
            </button>
          )}
        </div>
      )}

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 text-porto-black/30">
          <p className="text-4xl mb-2">🖼️</p>
          <p className="font-bold">The gallery is still in low fidelity</p>
          <p className="text-xs mt-1">Be the first to upload something tasteful and slightly overcomposed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`group relative aspect-square rounded-xl overflow-hidden bg-porto-black/10 cursor-pointer transition-all ${
                selectMode && selected.has(photo.id) ? 'ring-3 ring-porto-blue ring-offset-2' : ''
              }`}
              onClick={() => handlePhotoClick(photo)}
            >
              <img
                src={photo.dataUrl}
                alt="Meetup photo"
                className="w-full h-full object-cover"
              />
              {/* Select checkbox overlay */}
              {selectMode && (
                <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selected.has(photo.id)
                    ? 'bg-porto-blue border-porto-blue text-white'
                    : 'border-white bg-black/20'
                }`}>
                  {selected.has(photo.id) && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 3.5L3.5 6L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              )}
              {/* Hover overlay with avatar */}
              {!selectMode && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-porto-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={photo.uploadedBy} size={16} />
                    <p className="text-white/80 text-xs">{photo.uploadedBy}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-porto-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.dataUrl}
              alt="Meetup photo"
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Avatar name={lightbox.uploadedBy} size={20} />
                <p className="text-white/60 text-sm">
                  {lightbox.uploadedBy} &middot;{' '}
                  {new Date(lightbox.createdAt).toLocaleString([], { timeZone: 'Europe/Lisbon' })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadDataUrl(lightbox.dataUrl, `porto-meetup-${lightbox.id.slice(0, 8)}.jpg`)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-porto-black hover:bg-gray-100 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => { if (confirm('Delete this photo?')) handleDeletePhoto(lightbox.id) }}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-porto-red/20 text-porto-red hover:bg-porto-red/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 bg-white text-porto-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-gray-50"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
