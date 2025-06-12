
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers, mockOrders, mockProducts, getUserById } from "@/lib/mockData";
import type { DealerUser, Order, Product, OrderStatus } from "@/types";
import { Briefcase, ArrowRight, DollarSign, ListOrdered, AlertTriangle, Bell, LineChart as LineChartIcon, PieChart as RechartsPieChartIcon, FileText, Users, Tag, MessageSquare, Settings, BarChart3, HelpCircle, ShoppingCart, Archive, TrendingUp, UserCheck, Clock, Download, Building, Eye, Percent } from "lucide-react"; // Added Percent
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, LineChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend as RechartsLegend, ComposedChart, Pie, Cell as RechartsCell, PieChart as RechartsPieChart } from 'recharts';
import { format, parseISO, subMonths } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const defaultDealerForDemo = mockUsers.find(u => u.id === 'deal_1' && u.role === 'dealer') as DealerUser | undefined;

const mockCustomerData = [
    { id: 'cust_1', name: 'Alice Wonderland (Student)', email: 'alice.parent@example.com', totalOrders: 3, lastOrderDate: '2023-12-05' },
    { id: 'cust_2', name: 'Bob The Builder (Student)', email: 'bob.student@example.com', totalOrders: 2, lastOrderDate: '2023-11-01' },
    { id: 'cust_3', name: 'Greenwood High (Institution)', email: 'admin@greenwood.edu', totalOrders: 15, lastOrderDate: '2023-11-20' },
];

const mockPayoutHistory = [
    { id: 'pay_1', date: '2023-12-01', amount: 450.75, status: 'Paid' },
    { id: 'pay_2', date: '2023-11-01', amount: 380.50, status: 'Paid' },
    { id: 'pay_3', date: '2023-10-01', amount: 520.00, status: 'Paid' },
];

export default function DealerDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<DealerUser | null>(defaultDealerForDemo || null);
  const [isLoading, setIsLoading] = useState<boolean>(!defaultDealerForDemo);

  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lowStockItemCount, setLowStockItemCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<Order[]>([]);

 useEffect(() => {
    const fetchDealer = () => {
        const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;
        const storedUserRole = typeof window !== "undefined" ? localStorage.getItem('unishop_user_role') : null;
        let activeUser: DealerUser | null = null;

        if (storedUserId && storedUserRole === 'dealer') {
            const user = getUserById(storedUserId) as DealerUser | undefined;
            if (user) {
                activeUser = user;
            }
        }
        
        if (!activeUser && defaultDealerForDemo) { // Fallback to demo if no stored user or user not found
            activeUser = defaultDealerForDemo;
        }
        setCurrentUser(activeUser);
        setIsLoading(false); // Set loading to false after attempting to set user
    };
    fetchDealer();
  }, []);


  useEffect(() => {
    if (!currentUser || isLoading) return; 

    const fetchDealerDataAndAnalytics = async () => {
      if (currentUser) {
        // Mock total sales (lifetime) - can be a fixed number or more complex if needed
        const allSalesData = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        setTotalSales(allSalesData);

        // Mock monthly sales
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthSalesData = mockOrders
          .filter(order => {
            const orderDate = parseISO(order.orderDate);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
          })
          .reduce((sum, order) => sum + order.totalAmount, 0);
        setMonthlySales(monthSalesData);

        // Pending orders for THIS dealer or generally assignable
        const pendingCount = mockOrders.filter(order => 
            (order.status === 'Pending Dealer Assignment' && !order.assignedDealerId) ||
            (order.status === 'Awaiting Dealer Acceptance' && order.assignedDealerId === currentUser.id)
        ).length;
        setPendingOrdersCount(pendingCount);
        
        // Mock Low Stock Item Count
        const lowStockThreshold = 10;
        const lowStockCount = mockProducts.filter(p => (p.stock || 0) < lowStockThreshold).length;
        setLowStockItemCount(lowStockCount);
        
        // Mock Recent Activity (last 5 orders)
        setRecentActivity(mockOrders.slice(0, 5).sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
      }
    };
    fetchDealerDataAndAnalytics();
  }, [currentUser, isLoading, toast]);

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

  const averageOrderValue = useMemo(() => {
    return mockOrders.length > 0 ? totalSales / mockOrders.length : 0;
  }, [totalSales]);


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

  const commissionThisMonth = monthlySales * 0.10;

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
              <CardTitle className="text-sm font-medium">Commissions (This Month)</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${commissionThisMonth.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Your estimated 10% earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ListOrdered className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrdersCount}</div>
              <p className="text-xs text-muted-foreground">Orders awaiting your action</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lowStockItemCount}</div>
              <p className="text-xs text-muted-foreground">Items needing restock (mock)</p>
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
                        <RechartsPieChart>
                        <Pie data={topCategoriesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                            {topCategoriesData.map((entry, index) => (
                            <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }} formatter={(value) => [`${value} units`, undefined]}/>
                        <RechartsLegend wrapperStyle={{fontSize: "12px"}} layout="vertical" align="right" verticalAlign="middle"/>
                        </RechartsPieChart>
                    </ResponsiveContainer>
                ) : <p className="text-muted-foreground text-center pt-10">No category sales data available.</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders and important notifications.</CardDescription>
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
                    <p className="text-muted-foreground text-center py-4">No recent orders or notifications.</p>
                )}
            </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Dealer Tools &amp; Management</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Order Management</CardTitle>
                    <ShoppingCart className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">View, accept/reject, and update orders.</p>
                    <Button asChild variant="outline" className="w-full"><Link href="/dealer/orders">Manage Orders <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Inventory Overview</CardTitle>
                    <Archive className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">View product details and request restocks.</p>
                    <Button asChild variant="outline" className="w-full"><Link href="/dealer/inventory">View Inventory <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Profile &amp; Settings</CardTitle>
                    <Settings className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Manage your dealer account details.</p>
                    <Button asChild variant="outline" className="w-full"><Link href="/profile?tab=settings">Go to Settings <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
                </CardContent>
            </Card>
        </div>
      </section>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary"/> Sales &amp; Revenue</CardTitle>
                <CardDescription>Track your earnings and sales performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Revenue (This Month)</p>
                        <p className="text-2xl font-bold">${monthlySales.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Commissions (10%)</p>
                        <p className="text-2xl font-bold">${(monthlySales * 0.1).toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Pending Payouts (Mock)</p>
                        <p className="text-2xl font-bold">${(monthlySales * 0.05).toFixed(2)}</p> 
                    </div>
                </div>
                <div>
                    <h4 className="text-md font-semibold mb-2">Payout History (Mock)</h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPayoutHistory.map(payout => (
                                <TableRow key={payout.id}>
                                    <TableCell>{payout.date}</TableCell>
                                    <TableCell>${payout.amount.toFixed(2)}</TableCell>
                                    <TableCell><Badge variant={payout.status === 'Paid' ? 'default' : 'secondary'}>{payout.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({title: "Mock Action", description:"Sales report download initiated (mock)."})}><Download className="mr-2 h-4 w-4"/>Download Sales Report (CSV)</Button>
                    <Button variant="outline" size="sm" onClick={() => toast({title: "Mock Action", description:"Tax summary download initiated (mock)."})}><Download className="mr-2 h-4 w-4"/>Download Tax Summary (PDF)</Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> Customer Overview</CardTitle>
                <CardDescription>Summary of customers related to your sales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">(This is a simplified mock view.)</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Total Orders</TableHead>
                            <TableHead>Last Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockCustomerData.slice(0,3).map(customer => (
                            <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.name} <br/><span className="text-xs text-muted-foreground">{customer.email}</span></TableCell>
                                <TableCell className="text-center">{customer.totalOrders}</TableCell>
                                <TableCell>{customer.lastOrderDate}</TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => toast({title: "Mock Action", description:`Viewing details for ${customer.name} (mock).`})}
                                    >
                                        <Eye className="mr-1 h-4 w-4"/> View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant="outline" className="w-full" disabled>View All Customers (Coming Soon)</Button>
            </CardContent>
        </Card>
      </div>

      <Card>
          <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/> Performance Insights</CardTitle>
                <CardDescription>Key metrics and insights for your dealership.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><DollarSign className="h-3 w-3"/>Avg. Order Value</p>
                    <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Clock className="h-3 w-3"/>Order Fulfillment (Mock)</p>
                    <p className="text-2xl font-bold">2-3 Days</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><UserCheck className="h-3 w-3"/>Retention Rate (Mock)</p>
                    <p className="text-2xl font-bold">65%</p>
                </div>
            </div>
            <div>
                <h4 className="text-md font-semibold mb-2">Market Insights (Mock)</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-4">
                    <li>Most Popular Size: Medium</li>
                    <li>Peak Season: Back-to-School (July-Aug)</li>
                    <li>Trending: Eco-friendly fabric options</li>
                </ul>
            </div>
             <Button variant="outline" className="w-full md:w-auto" disabled>View Detailed Analytics (Coming Soon)</Button>
          </CardContent>
      </Card>


      <section>
        <h2 className="text-2xl font-bold font-headline mb-4">Additional Tools (Placeholders)</h2>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="opacity-70 cursor-not-allowed">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Promotions &amp; Discounts</CardTitle>
                    <Tag className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Create and manage promotional offers.</p>
                    <Button variant="outline" className="w-full" disabled>Manage Promotions (Coming Soon)</Button>
                </CardContent>
            </Card>
            
            <Card className="opacity-70 cursor-not-allowed">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Communication Tools</CardTitle>
                    <MessageSquare className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">Messages, notifications, and support.</p>
                    <Button variant="outline" className="w-full" disabled>View Messages (Coming Soon)</Button>
                </CardContent>
            </Card>

            <Card className="opacity-70 cursor-not-allowed">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Help &amp; Resources</CardTitle>
                    <HelpCircle className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">FAQs, guides, and support contact.</p>
                    <Button variant="outline" className="w-full" disabled>Get Help (Coming Soon)</Button>
                </CardContent>
            </Card>
         </div>
      </section>
    </div>
  );
}

