import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stores = await prisma.store.findMany()
    return NextResponse.json(stores)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}
