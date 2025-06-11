
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { mockProducts, getProductById } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Star, MessageSquare, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

// Dummy Label component for Select
const Label = ({htmlFor, children, className}: {htmlFor: string, children: React.ReactNode, className?:string}) => (
  <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-foreground", className)}>{children}</label>
);
// Helper cn function if not globally available (though it should be from lib/utils)
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
        setCurrentUserRole(localStorage.getItem('unishop_user_role'));
    }
  }, []);

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
  const canPurchase = isClient && currentUserRole !== 'institution' && currentUserRole !== 'dealer';

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
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(123 Reviews)</span>
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
                <Select disabled={!canPurchase}>
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
                <Select disabled={!canPurchase}>
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
                <Select defaultValue="1" disabled={!canPurchase}>
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

            {canPurchase && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button size="lg" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="flex-1">
                  Buy Now
                </Button>
              </div>
            )}
             {!canPurchase && isClient && currentUserRole === 'institution' && (
                <Badge variant="outline" className="mt-4 p-3 text-sm bg-blue-50 border-blue-200 text-blue-700 w-full flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <span>Institutions cannot make direct purchases. Please manage your catalog via the Institution Hub.</span>
                </Badge>
            )}
             {!canPurchase && isClient && currentUserRole === 'dealer' && (
                <Badge variant="outline" className="mt-4 p-3 text-sm bg-orange-50 border-orange-200 text-orange-700 w-full flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <span>Dealers can submit bulk inquiries for products via the Dealer Portal.</span>
                </Badge>
            )}
          </div>
        </div>

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

        <section className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold font-headline mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {[1,2].map(i => (
              <div key={i} className="p-4 border rounded-lg bg-card">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} className={`h-4 w-4 ${starIdx < (i === 1 ? 5 : 4) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="ml-2 text-sm font-semibold">User {i}</p>
                  <p className="ml-auto text-xs text-muted-foreground">2 days ago</p>
                </div>
                <h4 className="font-medium mb-1">Great Product!</h4>
                <p className="text-sm text-muted-foreground">This is a fantastic uniform, very comfortable and fits perfectly. Highly recommend!</p>
              </div>
            ))}
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" /> Write a review
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
