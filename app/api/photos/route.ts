import { NextResponse } from 'next/server'
import { getPhotos, addPhoto, deletePhoto } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getPhotos())
}

export async function POST(req: Request) {
  const body = await req.json()
  const photo = addPhoto({
    dataUrl: body.dataUrl,
    caption: body.caption || '',
    uploadedBy: body.uploadedBy,
  })
  return NextResponse.json(photo, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const ok = deletePhoto(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
