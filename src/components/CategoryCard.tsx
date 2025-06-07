
import type { Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`} className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="overflow-hidden h-full flex flex-col md:flex-row items-center bg-card hover:shadow-2xl transition-all duration-300 ease-in-out border-transparent hover:border-primary/30 group-focus-visible:border-ring">
        <CardHeader className="p-0 w-full md:w-2/5 lg:w-1/3 h-64 md:h-auto md:aspect-[4/3] relative">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint={category['data-ai-hint']}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r"></div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 lg:p-10 flex-grow flex flex-col justify-center items-start relative z-10 w-full md:w-3/5 lg:w-2/3">
          <h2 className="text-2xl lg:text-3xl font-bold font-headline text-card-foreground group-hover:text-primary transition-colors mb-2">
            {category.name}
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground mb-6 line-clamp-3">
            {category.description}
          </p>
          <Button variant="default" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors text-base px-6 py-3 rounded-md">
            Shop {category.name} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
