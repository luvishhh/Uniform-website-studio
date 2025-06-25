import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import StarRating from '@/components/StarRating'
import { useState, useEffect } from 'react'

export async function POST(request: NextRequest) {
  const { productId, rating, comment, userId } = await request.json()
  const db = await connectToDatabase()

  // Optionally, check if product exists
  const product = await db.collection('products').findOne({ _id: productId })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  // Insert the review
  const review = {
    productId,
    userId,
    rating,
    comment,
    createdAt: new Date(),
  }
  await db.collection('reviews').insertOne(review)

  return NextResponse.json(
    { message: 'Review added successfully' },
    { status: 201 }
  )
}
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')
  const db = await connectToDatabase()

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  }

  // If you store productId as ObjectId in reviews, use:
  // const reviews = await db.collection('reviews').find({ productId: new ObjectId(productId) }).toArray()
  // If you store as string, use as is:
  const reviews = await db.collection('reviews').find({ productId }).toArray()

  return NextResponse.json(reviews)
}
