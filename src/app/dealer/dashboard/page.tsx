
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mockData";
import type { Product, DealerUser } from "@/types";
import { Briefcase, ShoppingBag, FileText, UserCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function DealerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<DealerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 3);

  useEffect(() => {
    const fetchDealerData = async () => {
      setIsLoading(true);
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;
      const storedUserRole = typeof window !== "undefined" ? localStorage.getItem('unishop_user_role') : null;

      if (storedUserId && storedUserRole === 'dealer') {
        try {
          const userRes = await fetch(`/api/user/${storedUserId}`);
          if (userRes.ok) {
            const userData: DealerUser = await userRes.json();
            setCurrentUser(userData);
          } else {
            toast({ title: "Error", description: "Failed to load dealer data.", variant: "destructive" });
            router.push('/login');
          }
        } catch (error) {
          toast({ title: "Error", description: "Could not connect to server for dealer data.", variant: "destructive" });
          router.push('/login');
        }
      } else {
        // Fallback to a default mock dealer if not logged in or role mismatch for demo purposes
        const mockDealer = mockUsers.find(u => u.role === 'dealer' && u.id === 'deal_1') as DealerUser | undefined;
        if (mockDealer) {
            setCurrentUser(mockDealer);
        } else {
            toast({ title: "Access Denied / Demo Error", description: "Dealer not found or default demo dealer missing.", variant: "destructive" });
            router.push('/login');
        }
      }
      setIsLoading(false);
    };
    fetchDealerData();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading dealer dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-10rem)]">
            <Briefcase className="h-12 w-12 text-destructive mr-3" />
            <div>
            <p className="text-xl font-semibold">Unable to Load Dealer Data</p>
            <p className="text-muted-foreground">Please ensure you are logged in as a dealer or try again later.</p>
            <Button onClick={() => router.push('/login')} className="mt-4">Go to Login</Button>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
            <Briefcase className="h-12 w-12 text-primary" />
            <div>
                <h1 className="text-3xl font-bold font-headline">
                    Welcome, {currentUser?.dealerName || "Dealer"}!
                </h1>
                <p className="text-muted-foreground">Your portal for product catalog and bulk inquiries.</p>
            </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Browse Full Catalog</CardTitle>
              <ShoppingBag className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Explore all available uniform products.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dealer/products">View Catalog <ArrowRight className="ml-2 h-4 w-4"/></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Submit Bulk Inquiry</CardTitle>
              <FileText className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Need large quantities? Submit an inquiry.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dealer/inquiries">Make an Inquiry <ArrowRight className="ml-2 h-4 w-4"/></Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Your Profile</CardTitle>
              <UserCircle className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Manage your dealer account details.</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">View Profile <ArrowRight className="ml-2 h-4 w-4"/></Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Featured Products for Dealers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} isAdminView={false} /> // isAdminView=false to hide admin buttons
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
