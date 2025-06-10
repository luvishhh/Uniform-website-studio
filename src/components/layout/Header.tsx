
"use client";

import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User as UserIcon, ChevronDown, ShieldCheck, UserPlus, LogInIcon, LogOutIcon, Briefcase, Building, GraduationCap, Home, ShoppingBag, Gift, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Shop Uniforms', icon: ShoppingBag },
  { href: '/donate', label: 'Donate', icon: Gift },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Check for auth token cookie and user details in localStorage
    if (typeof window !== "undefined") {
      const cookieStore = document.cookie;
      const tokenPresent = cookieStore.split(';').some((item) => item.trim().startsWith('unishop_auth_token='));

      if (tokenPresent) {
        const storedUserRole = localStorage.getItem('unishop_user_role');
        const storedUserName = localStorage.getItem('unishop_user_displayName');
        if (storedUserRole && storedUserName) {
          setIsLoggedIn(true);
          setCurrentUserRole(storedUserRole);
          setCurrentUserName(storedUserName);
        } else {
          // Token exists but no user info, might be stale state or user cleared localStorage
          // For simplicity, treat as logged out if localStorage is missing info
          setIsLoggedIn(false);
          setCurrentUserRole(null);
          setCurrentUserName(null);
          // Optionally, call logout API here to clear server-side session/cookie if necessary
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUserRole(null);
        setCurrentUserName(null);
      }
    }
  }, [pathname]); // Re-evaluate on pathname change to reflect state if navigation happens without full page reload

  const handleLogout = async () => {
    setIsLoading(true); // Optional: add a loading state
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "Could not log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (typeof window !== "undefined") {
          localStorage.removeItem('unishop_user_role');
          localStorage.removeItem('unishop_user_displayName');
          // Also remove admin specific local storage if it exists
          localStorage.removeItem('isAdminLoggedIn'); 
      }
      setIsLoggedIn(false);
      setCurrentUserRole(null);
      setCurrentUserName(null);
      setIsLoading(false);
      router.push('/'); // Redirect to home
      router.refresh(); // Force refresh to ensure server components re-render correctly
    }
  };
  
  const [isLoading, setIsLoading] = useState(false); // For logout


  const NavLinkItem = ({ href, label, isActive, onClick, icon: Icon, className }: { href: string; label: string; isActive: boolean; onClick?: () => void; icon?: React.ElementType, className?:string }) => (
    <Link href={href} passHref>
      <Button 
        variant="ghost" 
        className={cn(
          "text-sm font-medium h-auto py-2 px-3",
          isActive ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-primary/5',
          className
        )} 
        onClick={onClick}
      >
        {Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
        {label}
      </Button>
    </Link>
  );

  const renderNavLinks = (isMobile = false) => {
    const handleLinkClick = () => {
      if (isMobile) setIsMobileMenuOpen(false);
    };
    
    const mobileClass = isMobile ? "w-full justify-start text-base py-3 px-4" : "";

    let linksToRender = navLinks.map((link) => (
      <NavLinkItem 
        key={link.href} 
        href={link.href} 
        label={link.label} 
        icon={link.icon}
        isActive={pathname === link.href || (link.href === '/products' && pathname.startsWith('/products'))}
        onClick={handleLinkClick}
        className={mobileClass}
      />
    ));

    // Add Admin Panel link only if the user is an admin AND logged in via the main system
    if (isLoggedIn && currentUserRole === 'admin') {
      linksToRender.push(
        <NavLinkItem 
          key="/admin/dashboard" 
          href="/admin/dashboard" 
          label="Admin Panel" 
          icon={ShieldCheck}
          isActive={pathname.startsWith('/admin')}
          onClick={handleLinkClick}
          className={mobileClass}
        />
      );
    }
    return linksToRender;
  };
  
  if (!isClient) { 
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 animate-pulse rounded-md bg-muted"></div>
            <div className="h-9 w-9 animate-pulse rounded-md bg-muted"></div>
            <div className="h-9 w-9 animate-pulse rounded-md bg-muted md:hidden"></div>
          </div>
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Logo />
        
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-3">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" aria-label="Shopping Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span> */}
            </Button>
          </Link>
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User Account">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                 {currentUserName && (
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Hi, {currentUserName}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {currentUserRole}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 py-2"><UserIcon className="h-4 w-4 text-muted-foreground"/> My Profile</Link>
                </DropdownMenuItem>
                {currentUserRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="flex items-center gap-2 py-2"><ShieldCheck className="h-4 w-4 text-muted-foreground"/>Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2 py-2">
                  <LogOutIcon className="h-4 w-4" /> {isLoading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" asChild className="text-sm font-medium px-3">
                <Link href="/login"><LogInIcon className="mr-1.5 h-4 w-4"/> Login</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="text-sm font-medium px-3">
                    <UserPlus className="mr-1.5 h-4 w-4" /> Register <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild><Link href="/register/student" className="flex items-center gap-2 py-2"><GraduationCap className="h-4 w-4 text-muted-foreground"/> Student</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/register/institution" className="flex items-center gap-2 py-2"><Building className="h-4 w-4 text-muted-foreground"/> Institution</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/register/dealer" className="flex items-center gap-2 py-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Dealer</Link></DropdownMenuItem>
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
              <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm p-0">
                <div className="flex h-16 items-center justify-between border-b px-6">
                  <Logo onClick={() => setIsMobileMenuOpen(false)} />
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon"><X className="h-5 w-5" /></Button>
                  </SheetClose>
                </div>
                <nav className="mt-6 flex flex-col space-y-1 px-4">
                  {renderNavLinks(true)}
                </nav>
                <div className="mt-6 border-t px-4 pt-6 space-y-3">
                  {isLoggedIn ? (
                    <>
                      {currentUserName && (
                        <div className="px-4 py-2 text-sm">
                          <p className="font-medium">Hi, {currentUserName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{currentUserRole}</p>
                        </div>
                      )}
                      <Button className="w-full justify-start text-base py-3 px-4" variant="ghost" asChild onClick={() => { setIsMobileMenuOpen(false); router.push('/profile'); }}>
                        <Link href="/profile"><UserIcon className="mr-2 h-5 w-5"/> My Profile</Link>
                      </Button>
                      <Button className="w-full justify-start text-base py-3 px-4 text-destructive hover:text-destructive" variant="ghost" onClick={handleLogout} disabled={isLoading}>
                        <LogOutIcon className="mr-2 h-5 w-5"/> {isLoading ? "Logging out..." : "Logout"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full justify-start text-base py-3 px-4" variant="default" asChild onClick={() => setIsMobileMenuOpen(false)}>
                        <Link href="/login"><LogInIcon className="mr-2 h-5 w-5"/> Login</Link>
                      </Button>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="w-full justify-start text-base py-3 px-4" variant="outline">
                              <UserPlus className="mr-2 h-5 w-5" /> Register <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" side="bottom" className="w-[calc(100vw-2rem-8px)] ml-4"> {/* Check this width for mobile */}
                            <DropdownMenuItem asChild onClick={() => setIsMobileMenuOpen(false)}><Link href="/register/student" className="flex items-center gap-2 py-2"><GraduationCap className="h-4 w-4 text-muted-foreground"/> Student</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild onClick={() => setIsMobileMenuOpen(false)}><Link href="/register/institution" className="flex items-center gap-2 py-2"><Building className="h-4 w-4 text-muted-foreground"/> Institution</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild onClick={() => setIsMobileMenuOpen(false)}><Link href="/register/dealer" className="flex items-center gap-2 py-2"><Briefcase className="h-4 w-4 text-muted-foreground"/> Dealer</Link></DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
