import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCartItems } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, ArrowRight, Lock } from "lucide-react";

export default function CheckoutPage() {
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00; // Mock shipping
  const taxes = subtotal * 0.1; // Mock 10% tax
  const total = subtotal + shipping + taxes;

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
                  <Select>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="gb">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="p-6 bg-card rounded-lg shadow">
              <h2 className="text-2xl font-semibold font-headline mb-6">Payment Method</h2>
              <div className="space-y-4">
                <Select defaultValue="razorpay">
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="razorpay">Razorpay (Mock)</SelectItem>
                    <SelectItem value="card">Credit/Debit Card (Mock)</SelectItem>
                    <SelectItem value="paypal">PayPal (Mock)</SelectItem>
                  </SelectContent>
                </Select>
                {/* Mock Razorpay/Card fields would go here */}
                <div className="p-4 border rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    This is a mock payment section. In a real application, you would integrate with a payment gateway like Razorpay.
                  </p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 mr-2 text-green-600" />
                  <span>Your payment information is secure.</span>
                </div>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-6 p-6 bg-card rounded-lg shadow h-fit sticky top-24">
            <h2 className="text-2xl font-semibold font-headline mb-4">Order Summary</h2>
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 mb-4">
              {mockCartItems.map(item => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
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
                <span className="text-muted-foreground">Subtotal</span>
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
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg" onClick={() => alert('Order Placed (Mock)')}>
              <CreditCard className="mr-2 h-5 w-5" /> Confirm Order
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
