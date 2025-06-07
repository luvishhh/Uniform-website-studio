import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers } from "@/lib/mockData";
import { Search, Eye, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const customers = mockUsers.filter(user => user.role === 'customer');

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Manage Customers</h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <UserPlus className="mr-2 h-5 w-5" /> Add New Customer (Mock)
        </Button>
      </div>

      {/* Search and Filters */}
       <Card>
        <CardHeader>
            <CardTitle>Filter Customers</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="search-customer" className="block text-sm font-medium text-foreground mb-1">Search by Name or Email</label>
                <div className="relative">
                <Input type="text" id="search-customer" placeholder="Customer Name/Email..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
            </div>
            {/* Add more filters like "User Type (Parent/Student/Institution)" if needed */}
            </div>
        </CardContent>
      </Card>

      {/* Customers Table/Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage customer accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registered</TableHead> {/* Mock data */}
                <TableHead>Total Orders</TableHead> {/* Mock data */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(customer.name)}`} alt={customer.name} data-ai-hint="profile avatar"/>
                        <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}</TableCell> {/* Mock date */}
                  <TableCell>{Math.floor(Math.random() * 10)}</TableCell> {/* Mock orders */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" title="Delete Customer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {customers.length === 0 && <p className="text-center text-muted-foreground py-8">No customers found.</p>}
        </CardContent>
      </Card>
      {/* Pagination would go here */}
    </div>
  );
}
