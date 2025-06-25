import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import type { Order, CartItem } from '@/types'
import { ObjectId } from 'mongodb'
import { useMockData, mockOrders } from '@/lib/mockData'

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      razorpayOrderId, // Optional, if payment was via Razorpay
      razorpayPaymentId,
      razorpaySignature,
    } = body

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !shippingAddress ||
      !paymentMethod
    ) {
      return NextResponse.json(
        { message: 'Missing required order fields' },
        { status: 400 }
      )
    }

    if (useMockData()) {
      // Simulate order creation in mock mode
      const newOrder: Order = {
        id: `mock_order_${mockOrders.length + 1}`,
        userId,
        items: items as CartItem[],
        totalAmount: parseFloat(totalAmount),
        status: 'Pending Dealer Assignment',
        orderDate: new Date().toISOString(),
        shippingAddress,
        paymentMethod,
        assignedDealerId: null,
        ...(razorpayOrderId && { razorpayOrderId }),
        ...(razorpayPaymentId && { razorpayPaymentId }),
        ...(razorpaySignature && { razorpaySignature }),
      }
      // Optionally, push to mockOrders array if you want to persist in-memory (not required)
      return NextResponse.json(
        { message: 'Order created successfully (mock)', order: newOrder },
        { status: 201 }
      )
    }

    // Basic validation for userId format (if you expect ObjectId string)
    // if (!ObjectId.isValid(userId)) {
    //     return NextResponse.json({ message: 'Invalid userId format' }, { status: 400 });
    // }

    const newOrderData: Omit<Order, 'id' | '_id'> = {
      userId: userId, // Assuming userId is already a string representation of the user's _id
      items: items as CartItem[],
      totalAmount: parseFloat(totalAmount),
      status: 'Pending Dealer Assignment', // Default status for new orders
      orderDate: new Date().toISOString(),
      shippingAddress,
      paymentMethod,
      assignedDealerId: null, // Initially no dealer assigned
      // Store Razorpay details if provided
      ...(razorpayOrderId && { razorpayOrderId }),
      ...(razorpayPaymentId && { razorpayPaymentId }),
      ...(razorpaySignature && { razorpaySignature }),
    }

    const db = await connectToDatabase()
    const result = await db.collection('orders').insertOne(newOrderData as any)

    if (!result.insertedId) {
      return NextResponse.json(
        { message: 'Failed to create order' },
        { status: 500 }
      )
    }

    const createdOrder: Order = {
      ...newOrderData,
      id: result.insertedId.toString(),
      _id: result.insertedId,
    }

    return NextResponse.json(
      { message: 'Order created successfully', order: createdOrder },
      { status: 201 }
    )
  } catch (error) {
    console.error('Failed to create order:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
