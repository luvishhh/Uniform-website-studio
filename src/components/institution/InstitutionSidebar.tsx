'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/shared/Logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Settings,
  Building,
  LogOut,
  ListOrdered,
  Users,
} from 'lucide-react' // Added Users

const institutionNavItems = [
  { href: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/institution/student-purchases',
    label: 'Student Purchases',
    icon: ListOrdered,
  },
  {
    href: '/institution/registered-students',
    label: 'Registered Students',
    icon: Users,
  }, // New Item
  { type: 'separator' },
  { href: '/profile?tab=settings', label: 'Account Settings', icon: Settings },
]

export default function InstitutionSidebar({
  mobile = false,
}: { mobile?: boolean } = {}) {
  const pathname = usePathname()

  return (
    <aside
      className={
        mobile
          ? 'flex md:hidden w-full h-auto bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col'
          : 'sticky top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-col hidden md:flex'
      }
    >
      <div className='p-4 border-b border-sidebar-border flex items-center gap-2'>
        <Building className='h-7 w-7 ' />
        <span className='text-xl font-semibold font-headline'>
          Institution Hub
        </span>
      </div>
      <ScrollArea className='flex-1 px-3 py-4'>
        <nav className='space-y-1'>
          {institutionNavItems.map((item, index) =>
            item.type === 'separator' ? (
              <Separator
                key={`sep-${index}`}
                className='my-3 bg-sidebar-border/50'
              />
            ) : (
              <Link key={item.href} href={item.href!} passHref>
                <Button
                  variant='ghost'
                  className={`w-full justify-start text-sm h-10 px-3 ${
                    pathname === item.href ||
                    (item.href &&
                      pathname.startsWith(item.href) &&
                      item.href !== '/institution/dashboard' &&
                      item.href !== '/profile?tab=settings' &&
                      item.href !== '/institution/student-purchases' &&
                      item.href !== '/institution/registered-students')
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${
                    item.href === '/profile?tab=settings' &&
                    pathname === '/profile' &&
                    typeof window !== 'undefined' &&
                    new URLSearchParams(window.location.search).get('tab') ===
                      'settings'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                      : ''
                  } ${
                    item.href === '/institution/student-purchases' &&
                    pathname === '/institution/student-purchases'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                      : ''
                  }
                  ${
                    item.href === '/institution/registered-students' &&
                    pathname === '/institution/registered-students'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                      : ''
                  }
                  ${
                    item.href === '/institution/dashboard' &&
                    pathname === '/institution/dashboard'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                      : ''
                  }
                  `}
                >
                  {item.icon && <item.icon className='mr-2 h-4 w-4' />}
                  {item.label}
                </Button>
              </Link>
            )
          )}
        </nav>
      </ScrollArea>
      <div className='p-4 border-t border-sidebar-border mt-auto'>
        <Link href='/' passHref>
          <Button className='w-full justify-start text-sm h-10 px-3 bg-accent text-accent-foreground hover:bg-card hover:text-primary border border-sidebar-border'>
            <LogOut className='mr-2 h-4 w-4' />
            Exit Hub (Go Home)
          </Button>
        </Link>
      </div>
    </aside>
  )
}
