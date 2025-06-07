
"use client";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts, mockCategories } from "@/lib/mockData";
import Link from "next/link";
import { PlusCircle, Search, Filter as FilterIcon, Package, ChevronDown } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


const getUniqueValues = (products: typeof mockProducts, key: 'institution' | 'gender' | 'category') => {
  if (key === 'category') {
     return Array.from(new Set(products.map(p => p.category))).sort() as string[];
  }
  return Array.from(new Set(products.map(p => p[key]).filter(Boolean))).sort() as string[];
};

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "all");
  const [selectedInstitution, setSelectedInstitution] = useState(searchParams.get('institution') || "all");
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || "all");
  
  const allCategories = useMemo(() => getUniqueValues(mockProducts, 'category'), []);
  const allInstitutions = useMemo(() => getUniqueValues(mockProducts, 'institution'), []);
  const allGenders: ('Unisex' | 'Boys' | 'Girls' | string)[] = ['Unisex', 'Boys', 'Girls'];


  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    if (selectedCategory !== "all") {
      products = products.filter(p => p.category === selectedCategory);
    }
    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.institution && p.institution.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedInstitution !== "all") {
      products = products.filter(p => p.institution === selectedInstitution);
    }
    if (selectedGender !== "all") {
      products = products.filter(p => p.gender === selectedGender);
    }
    return products;
  }, [searchTerm, selectedCategory, selectedInstitution, selectedGender]);

  const updateURLParams = (paramsToUpdate: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value && value !== "all") {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });
    router.push(`/admin/products?${currentParams.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateURLParams({ search: e.target.value, category: selectedCategory, institution: selectedInstitution, gender: selectedGender });
  };
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    updateURLParams({ search: searchTerm, category: value, institution: selectedInstitution, gender: selectedGender });
  };

  const handleInstitutionChange = (value: string) => {
    setSelectedInstitution(value);
    updateURLParams({ search: searchTerm, category: selectedCategory, institution: value, gender: selectedGender });
  };
  
  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
    updateURLParams({ search: searchTerm, category: selectedCategory, institution: selectedInstitution, gender: value });
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Manage Products</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </div>

      <div className="p-4 bg-card rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="search-product" className="block text-sm font-medium text-foreground mb-1">Search</label>
            <div className="relative">
              <Input 
                type="text" 
                id="search-product" 
                placeholder="Name, ID, Institution..." 
                className="pl-10" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Category</label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="institution-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Institution</label>
            <Select value={selectedInstitution} onValueChange={handleInstitutionChange}>
              <SelectTrigger id="institution-filter">
                <SelectValue placeholder="All Institutions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Institutions</SelectItem>
                {allInstitutions.map(inst => (
                  <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="gender-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Gender</label>
            <Select value={selectedGender} onValueChange={handleGenderChange}>
              <SelectTrigger id="gender-filter">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                {allGenders.map(gender => (
                  <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} isAdminView={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
