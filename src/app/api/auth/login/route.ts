
import { connectToDatabase } from '@/lib/mongodb';
import type { User, StudentUser } from '@/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse }_from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { identifier, password, role } = body; // identifier can be email or rollNumber

    if (!identifier || !password || !role) {
      return NextResponse.json({ message: 'Identifier, password, and role are required' }, { status: 400 });
    }

    let user: User | null = null;

    if (role === 'student') {
      user = await db.collection<StudentUser>('users').findOne({ rollNumber: identifier, role: 'student' });
    } else if (['institution', 'dealer', 'admin'].includes(role)) {
      user = await db.collection<User>('users').findOne({ email: identifier, role: role });
    } else {
      return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials or user not found for this role' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user._id?.toString() || user.id, // Use _id if available from MongoDB
      role: user.role,
      email: user.email, // Could be undefined for students
      name: role === 'student' ? (user as StudentUser).fullName : (user as any).institutionName || (user as any).dealerName || user.email,
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    const cookieStore = cookies();
    cookieStore.set('unishop_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
    });

    // Exclude passwordHash from the returned user object
    const { passwordHash, ...userWithoutPassword } = user;
    
    // Ensure _id is converted to id string
    if (userWithoutPassword._id) {
        userWithoutPassword.id = userWithoutPassword._id.toString();
        delete userWithoutPassword._id;
    }


    return NextResponse.json({ 
        message: 'Login successful', 
        token, // Also returning token in body for client-side access if needed (e.g., for header state)
        user: userWithoutPassword 
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
