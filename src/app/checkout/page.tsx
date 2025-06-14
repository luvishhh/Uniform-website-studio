
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
import type { User } from "@/types";


export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        const storedUserId = localStorage.getItem('unishop_user_id');
        const storedUserDisplayName = localStorage.getItem('unishop_user_displayName');
        const storedUserEmail = localStorage.getItem('unishop_user_email'); // Assuming email is stored

        if (storedUserId) {
            // For mock, just set some defaults if user is logged in
            // In a real app, you'd fetch user details or have them in a context
             setCurrentUser({ id: storedUserId } as User); // Partial user for now
             setShippingDetails(prev => ({
                ...prev,
                firstName: storedUserDisplayName?.split(' ')[0] || "",
                lastName: storedUserDisplayName?.split(' ').slice(1).join(' ') || "",
                email: storedUserEmail || "", // You might need to fetch this or store it at login
             }));
        }

        if (cartItems.length === 0) {
            toast({
                title: "Your cart is empty!",
                description: "Redirecting you to continue shopping.",
                variant: "destructive"
            });
            router.push('/products');
        }
    }
  }, [cartItems, router, toast]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.00 : 0; 
  const taxes = subtotal * 0.1; 
  const total = subtotal + shipping + taxes;
  const itemCount = getItemCount();

  const handleConfirmOrder = async () => {
    setIsProcessing(true);

    if (!currentUser || !currentUser.id) {
        toast({ title: "User Not Identified", description: "Please log in to place an order.", variant: "destructive" });
        setIsProcessing(false);
        router.push("/login");
        return;
    }
    if (!shippingDetails.firstName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.zip || !shippingDetails.country) {
        toast({ title: "Missing Shipping Details", description: "Please fill in all required shipping fields.", variant: "destructive" });
        setIsProcessing(false);
        return;
    }


    let paymentVerified = false;
    let razorpayDetails = {};

    if (selectedPaymentMethod === 'razorpay') {
      try {
        const createOrderResponse = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: total, 
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: { customerName: `${shippingDetails.firstName} ${shippingDetails.lastName}`, email: shippingDetails.email }
          }),
        });

        if (!createOrderResponse.ok) {
          const errorData = await createOrderResponse.json();
          throw new Error(errorData.message || 'Failed to create Razorpay order with backend.');
        }
        const orderData = await createOrderResponse.json();
        
        razorpayDetails = {
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: `mock_pay_${Date.now()}`, // Mock payment ID for simulation
            razorpaySignature: `mock_sig_${Date.now()}`  // Mock signature for simulation
        };

        const verifyResponse = await fetch('/api/payment/verify-signature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(razorpayDetails),
        });
        const verificationResult = await verifyResponse.json();

        if (verifyResponse.ok && verificationResult.status === 'success') {
            paymentVerified = true;
        } else {
            toast({ title: "Payment Verification Failed (Mock)", description: verificationResult.message || "Please try again or contact support.", variant: "destructive" });
        }
      } catch (error: any) {
        toast({ title: "Checkout Error", description: error.message || "An unexpected error occurred during payment processing.", variant: "destructive" });
      }
    } else {
      // For other mock payment methods, assume payment is instantly "verified"
      paymentVerified = true;
      razorpayDetails = { paymentMethod: selectedPaymentMethod };
    }

    if (paymentVerified) {
        // Now save the order to the database
        try {
            const finalOrderPayload = {
                userId: currentUser.id,
                items: cartItems,
                totalAmount: total,
                shippingAddress: {
                    name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                    email: shippingDetails.email,
                    street: shippingDetails.address,
                    city: shippingDetails.city,
                    zip: shippingDetails.zip,
                    country: shippingDetails.country,
                },
                paymentMethod: selectedPaymentMethod,
                ...(selectedPaymentMethod === 'razorpay' && razorpayDetails), // Add razorpay details if applicable
            };

            const saveOrderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrderPayload),
            });

            const savedOrderResult = await saveOrderResponse.json();

            if (saveOrderResponse.ok) {
                toast({ title: "Order Placed Successfully!", description: `Thank you for your purchase. Order ID: ${savedOrderResult.order.id.substring(0,8)}...` });
                clearCart();
                router.push('/'); 
            } else {
                toast({ title: "Order Placement Failed", description: savedOrderResult.message || "Could not save your order. Please try again.", variant: "destructive" });
            }
        } catch (error: any) {
            toast({ title: "Order Saving Error", description: error.message || "An unexpected error occurred while saving your order.", variant: "destructive" });
        }
    }
    setIsProcessing(false);
  };

  if (!isClient || (cartItems.length === 0 && router.pathname === '/checkout')) { // Avoid redirect if already navigating away
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
          <div className="lg:col-span-2 space-y-8">
            <section className="p-6 bg-card rounded-lg shadow">
              <h2 className="text-2xl font-semibold font-headline mb-6">Shipping Details</h2>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" value={shippingDetails.firstName} onChange={handleInputChange} required/>
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" value={shippingDetails.lastName} onChange={handleInputChange} required/>
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" value={shippingDetails.email} onChange={handleInputChange} required/>
                </div>
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input id="address" placeholder="123 Main St" value={shippingDetails.address} onChange={handleInputChange} required/>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" placeholder="Anytown" value={shippingDetails.city} onChange={handleInputChange} required/>
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="CA" value={shippingDetails.state} onChange={handleInputChange}/>
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP / Postal Code *</Label>
                    <Input id="zip" placeholder="90210" value={shippingDetails.zip} onChange={handleInputChange} required/>
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input id="country" placeholder="e.g., United States" value={shippingDetails.country} onChange={handleInputChange} required/>
                </div>
              </form>
            </section>

            <section className="p-6 bg-card rounded-lg shadow">
              <h2 className="text-2xl font-semibold font-headline mb-6">Payment Method</h2>
              <div className="space-y-4">
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} disabled={isProcessing}>
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
                      You've selected Razorpay. In a real application, the Razorpay payment interface would appear to complete your transaction securely.
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
            <Button 
              size="lg" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg" 
              onClick={handleConfirmOrder}
              disabled={isProcessing || cartItems.length === 0 || !currentUser}
            >
              {isProcessing ? "Processing..." : <><CreditCard className="mr-2 h-5 w-5" /> Confirm Order</>}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
