
import { connectToDatabase } from '@/lib/mongodb';
import type { StudentUser, InstitutionUser, DealerUser, AdminUser, User, CartItem } from '@/types';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();

    const { role, password, ...userData } = body;

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 });
    }
    if (!role || !['student', 'institution', 'dealer', 'admin'].includes(role)) {
        return NextResponse.json({ message: 'Valid role is required' }, { status: 400 });
    }

    // Check if user already exists
    let existingUser;
    if (role === 'student' && userData.rollNumber) {
      existingUser = await db.collection<User>('users').findOne({ role: 'student', rollNumber: userData.rollNumber });
    } else if (userData.email) {
      existingUser = await db.collection<User>('users').findOne({ email: userData.email, role });
    }

    if (existingUser) {
      const identifier = role === 'student' ? 'Roll number' : 'Email';
      return NextResponse.json({ message: `${identifier} already exists for this role.` }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser: Omit<User, 'id'> & { _id?: ObjectId; cart: CartItem[] };

    switch (role) {
      case 'student':
        if (!userData.rollNumber || !userData.schoolCollegeName || !userData.fullName || !userData.institutionType || !userData.gradeOrCourse || !userData.parentName || !userData.parentContactNumber) {
          return NextResponse.json({ message: 'Missing required student fields' }, { status: 400 });
        }
        newUser = {
          ...userData,
          role: 'student',
          passwordHash: hashedPassword,
          cart: [], // Initialize empty cart
        } as Omit<StudentUser, 'id'> & { cart: CartItem[] };
        break;
      case 'institution':
        if (!userData.email || !userData.institutionName || !userData.institutionType || !userData.institutionalAddress || !userData.contactNumber) {
          return NextResponse.json({ message: 'Missing required institution fields' }, { status: 400 });
        }
        newUser = {
          ...userData,
          role: 'institution',
          passwordHash: hashedPassword,
          cart: [], // Initialize empty cart
        } as Omit<InstitutionUser, 'id'> & { cart: CartItem[] };
        break;
      case 'dealer':
         if (!userData.email || !userData.dealerName || !userData.contactNumber || !userData.businessAddress || !userData.gstinNumber) {
          return NextResponse.json({ message: 'Missing required dealer fields' }, { status: 400 });
        }
        newUser = {
          ...userData,
          role: 'dealer',
          passwordHash: hashedPassword,
          cart: [], // Initialize empty cart
        } as Omit<DealerUser, 'id'> & { cart: CartItem[] };
        break;
      case 'admin': // Basic admin registration, could be more restricted
        if (!userData.email) {
             return NextResponse.json({ message: 'Email is required for admin' }, { status: 400 });
        }
        newUser = {
            ...userData,
            role: 'admin',
            passwordHash: hashedPassword,
            cart: [], // Initialize empty cart
        } as Omit<AdminUser, 'id'> & { cart: CartItem[] };
        break;
      default:
        return NextResponse.json({ message: 'Invalid user role' }, { status: 400 });
    }

    const result = await db.collection('users').insertOne(newUser);

    if (!result.insertedId) {
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
    
    // Exclude passwordHash from the returned user object
    const { passwordHash, ...userWithoutPassword } = newUser;

    return NextResponse.json({ message: 'User registered successfully', user: { ...userWithoutPassword, id: result.insertedId.toString()} }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}

