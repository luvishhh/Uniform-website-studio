
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOrders as initialMockOrders, getUserById, mockUsers } from "@/lib/mockData";
import type { Order, OrderStatus, DealerUser } from "@/types";
import { Search, Eye, Download, ShoppingCart, ArrowLeft, CheckCircle, XCircle, Edit } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const defaultDealerForDemo = mockUsers.find(u => u.id === 'deal_1' && u.role === 'dealer') as DealerUser | undefined;

export default function DealerOrdersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [orders, setOrders] = useState<Order[]>(initialMockOrders); // Local state for orders
  const [currentDealer, setCurrentDealer] = useState<DealerUser | null>(defaultDealerForDemo || null);
  const [isLoading, setIsLoading] = useState<boolean>(!defaultDealerForDemo);

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
        
        if (!activeUser && defaultDealerForDemo) {
            activeUser = defaultDealerForDemo;
        }
        setCurrentDealer(activeUser);
        setIsLoading(false);
    };
    fetchDealer();
  }, []);


  const handleAcceptOrder = (orderId: string) => {
    if (!currentDealer) {
        toast({ title: "Error", description: "Dealer information not available.", variant: "destructive" });
        return;
    }
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'Processing by Dealer', assignedDealerId: currentDealer.id }
          : order
      )
    );
    toast({
      title: "Order Accepted",
      description: `Order #${orderId.substring(0, 8)} has been accepted and assigned to you.`,
      variant: "default",
    });
  };

  const handleRejectOrder = (orderId: string) => {
     setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'Pending Dealer Assignment', assignedDealerId: null, dealerRejectionReason: "Rejected by dealer" } // Or specific status like 'Dealer Rejected'
          : order
      )
    );
    toast({
      title: "Order Rejected",
      description: `Order #${orderId.substring(0, 8)} has been rejected and returned to the pool.`,
      variant: "default", // Or "destructive" if preferred
    });
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
        title: "Order Status Update (Mock)",
        description: `Order #${orderId.substring(0,8)} status mock-updated to ${newStatus}.`,
    });
  };

  const handleViewDetails = (orderId: string) => {
    toast({
        title: "View Order Details (Mock)",
        description: `Viewing details for Order #${orderId.substring(0,8)}... (Mock Feature)`,
    });
  };

  const handleDownloadInvoice = (orderId: string) => {
    toast({
        title: "Invoice Download (Mock)",
        description: `Download initiated for invoice #${orderId.substring(0,8)}... (Mock Feature)`,
    });
  };

  const filteredOrders = useMemo(() => {
    if (isLoading || !currentDealer) return [];

    let displayOrders = orders.filter(order => {
        // Show orders awaiting any dealer action
        if (order.status === 'Pending Dealer Assignment' && !order.assignedDealerId) return true;
        // Show orders specifically assigned to this dealer for acceptance
        if (order.status === 'Awaiting Dealer Acceptance' && order.assignedDealerId === currentDealer.id) return true;
        // Show orders this dealer is currently processing or has processed (for other status updates)
        if (order.assignedDealerId === currentDealer.id && ['Processing by Dealer', 'Shipped', 'Delivered', 'Cancelled'].includes(order.status)) return true;
        return false;
    });

    if (searchTerm) {
      displayOrders = displayOrders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (getUserById(order.userId)?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      displayOrders = displayOrders.filter(order => order.status === statusFilter);
    }
    return displayOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, searchTerm, statusFilter, currentDealer, isLoading]);

  const availableOrderStatuses: OrderStatus[] = ['Pending Dealer Assignment', 'Awaiting Dealer Acceptance', 'Processing by Dealer', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];


  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Loading dealer orders...</p></div>;
  }
  
  if (!currentDealer) {
    return <div className="flex justify-center items-center h-64"><p>Could not load dealer information. Please try again.</p></div>;
  }


  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
                <Link href="/dealer/dashboard"><ArrowLeft className="h-4 w-4"/></Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center">
                <ShoppingCart className="mr-3 h-7 w-7 text-primary" /> Order Management
            </h1>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>Search and filter through orders assigned to you or available for acceptance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Order ID, Customer Name/Email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {availableOrderStatuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            Viewing {filteredOrders.length} orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">#{order.id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      {order.shippingAddress.name}
                      <br />
                      <span className="text-xs text-muted-foreground">{getUserById(order.userId)?.email || order.shippingAddress.email}</span>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                       <Badge
                        variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                        className={`capitalize text-xs whitespace-nowrap ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            order.status === 'Placed' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : // Student perspective, not usually for dealer
                            order.status === 'Pending Dealer Assignment' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            order.status === 'Awaiting Dealer Acceptance' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            order.status === 'Processing by Dealer' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            order.status === 'Confirmed' ? 'bg-purple-100 text-purple-700 border-purple-200' : // Can be same as processing
                            order.status === 'Dealer Rejected' ? 'bg-red-100 text-red-500 border-red-200' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                        >
                        {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {(order.status === 'Pending Dealer Assignment' || (order.status === 'Awaiting Dealer Acceptance' && order.assignedDealerId === currentDealer?.id)) ? (
                        <>
                          <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" title="Accept Order" onClick={() => handleAcceptOrder(order.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" title="Reject Order" onClick={() => handleRejectOrder(order.id)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (order.assignedDealerId === currentDealer?.id && ['Processing by Dealer', 'Shipped', 'Delivered', 'Cancelled'].includes(order.status)) ? (
                        <>
                           <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewDetails(order.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(newStatus) => handleUpdateStatus(order.id, newStatus as OrderStatus)} defaultValue={order.status} disabled={order.status === 'Delivered' || order.status === 'Cancelled'}>
                            <SelectTrigger className="h-8 w-auto text-xs px-2 py-1 inline-flex items-center" title="Update Status">
                                <Edit className="h-3 w-3 mr-1"/>
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {['Processing by Dealer', 'Shipped', 'Delivered', 'Cancelled'].map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" title="Download Invoice" onClick={() => handleDownloadInvoice(order.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewDetails(order.id)}>
                           <Eye className="h-4 w-4" />
                         </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders match your filters or require your attention.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

