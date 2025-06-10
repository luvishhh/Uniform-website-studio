import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { User } from '@/types';

// Basic validation for data URI (not exhaustive)
const isValidDataUrl = (s: string) => s.startsWith('data:image/') && s.includes(';base64,');

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { avatarDataUrl } = body;

    if (!avatarDataUrl || typeof avatarDataUrl !== 'string') {
      return NextResponse.json({ message: 'Avatar data URL is required and must be a string' }, { status: 400 });
    }

    if (!isValidDataUrl(avatarDataUrl)) {
        return NextResponse.json({ message: 'Invalid avatar data URL format.' }, { status: 400 });
    }
    
    // Optional: Add a size check for the base64 string if desired (e.g., < 2MB)
    // const base64SizeInBytes = avatarDataUrl.length * (3/4) - (avatarDataUrl.endsWith('==') ? 2 : avatarDataUrl.endsWith('=') ? 1 : 0);
    // if (base64SizeInBytes > 2 * 1024 * 1024) { // 2MB limit
    //   return NextResponse.json({ message: 'Image is too large. Maximum 2MB allowed.' }, { status: 413 });
    // }


    const db = await connectToDatabase();
    const result = await db.collection<User>('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { imageUrl: avatarDataUrl } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    if (result.modifiedCount === 0 && result.matchedCount === 1) {
      // This could mean the new URL is the same as the old one, or no actual change was made.
      // Still, we can consider it a "successful" operation in that the document matches.
      return NextResponse.json({ message: 'Avatar is already up to date or no change made.', imageUrl: avatarDataUrl }, { status: 200 });
    }

    return NextResponse.json({ message: 'Avatar updated successfully', imageUrl: avatarDataUrl }, { status: 200 });

  } catch (error) {
    console.error('Failed to update avatar:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}