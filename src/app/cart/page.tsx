
"use client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation"; // Added

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getItemCount } = useCart();
  const router = useRouter(); // Added

  const subtotal = getCartTotal();
  const taxes = subtotal * 0.1; // Mock 10% tax
  const total = subtotal + taxes;
  const itemCount = getItemCount();

  const handleQuantityChange = (productId: string, size: string | undefined, color: string | undefined, newQuantity: number) => {
    if (newQuantity >= 0) { // Allow setting to 0 to remove, or context handles filtering
      updateQuantity(productId, newQuantity, size, color);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">Your Shopping Cart ({itemCount} Items)</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg shadow">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map(item => (
                <div key={item.productId + (item.size || '') + (item.color || '')} className="flex items-start gap-4 p-4 border rounded-lg bg-card shadow">
                  <div className="relative w-24 h-24 aspect-square rounded-md overflow-hidden border">
                    <Image src={item.imageUrl} alt={item.name} fill sizes="100px" className="object-cover" data-ai-hint={item['data-ai-hint']}/>
                  </div>
                  <div className="flex-grow">
                    <Link href={`/products/${item.productId}`} className="hover:text-primary">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                    </Link>
                    {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                    <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border rounded-md">
                      <Button variant="ghost" size="icon" className="px-2 h-8 w-8" onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item.productId, item.size, item.color, parseInt(e.target.value, 10) || 0)}
                        className="w-12 h-8 text-center border-0 focus-visible:ring-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                      />
                      <Button variant="ghost" size="icon" className="px-2 h-8 w-8" onClick={() => handleQuantityChange(item.productId, item.size, item.color, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => removeFromCart(item.productId, item.size, item.color)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6 p-6 bg-card rounded-lg shadow h-fit sticky top-24">
              <h2 className="text-2xl font-semibold font-headline mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes (Est.)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <Separator className="my-2"/>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-xs text-muted-foreground text-center">Shipping and discounts calculated at checkout.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
