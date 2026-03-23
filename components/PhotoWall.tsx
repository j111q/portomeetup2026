'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Photo {
  id: string
  dataUrl: string
  caption: string
  uploadedBy: string
  createdAt: string
}

export default function PhotoWall({ currentUser }: { currentUser: string }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
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
          caption,
          uploadedBy: currentUser,
        }),
      })
      setCaption('')
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Photos</h2>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 mb-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
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
          <p className="text-gray-500">Uploading...</p>
        ) : (
          <>
            <p className="text-3xl mb-2">📸</p>
            <p className="text-gray-500">
              Drop a photo here or <span className="text-blue-600 font-medium">click to upload</span>
            </p>
          </>
        )}
      </div>

      {/* Caption input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Add a caption for your next upload (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-2">🖼️</p>
          <p>No photos yet. Share the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-200 cursor-pointer"
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.dataUrl}
                alt={photo.caption || 'Meetup photo'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.caption && (
                  <p className="text-white text-sm font-medium">{photo.caption}</p>
                )}
                <p className="text-white/70 text-xs">{photo.uploadedBy}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.dataUrl}
              alt={lightbox.caption || 'Meetup photo'}
              className="max-w-full max-h-[80vh] rounded-lg object-contain"
            />
            <div className="mt-3 text-white">
              {lightbox.caption && (
                <p className="font-medium">{lightbox.caption}</p>
              )}
              <p className="text-white/60 text-sm">
                by {lightbox.uploadedBy} &middot;{' '}
                {new Date(lightbox.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
