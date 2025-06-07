
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'School' | 'College'; // Updated category
  institution?: string; // School/College Name
  sizes: string[];
  colors?: string[];
  gender: 'Unisex' | 'Boys' | 'Girls';
  imageUrl: string;
  // stock: number; // Removed stock
  featured?: boolean;
  ['data-ai-hint']?: string;
};

export type Category = {
  id:string;
  name: 'School' | 'College'; // Updated category name
  description: string;
  imageUrl: string;
  slug: 'school' | 'college'; // Updated slug options
  ['data-ai-hint']?: string;
};

// Base User type for common fields
export type BaseUser = {
  id: string;
  email?: string; // Optional for students who use roll number
  passwordHash: string; // Store hashed passwords in a real app
  role: 'student' | 'institution' | 'dealer' | 'admin';
  contactNumber?: string;
};

export type StudentUser = BaseUser & {
  role: 'student';
  rollNumber: string;
  schoolCollegeName: string;
  fullName: string;
  institutionType: 'school' | 'college';
  gradeOrCourse: string; // e.g., "10th Grade" or "B.Sc. Computer Science"
  year?: string; // e.g., "1st Year", "Final Year" (for college)
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
  email: string; // Mandatory for institution
  institutionName: string;
  institutionType: 'school' | 'college';
  institutionalAddress: string; // Can be a simple string or a structured address object
  contactNumber: string; // Mandatory for institution
};

export type DealerUser = BaseUser & {
  role: 'dealer';
  email: string; // Mandatory for dealer
  dealerName: string;
  contactNumber: string; // Mandatory for dealer
  businessAddress: string;
  gstinNumber: string;
};

export type AdminUser = BaseUser & {
  role: 'admin';
  email: string; // Mandatory for admin
  // any other admin-specific fields
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
  userId: string; // Should correspond to a User's id
  items: CartItem[];
  totalAmount: number;
  status: 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  shippingAddress: {
    name: string;
    email?: string; // Student might use parent's email or school's
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  estimatedDelivery?: string;
};

export type Donation = {
  id: string;
  uniformType: string;
  quantity: number;
  condition: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  submissionDate: string;
  status: 'Pending' | 'Collected' | 'Distributed';
};

