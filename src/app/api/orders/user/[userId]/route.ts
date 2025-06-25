import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import type { Order } from '@/types'
import { useMockData, mockOrders } from '@/lib/mockData'

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      )
    }
    if (useMockData()) {
      // Filter mockOrders by userId
      const orders = mockOrders.filter((order) => order.userId === userId)
      // Convert to client format (id as string)
      const processedOrders = orders.map((order) => ({
        ...order,
        id: order.id,
      }))
      return NextResponse.json(processedOrders, { status: 200 })
    }
    const db = await connectToDatabase()
    const orders = await db
      .collection<Order>('orders')
      .find({ userId: userId })
      .sort({ orderDate: -1 })
      .toArray()
    const processedOrders = orders.map((order) => {
      const { _id, ...restOfOrder } = order
      return {
        ...restOfOrder,
        id: _id ? _id.toString() : '',
      }
    })
    return NextResponse.json(processedOrders, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
