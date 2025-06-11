
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, FileText } from "lucide-react";

export default function DealerInquiriesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitInquiry = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // Mock form submission
    // const formData = new FormData(event.currentTarget);
    // const data = Object.fromEntries(formData.entries());
    // console.log("Bulk Inquiry Data (Mock):", data);
    
    setTimeout(() => { // Simulate API call
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your bulk order inquiry. We will get back to you shortly.",
      });
      (event.target as HTMLFormElement).reset();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
            <h1 className="text-3xl font-bold font-headline">Submit Bulk Order Inquiry</h1>
            <p className="text-muted-foreground">Interested in large quantities? Let us know your requirements.</p>
            </div>
        </div>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Inquiry Form</CardTitle>
          <CardDescription>Please provide as much detail as possible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitInquiry} className="space-y-6">
            <div>
              <Label htmlFor="contactPerson">Contact Person Name</Label>
              <Input id="contactPerson" name="contactPerson" placeholder="Your Full Name" required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" name="businessName" placeholder="Your Dealer/Business Name" required disabled={isLoading} />
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="your.email@example.com" required disabled={isLoading} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Your Contact Number" required disabled={isLoading} />
              </div>
            </div>
            <div>
              <Label htmlFor="productsOfInterest">Product(s) of Interest</Label>
              <Textarea 
                id="productsOfInterest" 
                name="productsOfInterest" 
                placeholder="List product names/SKUs and any specific variations (size, color, etc.)" 
                rows={3} 
                required 
                disabled={isLoading} 
              />
            </div>
            <div>
              <Label htmlFor="desiredQuantity">Desired Quantity (Approx.)</Label>
              <Input id="desiredQuantity" name="desiredQuantity" type="text" placeholder="e.g., 50 shirts, 100 trousers" required disabled={isLoading} />
            </div>
            <div>
              <Label htmlFor="additionalNotes">Additional Notes or Requirements</Label>
              <Textarea 
                id="additionalNotes" 
                name="additionalNotes" 
                placeholder="Any specific customization, delivery timelines, or other details." 
                rows={4} 
                disabled={isLoading}
              />
            </div>
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? "Submitting..." : <><Send className="mr-2 h-5 w-5" /> Submit Inquiry</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
