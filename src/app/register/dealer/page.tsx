
"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Briefcase } from "lucide-react"; // Using Briefcase for dealer

export default function DealerRegisterPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Form data processing
    console.log("Dealer registration form submitted (mock)");
    toast({
      title: "Registration Successful (Mock)",
      description: "Your dealer account has been created.",
    });
    (event.target as HTMLFormElement).reset();
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
                <Input id="dealerName" placeholder="e.g., Uniform Supplies Inc." required />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="e.g., sales@uniformsupplies.com" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input id="contactNumber" type="tel" placeholder="e.g., 555-0200" required />
              </div>
              <div>
                <Label htmlFor="businessAddress">Business Address</Label>
                <Textarea id="businessAddress" placeholder="Full business address" required />
              </div>
              <div>
                <Label htmlFor="gstinNumber">GSTIN Number</Label>
                <Input id="gstinNumber" placeholder="e.g., 22AAAAA0000A1Z5" required />
              </div>

              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Register as Dealer
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
