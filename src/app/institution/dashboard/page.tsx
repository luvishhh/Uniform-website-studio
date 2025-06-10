
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts, mockOrders, mockUsers, getProductById, getUserById } from "@/lib/mockData";
import type { Product, InstitutionUser, StudentUser, User, Order } from "@/types";
import { ListChecks, FileText, Building, UserCircle, Users, ShoppingCart, Star, UserCheck, Package as PackageIcon } from "lucide-react"; // Added UserCheck and PackageIcon
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function InstitutionDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<InstitutionUser | null>(null);
  const [institutionProducts, setInstitutionProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for analytics
  const [registeredStudentCount, setRegisteredStudentCount] = useState(0);
  const [purchasingStudentCount, setPurchasingStudentCount] = useState(0);
  const [totalUniformOrders, setTotalUniformOrders] = useState(0);
  const [mostPopularProduct, setMostPopularProduct] = useState<{ name: string; quantity: number }>({ name: "N/A", quantity: 0 });

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
            const products = mockProducts.filter(p => p.institution && userData.institutionName && p.institution.toLowerCase() === userData.institutionName.toLowerCase());
            setInstitutionProducts(products);
          } else {
            console.error("Failed to fetch institution details");
            toast({ title: "Error", description: "Failed to load institution data.", variant: "destructive"});
          }
        } catch (error) {
          console.error("Error fetching institution data:", error);
          toast({ title: "Error", description: "Could not connect to server for institution data.", variant: "destructive"});
        }
      } else {
         toast({ title: "Access Denied", description: "You are not logged in as an institution.", variant: "destructive"});
         router.push('/login');
      }
      setIsLoading(false);
    };
    fetchInstitutionData();
  }, [router, toast]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'institution' && currentUser.institutionName) {
      const institutionNameLower = currentUser.institutionName.toLowerCase();

      // 1. Registered Students for this institution
      const studentsOfInstitution = mockUsers.filter(
        (u): u is StudentUser => u.role === 'student' && 
                                 typeof (u as StudentUser).schoolCollegeName === 'string' &&
                                 (u as StudentUser).schoolCollegeName.toLowerCase() === institutionNameLower
      );
      setRegisteredStudentCount(studentsOfInstitution.length);

      let purchasingStudentsSet = new Set<string>();
      let totalOrdersForInstitutionCount = 0;
      const productSaleCounts: Record<string, number> = {};

      mockOrders.forEach(order => {
        let orderContainsInstitutionProduct = false;
        order.items.forEach(item => {
          const productDetails = getProductById(item.productId);
          if (productDetails && productDetails.institution && productDetails.institution.toLowerCase() === institutionNameLower) {
            orderContainsInstitutionProduct = true;
            productSaleCounts[item.productId] = (productSaleCounts[item.productId] || 0) + item.quantity;
            
            const orderUser = getUserById(order.userId);
            if (orderUser && orderUser.role === 'student' && 
                typeof (orderUser as StudentUser).schoolCollegeName === 'string' &&
                (orderUser as StudentUser).schoolCollegeName.toLowerCase() === institutionNameLower) {
              purchasingStudentsSet.add(order.userId);
            }
          }
        });
        if (orderContainsInstitutionProduct) {
          totalOrdersForInstitutionCount++;
        }
      });

      setPurchasingStudentCount(purchasingStudentsSet.size);
      setTotalUniformOrders(totalOrdersForInstitutionCount);

      let topProduct = { name: "N/A", quantity: 0 };
      if (Object.keys(productSaleCounts).length > 0) {
        const mostSoldProductId = Object.keys(productSaleCounts).reduce((a, b) =>
          productSaleCounts[a] > productSaleCounts[b] ? a : b
        );
        const mostSoldProductDetails = getProductById(mostSoldProductId);
        if (mostSoldProductDetails) {
          topProduct = { name: mostSoldProductDetails.name, quantity: productSaleCounts[mostSoldProductId] };
        }
      }
      setMostPopularProduct(topProduct);
    } else {
      // Reset analytics if no current user or not an institution
      setRegisteredStudentCount(0);
      setPurchasingStudentCount(0);
      setTotalUniformOrders(0);
      setMostPopularProduct({ name: "N/A", quantity: 0 });
    }
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
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

      {/* Key Analytics Section */}
      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Key Analytics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{registeredStudentCount}</div>
                <p className="text-xs text-muted-foreground">Total students from {currentUser?.institutionName || "your institution"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Purchased Uniforms</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchasingStudentCount}</div>
                <p className="text-xs text-muted-foreground">Unique students who bought uniforms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Uniform Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUniformOrders}</div>
                <p className="text-xs text-muted-foreground">Orders containing your institution's uniforms</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Popular Uniform</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate" title={mostPopularProduct.name}>{mostPopularProduct.name}</div>
                <p className="text-xs text-muted-foreground">{mostPopularProduct.quantity} units sold</p>
              </CardContent>
            </Card>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section>
          <h2 className="text-2xl font-bold font-headline mb-6">Quick Actions</h2>
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
      </section>


      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">Uniforms for {currentUser?.institutionName || "Your Institution"}</h2>
        {institutionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {institutionProducts.map(product => (
              <ProductCard key={product.id} product={product} isAdminView={false} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
                <PackageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                    No specific uniforms are currently listed for {currentUser?.institutionName || "your institution"}.
                    <br />
                    Please contact support or use the "Manage Catalog" section to update your uniform list.
                </p>
                 <Button variant="link" className="mt-4" asChild><Link href="/contact">Contact Support</Link></Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
