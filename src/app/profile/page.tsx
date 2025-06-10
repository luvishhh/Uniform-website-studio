
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { User, StudentUser, Order, InstitutionUser, DealerUser, AdminUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, UserCircle, Settings, LogOut, Edit3, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    const storedUserId = localStorage.getItem('unishop_user_id');

    if (storedUserId) {
      try {
        // Fetch user details
        const userRes = await fetch(`/api/user/${storedUserId}`);
        if (!userRes.ok) {
          const errorData = await userRes.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }
        const userData: User = await userRes.json();
        setCurrentUser(userData);
        setAvatarUrl(userData.imageUrl || `https://placehold.co/100x100.png?text=${getInitials(getUserDisplayName(userData))}`);
        setNewAvatarUrl(userData.imageUrl || "");


        // Fetch user orders
        const ordersRes = await fetch(`/api/orders/user/${storedUserId}`);
        if (!ordersRes.ok) {
          // It's okay if orders are not found (404), just means user has no orders
          if (ordersRes.status !== 404) {
            const errorData = await ordersRes.json();
            throw new Error(errorData.message || 'Failed to fetch orders');
          }
          setUserOrders([]); // Set to empty array if 404 or other error
        } else {
          const ordersData: Order[] = await ordersRes.json();
          setUserOrders(ordersData);
        }

      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast({ title: "Error Loading Profile", description: error.message || "Could not load your profile data. Please try logging in again.", variant: "destructive" });
        // Optional: redirect to login if auth seems to be the issue
        // router.push('/login'); 
      }
    } else {
      toast({ title: "Not Logged In", description: "Please login to view your profile.", variant: "destructive" });
      router.push('/login');
    }
    setIsLoading(false);
  }, [router, toast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const getInitials = (name: string = "") => {
    if (!name) return "U";
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  const getUserDisplayName = (user: User | null): string => {
    if (!user) return "User";
    switch (user.role) {
      case 'student': return (user as StudentUser).fullName || "Student";
      case 'institution': return (user as InstitutionUser).institutionName || "Institution";
      case 'dealer': return (user as DealerUser).dealerName || "Dealer";
      case 'admin': return (user as AdminUser).email || "Admin";
      default: return user.email || user.id;
    }
  };
  
  const getUserIdentifier = (user: User | null): string => {
    if (!user) return "";
    return user.email || (user as StudentUser).rollNumber || "";
  }


  const handleAvatarUpdate = () => {
    if (newAvatarUrl.trim()) {
      setAvatarUrl(newAvatarUrl.trim());
      // In a real app, you'd call an API to update the user's profile
      toast({ title: "Avatar Updated (Mock)", description: "Your profile picture has been updated locally." });
      // Also update currentUser state if it's used for displaying the image elsewhere immediately
      if(currentUser) {
        setCurrentUser({...currentUser, imageUrl: newAvatarUrl.trim() });
      }
    }
    setIsAvatarDialogOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem('unishop_user_role');
      localStorage.removeItem('unishop_user_displayName');
      localStorage.removeItem('unishop_user_id');
      localStorage.removeItem('isAdminLoggedIn');
      window.dispatchEvent(new CustomEvent('authChange'));
      setCurrentUser(null);
      setUserOrders([]);
      router.push('/');
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 text-center">
          <p className="mb-4">Could not load profile information. You might not be logged in.</p>
          <Button asChild><Link href="/login">Go to Login</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  const displayName = getUserDisplayName(currentUser);
  const displayIdentifier = getUserIdentifier(currentUser);

  const getOrderStatusProgress = (status: Order['status']): number => {
    switch (status) {
      case 'Placed': return 25;
      case 'Confirmed': return 50;
      case 'Shipped': return 75;
      case 'Delivered': return 100;
      case 'Cancelled': return 0; // Or handle differently
      default: return 0;
    }
  };
  const orderStatuses: Order['status'][] = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="md:w-1/4 lg:w-1/5 h-fit sticky top-24 shadow-lg">
            <CardHeader className="items-center text-center relative">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="profile avatar" />
                <AvatarFallback className="text-3xl bg-muted">{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 hover:bg-background"
                onClick={() => {
                    setNewAvatarUrl(currentUser.imageUrl || "");
                    setIsAvatarDialogOpen(true);
                }}
                title="Change profile picture"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-headline">{displayName}</CardTitle>
              <CardDescription className="text-sm">{displayIdentifier} ({currentUser.role})</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <Separator className="mb-3" />
              <TabsList className="flex flex-col h-auto bg-transparent p-0 w-full">
                 {/* These are illustrative; actual tab switching is handled by Tabs component below */}
                <TabsTrigger value="details" className="w-full justify-start py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
                  <UserCircle className="mr-2 h-4 w-4"/> Personal Details
                </TabsTrigger>
                <TabsTrigger value="orders" className="w-full justify-start py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
                  <Package className="mr-2 h-4 w-4"/> Order History
                </TabsTrigger>
                <TabsTrigger value="settings" className="w-full justify-start py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
                  <Settings className="mr-2 h-4 w-4"/> Account Settings
                </TabsTrigger>
              </TabsList>
              <Separator className="my-3" />
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10 py-2.5" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/> Logout
              </Button>
            </CardContent>
          </Card>

          <div className="flex-1">
            <Tabs defaultValue="details" className="w-full">
              {/* Hidden TabsList, navigation is handled by sidebar buttons */}
               <TabsList className="hidden"> 
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Personal Details</CardTitle>
                    <CardDescription>View and manage your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p><strong>Name:</strong> {displayName}</p>
                    <p><strong>Primary Identifier:</strong> {displayIdentifier}</p>
                    <p><strong>Role:</strong> <span className="capitalize">{currentUser.role}</span></p>
                    {currentUser.role === 'student' && (
                      <>
                        <Separator />
                        <p><strong>School/College:</strong> {(currentUser as StudentUser).schoolCollegeName}</p>
                        <p><strong>Grade/Course:</strong> {(currentUser as StudentUser).gradeOrCourse}</p>
                        {(currentUser as StudentUser).year && <p><strong>Year:</strong> {(currentUser as StudentUser).year}</p>}
                        <Separator />
                        <p className="font-semibold mt-2">Parent Information</p>
                        <p><strong>Parent Name:</strong> {(currentUser as StudentUser).parentName}</p>
                        <p><strong>Parent Contact:</strong> {(currentUser as StudentUser).parentContactNumber}</p>
                         {(currentUser as StudentUser).address && (
                            <>
                            <Separator />
                            <p className="font-semibold mt-2">Address</p>
                            <p>{(currentUser as StudentUser).address?.street}</p>
                            <p>{(currentUser as StudentUser).address?.city}, {(currentUser as StudentUser).address?.zip}, {(currentUser as StudentUser).address?.country}</p>
                            </>
                        )}
                      </>
                    )}
                     {currentUser.role === 'institution' && (
                        <>
                            <Separator />
                            <p><strong>Institution Type:</strong> <span className="capitalize">{(currentUser as InstitutionUser).institutionType}</span></p>
                            <p><strong>Contact Number:</strong> {(currentUser as InstitutionUser).contactNumber}</p>
                            <p><strong>Address:</strong> {(currentUser as InstitutionUser).institutionalAddress}</p>
                        </>
                    )}
                    {currentUser.role === 'dealer' && (
                        <>
                            <Separator />
                            <p><strong>Contact Number:</strong> {(currentUser as DealerUser).contactNumber}</p>
                            <p><strong>Business Address:</strong> {(currentUser as DealerUser).businessAddress}</p>
                            <p><strong>GSTIN:</strong> {(currentUser as DealerUser).gstinNumber}</p>
                        </>
                    )}
                    <Button className="mt-4">Edit Details (Mock)</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Order History</CardTitle>
                    <CardDescription>View your past orders and their status.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {userOrders.length > 0 ? userOrders.map((order, orderIdx) => (
                      <Card key={order.id} className="p-4 shadow-sm border">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">Order ID: <span className="font-mono text-primary">#{order.id.substring(0,8)}...</span></h4>
                            <p className="text-xs text-muted-foreground">Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                          </div>
                           <Badge 
                              variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                              className={`capitalize text-xs mt-2 sm:mt-0 ${order.status === 'Delivered' ? 'bg-green-600 text-white' : order.status === 'Shipped' ? 'bg-blue-500 text-white' : ''}`}
                            >
                              {order.status}
                            </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-1">Items:</h5>
                          <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                            {order.items.map(item => (
                              <li key={item.productId + (item.size || '') + (item.color || '')}>
                                {item.name} (Qty: {item.quantity}{item.size ? `, Size: ${item.size}` : ''}{item.color ? `, Color: ${item.color}` : ''}) - ${item.price.toFixed(2)} each
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-sm font-semibold text-right">Total: ${order.totalAmount.toFixed(2)}</p>
                        
                        {/* Order Tracker Progress Bar - show for the first order for demo, or conditional */}
                        {orderIdx === 0 && order.status !== 'Cancelled' && (
                            <div className="mt-4 pt-4 border-t">
                                <h5 className="text-sm font-medium mb-3 text-center">Order Progress</h5>
                                <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
                                    {orderStatuses.map((statusStep, index, arr) => {
                                        const currentStatusIndex = orderStatuses.indexOf(order.status);
                                        const isCompleted = currentStatusIndex >= index;
                                        const isActive = currentStatusIndex === index;
                                        return (
                                        <React.Fragment key={statusStep}>
                                            <div className="flex flex-col items-center text-center flex-shrink-0 w-20">
                                            <div 
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs
                                                ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-muted-foreground'}
                                                ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                            >
                                                {isCompleted ? <Package className="h-4 w-4" /> : index + 1}
                                            </div>
                                            <p className={`text-xs mt-1.5 ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>{statusStep}</p>
                                            </div>
                                            {index < arr.length - 1 && <div className={`flex-1 h-1 min-w-[20px] ${isCompleted && currentStatusIndex > index ? 'bg-primary' : 'bg-border'}`}></div>}
                                        </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="mt-4 flex justify-end">
                             <Button variant="outline" size="sm">Track Order (Mock)</Button>
                        </div>
                      </Card>
                    )) : (
                      <p className="text-sm text-muted-foreground text-center py-8">You have no past orders.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl">Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences (e.g., password change - mock).</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="••••••••" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="••••••••" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" />
                     </div>
                     <Button>Change Password (Mock)</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Avatar className="w-32 h-32 mx-auto border-4 border-primary shadow-md">
              <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="profile preview"/>
              <AvatarFallback className="text-4xl bg-muted">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatarUrlInput" className="text-sm">Image URL</Label>
              <Input 
                id="avatarUrlInput" 
                value={newAvatarUrl} 
                onChange={(e) => setNewAvatarUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
              <p className="text-xs text-muted-foreground mt-1">Paste a URL to your new avatar image.</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAvatarUpdate}>
              <UploadCloud className="mr-2 h-4 w-4" /> Update Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

// Dummy Label for settings tab, replace if actual form is built
const Label = ({htmlFor, children, className}: {htmlFor?: string, children: React.ReactNode, className?:string}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-foreground mb-1 ${className || ''}`}>{children}</label>
);
