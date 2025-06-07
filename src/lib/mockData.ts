import type { Product, Category, User, Order, CartItem } from '@/types';

export const mockCategories: Category[] = [
  { id: '1', name: 'School', description: 'Uniforms for students of all ages.', imageUrl: 'https://placehold.co/600x400.png', slug: 'school', "data-ai-hint": "school uniforms" },
  { id: '2', name: 'Corporate', description: 'Professional attire for businesses.', imageUrl: 'https://placehold.co/600x400.png', slug: 'corporate', "data-ai-hint": "corporate attire" },
  { id: '3', name: 'Healthcare', description: 'Comfortable and durable medical wear.', imageUrl: 'https://placehold.co/600x400.png', slug: 'healthcare', "data-ai-hint": "medical scrubs" },
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
    category: 'School',
    institution: 'Oakwood Academy',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 120,
    featured: true,
    "data-ai-hint": "school trousers"
  },
  {
    id: 'prod_3',
    name: 'Professional Corporate Blazer - Charcoal',
    description: 'Elegant charcoal corporate blazer, tailored for a modern professional look. Ideal for meetings and office wear.',
    price: 75,
    category: 'Corporate',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'Navy'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 80,
    featured: true,
    "data-ai-hint": "corporate blazer"
  },
  {
    id: 'prod_4',
    name: 'Women\'s Business Blouse - Ivory',
    description: 'Sophisticated ivory business blouse made from soft, easy-care fabric. A staple for any corporate wardrobe.',
    price: 45,
    category: 'Corporate',
    sizes: ['S', 'M', 'L'],
    colors: ['Ivory', 'Sky Blue'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 95,
    "data-ai-hint": "business blouse"
  },
  {
    id: 'prod_5',
    name: 'Unisex Medical Scrubs Set - Blue',
    description: 'Comfortable and functional unisex medical scrubs set, designed for long shifts. Features multiple pockets.',
    price: 35,
    category: 'Healthcare',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ceil Blue', 'Green', 'Navy'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 200,
    "data-ai-hint": "medical scrubs"
  },
  {
    id: 'prod_6',
    name: 'Lab Coat - White',
    description: 'Professional white lab coat with three pockets, made from a durable cotton-polyester blend.',
    price: 30,
    category: 'Healthcare',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 110,
    "data-ai-hint": "lab coat"
  },
  {
    id: 'prod_7',
    name: 'School Tie - Striped',
    description: 'Classic striped school tie, available in various house colors.',
    price: 10,
    category: 'School',
    institution: 'Various Schools',
    sizes: ['One Size'],
    colors: ['Red/Gold Stripe', 'Blue/Silver Stripe'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 300,
    "data-ai-hint": "school tie"
  },
  {
    id: 'prod_8',
    name: 'Men\'s Formal Shirt - White',
    description: 'Crisp white formal shirt for corporate wear, regular fit.',
    price: 50,
    category: 'Corporate',
    sizes: ['M', 'L', 'XL'],
    colors: ['White'],
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 70,
    "data-ai-hint": "formal shirt"
  },
];

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Alice Wonderland',
    email: 'alice@example.com',
    role: 'customer',
    address: { street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' }
  },
  {
    id: 'user_2',
    name: 'Bob The Builder',
    email: 'bob@example.com',
    role: 'customer',
    address: { street: '456 Construction Site', city: 'Toolsville', zip: '67890', country: 'BuildWorld' }
  },
  {
    id: 'admin_1',
    name: 'Admin Ian',
    email: 'admin@unishop.com',
    role: 'admin',
  },
];

export const mockCartItems: CartItem[] = [
  { productId: 'prod_1', name: 'Classic School Shirt - White', price: 20, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "school shirt" },
  { productId: 'prod_3', name: 'Professional Corporate Blazer - Charcoal', price: 75, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'L', "data-ai-hint": "corporate blazer" },
];

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    userId: 'user_1',
    items: [
      { productId: 'prod_1', name: 'Classic School Shirt - White', price: 20, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "school shirt"},
      { productId: 'prod_2', name: 'Navy Blue School Trousers', price: 25, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', size: 'S', "data-ai-hint": "school trousers" },
    ],
    totalAmount: 45,
    status: 'Delivered',
    orderDate: '2023-10-15T10:30:00Z',
    shippingAddress: { name: 'Alice Wonderland', email: 'alice@example.com', street: '123 Rabbit Hole', city: 'Fantasy Land', zip: '12345', country: 'Wonderland' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-10-20',
  },
  {
    id: 'order_2',
    userId: 'user_2',
    items: [
      { productId: 'prod_5', name: 'Unisex Medical Scrubs Set - Blue', price: 35, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', size: 'M', "data-ai-hint": "medical scrubs" },
    ],
    totalAmount: 70,
    status: 'Shipped',
    orderDate: '2023-11-01T14:00:00Z',
    shippingAddress: { name: 'Bob The Builder', email: 'bob@example.com', street: '456 Construction Site', city: 'Toolsville', zip: '67890', country: 'BuildWorld' },
    paymentMethod: 'Mock Razorpay',
    estimatedDelivery: '2023-11-07',
  },
];

export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id);
export const getProductsByCategory = (categorySlug: string): Product[] => {
  const category = mockCategories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return mockProducts.filter(p => p.category === category.name);
};
