
import type { Product, Category, User, Order, CartItem, Donation, StudentUser, InstitutionUser, DealerUser, AdminUser } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'School & College', description: 'Uniforms for students of all ages and levels.', imageUrl: 'https://placehold.co/600x400.png', slug: 'school-college', "data-ai-hint": "school college" },
];

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Classic School Shirt - White',
    description: 'Comfortable and durable white school shirt made from breathable cotton. Perfect for everyday school wear.',
    price: 20,
    category: 'School & College',
    institution: 'Greenwood High',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 150,
    featured: true,
    "data-ai-hint": "school shirt"
  },
  {
    id: 'prod_2',
    name: 'Navy Blue School Trousers',
    description: 'Smart navy blue school trousers with an adjustable waistband for a comfortable fit.',
    price: 25,
    category: 'School & College',
    institution: 'Oakwood Academy',
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy Blue'],
    gender: 'Boys',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 120,
    featured: true,
    "data-ai-hint": "school trousers"
  },
  {
    id: 'prod_3',
    name: 'Girls School Skirt - Grey',
    description: 'Pleated grey school skirt, durable and comfortable for all-day wear.',
    price: 22,
    category: 'School & College',
    institution: 'Greenwood High',
    sizes: ['S', 'M', 'L'],
    colors: ['Grey'],
    gender: 'Girls',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 90,
    featured: false,
    "data-ai-hint": "school skirt"
  },
  {
    id: 'prod_4',
    name: 'College Blazer - Maroon',
    description: 'Smart maroon college blazer with logo embroidery option. Ideal for formal college events.',
    price: 75,
    category: 'School & College',
    institution: 'City College',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Maroon'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 80,
    featured: true,
    "data-ai-hint": "college blazer"
  },
  {
    id: 'prod_5',
    name: 'Sports T-Shirt - Blue',
    description: 'Breathable sports t-shirt for PE classes and college sports.',
    price: 15,
    category: 'School & College',
    institution: 'Oakwood Academy',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Red', 'Green'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 200,
    "data-ai-hint": "sports t-shirt"
  },
  {
    id: 'prod_6',
    name: 'Lab Coat - Standard',
    description: 'Professional white lab coat for science students.',
    price: 30,
    category: 'School & College',
    institution: 'City College',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 110,
    "data-ai-hint": "lab coat"
  },
];

export const mockUsers: User[] = [
  {
    id: 'stud_1',
    role: 'student',
    rollNumber: 'S1001',
    schoolCollegeName: 'Greenwood High',
    fullName: 'Alice Wonderland',
    institutionType: 'school',
    gradeOrCourse: '10th Grade',
    parentName: 'Queen of Hearts',
    parentContactNumber: '555-1234',
    passwordHash: 'password123', // In real app, this would be a hash
    email: 'alice.parent@example.com', // Parent's or student's email
    address: { street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' }
  } as StudentUser,
  {
    id: 'stud_2',
    role: 'student',
    rollNumber: 'C2002',
    schoolCollegeName: 'City College',
    fullName: 'Bob The Builder',
    institutionType: 'college',
    gradeOrCourse: 'Civil Engineering',
    year: '2nd Year',
    parentName: 'Wendy Builder',
    parentContactNumber: '555-5678',
    passwordHash: 'password123',
    email: 'bob.student@example.com',
    address: { street: '456 Construction Site', city: 'Toolsville', zip: '67890', country: 'BuildWorld' }
  } as StudentUser,
  {
    id: 'inst_1',
    role: 'institution',
    email: 'admin@greenwood.edu',
    institutionName: 'Greenwood High',
    institutionType: 'school',
    institutionalAddress: '1 Learning Lane, Knowledgetown, KT 54321, USA',
    contactNumber: '555-0100',
    passwordHash: 'instPass123',
  } as InstitutionUser,
  {
    id: 'deal_1',
    role: 'dealer',
    email: 'sales@uniformsupplies.com',
    dealerName: 'Uniform Supplies Inc.',
    contactNumber: '555-0200',
    businessAddress: '1 Supplier Road, Commerce City, CC 67890, USA',
    gstinNumber: '22AAAAA0000A1Z5',
    passwordHash: 'dealerPass123',
  } as DealerUser,
  {
    id: 'admin_1',
    role: 'admin',
    email: 'admin@unishop.com',
    passwordHash: 'adminPass123', // Actual admin password
    contactNumber: '555-0001',
  } as AdminUser,
];


export const mockCartItems: CartItem[] = [
  { productId: 'prod_1', name: 'Classic School Shirt - White', price: 20, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "school shirt" },
  { productId: 'prod_4', name: 'College Blazer - Maroon', price: 75, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'L', "data-ai-hint": "college blazer" },
];

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    userId: 'stud_1', // Alice Wonderland
    items: [
      { productId: 'prod_1', name: 'Classic School Shirt - White', price: 20, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "school shirt"},
      { productId: 'prod_3', name: 'Girls School Skirt - Grey', price: 22, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "school skirt" },
    ],
    totalAmount: 42,
    status: 'Delivered',
    orderDate: '2023-10-15T10:30:00Z',
    shippingAddress: { name: 'Alice Wonderland', email: 'alice.parent@example.com', street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-10-20',
  },
  {
    id: 'order_2',
    userId: 'stud_2', // Bob The Builder
    items: [
      { productId: 'prod_4', name: 'College Blazer - Maroon', price: 75, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "college blazer" },
    ],
    totalAmount: 75,
    status: 'Shipped',
    orderDate: '2023-11-01T14:00:00Z',
    shippingAddress: { name: 'Bob The Builder', email: 'bob.student@example.com', street: '456 Construction Site', city: 'Toolsville', zip: '67890', country: 'BuildWorld' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-11-07',
  },
];


export const mockDonations: Donation[] = [
  { id: 'don_1', uniformType: 'School Shirts', quantity: 10, condition: 'Good', contactName: 'Jane Doe', contactEmail: 'jane@example.com', submissionDate: '2023-11-10', status: 'Pending' },
  { id: 'don_2', uniformType: 'College Trousers', quantity: 5, condition: 'Like New', contactName: 'John Smith', contactEmail: 'john.s@example.com', submissionDate: '2023-11-05', status: 'Collected' },
  { id: 'don_3', uniformType: 'School Skirts', quantity: 15, condition: 'Fair', contactName: 'Emily White', contactEmail: 'emily.w@example.com', submissionDate: '2023-10-20', status: 'Distributed' },
];


export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id);

export const getProductsByCategorySlug = (categorySlug: string): Product[] => {
  const category = mockCategories.find(c => c.slug === categorySlug);
  if (!category) return []; // Should not happen if slug is always 'school-college'
  return mockProducts.filter(p => p.category === category.name);
};

// Get a user by ID, useful for profile pages or associating orders
export const getUserById = (id: string): User | undefined => mockUsers.find(u => u.id === id);
