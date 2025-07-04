'use client'

import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Menu,
  ShoppingCart,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  UserPlus,
  LogInIcon,
  LogOutIcon,
  Briefcase,
  Building,
  GraduationCap,
  Home,
  ShoppingBag,
  Gift,
  X,
  Settings,
  Package,
  LayoutDashboard,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/CartContext'
import { Badge } from '@/components/ui/badge'

const DONATION_FEATURE_LS_KEY = 'unishop_donation_feature_enabled'

const baseNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Shop Uniforms', icon: ShoppingBag },
  // Donate link will be added conditionally
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { getItemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isDonationFeatureEnabled, setIsDonationFeatureEnabled] = useState(true)

  const checkAuthState = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedUserRole = localStorage.getItem('unishop_user_role')
      const storedUserName = localStorage.getItem('unishop_user_displayName')

      if (storedUserRole && storedUserName) {
        setIsLoggedIn(true)
        setCurrentUserRole(storedUserRole)
        setCurrentUserName(storedUserName)
      } else {
        setIsLoggedIn(false)
        setCurrentUserRole(null)
        setCurrentUserName(null)
        // Clear all auth related items
        localStorage.removeItem('unishop_user_role')
        localStorage.removeItem('unishop_user_displayName')
        localStorage.removeItem('unishop_user_id')
        localStorage.removeItem('isAdminLoggedIn') // If you use this specific key
      }
    }
  }, [])

  const checkDonationFeatureState = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(DONATION_FEATURE_LS_KEY)
      setIsDonationFeatureEnabled(
        storedValue === null ? true : storedValue === 'true'
      )
    }
  }, [])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      checkAuthState()
      checkDonationFeatureState()
      setCartItemCount(getItemCount())

      window.addEventListener('authChange', checkAuthState)
      window.addEventListener('storage', (event) => {
        if (event.key === DONATION_FEATURE_LS_KEY) {
          checkDonationFeatureState()
        }
      })
      if (pathname) checkAuthState()
    }
    return () => {
      if (isClient && typeof window !== 'undefined') {
        window.removeEventListener('authChange', checkAuthState)
        window.removeEventListener('storage', checkDonationFeatureState)
      }
    }
  }, [
    isClient,
    pathname,
    checkAuthState,
    getItemCount,
    checkDonationFeatureState,
  ])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      })
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: 'Logout Error',
        description:
          'Could not log out. Please try again or check your connection.',
        variant: 'destructive',
      })
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('unishop_user_role')
        localStorage.removeItem('unishop_user_displayName')
        localStorage.removeItem('unishop_user_id')
        localStorage.removeItem('isAdminLoggedIn')
        window.dispatchEvent(new CustomEvent('authChange'))
      }
      setIsLoading(false)
      if (isMobileMenuOpen) setIsMobileMenuOpen(false)
      router.push('/')
      router.refresh()
    }
  }

  const NavLinkItem = ({
    href,
    label,
    isActive,
    onClick,
    icon: Icon,
    className,
  }: {
    href: string
    label: string
    isActive: boolean
    onClick?: () => void
    icon?: React.ElementType
    className?: string
  }) => (
    <Link href={href} passHref>
      <Button
        variant='ghost'
        className={cn(
          'text-sm font-medium h-auto py-2 px-3',
          isActive
            ? 'text-primary bg-primary/10'
            : 'text-foreground/80 hover:text-primary hover:bg-primary/5',
          className
        )}
        onClick={onClick}
      >
        {Icon && <Icon className='mr-2 h-4 w-4 shrink-0' />}
        {label}
      </Button>
    </Link>
  )

  const getNavLinks = () => {
    let links = [...baseNavLinks]
    if (isDonationFeatureEnabled) {
      links.push({ href: '/donate', label: 'Donate', icon: Gift })
    }
    return links
  }

  const renderNavLinks = (isMobile = false) => {
    const handleLinkClick = () => {
      if (isMobile) setIsMobileMenuOpen(false)
    }

    const mobileClass = isMobile
      ? 'w-full justify-start text-base py-3 px-4'
      : ''
    const currentNavLinks = getNavLinks()

    let linksToRender = currentNavLinks.map((link) => (
      <NavLinkItem
        key={link.href}
        href={link.href}
        label={link.label}
        icon={link.icon}
        isActive={
          pathname === link.href ||
          (link.href === '/products' && pathname.startsWith('/products'))
        }
        onClick={handleLinkClick}
        className={mobileClass}
      />
    ))

    if (isLoggedIn) {
      if (currentUserRole === 'admin') {
        linksToRender.push(
          <NavLinkItem
            key='/admin/dashboard'
            href='/admin/dashboard'
            label='Admin Panel'
            icon={ShieldCheck}
            isActive={pathname.startsWith('/admin')}
            onClick={handleLinkClick}
            className={mobileClass}
          />
        )
      } else if (currentUserRole === 'institution') {
        linksToRender.push(
          <NavLinkItem
            key='/institution/dashboard'
            href='/institution/dashboard'
            label='Institution Hub'
            icon={LayoutDashboard}
            isActive={pathname.startsWith('/institution')}
            onClick={handleLinkClick}
            className={mobileClass}
          />
        )
      } else if (currentUserRole === 'dealer') {
        linksToRender.push(
          <NavLinkItem
            key='/dealer/dashboard'
            href='/dealer/dashboard'
            label='Dealer Portal'
            icon={Briefcase}
            isActive={pathname.startsWith('/dealer')}
            onClick={handleLinkClick}
            className={mobileClass}
          />
        )
      }
    }
    return linksToRender
  }

  if (!isClient) {
    return (
      <header className='sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
          <Logo />
          <div className='flex items-center space-x-2'>
            <div className='h-9 w-9 animate-pulse rounded-md bg-muted'></div>{' '}
            {/* Cart placeholder */}
            <div className='h-9 w-9 animate-pulse rounded-md bg-muted'></div>{' '}
            {/* User placeholder */}
            <div className='h-9 w-9 animate-pulse rounded-md bg-muted md:hidden'></div>{' '}
            {/* Mobile menu placeholder */}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 md:px-6'>
        <Logo />

        <nav className='hidden md:flex items-center space-x-1 lg:space-x-1'>
          {renderNavLinks()}
        </nav>

        <div className='flex items-center space-x-2 md:space-x-3'>
          {currentUserRole !== 'institution' &&
            currentUserRole !== 'dealer' && (
              <Link href='/cart' passHref>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Shopping Cart'
                  className='relative'
                >
                  <ShoppingCart className='h-5 w-5' />
                  {cartItemCount > 0 && (
                    <Badge
                      variant='destructive'
                      className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full'
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='px-2 py-1 h-auto md:px-3 md:py-2'
                >
                  <UserIcon className='h-5 w-5 md:mr-1.5' />
                  <span className='hidden md:inline text-sm font-medium'>
                    {currentUserName || 'Account'}
                  </span>
                  <ChevronDown className='ml-1 h-4 w-4 opacity-70 hidden md:inline' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-56'>
                {currentUserName && (
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        Hi, {currentUserName}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground capitalize'>
                        {currentUserRole}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href='/profile'
                    className='flex items-center gap-2 py-2'
                  >
                    <UserIcon className='h-4 w-4 text-muted-foreground' /> My
                    Profile
                  </Link>
                </DropdownMenuItem>

                {currentUserRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link
                      href='/admin/dashboard'
                      className='flex items-center gap-2 py-2'
                    >
                      <ShieldCheck className='h-4 w-4 text-muted-foreground' />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                {currentUserRole === 'institution' && (
                  <DropdownMenuItem asChild>
                    <Link
                      href='/institution/dashboard'
                      className='flex items-center gap-2 py-2'
                    >
                      <LayoutDashboard className='h-4 w-4 text-muted-foreground' />
                      Institution Hub
                    </Link>
                  </DropdownMenuItem>
                )}
                {currentUserRole === 'dealer' && (
                  <DropdownMenuItem asChild>
                    <Link
                      href='/dealer/dashboard'
                      className='flex items-center gap-2 py-2'
                    >
                      <Briefcase className='h-4 w-4 text-muted-foreground' />
                      Dealer Portal
                    </Link>
                  </DropdownMenuItem>
                )}

                {currentUserRole !== 'admin' &&
                  currentUserRole !== 'institution' &&
                  currentUserRole !== 'dealer' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/profile'
                          onClick={() => router.push('/profile?tab=orders')}
                          className='flex items-center gap-2 py-2'
                        >
                          <Package className='h-4 w-4 text-muted-foreground' />{' '}
                          Order History
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href='/profile'
                          onClick={() => router.push('/profile?tab=settings')}
                          className='flex items-center gap-2 py-2'
                        >
                          <Settings className='h-4 w-4 text-muted-foreground' />{' '}
                          Account Settings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoading}
                  className='text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2 py-2 cursor-pointer'
                >
                  <LogOutIcon className='h-4 w-4' />{' '}
                  {isLoading ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='hidden md:flex items-center gap-1'>
              <Button
                variant='ghost'
                asChild
                className='text-sm font-medium px-3'
              >
                <Link href='/login'>
                  <LogInIcon className='mr-1.5 h-4 w-4' /> Login
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='text-sm font-medium px-3'>
                    <UserPlus className='mr-1.5 h-4 w-4' /> Register{' '}
                    <ChevronDown className='ml-1 h-4 w-4 opacity-70' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuItem asChild>
                    <Link
                      href='/register/student'
                      className='flex items-center gap-2 py-2'
                    >
                      <GraduationCap className='h-4 w-4 text-muted-foreground' />{' '}
                      Student
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href='/register/institution'
                      className='flex items-center gap-2 py-2'
                    >
                      <Building className='h-4 w-4 text-muted-foreground' />{' '}
                      Institution
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href='/register/dealer'
                      className='flex items-center gap-2 py-2'
                    >
                      <Briefcase className='h-4 w-4 text-muted-foreground' />{' '}
                      Dealer
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className='md:hidden'>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Open navigation menu'
                >
                  <Menu className='h-6 w-6' />
                </Button>
              </SheetTrigger>
              <SheetContent
                side='right'
                className='w-full max-w-xs sm:max-w-sm p-0 flex flex-col'
              >
                <SheetHeader>
                  <SheetTitle className='sr-only'>Main Navigation</SheetTitle>
                </SheetHeader>
                <div className='flex h-16 items-center justify-between border-b px-6'>
                  <Logo onClick={() => setIsMobileMenuOpen(false)} />
                  <SheetClose asChild>
                    <Button variant='ghost' size='icon'>
                      <X className='h-5 w-5' />
                    </Button>
                  </SheetClose>
                </div>
                <nav className='mt-6 flex flex-col space-y-1 px-4 flex-grow'>
                  {renderNavLinks(true)}
                </nav>
                <div className='mt-auto border-t px-4 py-6 space-y-3'>
                  {isLoggedIn ? (
                    <>
                      {currentUserName && (
                        <div className='px-4 py-2 text-sm mb-2 border-b pb-4'>
                          <p className='font-medium'>Hi, {currentUserName}</p>
                          <p className='text-xs text-muted-foreground capitalize'>
                            {currentUserRole}
                          </p>
                        </div>
                      )}
                      <Button
                        className='w-full justify-start text-base py-3 px-4'
                        variant='ghost'
                        asChild
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          router.push('/profile')
                        }}
                      >
                        <Link href='/profile'>
                          <UserIcon className='mr-2 h-5 w-5' /> My Profile
                        </Link>
                      </Button>

                      {currentUserRole === 'institution' && (
                        <Button
                          className='w-full justify-start text-base py-3 px-4'
                          variant='ghost'
                          asChild
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            router.push('/institution/dashboard')
                          }}
                        >
                          <Link href='/institution/dashboard'>
                            <LayoutDashboard className='mr-2 h-5 w-5' />{' '}
                            Institution Dashboard
                          </Link>
                        </Button>
                      )}
                      {currentUserRole === 'dealer' && (
                        <Button
                          className='w-full justify-start text-base py-3 px-4'
                          variant='ghost'
                          asChild
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            router.push('/dealer/dashboard')
                          }}
                        >
                          <Link href='/dealer/dashboard'>
                            <Briefcase className='mr-2 h-5 w-5' /> Dealer Portal
                          </Link>
                        </Button>
                      )}

                      {currentUserRole !== 'admin' &&
                        currentUserRole !== 'institution' &&
                        currentUserRole !== 'dealer' && (
                          <>
                            <Button
                              className='w-full justify-start text-base py-3 px-4'
                              variant='ghost'
                              asChild
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                router.push('/profile?tab=orders')
                              }}
                            >
                              <Link href='/profile?tab=orders'>
                                <Package className='mr-2 h-5 w-5' /> Order
                                History
                              </Link>
                            </Button>
                            <Button
                              className='w-full justify-start text-base py-3 px-4'
                              variant='ghost'
                              asChild
                              onClick={() => {
                                setIsMobileMenuOpen(false)
                                router.push('/profile?tab=settings')
                              }}
                            >
                              <Link href='/profile?tab=settings'>
                                <Settings className='mr-2 h-5 w-5' /> Account
                                Settings
                              </Link>
                            </Button>
                          </>
                        )}
                      <Button
                        className='w-full justify-start text-base py-3 px-4 text-destructive hover:text-destructive'
                        variant='ghost'
                        onClick={handleLogout}
                        disabled={isLoading}
                      >
                        <LogOutIcon className='mr-2 h-5 w-5' />{' '}
                        {isLoading ? 'Logging out...' : 'Logout'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className='w-full justify-start text-base py-3 px-4'
                        variant='default'
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link href='/login'>
                          <LogInIcon className='mr-2 h-5 w-5' /> Login
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className='w-full justify-start text-base py-3 px-4'
                            variant='outline'
                          >
                            <UserPlus className='mr-2 h-5 w-5' /> Register{' '}
                            <ChevronDown className='ml-auto h-4 w-4 opacity-70' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          side='top'
                          className='w-[calc(100%-2rem)] mb-2'
                        >
                          <DropdownMenuItem
                            asChild
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link
                              href='/register/student'
                              className='flex items-center gap-2 py-2'
                            >
                              <GraduationCap className='h-4 w-4 text-muted-foreground' />{' '}
                              Student
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link
                              href='/register/institution'
                              className='flex items-center gap-2 py-2'
                            >
                              <Building className='h-4 w-4 text-muted-foreground' />{' '}
                              Institution
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Link
                              href='/register/dealer'
                              className='flex items-center gap-2 py-2'
                            >
                              <Briefcase className='h-4 w-4 text-muted-foreground' />{' '}
                              Dealer
                            </Link>
                          </DropdownMenuItem>
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
  )
}

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ')
