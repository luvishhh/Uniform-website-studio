
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mockProducts, getProductById, getReviewsByProductId } from "@/lib/mockData"; // Added getReviewsByProductId
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Star, MessageSquare, Info, ThumbsUp, CheckCircle } from "lucide-react"; // Added ThumbsUp, CheckCircle
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState, useMemo } from "react";
import type { Review } from "@/types"; // Added Review type
import { Progress } from "@/components/ui/progress"; // Added Progress
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar components

// Dummy Label component for Select
const Label = ({htmlFor, children, className}: {htmlFor: string, children: React.ReactNode, className?:string}) => (
  <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-foreground", className)}>{children}</label>
);
// Helper cn function if not globally available (though it should be from lib/utils)
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

const getInitials = (name: string = "") => {
    if (!name) return "U";
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase() || 'U';
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
        setCurrentUserRole(localStorage.getItem('unishop_user_role'));
    }
    if (product) {
        setProductReviews(getReviewsByProductId(product.id));
    }
  }, [product]);

  const { averageRating, totalReviews, ratingDistribution, ratingCounts } = useMemo(() => {
    if (!productReviews.length) {
      return { averageRating: 0, totalReviews: 0, ratingDistribution: [], ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
    }
    const total = productReviews.reduce((acc, review) => acc + review.rating, 0);
    const avg = total / productReviews.length;
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    productReviews.forEach(review => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: counts[star] || 0,
      percentage: productReviews.length > 0 ? ((counts[star] || 0) / productReviews.length) * 100 : 0,
    }));
    return { averageRating: avg, totalReviews: productReviews.length, ratingDistribution: distribution, ratingCounts: counts };
  }, [productReviews]);


  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/products" passHref>
            <Button variant="link" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = mockProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const canPurchaseOrReview = isClient && currentUserRole !== 'institution' && currentUserRole !== 'dealer';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <Link href="/products" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square relative w-full rounded-lg overflow-hidden shadow-lg border">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                data-ai-hint={product['data-ai-hint']}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square relative w-full rounded-md overflow-hidden border hover:border-primary cursor-pointer">
                   <Image src={`https://placehold.co/100x100.png?text=Thumb${i}`} alt={`Thumbnail ${i}`} fill objectFit="cover" data-ai-hint="uniform detail" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold font-headline">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating > 0 ? `${averageRating.toFixed(1)} out of 5` : "No reviews yet"} ({totalReviews} Reviews)
              </span>
            </div>
            <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
            </div>
            {product.institution && (
              <p className="text-sm"><span className="font-medium">Institution:</span> {product.institution}</p>
            )}
            <p className="text-sm"><span className="font-medium">Category:</span> <Link href={`/products?category=${product.category.toLowerCase()}`} className="text-primary hover:underline">{product.category}</Link></p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="size-select" className="text-sm font-medium">Size:</Label>
                <Select disabled={!canPurchaseOrReview}>
                  <SelectTrigger id="size-select" className="w-full md:w-1/2">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="color-select" className="text-sm font-medium">Color:</Label>
                <Select disabled={!canPurchaseOrReview}>
                  <SelectTrigger id="color-select" className="w-full md:w-1/2">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="quantity-select" className="text-sm font-medium">Quantity:</Label>
                <Select defaultValue="1" disabled={!canPurchaseOrReview}>
                  <SelectTrigger id="quantity-select" className="w-full md:w-1/2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(q => (
                      <SelectItem key={q} value={String(q)}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            {canPurchaseOrReview && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  Buy Now
                </Button>
              </div>
            )}
             {!canPurchaseOrReview && isClient && currentUserRole === 'institution' && (
                <Badge variant="outline" className="mt-4 p-3 text-sm bg-blue-50 border-blue-200 text-blue-700 w-full flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <span>Institutions cannot make direct purchases. Please manage your catalog via the Institution Hub.</span>
                </Badge>
            )}
             {!canPurchaseOrReview && isClient && currentUserRole === 'dealer' && (
                <Badge variant="outline" className="mt-4 p-3 text-sm bg-orange-50 border-orange-200 text-orange-700 w-full flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <span>Dealers can submit bulk inquiries for products via the Dealer Portal.</span>
                </Badge>
            )}
          </div>
        </div>

        <section className="mt-16 pt-12 border-t">
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8 text-center">Customer Reviews</h2>
          {productReviews.length > 0 ? (
            <div className="grid md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] gap-8 lg:gap-12">
              {/* Column 1: Overall Rating Summary */}
              <div className="space-y-6 p-6 bg-card rounded-lg shadow-md">
                <div className="text-center">
                  <p className="text-5xl font-bold font-headline text-primary">{averageRating.toFixed(1)}</p>
                  <div className="flex justify-center items-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-6 w-6 ${i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {totalReviews} reviews</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-md mb-2">Rating Distribution</h4>
                  {ratingDistribution.map(item => (
                    <div key={item.star} className="flex items-center gap-2 text-sm">
                      <span className="w-12 shrink-0">{item.star} star</span>
                      <Progress value={item.percentage} className="w-full h-2 bg-muted" />
                      <span className="text-muted-foreground w-10 text-right tabular-nums">
                        {item.percentage.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
                 {canPurchaseOrReview && (
                    <Button variant="outline" className="w-full mt-6" onClick={() => alert('Write a review (mock)')}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
                    </Button>
                 )}
              </div>

              {/* Column 2: Individual Reviews List */}
              <div className="space-y-6">
                {productReviews.slice(0, 5).map(review => ( // Displaying up to 5 reviews for brevity
                  <Card key={review.id} className="p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={review.avatarUrl || `https://placehold.co/40x40.png?text=${getInitials(review.userName)}`} alt={review.userName} data-ai-hint="user avatar"/>
                        <AvatarFallback>{getInitials(review.userName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{review.userName}</h4>
                          <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star key={starIdx} className={`h-4 w-4 ${starIdx < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                          ))}
                           {review.verifiedPurchase && (
                            <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3"/> Verified Purchase
                            </Badge>
                           )}
                        </div>
                        <h5 className="font-medium text-sm mb-1">{review.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{review.comment}</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs h-auto p-1 text-muted-foreground hover:text-primary">
                            <ThumbsUp className="mr-1 h-3 w-3" /> Helpful (mock)
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {productReviews.length > 5 && (
                    <Button variant="outline" className="w-full mt-4">View All {totalReviews} Reviews</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to review this product!</p>
                {canPurchaseOrReview && (
                    <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => alert('Write a review (mock)')}>
                        Write a Review
                    </Button>
                )}
            </div>
          )}
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t">
            <h2 className="text-2xl font-bold font-headline text-center mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
