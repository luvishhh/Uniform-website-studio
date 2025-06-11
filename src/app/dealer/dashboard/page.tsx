
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers, mockOrders, mockProducts, mockCategories, getUserById } from "@/lib/mockData";
import type { DealerUser, Order, Product } from "@/types";
import { Briefcase, UserCircle, ArrowRight, DollarSign, ListOrdered, AlertTriangle, Bell, LineChart as LineChartIcon, PieChart as PieChartIcon, FileText, Users, Tag, MessageSquare, Settings, BarChart3, HelpCircle, ShoppingCart, Archive } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as RechartsLegend, ComposedChart, Pie, Cell as RechartsCell } from 'recharts';
import { format, parseISO, startOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from "date-fns";

const LOW_STOCK_THRESHOLD = 10;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const getInitials = (name: string = "") => {
  if (!name) return "U";
  const names = name.split(' ');
  return names.map(n => n[0]).join('').toUpperCase() || 'U';
};

const defaultDealerForDemo = mockUsers.find(u => u.id === 'deal_1' && u.role === 'dealer') as DealerUser | undefined;

export default function DealerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<DealerUser | null>(defaultDealerForDemo || null);
  const [isLoading, setIsLoading] = useState<boolean>(!defaultDealerForDemo);

  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [recentActivity, setRecentActivity] = useState<Order[]>([]);

  useEffect(() => {
    const fetchDealerDataAndAnalytics = async () => {
      setIsLoading(true);
      let activeUser: DealerUser | null = null;
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;
      const storedUserRole = typeof window !== "undefined" ? localStorage.getItem('unishop_user_role') : null;

      if (storedUserId && storedUserRole === 'dealer') {
        try {
          const userRes = await fetch(`/api/user/${storedUserId}`);
          if (userRes.ok) {
            const userData: DealerUser = await userRes.json();
            activeUser = userData;
            setCurrentUser(userData);
          } else {
            toast({ title: "Error", description: "Failed to load dealer data. Using demo data.", variant: "destructive" });
          }
        } catch (error) {
          toast({ title: "Error", description: "Could not connect to server for dealer data. Using demo data.", variant: "destructive" });
        }
      }
      
      if (!activeUser && defaultDealerForDemo) {
        activeUser = defaultDealerForDemo;
        setCurrentUser(defaultDealerForDemo);
      }

      if (activeUser) {
        const allSales = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalSales(allSales);

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthSalesData = mockOrders
          .filter(order => {
            const orderDate = parseISO(order.orderDate);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          })
          .reduce((sum, order) => sum + order.totalAmount, 0);
        setMonthlySales(monthSalesData);

        const pendingCount = mockOrders.filter(order => order.status === 'Placed' || order.status === 'Confirmed').length;
        setPendingOrdersCount(pendingCount);

        const lowStock = mockProducts.filter(p => (p.stock || 0) < LOW_STOCK_THRESHOLD);
        setLowStockItems(lowStock);

        setRecentActivity(mockOrders.slice(0, 5).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
      }
      setIsLoading(false);
    };
    fetchDealerDataAndAnalytics();
  }, [toast]);

  const salesTrendData = useMemo(() => {
    const last6MonthsSales: { name: string, sales: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonthDate = subMonths(new Date(), i);
      const monthName = format(targetMonthDate, 'MMM yy');
      const salesThisMonth = mockOrders
        .filter(order => {
          const orderDate = parseISO(order.orderDate);
          return orderDate.getMonth() === targetMonthDate.getMonth() && orderDate.getFullYear() === targetMonthDate.getFullYear();
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
      last6MonthsSales.push({ name: monthName, sales: salesThisMonth });
    }
    return last6MonthsSales;
  }, []);

  const topCategoriesData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    mockOrders.forEach(order => {
      order.items.forEach(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        if (product) {
          categoryCounts[product.category] = (categoryCounts[product.category] || 0) + item.quantity;
        }
      });
    });
    return Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, []);


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
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-10rem)] p-6 text-center">
            <Briefcase className="h-16 w-16 text-destructive mb-4" />
            <p className="text-xl font-semibold mb-2">Unable to Load Dealer Data</p>
            <p className="text-muted-foreground mb-6">Please ensure you are logged in as a dealer or that the default demo dealer data is available.</p>
            <Button onClick={() => router.push('/login')} className="mt-4">Go to Login</Button>
        </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <section className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold font-headline">
              Welcome, {currentUser.dealerName || "Dealer"}!
            </CardTitle>
            <CardDescription>Here's an overview of your business on UniShop.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales (Lifetime)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time sales figures</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales (This Month)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySales.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Revenue generated this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrdersCount}</div>
              <p className="text-xs text-muted-foreground">Orders awaiting processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItems.length} items</div>
              <p className="text-xs text-muted-foreground">Items below threshold ({LOW_STOCK_THRESHOLD} units)</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}/>
                  <RechartsLegend wrapperStyle={{fontSize: "12px"}} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" barSize={20} name="Sales ($)"/>
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Categories (Units)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                {topCategoriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie data={topCategoriesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                            {topCategoriesData.map((entry, index) => (
                            <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => [`${value} units`, undefined]}/>
                        <RechartsLegend wrapperStyle={{fontSize: "12px"}} layout="vertical" align="right" verticalAlign="middle"/>
                        </PieChart>
                    </ResponsiveContainer>
                ) : <p className="text-muted-foreground text-center pt-10">No category sales data available.</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders placed on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                {recentActivity.length > 0 ? (
                    <ul className="space-y-3">
                        {recentActivity.map(order => (
                            <li key={order.id} className="flex justify-between items-center text-sm p-2 border-b last:border-b-0">
                                <div>
                                    <span className="font-medium">Order #{order.id.substring(0,6)}...</span>
                                    <span className="text-xs text-muted-foreground ml-2">by {order.shippingAddress.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
                                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${ order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700' }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ): (
                    <p className="text-muted-foreground text-center py-4">No recent orders.</p>
                )}
            </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Order Management</CardTitle>
                <ShoppingCart className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">View, track, and update orders.</p>
                <Button asChild variant="outline" className="w-full"><Link href="/dealer/orders">Manage Orders <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Inventory Management</CardTitle>
                <Archive className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Track stock levels and manage products.</p>
                <Button asChild variant="outline" className="w-full"><Link href="/dealer/inventory">Manage Inventory <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-70 cursor-not-allowed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Sales & Revenue</CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Detailed sales reports and revenue summaries.</p>
                <Button variant="outline" className="w-full" disabled>View Reports (Coming Soon)</Button>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-70 cursor-not-allowed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Customer Management</CardTitle>
                <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">View customer lists and order history.</p>
                <Button variant="outline" className="w-full" disabled>Manage Customers (Coming Soon)</Button>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-70 cursor-not-allowed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Promotions & Discounts</CardTitle>
                <Tag className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Create and manage promotional offers.</p>
                <Button variant="outline" className="w-full" disabled>Manage Promotions (Coming Soon)</Button>
            </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow opacity-70 cursor-not-allowed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Communication Tools</CardTitle>
                <MessageSquare className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Messages, notifications, and support.</p>
                <Button variant="outline" className="w-full" disabled>View Messages (Coming Soon)</Button>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Profile & Settings</CardTitle>
                <Settings className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Manage your dealer account details.</p>
                <Button asChild variant="outline" className="w-full"><Link href="/profile?tab=settings">Go to Settings <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
            </CardContent>
        </Card>

         <Card className="hover:shadow-lg transition-shadow opacity-70 cursor-not-allowed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Advanced Analytics</CardTitle>
                <PieChartIcon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Deeper insights and performance metrics.</p>
                <Button variant="outline" className="w-full" disabled>View Analytics (Coming Soon)</Button>
            </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow opacity-70 cursor-not-allowed">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Help & Resources</CardTitle>
                <HelpCircle className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-3">FAQs, guides, and support contact.</p>
                <Button variant="outline" className="w-full" disabled>Get Help (Coming Soon)</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    