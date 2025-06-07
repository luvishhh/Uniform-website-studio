
"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { LogIn } from "lucide-react";

type LoginRole = "student" | "other"; // "other" for Institution/Dealer/Admin

export default function LoginPage() {
  const { toast } = useToast();
  const [loginRole, setLoginRole] = useState<LoginRole>("student");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Login form submitted (mock)", { role: loginRole, ...data });
    toast({
      title: "Login Attempt (Mock)",
      description: `Attempting to log in as ${loginRole === 'student' ? 'Student' : 'Institution/Dealer/Admin'}.`,
    });
    // In a real app, you would call an authentication API here
    // and then redirect on success or show an error message.
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <LogIn className="mx-auto h-12 w-12 text-primary mb-3" />
            <CardTitle className="text-3xl font-bold font-headline">Login to UniShop</CardTitle>
            <CardDescription>Access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="mb-2 block">Login as:</Label>
                <RadioGroup
                  defaultValue="student"
                  onValueChange={(value: string) => setLoginRole(value as LoginRole)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="role-student" />
                    <Label htmlFor="role-student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="role-other" />
                    <Label htmlFor="role-other">Institution / Dealer / Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              {loginRole === "student" ? (
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input id="rollNumber" name="rollNumber" placeholder="Enter your Roll Number" required />
                </div>
              ) : (
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="Enter your Email Address" required />
                </div>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Login
              </Button>

              <div className="text-sm text-center text-muted-foreground space-y-1">
                <p>
                  Don&apos;t have an account? Register as a{" "}
                  <Link href="/register/student" className="font-medium text-primary hover:underline">
                    Student
                  </Link>, {" "}
                  <Link href="/register/institution" className="font-medium text-primary hover:underline">
                    Institution
                  </Link>, or {" "}
                  <Link href="/register/dealer" className="font-medium text-primary hover:underline">
                    Dealer
                  </Link>.
                </p>
                 <p>
                  <Link href="/forgot-password" // Placeholder for forgot password
                    className="font-medium text-primary hover:underline text-xs">
                    Forgot Password?
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
