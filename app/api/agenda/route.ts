import { NextResponse } from 'next/server'
import { getAgenda } from '@/lib/store'

export async function GET() {
  return NextResponse.json(await getAgenda())
}
