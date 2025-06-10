
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { User } from '@/types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const db = await connectToDatabase();
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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
