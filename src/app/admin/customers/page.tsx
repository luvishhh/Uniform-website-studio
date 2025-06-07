
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockUsers } from "@/lib/mockData";
import type { User, StudentUser, InstitutionUser, DealerUser, AdminUser } from "@/types";
import { Search, Eye, Trash2, UserPlus, Briefcase, Building, GraduationCap, Mail, Phone, MapPin, ScrollText, Building2, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const getInitials = (name: string) => {
  const names = name.split(' ');
  return names.map(n => n[0]).join('').toUpperCase() || 'U';
};

const UserRoleIcon = ({ role }: { role: User['role'] }) => {
  if (role === 'student') return <GraduationCap className="h-4 w-4 text-muted-foreground" />;
  if (role === 'institution') return <Building className="h-4 w-4 text-muted-foreground" />;
  if (role === 'dealer') return <Briefcase className="h-4 w-4 text-muted-foreground" />;
  if (role === 'admin') return <UserCircle className="h-4 w-4 text-muted-foreground" />;
  return null;
};

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<User['role'] | "all">("all");
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

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
      case 'admin': return user.email || 'Admin';
      default: return user.id;
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUserForDetails(user);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline">Manage Users</h1>
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
                  <TableCell>{new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" title="View Details" onClick={() => handleViewDetails(user)}>
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

      {selectedUserForDetails && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline flex items-center">
                <UserRoleIcon role={selectedUserForDetails.role} />
                <span className="ml-2">{getUserDisplayName(selectedUserForDetails)} - Details</span>
              </DialogTitle>
              <DialogDescription>
                Role: <span className="capitalize font-medium">{selectedUserForDetails.role}</span> | User ID: <span className="font-mono text-xs">{selectedUserForDetails.id}</span>
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-4" />
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 text-sm">
              {selectedUserForDetails.role === 'student' && (
                <>
                  <p><strong>Full Name:</strong> {(selectedUserForDetails as StudentUser).fullName}</p>
                  <p><strong>Roll Number:</strong> {(selectedUserForDetails as StudentUser).rollNumber}</p>
                  {selectedUserForDetails.email && <p><strong>Email:</strong> {selectedUserForDetails.email}</p>}
                  <p><strong>School/College:</strong> {(selectedUserForDetails as StudentUser).schoolCollegeName}</p>
                  <p><strong>Institution Type:</strong> <span className="capitalize">{(selectedUserForDetails as StudentUser).institutionType}</span></p>
                  <p><strong>Grade/Course:</strong> {(selectedUserForDetails as StudentUser).gradeOrCourse}</p>
                  {(selectedUserForDetails as StudentUser).year && <p><strong>Year:</strong> {(selectedUserForDetails as StudentUser).year}</p>}
                  <Separator className="my-2" />
                  <p className="font-semibold text-base text-foreground">Parent Information</p>
                  <p><strong>Parent Name:</strong> {(selectedUserForDetails as StudentUser).parentName}</p>
                  <p><strong>Parent Contact:</strong> {(selectedUserForDetails as StudentUser).parentContactNumber}</p>
                  {(selectedUserForDetails as StudentUser).address && (
                    <>
                     <Separator className="my-2" />
                     <p className="font-semibold text-base text-foreground">Address</p>
                     <p>{(selectedUserForDetails as StudentUser).address?.street}</p>
                     <p>{(selectedUserForDetails as StudentUser).address?.city}, {(selectedUserForDetails as StudentUser).address?.zip}</p>
                     <p>{(selectedUserForDetails as StudentUser).address?.country}</p>
                    </>
                  )}
                </>
              )}
              {selectedUserForDetails.role === 'institution' && (
                <>
                  <p><strong>Institution Name:</strong> {(selectedUserForDetails as InstitutionUser).institutionName}</p>
                  <p><strong>Email:</strong> {(selectedUserForDetails as InstitutionUser).email}</p>
                  <p><strong>Contact Number:</strong> {(selectedUserForDetails as InstitutionUser).contactNumber}</p>
                  <p><strong>Institution Type:</strong> <span className="capitalize">{(selectedUserForDetails as InstitutionUser).institutionType}</span></p>
                  <Separator className="my-2" />
                  <p className="font-semibold text-base text-foreground">Address</p>
                  <p>{(selectedUserForDetails as InstitutionUser).institutionalAddress}</p>
                </>
              )}
              {selectedUserForDetails.role === 'dealer' && (
                <>
                  <p><strong>Dealer/Business Name:</strong> {(selectedUserForDetails as DealerUser).dealerName}</p>
                  <p><strong>Email:</strong> {(selectedUserForDetails as DealerUser).email}</p>
                  <p><strong>Contact Number:</strong> {(selectedUserForDetails as DealerUser).contactNumber}</p>
                  <p><strong>GSTIN:</strong> {(selectedUserForDetails as DealerUser).gstinNumber}</p>
                  <Separator className="my-2" />
                   <p className="font-semibold text-base text-foreground">Business Address</p>
                  <p>{(selectedUserForDetails as DealerUser).businessAddress}</p>
                </>
              )}
              {selectedUserForDetails.role === 'admin' && (
                <>
                  <p><strong>Email:</strong> {(selectedUserForDetails as AdminUser).email}</p>
                  {(selectedUserForDetails as AdminUser).contactNumber && <p><strong>Contact Number:</strong> {(selectedUserForDetails as AdminUser).contactNumber}</p>}
                </>
              )}
               <p className="mt-4 text-xs text-muted-foreground">Registered: {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
