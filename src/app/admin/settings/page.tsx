import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch"; // Assuming Switch component exists
import { Check } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold font-headline">Admin Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general store settings and configurations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" defaultValue="UniShop" />
          </div>
          <div>
            <Label htmlFor="storeEmail">Store Contact Email</Label>
            <Input id="storeEmail" type="email" defaultValue="contact@unishop.com" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily take the store offline for visitors.
              </p>
            </div>
            <Switch id="maintenanceMode" aria-label="Maintenance mode" />
          </div>
           <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><Check className="mr-2 h-4 w-4" /> Save General Settings</Button>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway Settings</CardTitle>
          <CardDescription>Configure your payment provider (e.g., Razorpay Mock).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="razorpayKey">Razorpay Key ID (Mock)</Label>
            <Input id="razorpayKey" placeholder="rzp_test_xxxxxx" />
          </div>
          <div>
            <Label htmlFor="razorpaySecret">Razorpay Key Secret (Mock)</Label>
            <Input id="razorpaySecret" type="password" placeholder="••••••••••••••••" />
          </div>
          <Button><Check className="mr-2 h-4 w-4" /> Save Payment Settings</Button>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Admin Account</CardTitle>
          <CardDescription>Manage your admin credentials.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input id="adminEmail" type="email" defaultValue="admin@unishop.com" readOnly />
          </div>
           <div>
            <Label htmlFor="adminPassword">New Password</Label>
            <Input id="adminPassword" type="password" placeholder="Enter new password" />
          </div>
          <div>
            <Label htmlFor="adminConfirmPassword">Confirm New Password</Label>
            <Input id="adminConfirmPassword" type="password" placeholder="Confirm new password" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

    </div>
  );
}
