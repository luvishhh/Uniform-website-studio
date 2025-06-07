"use client";

import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User as UserIcon, ChevronDown, HeartHandshake, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { 
    label: 'Categories', 
    isDropdown: true,
    subLinks: [
      { href: '/products/school', label: 'School Uniforms' },
      { href: '/products/corporate', label: 'Corporate Attire' },
      { href: '/products/healthcare', label: 'Healthcare Wear' },
    ]
  },
  { href: '/donate', label: 'Donate', icon: HeartHandshake },
  { href: '/admin/dashboard', label: 'Admin', icon: ShieldCheck, adminOnly: true },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Mock auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    setIsClient(true);
    // Simulate login status (e.g. after 2 seconds for demo)
    // In a real app, this would come from an auth context/hook
    const timer = setTimeout(() => {
      // setIsLoggedIn(true); 
      // setIsAdmin(true); // or false
    }, 1);
    return () => clearTimeout(timer);
  }, []);


  const NavLinkItem = ({ href, label, isActive, onClick }: { href: string; label: string; isActive: boolean; onClick?: () => void; }) => (
    <Link href={href} passHref>
      <Button variant="ghost" className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`} onClick={onClick}>
        {label}
      </Button>
    </Link>
  );

  const renderNavLinks = (isMobile = false) => {
    const handleLinkClick = () => {
      if (isMobile) setIsMobileMenuOpen(false);
    };

    return navLinks.filter(link => !link.adminOnly || (link.adminOnly && isAdmin)).map((link) => {
      if (link.isDropdown && link.subLinks) {
        return (
          <DropdownMenu key={link.label}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`text-sm font-medium flex items-center gap-1 ${pathname.startsWith('/products') ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`}>
                {link.label} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {link.subLinks.map(subLink => (
                <DropdownMenuItem key={subLink.label} asChild>
                  <Link href={subLink.href} onClick={handleLinkClick}>{subLink.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
      return (
        <NavLinkItem 
          key={link.href} 
          href={link.href!} 
          label={link.label} 
          isActive={pathname === link.href}
          onClick={handleLinkClick}
        />
      );
    });
  };
  
  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div> {/* Placeholder for icons */}
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {/* Add a badge for item count here if needed */}
            </Button>
          </Link>
          {isLoggedIn ? (
             <Link href="/profile" passHref>
              <Button variant="ghost" size="icon" aria-label="User Profile">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button onClick={() => { setIsLoggedIn(true); setIsAdmin(Math.random() > 0.5); }} className="text-sm">Login</Button>
          )}
          
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
                <div className="p-6">
                  <Logo />
                  <nav className="mt-8 flex flex-col space-y-4">
                    {renderNavLinks(true)}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
