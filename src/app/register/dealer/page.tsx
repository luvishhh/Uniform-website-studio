
"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DealerRegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const payload = {
      role: "dealer",
      dealerName: data.dealerName,
      email: data.email,
      password: data.password,
      contactNumber: data.contactNumber,
      businessAddress: data.businessAddress,
      gstinNumber: data.gstinNumber,
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
          description: "Your dealer account has been created. Please login.",
        });
        (event.target as HTMLFormElement).reset();
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
            <Briefcase className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Dealer Registration</CardTitle>
            <CardDescription>Join UniShop as a registered dealer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="dealerName">Dealer's Name / Business Name</Label>
                <Input id="dealerName" name="dealerName" placeholder="e.g., Uniform Supplies Inc." required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="e.g., sales@uniformsupplies.com" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" name="contactNumber" type="tel" placeholder="e.g., 555-0200" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea id="businessAddress" name="businessAddress" placeholder="Full business address" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="gstinNumber">GSTIN Number</Label>
                <Input id="gstinNumber" name="gstinNumber" placeholder="e.g., 22AAAAA0000A1Z5" required disabled={isLoading} />
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register as Dealer"}
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
