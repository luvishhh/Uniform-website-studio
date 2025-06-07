
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

export default function StudentRegisterPage() {
  const { toast } = useToast();
  const [institutionType, setInstitutionType] = useState<"school" | "college" | "">("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form data processing logic would go here
    console.log("Student registration form submitted (mock)");
    toast({
      title: "Registration Successful (Mock)",
      description: "Your student account has been created.",
    });
    (event.target as HTMLFormElement).reset();
    setInstitutionType("");
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
                <Input id="rollNumber" placeholder="e.g., S1001 / C2002" required />
              </div>
              <div>
                <Label htmlFor="schoolCollegeName">School/College Name</Label>
                <Input id="schoolCollegeName" placeholder="e.g., Greenwood High" required />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="e.g., Alice Wonderland" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <div>
                <Label htmlFor="institutionType">Institution Type</Label>
                <Select
                  required
                  onValueChange={(value: "school" | "college") => setInstitutionType(value)}
                  value={institutionType}
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
                  <Input id="grade" placeholder="e.g., 10th Grade" required />
                </div>
              )}
              {institutionType === "college" && (
                <>
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input id="course" placeholder="e.g., B.Sc. Computer Science" required />
                  </div>
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" placeholder="e.g., 1st Year, 2nd Year" />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input id="parentName" placeholder="e.g., Queen of Hearts" required />
              </div>
              <div>
                <Label htmlFor="parentContactNumber">Parent Contact Number</Label>
                <Input id="parentContactNumber" type="tel" placeholder="e.g., 555-1234" required />
              </div>
              <div>
                <Label htmlFor="email">Your Email (Optional, for communication)</Label>
                <Input id="email" type="email" placeholder="e.g., student@example.com" />
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Register Student Account
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
