
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
    category: 'School', // Updated
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
    category: 'School', // Updated
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
    category: 'School', // Updated
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
    category: 'College', // Updated
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
    // Assign to school or college based on common use or leave generic. For now, school.
    category: 'School', // Example assignment
    institution: 'Oakwood Academy', // This institution is school
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
    category: 'College', // Often more associated with college/higher ed labs
    institution: 'City College', // This institution is college
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 110,
    "data-ai-hint": "lab coat"
  },
   {
    id: 'prod_7',
    name: 'Primary School Polo - Red',
    description: 'Comfortable red polo shirt for primary school students.',
    price: 18,
    category: 'School',
    institution: 'Sunshine Primary',
    sizes: ['XS', 'S', 'M'],
    colors: ['Red', 'Yellow'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 180,
    featured: false,
    "data-ai-hint": "polo shirt"
  },
  {
    id: 'prod_8',
    name: 'University Hoodie - Grey',
    description: 'Warm grey hoodie with university logo option.',
    price: 45,
    category: 'College',
    institution: 'State University',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Grey', 'Navy'],
    gender: 'Unisex',
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 130,
    featured: true,
    "data-ai-hint": "university hoodie"
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
    passwordHash: 'password123', 
    email: 'alice.parent@example.com', 
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
    id: 'inst_2',
    role: 'institution',
    email: 'admin@citycollege.edu',
    institutionName: 'City College',
    institutionType: 'college',
    institutionalAddress: '1 University Ave, Higher Education City, HC 12345, USA',
    contactNumber: '555-0101',
    passwordHash: 'instPass456',
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
    email: 'Lavishkhare@gmail.com',
    passwordHash: 'lavish@123', 
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
