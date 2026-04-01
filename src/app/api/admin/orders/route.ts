import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        store: true,
        items: { include: { product: true } }
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status } = await req.json()
    const order = await prisma.order.update({
      where: { id },
      data: { status }
    })

    // If completed, add points to user
    if (status === 'COMPLETED') {
       const o = await prisma.order.findUnique({ where: { id }, include: { user: true } })
       if (o) {
         await prisma.user.update({
           where: { id: o.userId },
           data: { points: { increment: Math.floor(o.totalAmount) } }
         })
         await prisma.rewardHistory.create({
           data: {
             userId: o.userId,
             points: Math.floor(o.totalAmount),
             description: `Earned from Ritual #${id.substring(0,8)}`
           }
         })
       }
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
