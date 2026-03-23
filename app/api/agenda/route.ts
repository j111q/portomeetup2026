import { NextResponse } from 'next/server'
import { getAgenda, addAgendaItem, deleteAgendaItem } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getAgenda())
}

export async function POST(req: Request) {
  const body = await req.json()
  const item = addAgendaItem({
    title: body.title,
    description: body.description || '',
    startTime: body.startTime,
    endTime: body.endTime || '',
    location: body.location || '',
    sortOrder: body.sortOrder ?? Date.now(),
  })
  return NextResponse.json(item, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const ok = deleteAgendaItem(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
