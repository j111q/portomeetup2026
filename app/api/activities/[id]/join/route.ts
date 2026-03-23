import { NextResponse } from 'next/server'
import { joinActivity, leaveActivity } from '@/lib/store'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  const { id } = params
  const activity = body.leave
    ? leaveActivity(id, body.name)
    : joinActivity(id, body.name)
  if (!activity) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(activity)
}
