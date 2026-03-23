import { NextResponse } from 'next/server'
import { getActivities, addActivity } from '@/lib/store'

export async function GET() {
  return NextResponse.json(getActivities())
}

export async function POST(req: Request) {
  const body = await req.json()
  const activity = addActivity({
    title: body.title,
    description: body.description || '',
    createdBy: body.createdBy,
    startsAt: body.startsAt,
  })
  return NextResponse.json(activity, { status: 201 })
}
