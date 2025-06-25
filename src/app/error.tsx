'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-muted px-4'>
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
        <AlertTriangle className='mx-auto h-12 w-12 text-red-500 mb-4' />
        <h1 className='text-2xl font-bold mb-2'>Something went wrong</h1>
        <p className='text-muted-foreground mb-6'>
          An unexpected error occurred. Please try again or return to the
          homepage.
        </p>
        <Button onClick={() => reset()} className='mb-2 w-full'>
          Try Again
        </Button>
        <Button asChild variant='outline' className='w-full'>
          <Link href='/'>Go to Homepage</Link>
        </Button>
        <details
          className='mt-4 text-xs text-muted-foreground whitespace-pre-wrap'
          style={{ wordBreak: 'break-all' }}
        >
          {error?.message}
        </details>
      </div>
    </div>
  )
}
