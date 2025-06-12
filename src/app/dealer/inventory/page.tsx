
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts } from "@/lib/mockData"; 
import type { Product } from "@/types";
import { Search, Edit, PlusCircle, PackageX, PackageCheck, Archive, ArrowLeft } from "lucide-react"; 
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// LOW_STOCK_THRESHOLD removed as stock system is removed

export default function DealerInventoryPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Product['category'] | "all">("all");
  // stockFilter removed as stock system is removed

  const filteredProducts = useMemo(() => {
    let products = mockProducts;
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.institution || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (categoryFilter !== "all") {
      products = products.filter(product => product.category === categoryFilter);
    }
    // Logic for stockFilter removed
    // Sorting by name as stock is removed
    return products.sort((a,b) => a.name.localeCompare(b.name)); 
  }, [searchTerm, categoryFilter]);

  const productCategories: Product['category'][] = ["School", "College"];

  const handleRequestEdit = (productName: string) => {
    toast({
        title: "Product Update Request (Mock)",
        description: `Update request submitted for ${productName}. This would typically go to an admin for approval.`,
    });
  };

  // handleRequestRestock removed as stock system is removed

  return (
    <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dealer/dashboard"><ArrowLeft className="h-4 w-4"/></Link>
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center">
                    <Archive className="mr-3 h-7 w-7 text-primary" /> Inventory Overview
                </h1>
            </div>
            <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product (Admin Approval)
            </Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Products</CardTitle>
          <CardDescription>Search and filter your product inventory.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Adjusted grid from 3 to 2 */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Product Name, ID, Institution..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Product['category'] | "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {productCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Stock Status Filter Select removed */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Viewing {filteredProducts.length} of {mockProducts.length} total products.
             <br/>
            <span className="text-xs text-muted-foreground">(Note: In a real system, dealers would only see products assigned to them.)</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sizes</TableHead>
                  {/* Stock Column Removed */}
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded-md overflow-hidden border">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product['data-ai-hint'] || "product image"}/>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-xs">{product.sizes.join(', ')}</TableCell>
                    {/* Stock TableCell Removed */}
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" title="Request Product Update (Mock)" onClick={() => handleRequestEdit(product.name)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       {/* Restock Button Removed */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-10">
                <PackageX className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products match your filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
