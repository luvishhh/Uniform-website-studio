
"use client";

import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User as UserIcon, ChevronDown, ShieldCheck, UserPlus, LogInIcon, LogOutIcon, Briefcase, Building, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const mainCategory = { href: '/products', label: 'School & College Uniforms' };

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop Uniforms' }, // Main link to all products
  { href: '/donate', label: 'Donate' },
  // Admin link will be conditional based on user role
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Mock auth state - in a real app, this would come from AuthContext or similar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // 'student', 'admin', etc.

  useEffect(() => {
    setIsClient(true);
    // Simulate checking auth status
    // For demo: setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    // setCurrentUserRole(localStorage.getItem('userRole'));
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserRole(null);
    // localStorage.removeItem('isLoggedIn');
    // localStorage.removeItem('userRole');
    // redirect to home or login
  };
  
  // Example login simulation for demo
  const simulateLogin = (role: string) => {
    setIsLoggedIn(true);
    setCurrentUserRole(role);
    // localStorage.setItem('isLoggedIn', 'true');
    // localStorage.setItem('userRole', role);
  };


  const NavLinkItem = ({ href, label, isActive, onClick, icon: Icon }: { href: string; label: string; isActive: boolean; onClick?: () => void; icon?: React.ElementType }) => (
    <Link href={href} passHref>
      <Button variant="ghost" className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'}`} onClick={onClick}>
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {label}
      </Button>
    </Link>
  );

  const renderNavLinks = (isMobile = false) => {
    const handleLinkClick = () => {
      if (isMobile) setIsMobileMenuOpen(false);
    };

    return navLinks.map((link) => (
      <NavLinkItem 
        key={link.href} 
        href={link.href} 
        label={link.label} 
        isActive={pathname === link.href || (link.href === '/products' && pathname.startsWith('/products'))}
        onClick={handleLinkClick}
      />
    )).concat(
      currentUserRole === 'admin' ? (
        <NavLinkItem 
          key="/admin/dashboard" 
          href="/admin/dashboard" 
          label="Admin Panel" 
          isActive={pathname.startsWith('/admin')}
          onClick={handleLinkClick}
          icon={ShieldCheck}
        />
      ) : []
    );
  };
  
  if (!isClient) { // Basic SSR placeholder for icons
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div> {/* Cart */}
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div> {/* User/Login */}
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted md:hidden"></div> {/* Menu */}
          </div>
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User Account">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                {currentUserRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1">
              <Button variant="ghost" asChild className="text-sm">
                <Link href="/login"><LogInIcon className="mr-1 h-4 w-4 md:mr-2"/> Login</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="text-sm">
                    <UserPlus className="mr-1 h-4 w-4 md:mr-2" /> Register <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/register/student"><GraduationCap className="mr-2 h-4 w-4"/> Student</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register/institution"><Building className="mr-2 h-4 w-4"/> Institution</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register/dealer"><Briefcase className="mr-2 h-4 w-4"/> Dealer</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                  <nav className="mt-8 flex flex-col space-y-3">
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
