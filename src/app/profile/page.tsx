import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockOrders } from "@/lib/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, UserCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  // Mock current user
  const currentUser = mockUsers.find(u => u.role === 'customer'); 
  const userOrders = mockOrders.filter(order => order.userId === currentUser?.id);

  if (!currentUser) {
    // This should ideally be handled by auth guard redirecting to login
    return (
       <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
          <p>Please log in to view your profile.</p>
          <Button asChild className="mt-4"><Link href="/">Go to Homepage</Link></Button>
        </main>
        <Footer />
      </div>
    )
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <Card className="md:w-1/4 lg:w-1/5 h-fit sticky top-24">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src="https://placehold.co/100x100.png" alt={currentUser.name} data-ai-hint="profile picture" />
                <AvatarFallback className="text-3xl">{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <CardDescription>{currentUser.email}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Separator className="mb-4" />
              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start"><UserCircle className="mr-2 h-4 w-4"/> Personal Details</Button>
                <Button variant="ghost" className="w-full justify-start text-primary bg-muted"><Package className="mr-2 h-4 w-4"/> Order History</Button>
                <Button variant="ghost" className="w-full justify-start"><Settings className="mr-2 h-4 w-4"/> Account Settings</Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80"><LogOut className="mr-2 h-4 w-4"/> Logout</Button>
              </nav>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <div className="flex-1">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="details">Personal Details</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Manage your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Name: {currentUser.name}</p>
                    <p>Email: {currentUser.email}</p>
                    {currentUser.address && (
                      <p>Address: {currentUser.address.street}, {currentUser.address.city}, {currentUser.address.zip}, {currentUser.address.country}</p>
                    )}
                    <Button>Edit Details</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past orders and their status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userOrders.length > 0 ? userOrders.map(order => (
                      <Card key={order.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">Order ID: {order.id}</h4>
                            <p className="text-sm text-muted-foreground">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Placed' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>{order.status}</span>
                        </div>
                        <p className="text-sm mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">View Details</Button>
                      </Card>
                    )) : (
                      <p>You have no past orders.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p>Change Password, Notification Preferences, etc. (Mock)</p>
                     <Button>Update Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
