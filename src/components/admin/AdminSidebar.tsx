
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Package, Users, ShoppingCart, BarChart3, Settings, LogOut, Palette } from "lucide-react";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/donations", label: "Donations", icon: Palette }, // Using Palette for "Donations" as HeartHandshake may not be in lucide
  { type: "separator" },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col hidden md:flex">
      <div className="p-4 border-b border-sidebar-border">
        <Logo />
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {adminNavItems.map((item, index) =>
            item.type === "separator" ? (
              <Separator key={`sep-${index}`} className="my-3 bg-sidebar-border/50" />
            ) : (
              <Link key={item.href} href={item.href!} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm h-10 px-3 ${
                    pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href!))
                      ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                      : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  {item.label}
                </Button>
              </Link>
            )
          )}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-sidebar-border mt-auto">
         <Link href="/" passHref>
            <Button className="w-full justify-start text-sm h-10 px-3 bg-accent text-accent-foreground hover:bg-card hover:text-primary border border-sidebar-border">
                <LogOut className="mr-2 h-4 w-4" />
                Exit Admin (Go Home)
            </Button>
        </Link>
      </div>
    </aside>
  );
}
