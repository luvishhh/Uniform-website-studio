import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { mockProducts, mockCategories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import Link from "next/link";

export default function ProductsPage({ searchParams }: { searchParams?: { category?: string; search?: string; sort?: string; } }) {
  const currentCategorySlug = searchParams?.category;
  const searchTerm = searchParams?.search || "";
  const sortBy = searchParams?.sort || "name_asc";

  let filteredProducts = mockProducts;

  if (currentCategorySlug) {
    const category = mockCategories.find(c => c.slug === currentCategorySlug);
    if (category) {
      filteredProducts = mockProducts.filter(p => p.category === category.name);
    }
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Basic sorting
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
    return 0;
  });


  const currentCategoryName = currentCategorySlug 
    ? mockCategories.find(c => c.slug === currentCategorySlug)?.name 
    : "All Products";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-headline">{currentCategoryName}</h1>
          <p className="text-muted-foreground mt-2">Browse our collection of high-quality uniforms.</p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-8 p-6 bg-card rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search Products</label>
              <div className="relative">
                <Input type="text" id="search" placeholder="e.g., School Shirt, Blazer..." className="pl-10" defaultValue={searchTerm}/>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-foreground mb-1">Sort By</label>
              <Select defaultValue={sortBy}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="mt-4 flex flex-wrap gap-2">
            <p className="font-medium mr-2 self-center">Categories:</p>
            <Button variant={!currentCategorySlug ? "default" : "outline"} size="sm" asChild>
              <Link href="/products">All</Link>
            </Button>
            {mockCategories.map(cat => (
              <Button key={cat.id} variant={currentCategorySlug === cat.slug ? "default" : "outline"} size="sm" asChild>
                <Link href={`/products?category=${cat.slug}`}>{cat.name}</Link>
              </Button>
            ))}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters, or check back later!</p>
            <Button variant="link" asChild className="mt-4">
              <Link href="/products">Clear Filters</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
