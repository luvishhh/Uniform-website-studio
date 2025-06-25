import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type {
  User,
  StudentUser,
  InstitutionUser,
  DealerUser,
  CartItem,
} from '@/types' // Ensure all specific user types are imported
import bcrypt from 'bcryptjs'

// Type guard for User
function isUser(obj: any): obj is User {
  return obj && typeof obj === 'object' && typeof obj.role === 'string'
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params

    if (!userId) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
    }

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 })
    }
    const db = await connectToDatabase()
    const dbUser = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(userId) })
    if (!isUser(dbUser)) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const { passwordHash, _id, ...userWithoutPasswordAndMongoId } = dbUser
    const finalUser = {
      ...userWithoutPasswordAndMongoId,
      id: _id ? _id.toString() : dbUser.id,
      cart: dbUser.cart || [],
    }
    return NextResponse.json(finalUser, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: userId } = await params

    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword, cart, ...updateData } = body

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      )
    }
    const db = await connectToDatabase()
    const dbUser = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(userId) })
    if (!isUser(dbUser)) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    // Password update logic
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Current password is required to set a new password' },
          { status: 400 }
        )
      }
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        dbUser.passwordHash
      )
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Incorrect current password' },
          { status: 403 }
        )
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10)
    }
    // Cart update logic
    if (cart !== undefined && Array.isArray(cart)) {
      updateData.cart = cart as CartItem[] // Type assertion after validation
    } else if (cart !== undefined) {
      // If 'cart' is present but not an array, it's a bad request
      return NextResponse.json(
        { message: 'Invalid cart format. Expected an array.' },
        { status: 400 }
      )
    }
    // Prevent role and email from being updated directly via this route for non-admins
    // and ensure specific fields are updated based on role if needed.
    delete updateData.role
    delete updateData.email
    delete updateData.rollNumber
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          message:
            'No update data provided or only cart was updated (which is fine).',
          user: dbUser,
        },
        { status: 200 }
      )
    }
    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateData })
    if (result.matchedCount === 0) {
      // This case should ideally be caught by the initial user find.
      return NextResponse.json(
        { message: 'User not found for update (though found initially)' },
        { status: 404 }
      )
    }
    // Fetch the updated user to return
    const updatedUserDoc = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(userId) })
    if (!isUser(updatedUserDoc)) {
      return NextResponse.json(
        { message: 'Failed to retrieve updated user' },
        { status: 500 }
      )
    }
    const {
      passwordHash: ph,
      _id,
      ...userWithoutPasswordAndMongoId
    } = updatedUserDoc
    const finalUser = {
      ...userWithoutPasswordAndMongoId,
      id: _id ? _id.toString() : updatedUserDoc.id,
      cart: updatedUserDoc.cart || [], // Ensure cart is always an array
    }
    return NextResponse.json(
      { message: 'Profile updated successfully', user: finalUser },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to update user profile:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
