
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Building } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InstitutionRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [institutionType, setInstitutionType] = useState<"school" | "college" | "">("");


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const payload = {
      role: "institution",
      institutionName: data.institutionName,
      institutionType: data.institutionType,
      email: data.email,
      password: data.password,
      institutionalAddress: data.institutionalAddress,
      contactNumber: data.contactNumber,
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
          description: "Your institution account has been created. Please login.",
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
            <Building className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Institution Registration</CardTitle>
            <CardDescription>Register your School or College with UniShop.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input id="institutionName" name="institutionName" placeholder="e.g., Greenwood High School" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="institutionType">Type (School or College)</Label>
                <Select 
                  name="institutionType" 
                  required 
                  disabled={isLoading} 
                  onValueChange={(value: "school" | "college") => setInstitutionType(value)}
                  value={institutionType}
                >
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
                <Input id="email" name="email" type="email" placeholder="e.g., admin@greenwood.edu" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="institutionalAddress">Institutional Address</Label>
                <Textarea id="institutionalAddress" name="institutionalAddress" placeholder="Full address of the institution" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" name="contactNumber" type="tel" placeholder="e.g., 555-0100" required disabled={isLoading} />
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register Institution"}
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
