'use client'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  mockProducts,
  getProductById,
  getReviewsByProductId,
} from '@/lib/mockData'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  MessageSquare,
  Info,
  ThumbsUp,
  CheckCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import React, { useEffect, useState, useMemo } from 'react'
import type { Review } from '@/types'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { useCart } from '@/contexts/CartContext' // Added
import { useToast } from '@/hooks/use-toast' // Added
import StarRating from '@/components/StarRating'

// Dummy Label component for Select
const Label = ({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string
  children: React.ReactNode
  className?: string
}) => (
  <label
    htmlFor={htmlFor}
    className={cn('block text-sm font-medium text-foreground', className)}
  >
    {children}
  </label>
)
// Helper cn function if not globally available (though it should be from lib/utils)
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ')

const getInitials = (name: string = '') => {
  if (!name) return 'U'
  const names = name.split(' ')
  return (
    names
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'
  )
}

// ReviewForm component
function ReviewForm({ productId, userId, onReviewAdded }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId, rating, comment }),
    })
    setRating(0)
    setComment('')
    setLoading(false)
    onReviewAdded?.()
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 mb-8'>
      <label className='block font-medium'>Your Rating</label>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        className='w-full border rounded p-2'
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Write your review...'
        required
      />
      <button
        type='submit'
        className='bg-primary text-white px-4 py-2 rounded'
        disabled={loading || rating === 0}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

// ReviewList component
function ReviewList({ productId, refresh }) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`/api/products/${productId}/reviews?productId=${productId}`)
      .then((res) => res.json())
      .then(setReviews)
  }, [productId, refresh])

  if (!reviews.length) return <p>No reviews yet.</p>

  return (
    <div className='space-y-4 mt-6'>
      {reviews.map((review, i) => (
        <div key={i} className='border rounded p-3'>
          <StarRating value={review.rating} readOnly size={20} />
          <p className='mt-1'>{review.comment}</p>
          <span className='text-xs text-muted-foreground'>
            {new Date(review.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const product = getProductById(params.id)
  const { addToCart } = useCart() // Added
  const { toast } = useToast() // Added

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  )
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  )
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  const [productReviews, setProductReviews] = useState<Review[]>([])
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [refreshReviews, setRefreshReviews] = useState(0)
  const userId =
    (typeof window !== 'undefined' &&
      localStorage.getItem('unishop_user_id')) ||
    'guest'

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setCurrentUserRole(localStorage.getItem('unishop_user_role'))
    }
    if (product) {
      setProductReviews(getReviewsByProductId(product.id))
      // Initialize selected size and color if available
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0])
      }
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0])
      }
    }
  }, [product, selectedSize, selectedColor])

  const { averageRating, totalReviews, ratingDistribution } = useMemo(() => {
    // Removed ratingCounts as it's not used in UI
    if (!productReviews.length) {
      return { averageRating: 0, totalReviews: 0, ratingDistribution: [] }
    }
    const total = productReviews.reduce((acc, review) => acc + review.rating, 0)
    const avg = total / productReviews.length
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    productReviews.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1
    })
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star] || 0,
      percentage:
        productReviews.length > 0
          ? ((counts[star] || 0) / productReviews.length) * 100
          : 0,
    }))
    return {
      averageRating: avg,
      totalReviews: productReviews.length,
      ratingDistribution: distribution,
    }
  }, [productReviews])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedQuantity, selectedSize, selectedColor)
    }
  }

  if (!product) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow container mx-auto px-4 md:px-6 py-8 text-center'>
          <h1 className='text-2xl font-bold'>Product not found</h1>
          <Link href='/products' passHref>
            <Button variant='link' className='mt-4'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Back to Products
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const relatedProducts = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  const canPurchaseOrReview =
    isClient &&
    currentUserRole !== 'institution' &&
    currentUserRole !== 'dealer'

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 md:px-6 py-8'>
        <div className='mb-6'>
          <Link href='/products' passHref>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Back to Products
            </Button>
          </Link>
        </div>

        <div className='grid md:grid-cols-2 gap-8 lg:gap-12'>
          <div className='space-y-4'>
            <div className='aspect-square relative w-full rounded-lg overflow-hidden shadow-lg border'>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                className='object-cover'
                priority
                data-ai-hint={product['data-ai-hint']}
              />
            </div>
            <div className='grid grid-cols-4 gap-2'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='aspect-square relative w-full rounded-md overflow-hidden border hover:border-primary cursor-pointer'
                >
                  <Image
                    src={`https://placehold.co/100x100.png?text=Thumb${i}`}
                    alt={`Thumbnail ${i}`}
                    fill
                    objectFit='cover'
                    data-ai-hint='uniform detail'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-6'>
            <h1 className='text-3xl md:text-4xl font-bold font-headline'>
              {product.name}
            </h1>
            <div className='flex items-center space-x-2'>
              <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className='text-sm text-muted-foreground'>
                {averageRating > 0
                  ? `${averageRating.toFixed(1)} out of 5`
                  : 'No reviews yet'}{' '}
                ({totalReviews} Reviews)
              </span>
            </div>
            <p className='text-3xl font-semibold text-primary'>
              ${product.price.toFixed(2)}
            </p>
            <Separator />
            <div>
              <h3 className='text-lg font-semibold mb-2'>Description</h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {product.description}
              </p>
            </div>
            {product.institution && (
              <p className='text-sm'>
                <span className='font-medium'>Institution:</span>{' '}
                {product.institution}
              </p>
            )}
            <p className='text-sm'>
              <span className='font-medium'>Category:</span>{' '}
              <Link
                href={`/products?category=${product.category.toLowerCase()}`}
                className='text-primary hover:underline'
              >
                {product.category}
              </Link>
            </p>

            {product.sizes && product.sizes.length > 0 && (
              <div className='space-y-2'>
                <Label htmlFor='size-select' className='text-sm font-medium'>
                  Size:
                </Label>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  disabled={!canPurchaseOrReview}
                >
                  <SelectTrigger id='size-select' className='w-full md:w-1/2'>
                    <SelectValue placeholder='Select size' />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className='space-y-2'>
                <Label htmlFor='color-select' className='text-sm font-medium'>
                  Color:
                </Label>
                <Select
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  disabled={!canPurchaseOrReview}
                >
                  <SelectTrigger id='color-select' className='w-full md:w-1/2'>
                    <SelectValue placeholder='Select color' />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='quantity-select' className='text-sm font-medium'>
                Quantity:
              </Label>
              <Select
                value={String(selectedQuantity)}
                onValueChange={(val) => setSelectedQuantity(Number(val))}
                disabled={!canPurchaseOrReview}
              >
                <SelectTrigger id='quantity-select' className='w-full md:w-1/2'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                    (
                      q // Increased quantity options
                    ) => (
                      <SelectItem key={q} value={String(q)}>
                        {q}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {canPurchaseOrReview && (
              <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                <Button
                  size='lg'
                  className='flex-1 bg-accent hover:bg-accent/90 text-accent-foreground'
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className='mr-2 h-5 w-5' /> Add to Cart
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='flex-1'
                  onClick={() => {
                    if (product) {
                      addToCart(
                        product,
                        selectedQuantity,
                        selectedSize,
                        selectedColor
                      )
                      // Wait a tick for context to update localStorage, then navigate
                      setTimeout(() => router.push('/cart'), 100)
                    }
                  }}
                >
                  Buy Now
                </Button>
              </div>
            )}
            {!canPurchaseOrReview &&
              isClient &&
              currentUserRole === 'institution' && (
                <Badge
                  variant='outline'
                  className='mt-4 p-3 text-sm bg-blue-50 border-blue-200 text-blue-700 w-full flex items-center gap-2'
                >
                  <Info className='h-5 w-5' />
                  <span>
                    Institutions cannot make direct purchases. Please manage
                    your catalog via the Institution Hub.
                  </span>
                </Badge>
              )}
            {!canPurchaseOrReview &&
              isClient &&
              currentUserRole === 'dealer' && (
                <Badge
                  variant='outline'
                  className='mt-4 p-3 text-sm bg-orange-50 border-orange-200 text-orange-700 w-full flex items-center gap-2'
                >
                  <Info className='h-5 w-5' />
                  <span>
                    Dealers can submit bulk inquiries for products via the
                    Dealer Portal.
                  </span>
                </Badge>
              )}
          </div>
        </div>

        <section className='mt-16 pt-12 border-t'>
          <h2 className='text-2xl md:text-3xl font-bold font-headline mb-8 text-center'>
            Customer Reviews
          </h2>
          {canPurchaseOrReview && (
            <ReviewForm
              productId={product.id}
              userId={userId}
              onReviewAdded={() => setRefreshReviews((r) => r + 1)}
            />
          )}
          <ReviewList productId={product.id} refresh={refreshReviews} />
        </section>

        {relatedProducts.length > 0 && (
          <section className='mt-16 pt-12 border-t'>
            <h2 className='text-2xl font-bold font-headline text-center mb-8'>
              Related Products
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'>
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
