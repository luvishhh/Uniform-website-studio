import {
  mockProducts,
  mockCategories,
  mockUsers,
  mockOrders,
  mockReviews,
  useMockData,
} from './mockData'

export async function getProducts() {
  if (useMockData()) {
    return mockProducts
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const db = await connectToDatabase()
    return db.collection('products').find({}).toArray()
  }
}

export async function getProductById(id: string) {
  if (useMockData()) {
    return mockProducts.find((p) => p.id === id)
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const { ObjectId } = await import('mongodb')
    const db = await connectToDatabase()
    return db.collection('products').findOne({ _id: new ObjectId(id) })
  }
}

export async function getCategories() {
  if (useMockData()) {
    return mockCategories
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const db = await connectToDatabase()
    return db.collection('categories').find({}).toArray()
  }
}

export async function getUsers() {
  if (useMockData()) {
    return mockUsers
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const db = await connectToDatabase()
    return db.collection('users').find({}).toArray()
  }
}

export async function getUserById(id: string) {
  if (useMockData()) {
    return mockUsers.find((u) => u.id === id)
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const { ObjectId } = await import('mongodb')
    const db = await connectToDatabase()
    return db.collection('users').findOne({ _id: new ObjectId(id) })
  }
}

export async function getOrders() {
  if (useMockData()) {
    return mockOrders
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const db = await connectToDatabase()
    return db.collection('orders').find({}).toArray()
  }
}

export async function getReviewsByProductId(productId: string) {
  if (useMockData()) {
    return mockReviews.filter((review) => review.productId === productId)
  } else {
    const { connectToDatabase } = await import('./mongodb')
    const db = await connectToDatabase()
    return db.collection('reviews').find({ productId }).toArray()
  }
}

export function getProductsByCategorySlug(slug: string) {
  // Find the category name by slug
  const category = mockCategories.find((c) => c.slug === slug)
  if (!category) return []
  return mockProducts.filter((p) => p.category === category.name)
}
