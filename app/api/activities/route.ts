import { NextResponse } from 'next/server'
import { getActivities, addActivity, deleteActivity } from '@/lib/store'

export async function GET() {
  return NextResponse.json(await getActivities())
}

export async function POST(req: Request) {
  const body = await req.json()
  const activity = await addActivity({
    title: body.title,
    description: body.description || '',
    createdBy: body.createdBy,
    startsAt: body.startsAt,
  })
  return NextResponse.json(activity, { status: 201 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  const ok = await deleteActivity(id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
