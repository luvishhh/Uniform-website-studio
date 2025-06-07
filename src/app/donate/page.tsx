"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { HeartHandshake, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


export default function DonatePage() {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmitDonation = (event: React.FormEvent) => {
    event.preventDefault();
    // Mock form submission
    console.log("Donation form submitted (mock)");
    setShowConfirmation(true);
    // Reset form or redirect after a delay if needed
    // toast({
    //   title: "Donation Submitted!",
    //   description: "Thank you for your generous contribution. We will contact you shortly.",
    //   variant: "default",
    // });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <HeartHandshake className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Donate Your Old Uniforms</CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Help underprivileged students and promote sustainability by giving your old uniforms a new life.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitDonation} className="space-y-6">
              <div>
                <Label htmlFor="uniformType">Uniform Type</Label>
                <Input id="uniformType" placeholder="e.g., School Shirt, Corporate Blazer" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="e.g., 2" min="1" required />
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select required>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New / Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="contactName">Your Name</Label>
                <Input id="contactName" placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="contactEmail">Your Email</Label>
                <Input id="contactEmail" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div>
                <Label htmlFor="contactPhone">Your Phone (Optional)</Label>
                <Input id="contactPhone" type="tel" placeholder="+1 123 456 7890" />
              </div>
               <div>
                <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                <Textarea id="additionalInfo" placeholder="Any specific details about the uniforms or pickup instructions." />
              </div>
              <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg">
                Submit Donation
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <AlertDialogTitle className="text-center">Donation Submitted Successfully!</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                Thank you for your generous contribution. We appreciate your support in helping those in need. Our team will contact you shortly to arrange collection if necessary.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowConfirmation(false)} className="w-full">Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
      <Footer />
    </div>
  );
}
