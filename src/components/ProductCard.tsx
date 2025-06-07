
"use client";

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart, Edit, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean;
}

export default function ProductCard({ product, isAdminView = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group bg-card shadow-md hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg border border-transparent hover:border-primary/30 focus-within:border-primary/50">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block aspect-[4/3] relative w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={product['data-ai-hint'] || product.name.split(" ").slice(0,2).join(" ").toLowerCase()}
          />
          {/* Removed stock-based badges */}
          {product.featured && !isAdminView && (
            <Badge variant="default" className="absolute top-3 left-3 z-10 bg-accent text-accent-foreground">Featured</Badge>
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          {product.institution && <p className="text-xs text-muted-foreground mb-1">{product.institution}</p>}
          <Link href={`/products/${product.id}`} className="focus:outline-none">
            <h3 className="text-lg font-semibold font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1 focus:underline">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground capitalize mb-2">{product.gender}</p>
        </div>
        
        {!isAdminView && (
          <div className="flex items-center my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn('h-4 w-4', i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50')} />
            ))}
            <span className="text-xs text-muted-foreground ml-1.5">(120+)</span>
          </div>
        )}

        <p className="text-2xl font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isAdminView ? (
          <div className="w-full space-y-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/admin/products/edit/${product.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Product
              </Link>
            </Button>
            <Button variant="destructive" size="sm" className="w-full" onClick={() => alert(`Delete ${product.name} (mock)`)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <Button 
              variant="default" 
              className="flex-1" 
              onClick={() => alert(`Added ${product.name} to cart (mock)`)} 
              // disabled={product.stock === 0} // Removed stock-based disable
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/products/${product.id}`} aria-label={`View details for ${product.name}`}>
                <Eye className="mr-2 h-4 w-4" />
                <span className="inline">View</span>
              </Link>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
