'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import type {
  InstitutionUser,
  Order,
  Product,
  StudentUser,
  User,
  CartItem,
} from '@/types'
import { mockOrders, mockUsers, mockProducts } from '@/lib/mockData'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const getInitials = (name: string = '') => {
  if (!name) return 'U'
  const names = name.split(' ')
  return (
    names
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'
  )
}

type StudentPurchaseDetails = Order & {
  student?: StudentUser
  institutionItems: CartItem[]
}

export default function StudentPurchasesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<InstitutionUser | null>(null)
  const [studentPurchases, setStudentPurchases] = useState<
    StudentPurchaseDetails[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInstitutionData = async () => {
      setIsLoading(true)
      const storedUserId =
        typeof window !== 'undefined'
          ? localStorage.getItem('unishop_user_id')
          : null
      const storedUserRole =
        typeof window !== 'undefined'
          ? localStorage.getItem('unishop_user_role')
          : null

      if (storedUserId && storedUserRole === 'institution') {
        try {
          const userRes = await fetch(`/api/user/${storedUserId}`)
          if (userRes.ok) {
            const userData: InstitutionUser = await userRes.json()
            setCurrentUser(userData)
          } else {
            toast({
              title: 'Error',
              description: 'Failed to load institution data.',
              variant: 'destructive',
            })
            router.push('/login')
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Could not connect to server for institution data.',
            variant: 'destructive',
          })
          router.push('/login')
        }
      } else {
        toast({
          title: 'Access Denied',
          description: 'You are not logged in as an institution.',
          variant: 'destructive',
        })
        router.push('/login')
      }
      // setIsLoading(false); // Moved to after studentPurchases calculation
    }
    fetchInstitutionData()
  }, [router, toast])

  useEffect(() => {
    if (currentUser && currentUser.institutionName) {
      const institutionNameLower = currentUser.institutionName.toLowerCase()
      const purchases: StudentPurchaseDetails[] = []

      mockOrders.forEach((order) => {
        const studentUser = mockUsers.find((u) => u.id === order.userId) as
          | StudentUser
          | undefined

        if (
          studentUser &&
          studentUser.role === 'student' &&
          studentUser.schoolCollegeName?.toLowerCase() === institutionNameLower
        ) {
          const institutionItemsInOrder: CartItem[] = []
          order.items.forEach((item) => {
            const productDetails = mockProducts.find(
              (p) => p.id === item.productId
            )
            if (
              productDetails &&
              productDetails.institution?.toLowerCase() === institutionNameLower
            ) {
              institutionItemsInOrder.push(item)
            }
          })

          if (institutionItemsInOrder.length > 0) {
            purchases.push({
              ...order,
              student: studentUser,
              institutionItems: institutionItemsInOrder,
            })
          }
        }
      })
      setStudentPurchases(
        purchases.sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
      )
    }
    setIsLoading(false) // Set loading to false after calculations
  }, [currentUser])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-full min-h-[calc(100vh-10rem)]'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        <p className='ml-3 text-muted-foreground'>
          Loading student purchases...
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center gap-3'>
            <ShoppingCart className='h-8 w-8 text-primary' />
            <div>
              <CardTitle className='text-2xl font-bold font-headline'>
                Student Uniform Purchases for{' '}
                {currentUser?.institutionName || 'Your Institution'}
              </CardTitle>
              <CardDescription>
                View orders placed by your students for your institution's
                uniforms.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {studentPurchases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Institution Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Order Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className='font-medium'>
                      <Button variant='link' asChild className='p-0 h-auto'>
                        <Link
                          href={`/admin/orders/${purchase.id}`}
                          title='View Order Details (Admin View)'
                        >
                          #{purchase.id.substring(0, 8)}...
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {purchase.student ? (
                        <div className='flex items-center gap-2'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={
                                purchase.student.imageUrl ||
                                `https://placehold.co/32x32.png?text=${getInitials(
                                  purchase.student.fullName
                                )}`
                              }
                              alt={purchase.student.fullName}
                              data-ai-hint='student avatar'
                            />
                            <AvatarFallback>
                              {getInitials(purchase.student.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className='font-medium'>
                            {purchase.student.fullName}
                          </span>
                        </div>
                      ) : (
                        <span className='text-muted-foreground'>N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {purchase.student?.rollNumber || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(purchase.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <ul className='list-disc list-inside text-xs'>
                        {purchase.institutionItems.map((item, idx) => (
                          <li
                            key={idx}
                            className='truncate'
                            title={`${item.name} (Qty: ${item.quantity})`}
                          >
                            {item.name} (Qty: {item.quantity})
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          purchase.status === 'Delivered'
                            ? 'default'
                            : purchase.status === 'Cancelled'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={`capitalize text-xs ${
                          purchase.status === 'Delivered'
                            ? 'bg-green-600 text-white'
                            : purchase.status === 'Shipped'
                            ? 'bg-blue-500 text-white'
                            : ''
                        }`}
                      >
                        {purchase.status}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right font-medium'>
                      ${purchase.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className='text-center py-10'>
              <UserCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
              <p className='text-muted-foreground'>
                No students from{' '}
                {currentUser?.institutionName || 'your institution'} have
                purchased uniforms yet, or no orders match the criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
