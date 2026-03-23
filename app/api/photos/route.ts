import { NextResponse } from 'next/server'
import { getPhotos, addPhoto } from '@/lib/store'

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
