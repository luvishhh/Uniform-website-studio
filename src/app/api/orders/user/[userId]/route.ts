
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { Order } from '@/types';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const db = await connectToDatabase();
    // Assuming orders collection stores userId as a string matching user.id (which is string version of user._id)
    const orders = await db.collection<Order>('orders').find({ userId: userId }).sort({ orderDate: -1 }).toArray();

    if (!orders) {
      return NextResponse.json({ message: 'No orders found for this user' }, { status: 404 });
    }
    
    // Ensure _id is converted to id string for consistency on client
    const processedOrders = orders.map(order => {
        const { _id, ...restOfOrder } = order;
        return {
            ...restOfOrder,
            id: _id ? _id.toString() : '' // Handle if _id is somehow missing, though unlikely
        };
    });

    return NextResponse.json(processedOrders, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
