
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import type { Order, OrderStatus } from '@/types';
import { ObjectId } from 'mongodb';

// GET /api/orders/[orderId] - Get a single order by ID
export async function GET(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const db = await connectToDatabase();
    const { orderId } = params;

    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: 'Invalid order ID format' }, { status: 400 });
    }

    const order = await db.collection<Order>('orders').findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Convert _id to string id for client consistency
    const { _id, ...restOfOrder } = order;
    const orderToReturn = { ...restOfOrder, id: _id!.toString() };

    return NextResponse.json(orderToReturn, { status: 200 });
  } catch (error) {
    console.error(`Failed to fetch order ${params.orderId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}


// PATCH /api/orders/[orderId] - Update order status or dealer assignment
export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const db = await connectToDatabase();
    const { orderId } = params;

    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: 'Invalid order ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { status, assignedDealerId, dealerRejectionReason } = body as { 
        status?: OrderStatus; 
        assignedDealerId?: string | null; 
        dealerRejectionReason?: string;
    };

    if (!status && assignedDealerId === undefined && !dealerRejectionReason) {
      return NextResponse.json({ message: 'No update fields provided (status, assignedDealerId, or dealerRejectionReason)' }, { status: 400 });
    }

    const updateFields: Partial<Order> = {};
    if (status) updateFields.status = status;
    if (assignedDealerId !== undefined) updateFields.assignedDealerId = assignedDealerId; // Allow setting to null
    if (dealerRejectionReason) updateFields.dealerRejectionReason = dealerRejectionReason;
    if (status === 'Pending Dealer Assignment' && assignedDealerId === undefined) { // If rejected, clear dealer
        updateFields.assignedDealerId = null;
    }


    const result = await db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: updateFields },
      { returnDocument: 'after' } // Return the updated document
    );
    
    if (!result) { // If findOneAndUpdate returns null (MongoDB Driver v4+ syntax for .value)
        return NextResponse.json({ message: 'Order not found or no update made' }, { status: 404 });
    }
    
    const updatedOrder = result as Order; // Type assertion after successful update
    // Convert _id to string id for client consistency
    const { _id, ...restOfOrder } = updatedOrder;
    const orderToReturn = { ...restOfOrder, id: _id!.toString() };


    return NextResponse.json({ message: 'Order updated successfully', order: orderToReturn }, { status: 200 });

  } catch (error) {
    console.error(`Failed to update order ${params.orderId}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
