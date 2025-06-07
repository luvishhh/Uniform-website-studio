
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers } from "@/lib/mockData";
import type { User, StudentUser, InstitutionUser, DealerUser } from "@/types";
import { Search, Eye, Trash2, UserPlus, Briefcase, Building, GraduationCap } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const getInitials = (name: string) => {
  const names = name.split(' ');
  return names.map(n => n[0]).join('').toUpperCase();
};

const UserRoleIcon = ({ role }: { role: User['role'] }) => {
  if (role === 'student') return <GraduationCap className="h-4 w-4 text-muted-foreground" />;
  if (role === 'institution') return <Building className="h-4 w-4 text-muted-foreground" />;
  if (role === 'dealer') return <Briefcase className="h-4 w-4 text-muted-foreground" />;
  return null;
};

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<User['role'] | "all">("all");

  const filteredUsers = useMemo(() => {
    let users = mockUsers;
    if (searchTerm) {
      users = users.filter(user => {
        const name = (user as StudentUser).fullName || (user as InstitutionUser).institutionName || (user as DealerUser).dealerName || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }
    if (selectedRole !== "all") {
      users = users.filter(user => user.role === selectedRole);
    }
    return users;
  }, [searchTerm, selectedRole]);

  const getUserDisplayName = (user: User) => {
    switch(user.role) {
      case 'student': return (user as StudentUser).fullName;
      case 'institution': return (user as InstitutionUser).institutionName;
      case 'dealer': return (user as DealerUser).dealerName;
      case 'admin': return user.email || 'Admin'; // Admin might not have a separate name field
      default: return user.id;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Manage Users</h1>
        {/* Add New User button can link to a page with options for user type */}
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <UserPlus className="mr-2 h-5 w-5" /> Add New User (Mock)
        </Button>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="search-user" className="block text-sm font-medium text-foreground mb-1">Search by Name or Email</label>
                  <div className="relative">
                  <Input 
                    type="text" 
                    id="search-user" 
                    placeholder="User Name/Email..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
              </div>
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-foreground mb-1">Filter by Role</label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as User['role'] | "all")}>
                  <SelectTrigger id="role-filter">
                      <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="institution">Institution</SelectItem>
                      <SelectItem value="dealer">Dealer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>View and manage user accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email / Roll No.</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage 
                          src={`https://placehold.co/40x40.png?text=${getInitials(getUserDisplayName(user))}`} 
                          alt={getUserDisplayName(user)} 
                          data-ai-hint="profile avatar"
                        />
                        <AvatarFallback>{getInitials(getUserDisplayName(user))}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{getUserDisplayName(user)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.role === 'student' ? (user as StudentUser).rollNumber : user.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserRoleIcon role={user.role} />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell> {/* Mock date */}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" title="View Details (mock)">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" title="Delete User (mock)">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredUsers.length === 0 && <p className="text-center text-muted-foreground py-8">No users found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
