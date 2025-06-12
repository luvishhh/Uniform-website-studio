
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductById, mockCategories } from "@/lib/mockData";
import type { Product, Category } from "@/types";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [formData, setFormData] = useState<Partial<Product> & { sizes?: string; colors?: string }>({}); 
  
  useEffect(() => {
    if (productId) {
      const fetchedProduct = getProductById(productId);
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        setFormData({
          ...fetchedProduct,
          sizes: fetchedProduct.sizes.join(", "), 
          colors: fetchedProduct.colors?.join(", ") || "",
        });
      }
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
     if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'category') {
      setFormData(prev => ({ ...prev, category: value as 'School' | 'College' }));
    }
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    toast({
      title: "Product Updated (Mock)",
      description: `${formData.name || product?.name} has been successfully updated.`,
      action: <Button variant="outline" size="sm" onClick={() => console.log('Undo mock update')}>Undo</Button>,
    });
  };

  if (product === undefined) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading product details...</p>
        </div>
    );
  }

  if (product === null) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="text-3xl font-bold font-headline text-destructive">Product Not Found</h1>
        <p className="text-muted-foreground">The product with ID "{productId}" could not be found.</p>
        <Button variant="outline" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Products</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editing: {product.name}</CardTitle>
          <CardDescription>Modify the details for this product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="productIdDisplay">Product ID (SKU)</Label>
              <Input id="productIdDisplay" value={product.id} readOnly className="bg-muted/50 cursor-not-allowed" />
              <p className="text-xs text-muted-foreground mt-1">Product ID cannot be changed.</p>
            </div>

            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="name" value={formData.name || ""} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="productDescription">Description</Label>
              <Textarea id="productDescription" name="description" value={formData.description || ""} onChange={handleChange} rows={4} required />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Select name="category" value={formData.category || ""} onValueChange={(value) => handleSelectChange("category", value)} required>
                  <SelectTrigger id="productCategory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                     {(mockCategories as Category[]).map(cat => (
                      <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="productInstitution">School/College Name (Institution)</Label>
                <Input id="productInstitution" name="institution" value={formData.institution || ""} onChange={handleChange} placeholder="e.g., Greenwood High" />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="productGender">Gender</Label>
                    <Select name="gender" value={formData.gender || ""} onValueChange={(value) => handleSelectChange("gender", value)} required>
                    <SelectTrigger id="productGender">
                        <SelectValue placeholder="Select gender target" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Unisex">Unisex</SelectItem>
                        <SelectItem value="Boys">Boys</SelectItem>
                        <SelectItem value="Girls">Girls</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="productSizes">Sizes (comma-separated)</Label>
                    <Input id="productSizes" name="sizes" value={formData.sizes as string || ""} onChange={handleChange} placeholder="e.g., S, M, L, XL" required />
                </div>
            </div>

            <div className="grid sm:grid-cols-1 gap-6"> {/* Changed to single column as stock is removed */}
              <div>
                <Label htmlFor="productPrice">Price ($)</Label>
                <Input id="productPrice" name="price" type="number" value={formData.price || ""} onChange={handleChange} step="0.01" placeholder="e.g., 20.00" required />
              </div>
              {/* Stock Quantity field was previously removed */}
            </div>
            
            <div>
              <Label htmlFor="productColors">Colors (comma-separated, Optional)</Label>
              <Input id="productColors" name="colors" value={formData.colors as string || ""} onChange={handleChange} placeholder="e.g., White, Light Blue" />
            </div>

            <div>
              <Label htmlFor="productImageUrl">Image URL</Label>
              <Input id="productImageUrl" name="imageUrl" type="url" value={formData.imageUrl || ""} onChange={handleChange} placeholder="https://placehold.co/600x400.png" required />
            </div>
            
            <div className="flex items-center space-x-2">
              <Input 
                type="checkbox" 
                id="featuredProduct" 
                name="featured" 
                checked={formData.featured || false}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
              />
              <Label htmlFor="featuredProduct" className="text-sm font-medium">
                Mark as Featured Product
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <CheckCircle className="mr-2 h-5 w-5" /> Save Changes
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
