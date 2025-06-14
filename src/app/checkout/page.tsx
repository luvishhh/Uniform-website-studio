
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { CreditCard, ArrowRight, Lock, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay");


  useEffect(() => {
    setIsClient(true);
    if (cartItems.length === 0 && typeof window !== 'undefined') {
        toast({
            title: "Your cart is empty!",
            description: "Redirecting you to continue shopping.",
            variant: "destructive"
        });
        router.push('/products');
    }
  }, [cartItems, router, toast]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.00 : 0; // Mock shipping, free if no items (though redirect should happen)
  const taxes = subtotal * 0.1; // Mock 10% tax
  const total = subtotal + shipping + taxes;
  const itemCount = getItemCount();

  const handleConfirmOrder = () => {
    // Simulate order placement
    toast({
      title: "Order Placed (Mock)!",
      description: "Thank you for your purchase. Your order is being processed.",
    });
    clearCart(); // Clear the cart after mock order placement
    
    // Simulate redirect to a confirmation page or home
    router.push('/'); 
    // In a real app, you'd redirect to an order confirmation page:
    // router.push('/order-confirmation?orderId=MOCK123');
  };

  if (!isClient || cartItems.length === 0) {
    // Render nothing or a loading state until client-side check completes and redirects if cart is empty
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8 flex items-center justify-center">
                 <p className="text-muted-foreground">Loading checkout or redirecting...</p>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Shipping and Payment Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Details */}
            <section className="p-6 bg-card rounded-lg shadow">
              <h2 className="text-2xl font-semibold font-headline mb-6">Shipping Details</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" />
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="CA" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input id="zip" placeholder="90210" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="e.g., United States" />
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="p-6 bg-card rounded-lg shadow">
              <h2 className="text-2xl font-semibold font-headline mb-6">Payment Method</h2>
              <div className="space-y-4">
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay</SelectItem>
                    <SelectItem value="card">Credit/Debit Card (Mock)</SelectItem>
                    <SelectItem value="paypal">PayPal (Mock)</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedPaymentMethod === 'razorpay' && (
                  <div className="p-4 border rounded-md bg-muted/50 text-center">
                    <Info className="h-5 w-5 text-primary inline-block mr-2 mb-1" />
                    <p className="text-sm text-muted-foreground">
                      You've selected Razorpay. In a real application, the Razorpay payment interface would appear here to complete your transaction securely.
                    </p>
                  </div>
                )}
                {selectedPaymentMethod === 'card' && (
                   <div className="p-4 border rounded-md bg-muted/50">
                     <p className="text-sm text-muted-foreground">Mock Credit/Debit card form would appear here.</p>
                   </div>
                )}
                {selectedPaymentMethod === 'paypal' && (
                   <div className="p-4 border rounded-md bg-muted/50">
                     <p className="text-sm text-muted-foreground">Mock PayPal button/integration would appear here.</p>
                   </div>
                )}

                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <Lock className="h-4 w-4 mr-2 text-green-600" />
                  <span>Your payment information is processed securely.</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: Upon successful real payment (handled by the backend), automated email receipts would be sent to you and the site admin.
                </p>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6 p-6 bg-card rounded-lg shadow h-fit sticky top-24">
            <h2 className="text-2xl font-semibold font-headline mb-4">Order Summary</h2>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 mb-4">
              {cartItems.map(item => (
                <div key={item.productId + (item.size || '') + (item.color || '')} className="flex items-center gap-3 text-sm">
                  <div className="relative w-12 h-12 aspect-square rounded overflow-hidden border">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="50px" className="object-cover" data-ai-hint={item['data-ai-hint']}/>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <Separator className="my-2"/>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg" onClick={handleConfirmOrder}>
              <CreditCard className="mr-2 h-5 w-5" /> Confirm Order
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

