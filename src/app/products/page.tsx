
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ProductCard";
import { mockProducts, mockCategories } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Helper to get unique values for filters
const getUniqueValues = (products: typeof mockProducts, key: keyof typeof mockProducts[0]) => {
  const values = products.map(p => p[key]);
  if (key === 'sizes') { // Sizes is an array
    return Array.from(new Set(products.flatMap(p => p.sizes))).sort();
  }
  return Array.from(new Set(values.filter(Boolean))).sort() as string[];
};


export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>(searchParams.getAll('institution') || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.getAll('size') || []);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(searchParams.getAll('gender') || []);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || "name_asc");
  
  // Derive available filter options from all products initially
  const allInstitutions = useMemo(() => getUniqueValues(mockProducts, 'institution'), []);
  const allSizes = useMemo(() => getUniqueValues(mockProducts, 'sizes'), []);
  const allGenders: ('Unisex' | 'Boys' | 'Girls')[] = ['Unisex', 'Boys', 'Girls'];


  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    selectedInstitutions.forEach(inst => params.append('institution', inst));
    selectedSizes.forEach(size => params.append('size', size));
    selectedGenders.forEach(gender => params.append('gender', gender));
    if (sortBy) params.set('sort', sortBy);
    
    // Use router.replace to update URL without adding to history stack for filters
    router.replace(`/products?${params.toString()}`, { scroll: false });

  }, [searchTerm, selectedInstitutions, selectedSizes, selectedGenders, sortBy, router]);


  const filteredProducts = useMemo(() => {
    let products = [...mockProducts]; // Filter for "School & College" category

    if (searchTerm) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.institution && p.institution.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedInstitutions.length > 0) {
      products = products.filter(p => p.institution && selectedInstitutions.includes(p.institution));
    }

    if (selectedSizes.length > 0) {
      products = products.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    
    if (selectedGenders.length > 0) {
      products = products.filter(p => selectedGenders.includes(p.gender));
    }

    products.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      return 0;
    });
    return products;
  }, [searchTerm, selectedInstitutions, selectedSizes, selectedGenders, sortBy]);
  
  const handleCheckboxChange = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    currentValues: string[]
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setter(newValues);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedInstitutions([]);
    setSelectedSizes([]);
    setSelectedGenders([]);
    setSortBy("name_asc");
    router.replace('/products', { scroll: false });
  };

  const categoryName = mockCategories[0]?.name || "All Products";


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-headline">{categoryName}</h1>
          <p className="text-muted-foreground mt-2">Browse our collection of high-quality uniforms.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="md:col-span-1 space-y-6 p-6 bg-card rounded-lg shadow h-fit sticky top-24">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold font-headline">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                <X className="mr-1 h-3 w-3" /> Clear All
              </Button>
            </div>
            
            <div>
              <Label className="text-base font-medium">School/College</Label>
              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-2">
                {allInstitutions.map(inst => (
                  <div key={inst} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`inst-${inst}`} 
                      checked={selectedInstitutions.includes(inst)}
                      onCheckedChange={() => handleCheckboxChange(inst, setSelectedInstitutions, selectedInstitutions)}
                    />
                    <Label htmlFor={`inst-${inst}`} className="text-sm font-normal cursor-pointer">{inst}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Gender</Label>
              <div className="space-y-2 mt-2">
                {allGenders.map(gender => (
                  <div key={gender} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`gender-${gender}`}
                      checked={selectedGenders.includes(gender)}
                      onCheckedChange={() => handleCheckboxChange(gender, setSelectedGenders, selectedGenders)}
                    />
                    <Label htmlFor={`gender-${gender}`} className="text-sm font-normal cursor-pointer">{gender}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Sizes</Label>
              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto pr-2">
                {(allSizes as string[]).map(size => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size}`} 
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => handleCheckboxChange(size, setSelectedSizes, selectedSizes)}
                    />
                    <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">{size}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price filter could be a range slider or min/max inputs - simplified for now */}
          </aside>

          {/* Products Grid and Sort/Search */}
          <div className="md:col-span-3">
            <div className="mb-6 p-4 bg-card rounded-lg shadow sticky top-0 z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <Label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search Products</Label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      id="search" 
                      placeholder="Name, description, institution..." 
                      className="pl-10" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sort" className="block text-sm font-medium text-foreground mb-1">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort">
                      <SelectValue placeholder="Select sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                      <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                      <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                      <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                      {/* Add featured or newness sort if needed */}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
                <p className="text-muted-foreground">Try adjusting your search or filters, or check back later!</p>
                <Button variant="link" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
            {/* Pagination would go here for a real app */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
