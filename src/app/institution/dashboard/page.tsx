
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mockData"; // We'll use mockProducts for now
import type { Product, InstitutionUser } from "@/types";
import { ListChecks, FileText, Building, UserCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function InstitutionDashboardPage() {
  const [currentUser, setCurrentUser] = useState<InstitutionUser | null>(null);
  const [institutionProducts, setInstitutionProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      setIsLoading(true);
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;
      const storedUserRole = typeof window !== "undefined" ? localStorage.getItem('unishop_user_role') : null;

      if (storedUserId && storedUserRole === 'institution') {
        try {
          const userRes = await fetch(`/api/user/${storedUserId}`);
          if (userRes.ok) {
            const userData: InstitutionUser = await userRes.json();
            setCurrentUser(userData);
            // Filter products based on institution name
            const products = mockProducts.filter(p => p.institution === userData.institutionName);
            setInstitutionProducts(products);
          } else {
            console.error("Failed to fetch institution details");
          }
        } catch (error) {
          console.error("Error fetching institution data:", error);
        }
      }
      setIsLoading(false);
    };
    fetchInstitutionData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
            <Building className="h-12 w-12 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">
                    Welcome, {currentUser?.institutionName || "Institution"}!
                </h1>
                <p className="text-muted-foreground">This is your central hub for managing uniforms and orders.</p>
            </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium font-headline">Manage Uniform Catalog</CardTitle>
            <ListChecks className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Review and update the list of approved uniforms for your institution.
            </p>
            <Button asChild variant="outline">
              <Link href="/institution/catalog">Go to Catalog</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium font-headline">Bulk Order Inquiries</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Initiate or track bulk order requests for your institution's uniform needs.
            </p>
            <Button asChild variant="outline">
              <Link href="/institution/bulk-orders">Bulk Orders</Link>
            </Button>
          </CardContent>
        </Card>
         <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium font-headline">Your Profile</CardTitle>
            <UserCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and update your institution's contact and profile information.
            </p>
            <Button asChild variant="outline">
              <Link href="/profile">View Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Uniforms for {currentUser?.institutionName || "Your Institution"}</h2>
        {institutionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {institutionProducts.map(product => (
              <ProductCard key={product.id} product={product} isAdminView={false} /> // Institutions are not admins here
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
            No specific uniforms are currently listed for your institution. Please contact support or check the "Manage Catalog" section.
          </p>
        )}
      </section>
    </div>
  );
}

    