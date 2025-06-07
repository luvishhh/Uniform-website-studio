
"use client";

import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Building } from "lucide-react"; // Using Building for institution

export default function InstitutionRegisterPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form data processing logic
    console.log("Institution registration form submitted (mock)");
    toast({
      title: "Registration Successful (Mock)",
      description: "Your institution account has been created.",
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <Building className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Institution Registration</CardTitle>
            <CardDescription>Register your School or College with UniShop.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input id="institutionName" placeholder="e.g., Greenwood High School" required />
              </div>
              <div>
                <Label htmlFor="institutionType">Type (School or College)</Label>
                <Select required>
                  <SelectTrigger id="institutionType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="e.g., admin@greenwood.edu" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <div>
                <Label htmlFor="institutionalAddress">Institutional Address</Label>
                <Textarea id="institutionalAddress" placeholder="Full address of the institution" required />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" type="tel" placeholder="e.g., 555-0100" required />
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Register Institution
              </Button>
               <p className="text-sm text-center text-muted-foreground">
                Already registered?{" "}
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
