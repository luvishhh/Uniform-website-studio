
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCategories } from "@/lib/mockData"; 
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import type { Category } from "@/types";

export default function AdminAddNewProductPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form data processing would happen here
    // const formData = new FormData(event.currentTarget);
    // const productData = Object.fromEntries(formData.entries());
    // console.log("New Product Data (Mock):", productData);
    
    toast({
      title: "Product Added (Mock)",
      description: "The new product has been successfully added to the catalog.",
      action: <Button variant="outline" size="sm" onClick={() => console.log('Undo mock')}>Undo</Button>,
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Products</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Fill in the details for the new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="productId">Product ID (SKU)</Label>
              <Input id="productId" name="id" placeholder="e.g., SCH-SHT-WH-M" required />
              <p className="text-xs text-muted-foreground mt-1">Unique identifier for the product.</p>
            </div>

            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input id="productName" name="name" placeholder="e.g., Classic White School Shirt" required />
            </div>

            <div>
              <Label htmlFor="productDescription">Description</Label>
              <Textarea id="productDescription" name="description" placeholder="Detailed description of the product..." rows={4} required />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Select name="category" required>
                  <SelectTrigger id="productCategory">
                    <SelectValue placeholder="Select category" />
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
                <Input id="productInstitution" name="institution" placeholder="e.g., Greenwood High" />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="productGender">Gender</Label>
                    <Select name="gender" required>
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
                    <Input id="productSizes" name="sizes" placeholder="e.g., S, M, L, XL" required />
                </div>
            </div>


            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="productPrice">Price ($)</Label>
                <Input id="productPrice" name="price" type="number" step="0.01" placeholder="e.g., 20.00" required />
              </div>
              {/* Stock Quantity Removed */}
            </div>
            
            <div>
              <Label htmlFor="productColors">Colors (comma-separated, Optional)</Label>
              <Input id="productColors" name="colors" placeholder="e.g., White, Light Blue" />
            </div>

            <div>
              <Label htmlFor="productImageUrl">Image URL</Label>
              <Input id="productImageUrl" name="imageUrl" type="url" placeholder="https://placehold.co/600x400.png" required />
              <p className="text-xs text-muted-foreground mt-1">Or use a placeholder like https://placehold.co/600x400.png</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id="featuredProduct" name="featured" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <Label htmlFor="featuredProduct" className="text-sm font-medium">
                Mark as Featured Product
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <CheckCircle className="mr-2 h-5 w-5" /> Add Product
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
