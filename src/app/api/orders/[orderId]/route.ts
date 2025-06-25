import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import type { Order, OrderStatus } from '@/types'
import { ObjectId } from 'mongodb'
import { useMockData, mockOrders } from '@/lib/mockData'

// GET /api/orders/[orderId] - Get a single order by ID
export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    if (!orderId) {
      return NextResponse.json(
        { message: 'Invalid order ID format' },
        { status: 400 }
      )
    }
    if (useMockData()) {
      const order = mockOrders.find((o) => o.id === orderId)
      if (!order) {
        return NextResponse.json(
          { message: 'Order not found (mock)' },
          { status: 404 }
        )
      }
      return NextResponse.json(order, { status: 200 })
    }
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: 'Invalid order ID format' },
        { status: 400 }
      )
    }
    const db = await connectToDatabase()
    const order = await db
      .collection<Order>('orders')
      .findOne({ _id: new ObjectId(orderId) })
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    const { _id, ...restOfOrder } = order
    const orderToReturn = { ...restOfOrder, id: _id!.toString() }
    return NextResponse.json(orderToReturn, { status: 200 })
  } catch (error) {
    console.error(`Failed to fetch order ${params.orderId}:`, error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// PATCH /api/orders/[orderId] - Update order status or dealer assignment
export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    if (!orderId) {
      return NextResponse.json(
        { message: 'Invalid order ID format' },
        { status: 400 }
      )
    }
    const body = await request.json()
    const { status, assignedDealerId, dealerRejectionReason } = body as {
      status?: OrderStatus
      assignedDealerId?: string | null
      dealerRejectionReason?: string
    }
    if (useMockData()) {
      // Simulate update in mock mode
      const order = mockOrders.find((o) => o.id === orderId)
      if (!order) {
        return NextResponse.json(
          { message: 'Order not found (mock)' },
          { status: 404 }
        )
      }
      // Simulate update
      const updatedOrder = { ...order }
      if (status) updatedOrder.status = status
      if (assignedDealerId !== undefined)
        updatedOrder.assignedDealerId = assignedDealerId
      if (dealerRejectionReason)
        updatedOrder.dealerRejectionReason = dealerRejectionReason
      return NextResponse.json(updatedOrder, { status: 200 })
    }
    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: 'Invalid order ID format' },
        { status: 400 }
      )
    }
    const db = await connectToDatabase()
    const updateFields: Partial<Order> = {}
    if (status) updateFields.status = status
    if (assignedDealerId !== undefined)
      updateFields.assignedDealerId = assignedDealerId
    if (dealerRejectionReason)
      updateFields.dealerRejectionReason = dealerRejectionReason
    if (
      status === 'Pending Dealer Assignment' &&
      assignedDealerId === undefined
    ) {
      updateFields.assignedDealerId = null
    }
    const result = await db
      .collection('orders')
      .findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $set: updateFields },
        { returnDocument: 'after' }
      )
    if (!result) {
      return NextResponse.json(
        { message: 'Order not found or no update made' },
        { status: 404 }
      )
    }
    const updatedOrder = result as Order
    const { _id, ...restOfOrder } = updatedOrder
    return NextResponse.json(
      { ...restOfOrder, id: _id ? _id.toString() : '' },
      { status: 200 }
    )
  } catch (error) {
    console.error(`Failed to update order ${params.orderId}:`, error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
