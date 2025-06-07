
"use client"; // Needs to be client component due to hooks and state

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockOrders } from "@/lib/mockData";
import type { User, StudentUser, Order } from "@/types"; // Ensure correct types are imported
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, UserCircle, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  // Mock current user - In a real app, this would come from an auth context/hook
  // For demo, let's try to find a student user, then any other user if not found.
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulate fetching logged-in user data
    // This is a placeholder. In a real app, you'd get this from your auth system.
    const loggedInUser = mockUsers.find(u => u.role === 'student' && u.id === 'stud_1') || // Try to get Alice
                         mockUsers.find(u => u.role === 'student') || // Or any student
                         mockUsers[0] || // Or any user
                         null; 
    setCurrentUser(loggedInUser);

    if (loggedInUser) {
      setUserOrders(mockOrders.filter(order => order.userId === loggedInUser.id));
    }
  }, []);


  if (!currentUser) {
    // This should ideally be handled by auth guard redirecting to login
    return (
       <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
          <p>Loading profile or please log in to view your profile.</p>
          {/* Add a loading spinner here? */}
          <Button asChild className="mt-4"><Link href="/login">Go to Login</Link></Button>
        </main>
        <Footer />
      </div>
    )
  }

  const getInitials = (name: string = "") => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase() || 'U';
  }
  
  const getUserDisplayName = (user: User) => {
    if (user.role === 'student') return (user as StudentUser).fullName;
    if (user.role === 'institution') return (user as any).institutionName; // Assuming InstitutionUser type
    if (user.role === 'dealer') return (user as any).dealerName; // Assuming DealerUser type
    return user.email || user.id;
  };

  const displayName = getUserDisplayName(currentUser);
  const displayEmail = currentUser.email || (currentUser.role === 'student' ? (currentUser as StudentUser).rollNumber : 'N/A');


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="md:w-1/4 lg:w-1/5 h-fit sticky top-24">
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(displayName)}`} alt={displayName} data-ai-hint="profile avatar" />
                <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{displayName}</CardTitle>
              <CardDescription>{displayEmail} ({currentUser.role})</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <Separator className="mb-4" />
              <nav className="space-y-1">
                {/* Example: Update these to be actual tabs or separate pages */}
                <Button variant="ghost" className="w-full justify-start"><UserCircle className="mr-2 h-4 w-4"/> Personal Details</Button>
                <Button variant="ghost" className="w-full justify-start text-primary bg-muted"><Package className="mr-2 h-4 w-4"/> Order History</Button>
                <Button variant="ghost" className="w-full justify-start"><Settings className="mr-2 h-4 w-4"/> Account Settings</Button>
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/80"><LogOut className="mr-2 h-4 w-4"/> Logout</Button>
              </nav>
            </CardContent>
          </Card>

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
                    <p><strong>Name:</strong> {displayName}</p>
                    <p><strong>Email/ID:</strong> {displayEmail}</p>
                    <p><strong>Role:</strong> <span className="capitalize">{currentUser.role}</span></p>
                    {currentUser.role === 'student' && (
                      <>
                        <p><strong>School/College:</strong> {(currentUser as StudentUser).schoolCollegeName}</p>
                        <p><strong>Grade/Course:</strong> {(currentUser as StudentUser).gradeOrCourse}</p>
                        {(currentUser as StudentUser).year && <p><strong>Year:</strong> {(currentUser as StudentUser).year}</p>}
                        <p><strong>Parent Name:</strong> {(currentUser as StudentUser).parentName}</p>
                        <p><strong>Parent Contact:</strong> {(currentUser as StudentUser).parentContactNumber}</p>
                      </>
                    )}
                     {(currentUser as any).address && (
                      <p><strong>Address:</strong> {(currentUser as any).address.street}, {(currentUser as any).address.city}, {(currentUser as any).address.zip}, {(currentUser as any).address.country}</p>
                    )}
                    <Button>Edit Details (Mock)</Button>
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
                            <h4 className="font-semibold">Order ID: #{order.id.substring(0,8)}...</h4>
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
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1">View Details (Mock)</Button>
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
                     <p>Change Password, Notification Preferences, etc. (Mock Section)</p>
                     <Button>Update Settings (Mock)</Button>
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
