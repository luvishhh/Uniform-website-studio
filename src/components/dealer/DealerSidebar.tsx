
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { LayoutDashboard, Settings, LogOut, Briefcase, ShoppingCart, Archive, BarChart3, Users, Tag, MessageSquare, HelpCircle } from "lucide-react";

const dealerNavItems = [
  { href: "/dealer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dealer/orders", label: "Order Management", icon: ShoppingCart },
  { href: "/dealer/inventory", label: "Inventory", icon: Archive },
  // Placeholders for future expansion, can be linked from dashboard for now
  // { href: "/dealer/sales", label: "Sales & Revenue", icon: BarChart3 },
  // { href: "/dealer/customers", label: "Customers", icon: Users },
  // { href: "/dealer/promotions", label: "Promotions", icon: Tag },
  // { href: "/dealer/messages", label: "Communications", icon: MessageSquare },
  { type: "separator" },
  { href: "/profile?tab=settings", label: "Account Settings", icon: Settings },
  // { href: "/dealer/help", label: "Help & Resources", icon: HelpCircle },
];

export default function DealerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/profile?tab=settings") {
      return pathname === "/profile" && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tab") === "settings";
    }
    return pathname === href || pathname.startsWith(href + "/"); // Ensure deeper paths are also active
  };


  return (
    <aside className="sticky top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col hidden md:flex">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <Briefcase className="h-7 w-7 text-primary" />
        <span className="text-xl font-semibold font-headline">Dealer Portal</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {dealerNavItems.map((item, index) =>
            item.type === "separator" ? (
              <Separator key={`sep-${index}`} className="my-3 bg-sidebar-border/50" />
            ) : (
              <Link key={item.href} href={item.href!} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm h-10 px-3 ${
                    isActive(item.href!)
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
                Exit Portal (Go Home)
            </Button>
        </Link>
      </div>
    </aside>
  );
}
