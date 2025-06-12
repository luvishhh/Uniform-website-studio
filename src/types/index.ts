
import type { ObjectId } from 'mongodb';

export type Product = {
  id: string;
  _id?: ObjectId; // For MongoDB
  name: string;
  description: string;
  price: number;
  category: 'School' | 'College';
  institution?: string;
  sizes: string[];
  colors?: string[];
  gender: 'Unisex' | 'Boys' | 'Girls';
  imageUrl: string;
  featured?: boolean;
  // stock?: number; // Removed stock system
  ['data-ai-hint']?: string;
};

export type Category = {
  id:string;
  _id?: ObjectId; // For MongoDB
  name: 'School' | 'College';
  description: string;
  imageUrl: string;
  slug: 'school' | 'college';
  ['data-ai-hint']?: string;
};

// Base User type for common fields
export type BaseUser = {
  id: string; // This will be the string representation of _id
  _id?: ObjectId; // For MongoDB native ID
  email?: string;
  passwordHash: string;
  role: 'student' | 'institution' | 'dealer' | 'admin';
  contactNumber?: string;
  imageUrl?: string; // Added for profile picture
  cart?: CartItem[]; // Added for user's shopping cart
};

export type StudentUser = BaseUser & {
  role: 'student';
  rollNumber: string;
  schoolCollegeName: string;
  fullName: string;
  institutionType: 'school' | 'college';
  gradeOrCourse: string;
  year?: string;
  parentName: string;
  parentContactNumber: string;
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
};

export type InstitutionUser = BaseUser & {
  role: 'institution';
  email: string;
  institutionName: string;
  institutionType: 'school' | 'college';
  institutionalAddress: string;
  contactNumber: string;
};

export type DealerUser = BaseUser & {
  role: 'dealer';
  email: string;
  dealerName: string;
  contactNumber: string;
  businessAddress: string;
  gstinNumber: string;
};

export type AdminUser = BaseUser & {
  role: 'admin';
  email: string;
};

export type User = StudentUser | InstitutionUser | DealerUser | AdminUser;


export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
  ['data-ai-hint']?: string;
};

export type Order = {
  id: string;
  _id?: ObjectId; // For MongoDB
  userId: string; // This should be the string representation of the User's _id
  items: CartItem[];
  totalAmount: number;
  status: 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string; // Should be ISOString
  shippingAddress: {
    name: string;
    email?: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  estimatedDelivery?: string; // Should be ISOString
};

export type Donation = {
  id: string;
  _id?: ObjectId; // For MongoDB
  uniformType: string;
  quantity: number;
  condition: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  submissionDate: string; // Should be ISOString
  status: 'Pending' | 'Collected' | 'Distributed';
};

