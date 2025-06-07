export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'School' | 'Corporate' | 'Healthcare';
  institution?: string; // For school uniforms
  sizes: string[];
  colors?: string[];
  imageUrl: string;
  stock: number;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: 'School' | 'Corporate' | 'Healthcare';
  description: string;
  imageUrl: string;
  slug: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  address?: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  size?: string;
  color?: string;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Placed' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  shippingAddress: {
    name: string;
    email: string;
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: string; // e.g., 'Mock Razorpay'
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
