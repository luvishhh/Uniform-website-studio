
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
    let existingUserQuery: any = { role };
    let identifierField: string;

    if (role === 'student') {
        if (!userData.rollNumber) return NextResponse.json({ message: 'Roll number is required for student registration.' }, { status: 400 });
        existingUserQuery.rollNumber = userData.rollNumber;
        identifierField = 'Roll number';
    } else { // institution, dealer, admin
        if (!userData.email) return NextResponse.json({ message: 'Email is required for this role.' }, { status: 400 });
        existingUserQuery.email = userData.email;
        identifierField = 'Email';
    }
    
    const existingUser = await db.collection<User>('users').findOne(existingUserQuery);

    if (existingUser) {
      return NextResponse.json({ message: `${identifierField} already exists for this role.` }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUserObject: Omit<User, 'id' | '_id'> & { cart: CartItem[] }; // Prepare object for insertion, without _id or string id

    switch (role) {
      case 'student':
        if (!userData.schoolCollegeName || !userData.fullName || !userData.institutionType || !userData.gradeOrCourse || !userData.parentName || !userData.parentContactNumber) {
          return NextResponse.json({ message: 'Missing required student fields' }, { status: 400 });
        }
        newUserObject = {
          ...userData,
          role: 'student',
          passwordHash: hashedPassword,
          cart: [], 
        } as Omit<StudentUser, 'id' | '_id'> & { cart: CartItem[] };
        break;
      case 'institution':
        if (!userData.institutionName || !userData.institutionType || !userData.institutionalAddress || !userData.contactNumber) {
          return NextResponse.json({ message: 'Missing required institution fields' }, { status: 400 });
        }
        newUserObject = {
          ...userData,
          role: 'institution',
          passwordHash: hashedPassword,
          cart: [], 
        } as Omit<InstitutionUser, 'id' | '_id'> & { cart: CartItem[] };
        break;
      case 'dealer':
         if (!userData.dealerName || !userData.contactNumber || !userData.businessAddress || !userData.gstinNumber) {
          return NextResponse.json({ message: 'Missing required dealer fields' }, { status: 400 });
        }
        newUserObject = {
          ...userData,
          role: 'dealer',
          passwordHash: hashedPassword,
          cart: [], 
        } as Omit<DealerUser, 'id' | '_id'> & { cart: CartItem[] };
        break;
      case 'admin': 
        newUserObject = {
            ...userData,
            role: 'admin',
            passwordHash: hashedPassword,
            cart: [],
        } as Omit<AdminUser, 'id' | '_id'> & { cart: CartItem[] };
        break;
      default:
        return NextResponse.json({ message: 'Invalid user role' }, { status: 400 });
    }

    const result = await db.collection('users').insertOne(newUserObject as any); // Insert without _id

    if (!result.insertedId) {
        return NextResponse.json({ message: 'Failed to register user' }, { status: 500 });
    }
    
    // Exclude passwordHash from the returned user object
    const { passwordHash: ph, ...userWithoutPassword } = newUserObject;

    return NextResponse.json({ 
        message: 'User registered successfully', 
        user: { ...userWithoutPassword, id: result.insertedId.toString()} 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ message: `Internal server error: ${errorMessage}` }, { status: 500 });
  }
}
