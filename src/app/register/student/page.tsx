
"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StudentRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [institutionType, setInstitutionType] = useState<"school" | "college" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const payload = {
      role: "student",
      rollNumber: data.rollNumber,
      schoolCollegeName: data.schoolCollegeName,
      fullName: data.fullName,
      password: data.password,
      institutionType: data.institutionType,
      gradeOrCourse: institutionType === "school" ? data.grade : data.course,
      year: institutionType === "college" ? data.year : undefined,
      parentName: data.parentName,
      parentContactNumber: data.parentContactNumber,
      email: data.email || undefined, // Optional email
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "Your student account has been created. Please login.",
        });
        (event.target as HTMLFormElement).reset();
        setInstitutionType("");
        router.push('/login');
      } else {
        toast({
          title: "Registration Failed",
          description: result.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "Could not connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <UserPlus className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Student Registration</CardTitle>
            <CardDescription>Create your UniShop student account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" name="rollNumber" placeholder="e.g., S1001 / C2002" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="schoolCollegeName">School/College Name</Label>
                <Input id="schoolCollegeName" name="schoolCollegeName" placeholder="e.g., Greenwood High" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="e.g., Alice Wonderland" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="institutionType">Institution Type</Label>
                <Select
                  name="institutionType"
                  required
                  onValueChange={(value: "school" | "college") => setInstitutionType(value)}
                  value={institutionType}
                  disabled={isLoading}
                >
                  <SelectTrigger id="institutionType">
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {institutionType === "school" && (
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" name="grade" placeholder="e.g., 10th Grade" required={institutionType === "school"} disabled={isLoading} />
                </div>
              )}
              {institutionType === "college" && (
                <>
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input id="course" name="course" placeholder="e.g., B.Sc. Computer Science" required={institutionType === "college"} disabled={isLoading} />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" placeholder="e.g., 1st Year, 2nd Year" disabled={isLoading} />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input id="parentName" name="parentName" placeholder="e.g., Queen of Hearts" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="parentContactNumber">Parent Contact Number</Label>
                <Input id="parentContactNumber" name="parentContactNumber" type="tel" placeholder="e.g., 555-1234" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="email">Your Email (Optional, for communication)</Label>
                <Input id="email" name="email" type="email" placeholder="e.g., student@example.com" disabled={isLoading} />
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register Student Account"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Login here
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
