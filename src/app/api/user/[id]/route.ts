
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { User, StudentUser, InstitutionUser, DealerUser } from '@/types'; // Ensure all specific user types are imported
import bcrypt from 'bcryptjs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase();
    const userId = params.id; 

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
    }

    const user = await db.collection<User>('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { passwordHash, _id, ...userWithoutPasswordAndMongoId } = user;
    
    const finalUser = {
        ...userWithoutPasswordAndMongoId,
        id: _id!.toString() 
    };

    return NextResponse.json(finalUser, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await connectToDatabase();
    const userId = params.id;

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, ...updateData } = body;

    const user = await db.collection<User>('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Password update logic
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Current password is required to set a new password' }, { status: 400 });
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Incorrect current password' }, { status: 403 });
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Prevent role and email from being updated directly via this route for non-admins
    // and ensure specific fields are updated based on role if needed.
    // Example: if (user.role === 'student') { updateData.schoolCollegeName = body.schoolCollegeName }
    // For simplicity, we'll allow updating fields present in updateData, excluding sensitive ones like 'role'.
    delete updateData.role; 
    delete updateData.email; // Email change typically requires verification, handle elsewhere or by admin.
    delete updateData.rollNumber; // Roll number should not be changed.
    

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found for update (though found initially)' }, { status: 404 });
    }
    
    // Fetch the updated user to return
    const updatedUser = await db.collection<User>('users').findOne({ _id: new ObjectId(userId) });
    if (!updatedUser) { // Should not happen if update was successful
        return NextResponse.json({ message: 'Failed to retrieve updated user' }, { status: 500 });
    }

    const { passwordHash, _id, ...userWithoutPasswordAndMongoId } = updatedUser;
    const finalUser = {
        ...userWithoutPasswordAndMongoId,
        id: _id!.toString()
    };

    return NextResponse.json({ message: 'Profile updated successfully', user: finalUser }, { status: 200 });

  } catch (error) {
    console.error('Failed to update user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
