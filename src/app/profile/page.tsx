
"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { User, StudentUser, Order, InstitutionUser, DealerUser, AdminUser, OrderStatus } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Package, UserCircle, Settings, LogOut, Edit3, UploadCloud } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  
  const initialTab = searchParams.get('tab') || "details";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [newAvatarUrl, setNewAvatarUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;

    if (storedUserId) {
      try {
        const userRes = await fetch(`/api/user/${storedUserId}`);
        if (!userRes.ok) {
          const errorData = await userRes.json();
          throw new Error(errorData.message || 'Failed to fetch user data');
        }
        const userData: User = await userRes.json();
        setCurrentUser(userData);
        setAvatarUrl(userData.imageUrl || `https://placehold.co/100x100.png?text=${getInitials(getUserDisplayName(userData))}`);

        if (userData.role !== 'institution' && userData.role !== 'dealer') { 
            const ordersRes = await fetch(`/api/orders/user/${storedUserId}`);
            if (!ordersRes.ok) {
            if (ordersRes.status !== 404) { // 404 for no orders is acceptable
                const errorData = await ordersRes.json();
                throw new Error(errorData.message || 'Failed to fetch orders');
            }
            setUserOrders([]);
            } else {
            const ordersData: Order[] = await ordersRes.json();
            setUserOrders(ordersData);
            }
        } else {
            setUserOrders([]); 
        }

      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast({ title: "Error Loading Profile", description: error.message || "Could not load your profile data. Please try logging in again.", variant: "destructive" });
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

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!newAvatarUrl || !currentUser) {
      toast({ title: "No Image Selected", description: "Please select an image file first.", variant: "destructive" });
      return;
    }
    setIsUpdatingAvatar(true);
    try {
      const response = await fetch(`/api/user/${currentUser.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarDataUrl: newAvatarUrl }),
      });
      const result = await response.json();
      if (response.ok) {
        setAvatarUrl(newAvatarUrl);
        setCurrentUser(prev => prev ? { ...prev, imageUrl: newAvatarUrl } : null);
        toast({ title: "Avatar Updated", description: "Your profile picture has been successfully updated." });
        setIsAvatarDialogOpen(false);
        setNewAvatarUrl(null);
      } else {
        throw new Error(result.message || "Failed to update avatar");
      }
    } catch (error: any) {
      console.error('Failed to update avatar:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({ title: "Avatar Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsUpdatingAvatar(false);
    }
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
      if (typeof window !== "undefined") {
        localStorage.removeItem('unishop_user_role');
        localStorage.removeItem('unishop_user_displayName');
        localStorage.removeItem('unishop_user_id');
        localStorage.removeItem('isAdminLoggedIn');
        window.dispatchEvent(new CustomEvent('authChange'));
      }
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
  const orderProgressStatuses: OrderStatus[] = ['Placed', 'Confirmed', 'Processing by Dealer', 'Shipped', 'Delivered'];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Card className="md:w-1/4 lg:w-1/5 h-fit sticky top-24 shadow-lg">
            <CardHeader className="items-center text-center relative">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={avatarUrl} alt={displayName} data-ai-hint="profile avatar"/>
                <AvatarFallback className="text-3xl bg-muted">{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 hover:bg-background"
                onClick={() => {
                    setNewAvatarUrl(null);
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
              <div className="flex flex-col space-y-1 w-full">
                <Button
                  variant={activeTab === "details" ? "secondary" : "ghost"}
                  onClick={() => setActiveTab("details")}
                  className="w-full justify-start py-2.5 font-normal data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                  data-active={activeTab === "details"}
                >
                  <UserCircle className="mr-2 h-4 w-4"/> Personal Details
                </Button>
                {(currentUser.role !== 'institution' && currentUser.role !== 'dealer') && (
                  <Button
                    variant={activeTab === "orders" ? "secondary" : "ghost"}
                    onClick={() => setActiveTab("orders")}
                    className="w-full justify-start py-2.5 font-normal data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                    data-active={activeTab === "orders"}
                  >
                    <Package className="mr-2 h-4 w-4"/> Order History
                  </Button>
                )}
                <Button
                  variant={activeTab === "settings" ? "secondary" : "ghost"}
                  onClick={() => setActiveTab("settings")}
                  className="w-full justify-start py-2.5 font-normal data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold"
                  data-active={activeTab === "settings"}
                >
                  <Settings className="mr-2 h-4 w-4"/> Account Settings
                </Button>
              </div>
              <Separator className="my-3" />
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive/90 hover:bg-destructive/10 py-2.5" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4"/> Logout
              </Button>
            </CardContent>
          </Card>

          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

              {(currentUser.role !== 'institution' && currentUser.role !== 'dealer') && (
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
                                className={`capitalize text-xs mt-2 sm:mt-0 ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                    order.status === 'Processing by Dealer' || order.status === 'Confirmed' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                    order.status === 'Awaiting Dealer Acceptance' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    order.status === 'Pending Dealer Assignment' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                    order.status === 'Placed' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                    order.status === 'Dealer Rejected' ? 'bg-red-100 text-red-500 border-red-200' :
                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                    'bg-gray-100 text-gray-700 border-gray-200'
                                }`}
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

                          {orderIdx === 0 && order.status !== 'Cancelled' && (
                              <div className="mt-4 pt-4 border-t">
                                  <h5 className="text-sm font-medium mb-3 text-center">Order Progress</h5>
                                  <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
                                      {orderProgressStatuses.map((statusStep, index, arr) => {
                                          const currentStatusIndex = orderProgressStatuses.indexOf(order.status);
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
              )}

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

      <Dialog open={isAvatarDialogOpen} onOpenChange={(open) => { setIsAvatarDialogOpen(open); if(!open) setNewAvatarUrl(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-xl">Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Avatar className="w-32 h-32 mx-auto border-4 border-primary shadow-md">
              <AvatarImage src={newAvatarUrl || avatarUrl} alt={displayName} data-ai-hint="profile preview"/>
              <AvatarFallback className="text-4xl bg-muted">{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="avatarFileInput" className="text-sm">Choose an image file</Label>
              <Input
                id="avatarFileInput"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">Max file size: 2MB. Recommended formats: JPG, PNG.</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isUpdatingAvatar}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleAvatarUpdate} disabled={isUpdatingAvatar || !newAvatarUrl}>
              {isUpdatingAvatar ? "Updating..." : <><UploadCloud className="mr-2 h-4 w-4" /> Update Avatar</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

const Label = ({htmlFor, children, className}: {htmlFor?: string, children: React.ReactNode, className?:string}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-foreground mb-1 ${className || ''}`}>{children}</label>
);

    
