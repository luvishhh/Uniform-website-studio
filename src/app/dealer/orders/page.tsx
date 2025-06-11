
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockOrders, getUserById } from "@/lib/mockData";
import type { Order } from "@/types";
import { Search, Eye, Edit, Download, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function DealerOrdersPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order['status'] | "all">("all");

  const filteredOrders = useMemo(() => {
    let orders = mockOrders;
    if (searchTerm) {
      orders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (getUserById(order.userId)?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      orders = orders.filter(order => order.status === statusFilter);
    }
    return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [searchTerm, statusFilter]);

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    toast({
        title: "Order Status Update (Mock)",
        description: `Order #${orderId.substring(0,8)} status mock-updated to ${newStatus}.`,
    });
    // In a real app, you would make an API call here to update the order status
    // and then potentially re-fetch or update the local order data.
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

  const orderStatuses: Order['status'][] = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

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
          <CardDescription>Search and filter through all orders.</CardDescription>
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
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Order['status'] | "all")}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {orderStatuses.map(status => (
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
            Viewing {filteredOrders.length} of {mockOrders.length} total orders.
            <br/>
            <span className="text-xs text-muted-foreground">(Note: In a real system, dealers would only see orders relevant to them.)</span>
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
                            order.status === 'Placed' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            order.status === 'Confirmed' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                        >
                        {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewDetails(order.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select onValueChange={(newStatus) => handleUpdateStatus(order.id, newStatus as Order['status'])} defaultValue={order.status}>
                        <SelectTrigger className="h-8 w-auto text-xs px-2 py-1 inline-flex items-center" title="Update Status">
                            <Edit className="h-3 w-3 mr-1"/>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {orderStatuses.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" title="Download Invoice" onClick={() => handleDownloadInvoice(order.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders match your filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
