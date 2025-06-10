
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { User } from '@/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Moved params access after the first await
    // const userId = params.id; 

    // Example: If there was a request body read, it would be here
    // await request.text(); // Or some other awaitable operation on request

    const db = await connectToDatabase();
    const userId = params.id; // Access params after the first relevant await

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await db.collection<User>('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Exclude passwordHash from the returned user object
    const { passwordHash, ...userWithoutPassword } = user;
    
    // Ensure _id is converted to id string for consistency on client
    const finalUser = {
        ...userWithoutPassword,
        id: user._id!.toString() // _id is guaranteed to exist if user is found
    };
    if (finalUser._id) delete (finalUser as any)._id;


    return NextResponse.json(finalUser, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}

