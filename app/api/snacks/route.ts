import { NextResponse } from 'next/server'
import { getSnacks, addSnack, deleteSnack } from '@/lib/store'

export async function GET() {
  return NextResponse.json(await getSnacks())
}

export async function POST(req: Request) {
  const body = await req.json()
  const snack = await addSnack({
    name: body.name,
    description: body.description || '',
    location: body.location,
    country: body.country || '',
    lat: body.lat,
    lng: body.lng,
    dataUrl: body.dataUrl,
    broughtBy: body.broughtBy,
  })
  return NextResponse.json(snack, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const ok = await deleteSnack(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
