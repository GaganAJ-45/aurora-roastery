import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type OrderItemInput = {
  productId: string
  quantity: number
  price: number
}

type CreateOrderBody = {
  items: OrderItemInput[]
  storeId: string
  totalAmount: number
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: session.user.id },
          { email: session.user.email },
        ],
      },
      select: {
        id: true,
      },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Session is out of date. Please sign in again.' },
        { status: 401 }
      )
    }

    const { items, storeId, totalAmount } = (await req.json()) as CreateOrderBody

    if (!items.length) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    // Validate store existence (using findFirst for slug or just check ID)
    const store = await prisma.store.findFirst({
      where: {
        OR: [
          { id: storeId },
          { name: { contains: storeId, mode: 'insensitive' } }
        ]
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 400 })
    }

    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true,
      },
      select: {
        id: true,
        price: true,
      },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Your cart contains outdated products. Please add them again from the menu.' },
        { status: 409 }
      )
    }

    const productMap = new Map(products.map((product) => [product.id, product]))

    // Create Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: currentUser.id,
          storeId: store.id,
          totalAmount: totalAmount,
          status: 'PENDING',
          items: {
            create: items.map((item) => {
              const product = productMap.get(item.productId)

              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product?.price ?? item.price,
              }
            }),
          },
        },
      })

      // 2. Add Points (1pt per $1 rounded down)
      const pointsToAdd = Math.floor(totalAmount)
      await tx.user.update({
        where: { id: currentUser.id },
        data: { points: { increment: pointsToAdd } },
      })

      // 3. Log Reward History
      await tx.rewardHistory.create({
        data: {
          userId: currentUser.id,
          points: pointsToAdd,
          description: `Spent $${totalAmount.toFixed(2)} at Aurora Roastery.`,
        },
      })

      return newOrder
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
