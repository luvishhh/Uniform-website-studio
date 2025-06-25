'use client'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

const getUniqueValues = (products: any[], key: string) => {
  if (key === 'sizes') {
    return Array.from(new Set(products.flatMap((p) => p.sizes || []))).sort()
  }
  return Array.from(new Set(products.map((p) => p[key]).filter(Boolean))).sort()
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const initialCategorySlug = searchParams.get('category')
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategorySlug
  )
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>(
    searchParams.getAll('institution') || []
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    searchParams.getAll('size') || []
  )
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    searchParams.getAll('gender') || []
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name_asc')

  useEffect(() => {
    setLoading(true)
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = [...products]
    if (selectedCategory) {
      filtered = filtered.filter((p: any) => p.category === selectedCategory)
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (p: any) =>
          (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.description &&
            p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.institution &&
            p.institution.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    if (selectedInstitutions.length > 0) {
      filtered = filtered.filter(
        (p: any) =>
          p.institution && selectedInstitutions.includes(p.institution)
      )
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(
        (p: any) =>
          Array.isArray(p.sizes) &&
          p.sizes.some((s: string) => selectedSizes.includes(s))
      )
    }
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((p: any) => selectedGenders.includes(p.gender))
    }
    filtered.sort((a: any, b: any) => {
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name)
      return 0
    })
    return filtered
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedInstitutions,
    selectedSizes,
    selectedGenders,
    sortBy,
  ])

  const handleFilterChange = (
    value: string,
    currentValues: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    setter(newValues)
  }

  const handleCategoryChange = (slug: string | null) => {
    setSelectedCategory(slug)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory(null)
    setSelectedInstitutions([])
    setSelectedSizes([])
    setSelectedGenders([])
    setSortBy('name_asc')
  }

  const pageTitle = useMemo(() => {
    if (selectedCategory) {
      return `${selectedCategory} Uniforms`
    }
    return 'Shop All Uniforms'
  }, [selectedCategory])

  const getSortByLabel = () => {
    if (sortBy === 'price_asc') return 'Price: Low to High'
    if (sortBy === 'price_desc') return 'Price: High to Low'
    if (sortBy === 'name_asc') return 'Name: A-Z'
    if (sortBy === 'name_desc') return 'Name: Z-A'
    return 'Sort By'
  }

  if (loading) return <div>Loading products...</div>

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 md:px-6 py-8'>
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-bold font-headline'>{pageTitle}</h1>
          <p className='text-muted-foreground mt-2'>
            Browse our collection of high-quality uniforms.
          </p>
        </div>

        <div className='mb-6 p-4 bg-card rounded-lg shadow-md sticky top-[70px] md:top-[70px] z-30'>
          <div className='flex flex-col md:flex-row gap-4 mb-4'>
            <div className='w-full md:flex-grow'>
              <Label htmlFor='search-products' className='sr-only'>
                Search Products
              </Label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
                <Input
                  type='text'
                  id='search-products'
                  placeholder='Name, description, institution...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-3 items-center'>
            {/* Category Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-between min-w-[160px]'
                >
                  Category: {selectedCategory ? selectedCategory : 'All'}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => handleCategoryChange(null)}>
                  All Categories
                </DropdownMenuItem>
                {/* Add category options here */}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Institution Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-between min-w-[160px]'
                >
                  Institutions{' '}
                  {selectedInstitutions.length > 0
                    ? `(${selectedInstitutions.length})`
                    : ''}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='max-h-60 overflow-y-auto'
              >
                <DropdownMenuLabel>Filter by School/College</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getUniqueValues(products, 'institution').map((inst) => (
                  <DropdownMenuCheckboxItem
                    key={inst}
                    checked={selectedInstitutions.includes(inst)}
                    onCheckedChange={() =>
                      handleFilterChange(
                        inst,
                        selectedInstitutions,
                        setSelectedInstitutions
                      )
                    }
                  >
                    {inst}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Gender Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-between min-w-[120px]'
                >
                  Gender{' '}
                  {selectedGenders.length > 0
                    ? `(${selectedGenders.length})`
                    : ''}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuLabel>Filter by Gender</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {['Unisex', 'Boys', 'Girls'].map((gender) => (
                  <DropdownMenuCheckboxItem
                    key={gender}
                    checked={selectedGenders.includes(gender)}
                    onCheckedChange={() =>
                      handleFilterChange(
                        gender,
                        selectedGenders,
                        setSelectedGenders
                      )
                    }
                  >
                    {gender}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sizes Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-between min-w-[100px]'
                >
                  Size{' '}
                  {selectedSizes.length > 0 ? `(${selectedSizes.length})` : ''}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='max-h-60 overflow-y-auto'
              >
                <DropdownMenuLabel>Filter by Size</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {getUniqueValues(products, 'sizes').map((size) => (
                  <DropdownMenuCheckboxItem
                    key={size}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() =>
                      handleFilterChange(size, selectedSizes, setSelectedSizes)
                    }
                  >
                    {size}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort By Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='justify-between min-w-[180px]'
                >
                  {getSortByLabel()}
                  <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setSortBy('name_asc')}>
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy('name_desc')}>
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy('price_asc')}>
                  Price (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortBy('price_desc')}>
                  Price (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant='ghost'
              onClick={clearFilters}
              className='text-sm ml-auto md:ml-0'
            >
              <X className='mr-1 h-3 w-3' /> Clear All
            </Button>
          </div>
        </div>

        <div className='mt-8'>
          {filteredProducts.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className='text-center py-12 border-2 border-dashed rounded-lg'>
              <Filter className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <h2 className='text-xl font-semibold mb-2'>No Products Found</h2>
              <p className='text-muted-foreground'>
                Try adjusting your search or filters, or check back later!
              </p>
              <Button variant='link' onClick={clearFilters} className='mt-4'>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
