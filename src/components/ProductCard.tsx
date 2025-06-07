"use client";

import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean; // For admin-specific actions
}

export default function ProductCard({ product, isAdminView = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block group">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              data-ai-hint={product['data-ai-hint']}
            />
          </div>
        </Link>
        {product.featured && !isAdminView && (
          <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground">Featured</Badge>
        )}
         {isAdminView && (
          <Badge variant="secondary" className="absolute top-2 left-2">Stock: {product.stock}</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="block group">
          <CardTitle className="text-lg font-headline leading-tight group-hover:text-primary transition-colors line-clamp-2">{product.name}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        <p className="text-xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isAdminView ? (
          <div className="w-full space-y-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href={`/admin/products/edit/${product.id}`}>Edit</Link>
            </Button>
            <Button variant="destructive" size="sm" className="w-full">Delete</Button>
          </div>
        ) : (
          <div className="w-full flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/products/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </Link>
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => alert(`Added ${product.name} to cart (mock)`)}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
