'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockOrders } from '@/lib/mockData'
import { Search, Filter, PackageCheck, Eye } from 'lucide-react'
import Link from 'next/link'
import React from 'react' // Moved React import to the top for consistency

export default function AdminOrdersPage() {
  // Mock logic for filtering/searching
  const orders = mockOrders

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold font-headline'>Manage Orders</h1>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label
                htmlFor='search-order'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Search by Order ID or Customer
              </label>
              <div className='relative'>
                <Input
                  type='text'
                  id='search-order'
                  placeholder='Order ID, Customer Name/Email...'
                  className='pl-10'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
              </div>
            </div>
            <div>
              <label
                htmlFor='status-filter'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Filter by Status
              </label>
              <Select>
                <SelectTrigger id='status-filter'>
                  <SelectValue placeholder='All Statuses' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  <SelectItem value='Placed'>Placed</SelectItem>
                  <SelectItem value='Confirmed'>Confirmed</SelectItem>
                  <SelectItem value='Shipped'>Shipped</SelectItem>
                  <SelectItem value='Delivered'>Delivered</SelectItem>
                  <SelectItem value='Cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor='date-filter'
                className='block text-sm font-medium text-foreground mb-1'
              >
                Filter by Date Range
              </label>
              <Input type='date' id='date-filter' />
              {/* This would ideally be a date range picker */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='font-medium'>
                    #{order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {order.shippingAddress.name} <br />
                    <span className='text-xs text-muted-foreground'>
                      {order.shippingAddress.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toISOString().split('T')[0]}
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : order.status === 'Placed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'Confirmed'
                          ? 'bg-purple-100 text-purple-700'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='sm' className='mr-2' asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className='h-4 w-4 mr-1' /> View
                      </Link>
                    </Button>
                    {order.status !== 'Shipped' &&
                      order.status !== 'Delivered' &&
                      order.status !== 'Cancelled' && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            alert(`Mark order ${order.id} as Shipped (Mock)`)
                          }
                        >
                          <PackageCheck className='h-4 w-4 mr-1' /> Mark Shipped
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && (
            <p className='text-center text-muted-foreground py-8'>
              No orders found.
            </p>
          )}
        </CardContent>
      </Card>
      {/* Order Tracker Progress Bar (example for one order) */}
      {orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Order Tracker Example (Order: #{orders[0].id.substring(0, 8)})
            </CardTitle>
            <CardDescription>Visual progress of an order.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-2'>
              {['Placed', 'Confirmed', 'Shipped', 'Delivered'].map(
                (status, index, arr) => {
                  const isActive = status === orders[0].status
                  const isCompleted =
                    ['Placed', 'Confirmed', 'Shipped', 'Delivered'].indexOf(
                      orders[0].status
                    ) >= index
                  return (
                    <React.Fragment key={status}>
                      <div className='flex flex-col items-center'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isActive || isCompleted
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-muted border-border text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? (
                            <PackageCheck className='h-4 w-4' />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${
                            isActive
                              ? 'font-semibold text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                      {index < arr.length - 1 && (
                        <div
                          className={`flex-1 h-1 ${
                            isCompleted ? 'bg-primary' : 'bg-border'
                          }`}
                        ></div>
                      )}
                    </React.Fragment>
                  )
                }
              )}
            </div>
            <div className='mt-4'>
              <Button
                disabled={
                  orders[0].status === 'Shipped' ||
                  orders[0].status === 'Delivered'
                }
              >
                Mark as Shipped
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
