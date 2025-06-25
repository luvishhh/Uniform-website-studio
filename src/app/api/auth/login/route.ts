import { connectToDatabase } from '@/lib/mongodb'
import type { User, StudentUser, InstitutionUser, DealerUser } from '@/types'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'
import { useMockData, getUsers } from '@/lib/mockData'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  // In a real app, you might want to log this error or handle it differently
  // For now, throwing an error during server startup is appropriate.
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.')
  throw new Error('JWT_SECRET is not set, authentication cannot proceed.')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { identifier, password, role } = body // identifier can be email or rollNumber

    if (!identifier || !password || !role) {
      return NextResponse.json(
        { message: 'Identifier, password, and role are required' },
        { status: 400 }
      )
    }

    let userFromDb: User | null = null
    let query: any = { role }

    if (role === 'student') {
      query.rollNumber = identifier
    } else if (['institution', 'dealer', 'admin'].includes(role)) {
      query.email = identifier
    } else {
      return NextResponse.json(
        { message: 'Invalid role specified' },
        { status: 400 }
      )
    }

    if (useMockData()) {
      // Use mock users
      const users = await getUsers()
      userFromDb =
        users.find((u) => {
          if (u.role !== role) return false
          if (role === 'student')
            return (u as StudentUser).rollNumber === identifier
          return u.email === identifier
        }) || null
    } else {
      // Use real database
      const db = await connectToDatabase()
      userFromDb = await db.collection<User>('users').findOne(query)
    }

    if (!userFromDb) {
      return NextResponse.json(
        { message: 'Invalid credentials or user not found for this role' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userFromDb.passwordHash
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Ensure _id is converted to string id
    const userIdString = userFromDb._id
      ? userFromDb._id.toString()
      : userFromDb.id // For mock users

    const tokenPayload = {
      userId: userIdString,
      role: userFromDb.role,
      email: userFromDb.email, // Might be undefined for students not providing it
      name:
        role === 'student'
          ? (userFromDb as StudentUser).fullName
          : role === 'institution'
          ? (userFromDb as InstitutionUser).institutionName
          : role === 'dealer'
          ? (userFromDb as DealerUser).dealerName
          : userFromDb.email, // Fallback for admin or others
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' })

    const cookieStore = await cookies()
    await cookieStore.set('unishop_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
    })

    // Exclude passwordHash from the returned user object
    const { passwordHash, _id, ...userWithoutPasswordAndMongoId } = userFromDb

    const userToReturn = {
      ...userWithoutPasswordAndMongoId,
      id: userIdString, // Ensure 'id' field is the string representation
    }

    return NextResponse.json(
      {
        message: 'Login successful',
        token, // Also returning token in body for client-side access if needed
        user: userToReturn,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json(
      { message: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
