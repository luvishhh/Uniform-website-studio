
import type { Product, Category, User, Order, CartItem, Donation, StudentUser, InstitutionUser, DealerUser, AdminUser } from '@/types';

export const mockCategories: Category[] = [
  { id: 'cat_school', name: 'School', description: 'High-quality uniforms for school students, designed for comfort and durability.', imageUrl: 'https://placehold.co/600x400.png', slug: 'school', "data-ai-hint": "school students" },
  { id: 'cat_college', name: 'College', description: 'Smart and professional attire for college students, suitable for academics and events.', imageUrl: 'https://placehold.co/600x400.png', slug: 'college', "data-ai-hint": "college students campus" },
];

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'Classic School Shirt - White',
    description: 'Comfortable and durable white school shirt made from breathable cotton. Perfect for everyday school wear.',
    price: 20,
    category: 'School',
    institution: 'Greenwood High',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    featured: true,
    stock: 50,
    "data-ai-hint": "school shirt"
  },
  {
    id: 'prod_2',
    name: 'Navy Blue School Trousers',
    description: 'Smart navy blue school trousers with an adjustable waistband for a comfortable fit.',
    price: 25,
    category: 'School',
    institution: 'Greenwood High', // Changed from Oakwood Academy
    sizes: ['M', 'L', 'XL'],
    colors: ['Navy Blue'],
    gender: 'Boys',
    imageUrl: 'https://placehold.co/600x400.png',
    featured: true,
    stock: 35,
    "data-ai-hint": "school trousers"
  },
  {
    id: 'prod_3',
    name: 'Girls School Skirt - Grey',
    description: 'Pleated grey school skirt, durable and comfortable for all-day wear.',
    price: 22,
    category: 'School',
    institution: 'Greenwood High',
    sizes: ['S', 'M', 'L'],
    colors: ['Grey'],
    gender: 'Girls',
    imageUrl: 'https://placehold.co/600x400.png',
    featured: false,
    stock: 40,
    "data-ai-hint": "school skirt"
  },
  {
    id: 'prod_4',
    name: 'College Blazer - Maroon',
    description: 'Smart maroon college blazer with logo embroidery option. Ideal for formal college events.',
    price: 75,
    category: 'College',
    institution: 'City College',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Maroon'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    featured: true,
    stock: 20,
    "data-ai-hint": "college blazer"
  },
  {
    id: 'prod_5',
    name: 'Sports T-Shirt - Blue',
    description: 'Breathable sports t-shirt for PE classes and college sports.',
    price: 15,
    category: 'College', // Changed from School to fit City College better
    institution: 'City College', // Changed from Oakwood Academy
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Red', 'Green'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 100,
    "data-ai-hint": "sports t-shirt"
  },
  {
    id: 'prod_6',
    name: 'Lab Coat - Standard',
    description: 'Professional white lab coat for science students.',
    price: 30,
    category: 'College',
    institution: 'City College',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 8, // Low stock example
    "data-ai-hint": "lab coat"
  },
   {
    id: 'prod_7',
    name: 'School Polo - Red',
    description: 'Comfortable red polo shirt for school students.',
    price: 18,
    category: 'School',
    institution: 'Greenwood High', // Changed from Sunshine Primary
    sizes: ['XS', 'S', 'M'],
    colors: ['Red', 'Yellow'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    featured: false,
    stock: 60,
    "data-ai-hint": "polo shirt"
  },
  {
    id: 'prod_8',
    name: 'University Hoodie - Grey',
    description: 'Warm grey hoodie with university logo option.',
    price: 45,
    category: 'College',
    institution: 'City College', // Changed from State University
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'Navy'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    featured: true,
    stock: 25,
    "data-ai-hint": "university hoodie"
  },
  {
    id: 'prod_9',
    name: 'School Jumper - Navy',
    description: 'Warm navy blue V-neck jumper for Greenwood High.',
    price: 35,
    category: 'School',
    institution: 'Greenwood High',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 5, // Low stock example
    "data-ai-hint": "school jumper"
  },
  {
    id: 'prod_10',
    name: 'College Scarf - Striped',
    description: 'Official striped scarf for City College.',
    price: 12,
    category: 'College',
    institution: 'City College',
    sizes: ['One Size'],
    colors: ['Maroon', 'Gold'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 70,
    "data-ai-hint": "college scarf"
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
    passwordHash: '$2a$10$dummyhashfortestingpurposes', // Placeholder hash
    email: 'alice.parent@example.com',
    address: { street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' },
    imageUrl: 'https://placehold.co/100x100.png?text=AW',
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
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    email: 'bob.student@example.com',
    address: { street: '456 Construction Site', city: 'Toolsville', zip: '67890', country: 'BuildWorld' },
    imageUrl: 'https://placehold.co/100x100.png?text=BB',
  } as StudentUser,
  {
    id: 'stud_3',
    role: 'student',
    rollNumber: 'S1002',
    schoolCollegeName: 'Greenwood High',
    fullName: 'Carol Danvers',
    institutionType: 'school',
    gradeOrCourse: '11th Grade',
    parentName: 'Joseph Danvers',
    parentContactNumber: '555-0011',
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    email: 'carol.parent@example.com',
    address: { street: '789 Sky High Apt', city: 'Aerospace City', zip: '11223', country: 'USA' },
    imageUrl: 'https://placehold.co/100x100.png?text=CD',
  } as StudentUser,
  {
    id: 'stud_4',
    role: 'student',
    rollNumber: 'S1003',
    schoolCollegeName: 'Greenwood High',
    fullName: 'David Banner',
    institutionType: 'school',
    gradeOrCourse: '9th Grade',
    parentName: 'Brian Banner',
    parentContactNumber: '555-0022',
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    address: { street: '10 Gamma Ray St', city: 'Scienceville', zip: '33445', country: 'USA' },
    imageUrl: 'https://placehold.co/100x100.png?text=DB',
  } as StudentUser,
  {
    id: 'stud_5',
    role: 'student',
    rollNumber: 'C2003',
    schoolCollegeName: 'City College',
    fullName: 'Eve Adams',
    institutionType: 'college',
    gradeOrCourse: 'Arts & Humanities',
    year: '1st Year',
    parentName: 'Adam Adams',
    parentContactNumber: '555-0033',
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    email: 'eve.student@example.com',
    address: { street: '2 Eden Gardens', city: 'Paradise City', zip: '55667', country: 'Utopia' },
    imageUrl: 'https://placehold.co/100x100.png?text=EA',
  } as StudentUser,
  {
    id: 'stud_6',
    role: 'student',
    rollNumber: 'C2004',
    schoolCollegeName: 'City College',
    fullName: 'Frank Castle',
    institutionType: 'college',
    gradeOrCourse: 'Criminal Justice',
    year: '3rd Year',
    parentName: 'Maria Castle',
    parentContactNumber: '555-0044',
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    address: { street: '1 War Zone Alley', city: 'Vigilante Town', zip: '77889', country: 'USA' },
    imageUrl: 'https://placehold.co/100x100.png?text=FC',
  } as StudentUser,
  {
    id: 'inst_1',
    role: 'institution',
    email: 'admin@greenwood.edu',
    institutionName: 'Greenwood High',
    institutionType: 'school',
    institutionalAddress: '1 Learning Lane, Knowledgetown, KT 54321, USA',
    contactNumber: '555-0100',
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    imageUrl: 'https://placehold.co/100x100.png?text=GH',
  } as InstitutionUser,
   {
    id: 'inst_2',
    role: 'institution',
    email: 'admin@citycollege.edu',
    institutionName: 'City College',
    institutionType: 'college',
    institutionalAddress: '1 University Ave, Higher Education City, HC 12345, USA',
    contactNumber: '555-0101',
    passwordHash: '$2a$10$dummyhashfortestingpurposes',
    imageUrl: 'https://placehold.co/100x100.png?text=CC',
  } as InstitutionUser,
  {
    id: 'deal_1',
    role: 'dealer',
    email: 'sales@uniformsupplies.com',
    dealerName: 'Uniform Supplies Inc.',
    contactNumber: '555-0200',
    businessAddress: '1 Supplier Road, Commerce City, CC 67890, USA',
    gstinNumber: '22AAAAA0000A1Z5',
    passwordHash: '$2a$10$dummyhashfortestingpurposes', // Mock hash for deal_1
    imageUrl: 'https://placehold.co/100x100.png?text=USI',
  } as DealerUser,
  {
    id: 'admin_1',
    role: 'admin',
    email: 'Lavishkhare@gmail.com',
    // passwordHash for admin_1 should be: $2a$10$8hG.iAhQ3yJ1.tA3uEwXyOANK8JnLioaS3X.1Y5F8V7E5Zz0wzI0.', // Original: lavish@123
    passwordHash: '$2a$10$rP6WcE2XyZz4A5B6c7D8eO.dummyhashfortesting', // Placeholder, real one commented out
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
    userId: 'stud_1',
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
    userId: 'stud_2',
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
  {
    id: 'order_3',
    userId: 'stud_3', // Carol Danvers (Greenwood High)
    items: [
      { productId: 'prod_2', name: 'Navy Blue School Trousers', price: 25, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "school trousers" },
      { productId: 'prod_9', name: 'School Jumper - Navy', price: 35, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "school jumper" },
    ],
    totalAmount: 60,
    status: 'Placed',
    orderDate: '2023-09-20T09:15:00Z',
    shippingAddress: { name: 'Carol Danvers', email: 'carol.parent@example.com', street: '789 Sky High Apt', city: 'Aerospace City', zip: '11223', country: 'USA' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-09-27',
  },
  {
    id: 'order_4',
    userId: 'stud_4', // David Banner (Greenwood High)
    items: [
      { productId: 'prod_1', name: 'Classic School Shirt - White', price: 20, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'L', "data-ai-hint": "school shirt" },
      { productId: 'prod_7', name: 'School Polo - Red', price: 18, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'L', "data-ai-hint": "polo shirt" },
    ],
    totalAmount: 58,
    status: 'Delivered',
    orderDate: '2023-08-10T11:00:00Z',
    shippingAddress: { name: 'David Banner', street: '10 Gamma Ray St', city: 'Scienceville', zip: '33445', country: 'USA' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-08-17',
  },
  {
    id: 'order_5',
    userId: 'stud_5', // Eve Adams (City College)
    items: [
      { productId: 'prod_5', name: 'Sports T-Shirt - Blue', price: 15, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "sports t-shirt" },
      { productId: 'prod_6', name: 'Lab Coat - Standard', price: 30, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "lab coat" },
    ],
    totalAmount: 60,
    status: 'Shipped',
    orderDate: '2023-11-15T16:45:00Z',
    shippingAddress: { name: 'Eve Adams', email: 'eve.student@example.com', street: '2 Eden Gardens', city: 'Paradise City', zip: '55667', country: 'Utopia' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-11-22',
  },
  {
    id: 'order_6',
    userId: 'stud_6', // Frank Castle (City College)
    items: [
      { productId: 'prod_8', name: 'University Hoodie - Grey', price: 45, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'XL', "data-ai-hint": "university hoodie" },
      { productId: 'prod_10', name: 'College Scarf - Striped', price: 12, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'One Size', "data-ai-hint": "college scarf" },
    ],
    totalAmount: 57,
    status: 'Confirmed',
    orderDate: '2023-07-25T13:00:00Z',
    shippingAddress: { name: 'Frank Castle', street: '1 War Zone Alley', city: 'Vigilante Town', zip: '77889', country: 'USA' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-08-01',
  },
  {
    id: 'order_7',
    userId: 'stud_1', // Alice Wonderland (Greenwood High) - repeat order
    items: [
      { productId: 'prod_9', name: 'School Jumper - Navy', price: 35, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "school jumper" },
    ],
    totalAmount: 70,
    status: 'Delivered',
    orderDate: '2023-12-05T10:00:00Z',
    shippingAddress: { name: 'Alice Wonderland', email: 'alice.parent@example.com', street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-12-10',
  },
  {
    id: 'order_8',
    userId: 'stud_5', // Eve Adams (City College) - repeat order
    items: [
      { productId: 'prod_4', name: 'College Blazer - Maroon', price: 75, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "college blazer" },
    ],
    totalAmount: 75,
    status: 'Delivered',
    orderDate: '2023-10-05T14:30:00Z',
    shippingAddress: { name: 'Eve Adams', email: 'eve.student@example.com', street: '2 Eden Gardens', city: 'Paradise City', zip: '55667', country: 'Utopia' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-10-12',
  },
  // Additional orders to make dashboard more lively
  {
    id: 'order_9',
    userId: 'stud_2', // Bob, City College
    items: [ { productId: 'prod_5', name: 'Sports T-Shirt - Blue', price: 15, quantity: 3, imageUrl: 'https://placehold.co/100x100.png', size: 'L', "data-ai-hint": "sports t-shirt" } ],
    totalAmount: 45, status: 'Placed', orderDate: '2023-07-10T10:00:00Z',
    shippingAddress: { name: 'Bob The Builder', email: 'bob.student@example.com', street: '456 Construction Site', city: 'Toolsville', zip: '67890', country: 'BuildWorld' },
    paymentMethod: 'Mock Razorpay', estimatedDelivery: '2023-07-17',
  },
  {
    id: 'order_10',
    userId: 'stud_3', // Carol, Greenwood High
    items: [ { productId: 'prod_1', name: 'Classic School Shirt - White', price: 20, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "school shirt" } ],
    totalAmount: 20, status: 'Delivered', orderDate: '2023-08-05T12:00:00Z',
    shippingAddress: { name: 'Carol Danvers', email: 'carol.parent@example.com', street: '789 Sky High Apt', city: 'Aerospace City', zip: '11223', country: 'USA' },
    paymentMethod: 'Mock Razorpay', estimatedDelivery: '2023-08-12',
  },
  {
    id: 'order_11',
    userId: 'stud_1', // Alice, Greenwood High
    items: [ { productId: 'prod_7', name: 'School Polo - Red', price: 18, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "polo shirt" } ],
    totalAmount: 36, status: 'Shipped', orderDate: '2023-09-10T14:30:00Z',
    shippingAddress: { name: 'Alice Wonderland', email: 'alice.parent@example.com', street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' },
    paymentMethod: 'Mock Razorpay', estimatedDelivery: '2023-09-17',
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
  if (!category) return [];
  return mockProducts.filter(p => p.category === category.name);
};

export const getUserById = (id: string): User | undefined => mockUsers.find(u => u.id === id);

// Helper to simulate password hashing for mock data (DO NOT USE IN PRODUCTION)
// In a real app, passwords would be hashed on the server during registration.
// const bcrypt = require('bcryptjs'); // Would be a server-side import
// export const mockHashPassword = (password: string) => bcrypt.hashSync(password, 10);
// For simplicity, we'll just store plain text or a fixed dummy hash in mockData for passwordHash.
// e.g. mockUsers[0].passwordHash = mockHashPassword("password123");

