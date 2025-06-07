
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProducts, mockOrders, mockUsers, mockCategories } from "@/lib/mockData";
import { DollarSign, Package, Users, ShoppingCart, ArrowUpRight, ArrowDownRight, PlusCircle, Settings, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Dummy data for dashboard
const inventoryCounts = {
  schoolStock: mockProducts.filter(p => p.category === "School").reduce((sum, p) => sum + p.stock, 0),
  collegeStock: mockProducts.filter(p => p.category === "College").reduce((sum, p) => sum + p.stock, 0),
  totalStock: mockProducts.reduce((sum, p) => sum + p.stock, 0),
};

const totalRevenue = mockOrders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.totalAmount, 0);
const totalOrders = mockOrders.length;
const totalRegisteredUsers = mockUsers.length;

const stats = [
  { title: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, trend: "+2.5%", trendType: "up" as "up" | "down" },
  { title: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, trend: "+10", trendType: "up" as "up" | "down" },
  { title: "Total Users", value: totalRegisteredUsers.toString(), icon: Users, trend: "+5", trendType: "up" as "up" | "down" },
  { title: "Total Stock", value: inventoryCounts.totalStock.toString(), icon: Package, trend: "-50", trendType: "down" as "up" | "down" },
];

const categoryStockSummary = [
    { name: "School Uniforms Stock", count: inventoryCounts.schoolStock },
    { name: "College Uniforms Stock", count: inventoryCounts.collegeStock },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trendType === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {stat.trendType === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
            <CardDescription>Current stock levels for School and College uniforms.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2"> 
              {categoryStockSummary.map(cat => (
                   <Card key={cat.name} className="p-4">
                      <CardTitle className="text-lg font-medium">{cat.name}</CardTitle>
                      <CardDescription className="text-3xl font-bold text-primary mt-1">{cat.count}</CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">items in stock</p>
                   </Card>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/products/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/orders">
                <ListOrdered className="mr-2 h-4 w-4" /> View All Orders
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/customers">
                <Users className="mr-2 h-4 w-4" /> Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full justify-start">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" /> Go to Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>A quick look at the latest orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockOrders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <p className="font-medium">Order #{order.id.substring(0,8)}...</p>
                <p className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()} - {order.items.length} items</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Placed' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{order.status}</span>
              </div>
            </div>
          ))}
           {mockOrders.length === 0 && <p className="text-center text-muted-foreground py-4">No recent orders.</p>}
        </CardContent>
      </Card>
      
    </div>
  );
}
