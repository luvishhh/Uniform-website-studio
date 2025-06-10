
"use client";

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean;
}

export default function ProductCard({ product, isAdminView = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group bg-card shadow-lg hover:shadow-xl focus-within:shadow-xl transition-all duration-300 ease-in-out rounded-xl border border-border/30 hover:border-primary/60 focus-within:border-primary/60 relative">
      <Link href={`/products/${product.id}`} className="block focus:outline-none" aria-label={`View details for ${product.name}`}>
        <div className="aspect-[3/4] relative w-full overflow-hidden rounded-t-xl">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            data-ai-hint={product['data-ai-hint'] || product.name.split(" ").slice(0,2).join(" ").toLowerCase()}
          />
          {product.featured && !isAdminView && (
            <Badge variant="default" className="absolute top-3 right-3 z-10 bg-accent text-accent-foreground shadow-md !py-1 !px-2.5 text-xs">
              FEATURED
            </Badge>
          )}
           {/* Overlay for action buttons on hover, not for admin view */}
          {!isAdminView && (
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-background/80 hover:bg-background text-foreground border-border backdrop-blur-sm"
                    asChild
                    onClick={(e) => e.stopPropagation()} // Prevent link navigation if button itself is clicked
                >
                    <Link href={`/products/${product.id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </Link>
                </Button>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="px-4 py-3 flex-grow flex flex-col"> {/* Adjusted padding here */}
        <div className="flex-grow mb-2">
          {product.institution && (
            <p className="text-xs text-muted-foreground mb-1 tracking-wide uppercase">
              {product.institution}
            </p>
          )}
          <Link href={`/products/${product.id}`} className="focus:outline-none">
            <h3 className="text-lg font-bold font-headline leading-snug group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground capitalize mt-0.5">{product.category} &bull; {product.gender}</p>
        </div>
        
        <div className="flex items-center justify-end mt-auto"> {/* Price removed, adjusted justify to end */}
          {!isAdminView && (
            <Button 
              size="sm"
              variant="default"
              className="bg-primary hover:bg-primary/90 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation(); 
                alert(`Added ${product.name} to cart (mock)`);
              }}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add to Cart</span>
            </Button>
          )}
        </div>
      </CardContent>

      {isAdminView && (
        <CardFooter className="p-3 pt-0 border-t mt-3">
          <div className="w-full grid grid-cols-2 gap-2 pt-3">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/admin/products/edit/${product.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" className="w-full" onClick={() => alert(`Delete ${product.name} (mock)`)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
