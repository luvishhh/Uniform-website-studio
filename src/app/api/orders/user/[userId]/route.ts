
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { Order } from '@/types';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    // const userId = params.userId; // Moved params access

    const db = await connectToDatabase(); // First await
    const userId = params.userId; // Access params after the first relevant await

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Assuming orders collection stores userId as a string matching user.id (which is string version of user._id)
    const orders = await db.collection<Order>('orders').find({ userId: userId }).sort({ orderDate: -1 }).toArray();

    // find().toArray() returns [] if no docs match, which is not !orders.
    // If orders is an empty array, it's a valid response (user has no orders).
    // A 404 might be more appropriate if the user itself wasn't found, handled elsewhere.
    // For now, returning empty array for no orders is fine.
    // if (!orders || orders.length === 0) { 
    //   return NextResponse.json({ message: 'No orders found for this user' }, { status: 404 });
    // }
    
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
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
