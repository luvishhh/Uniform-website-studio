
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts } from "@/lib/mockData"; // Removed mockCategories as it's not used
import type { Product } from "@/types";
import { Search, Edit, PlusCircle, PackageX, PackageCheck, Archive, ArrowLeft } from "lucide-react"; // Removed Filter icon
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const LOW_STOCK_THRESHOLD = 10;

export default function DealerInventoryPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Product['category'] | "all">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "in_stock">("all");

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
    if (stockFilter === "low") {
      products = products.filter(product => (product.stock || 0) < LOW_STOCK_THRESHOLD);
    } else if (stockFilter === "in_stock") {
      products = products.filter(product => (product.stock || 0) >= LOW_STOCK_THRESHOLD);
    }
    return products.sort((a,b) => (a.stock || 0) - (b.stock || 0)); // Sort by stock ascending
  }, [searchTerm, categoryFilter, stockFilter]);

  const productCategories: Product['category'][] = ["School", "College"];

  const handleRequestEdit = (productName: string) => {
    toast({
        title: "Product Update Request (Mock)",
        description: `Update request submitted for ${productName}. This would typically go to an admin for approval.`,
    });
  };

  const handleRequestRestock = (productName: string) => {
    toast({
        title: "Restock Request (Mock)",
        description: `Restock requested for ${productName}. Admin has been notified.`,
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dealer/dashboard"><ArrowLeft className="h-4 w-4"/></Link>
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center">
                    <Archive className="mr-3 h-7 w-7 text-primary" /> Inventory Management
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
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as "all" | "low" | "in_stock")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Statuses</SelectItem>
              <SelectItem value="low">Low Stock (&lt; {LOW_STOCK_THRESHOLD})</SelectItem>
              <SelectItem value="in_stock">In Stock (&ge; {LOW_STOCK_THRESHOLD})</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Viewing {filteredProducts.length} of {mockProducts.length} total products.
             <br/>
            <span className="text-xs text-muted-foreground">(Note: In a real system, dealers would only see products assigned to them or manage their own inventory.)</span>
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
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className={ (product.stock || 0) < LOW_STOCK_THRESHOLD ? "bg-red-50 dark:bg-red-900/30" : ""}>
                    <TableCell>
                      <div className="w-12 h-12 relative rounded-md overflow-hidden border">
                        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" data-ai-hint={product['data-ai-hint'] || "product image"}/>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{product.id}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-xs">{product.sizes.join(', ')}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={(product.stock || 0) < LOW_STOCK_THRESHOLD ? "destructive" : "secondary"} className="text-sm">
                            {product.stock !== undefined ? product.stock : 'N/A'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" title="Request Product Update (Mock)" onClick={() => handleRequestEdit(product.name)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       <Button variant="outline" size="xs" title="Request Restock" onClick={() => handleRequestRestock(product.name)}>
                        <PackageCheck className="h-3 w-3 mr-1"/> Restock
                      </Button>
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
