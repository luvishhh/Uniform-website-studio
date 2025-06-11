// This page was intended to be removed as per previous instructions.
// Providing a minimal component to resolve the "default export is not a React Component" error.
// Ideally, the route /dealer/products should not exist.
"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { PackageX } from 'lucide-react'; 

export default function DealerProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8">
      <PackageX className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Catalog Not Available</h1>
      <p className="text-muted-foreground mb-6">
        The dealer-specific product catalog has been removed from the portal.
      </p>
      <Button asChild variant="outline">
        <Link href="/dealer/dashboard">Return to Dealer Dashboard</Link>
      </Button>
    </div>
  );
}
