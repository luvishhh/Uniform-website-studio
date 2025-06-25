'use client'
import InstitutionSidebar from '@/components/institution/InstitutionSidebar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Link from 'next/link'

const institutionNavItems = [
  { href: '/institution/dashboard', label: 'Dashboard' },
  { href: '/institution/student-purchases', label: 'Student Purchases' },
  { href: '/institution/registered-students', label: 'Registered Students' },
  { href: '/profile?tab=settings', label: 'Account Settings' },
]

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const role =
      typeof window !== 'undefined'
        ? localStorage.getItem('unishop_user_role')
        : null
    if (role === 'institution') {
      setIsAuthorized(true)
    } else {
      toast({
        title: 'Access Denied',
        description:
          'You must be logged in as an institution to view this page.',
        variant: 'destructive',
      })
      router.replace('/login') // Or '/'
    }
    setIsLoading(false)
  }, [router, toast])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary'></div>
        <p className='ml-4 text-muted-foreground'>Verifying access...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Or a message, but redirection should handle it.
  }

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Mobile menu bar */}
      <div className='md:hidden flex items-center p-4 border-b bg-sidebar'>
        <Sheet>
          <SheetTrigger asChild>
            <button aria-label='Open menu'>
              <Menu className='h-7 w-7 text-primary' />
            </button>
          </SheetTrigger>
          <SheetContent side='left' className='p-0 w-64'>
            <SheetHeader>
              <SheetTitle className='sr-only'>Institution Hub</SheetTitle>
            </SheetHeader>
            <InstitutionSidebar mobile />
          </SheetContent>
        </Sheet>
        <span className='ml-3 text-xl font-semibold font-headline'>
          Institution Hub
        </span>
      </div>
      <div className='flex flex-1'>
        <InstitutionSidebar />
        <main className='flex-1 p-6 md:p-8 bg-muted/30 overflow-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}
