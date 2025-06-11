
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { InstitutionUser, StudentUser, User } from "@/types";
import { mockUsers } from "@/lib/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Mail } from "lucide-react";

const getInitials = (name: string = "") => {
  if (!name) return "U";
  const names = name.split(' ');
  return names.map(n => n[0]).join('').toUpperCase() || 'U';
};

export default function RegisteredStudentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<InstitutionUser | null>(null);
  const [registeredStudents, setRegisteredStudents] = useState<StudentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      setIsLoading(true);
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem('unishop_user_id') : null;
      const storedUserRole = typeof window !== "undefined" ? localStorage.getItem('unishop_user_role') : null;

      if (storedUserId && storedUserRole === 'institution') {
        try {
          const userRes = await fetch(`/api/user/${storedUserId}`);
          if (userRes.ok) {
            const userData: InstitutionUser = await userRes.json();
            setCurrentUser(userData);
          } else {
            toast({ title: "Error", description: "Failed to load institution data.", variant: "destructive" });
            router.push('/login');
          }
        } catch (error) {
          toast({ title: "Error", description: "Could not connect to server for institution data.", variant: "destructive" });
          router.push('/login');
        }
      } else {
        toast({ title: "Access Denied", description: "You are not logged in as an institution.", variant: "destructive" });
        router.push('/login');
      }
    };
    fetchInstitutionData();
  }, [router, toast]);

  useEffect(() => {
    if (currentUser && currentUser.institutionName) {
      const institutionNameLower = currentUser.institutionName.toLowerCase();
      const students = mockUsers.filter(
        (user): user is StudentUser =>
          user.role === 'student' &&
          (user as StudentUser).schoolCollegeName?.toLowerCase() === institutionNameLower
      );
      setRegisteredStudents(students);
    }
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading registered students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold font-headline">
                Registered Students for {currentUser?.institutionName || "Your Institution"}
              </CardTitle>
              <CardDescription>
                List of students registered with your institution on UniShop.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {registeredStudents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Grade/Course</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Parent Contact</TableHead>
                  <TableHead>Email (Optional)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredStudents.map(student => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.imageUrl || `https://placehold.co/40x40.png?text=${getInitials(student.fullName)}`} alt={student.fullName} data-ai-hint="student avatar" />
                          <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.gradeOrCourse}</TableCell>
                    <TableCell>{student.year || 'N/A'}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>{student.parentContactNumber}</TableCell>
                    <TableCell>
                        {student.email ? (
                            <a href={`mailto:${student.email}`} className="flex items-center gap-1 text-primary hover:underline">
                                <Mail className="h-3 w-3"/> {student.email}
                            </a>
                        ) : (
                            <span className="text-muted-foreground">N/A</span>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No students found registered for {currentUser?.institutionName || "your institution"}.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
