
import type { ObjectId } from 'mongodb';

export type Product = {
  id: string; // String representation of _id
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
  ['data-ai-hint']?: string;
};

export type Category = {
  id:string; // String representation of _id
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
  imageUrl?: string;
  cart: CartItem[]; // Ensure cart is part of the base user type and initialized
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
  email: string; // Institution email is mandatory
  institutionName: string;
  institutionType: 'school' | 'college';
  institutionalAddress: string;
  contactNumber: string;
};

export type DealerUser = BaseUser & {
  role: 'dealer';
  email: string; // Dealer email is mandatory
  dealerName: string;
  contactNumber: string;
  businessAddress: string;
  gstinNumber: string;
};

export type AdminUser = BaseUser & {
  role: 'admin';
  email: string; // Admin email is mandatory
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

export type OrderStatus = 
  | 'Pending Payment'
  | 'Pending Dealer Assignment' 
  | 'Awaiting Dealer Acceptance' 
  | 'Processing by Dealer'       
  | 'Dealer Rejected'            
  | 'Placed'                     
  | 'Confirmed'                  
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type Order = {
  id: string; // String representation of _id
  _id?: ObjectId; // For MongoDB
  userId: string; // Store as string, referencing User.id
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
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
  assignedDealerId?: string | null; // Store as string, referencing DealerUser.id
  dealerRejectionReason?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
};

export type Donation = {
  id: string; // String representation of _id
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

export type Review = {
  id: string; // String representation of _id
  _id?: ObjectId; // For MongoDB
  productId: string;
  userId?: string; 
  userName: string;
  avatarUrl?: string; 
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string; // ISOString for review date
  verifiedPurchase?: boolean;
};

