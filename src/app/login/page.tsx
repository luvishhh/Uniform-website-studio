'use client'

import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

type LoginRole = 'student' | 'institution' | 'dealer'

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loginRole, setLoginRole] = useState<LoginRole>('student')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const emailOrRoll = formData.get(
      loginRole === 'student' ? 'rollNumber' : 'email'
    ) as string
    const password = formData.get('password') as string

    const payload = {
      identifier: emailOrRoll,
      password: password,
      role: loginRole,
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok && result.user) {
        const displayName =
          result.user.name ||
          result.user.fullName ||
          result.user.institutionName ||
          result.user.dealerName ||
          'User'
        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${displayName}! Redirecting...`,
        })

        if (typeof window !== 'undefined') {
          localStorage.setItem('unishop_user_role', result.user.role)
          localStorage.setItem('unishop_user_displayName', displayName)
          localStorage.setItem('unishop_user_id', result.user.id)
          window.dispatchEvent(new CustomEvent('authChange'))
        }

        if (result.user.role === 'institution') {
          router.push('/institution/dashboard')
        } else if (result.user.role === 'dealer') {
          router.push('/dealer/dashboard')
        } else {
          router.push('/')
        }
        router.refresh()
      } else {
        toast({
          title: 'Login Failed',
          description:
            result.message || 'Invalid credentials or an error occurred.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Login Error',
        description: 'Could not connect to the server. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container mx-auto px-4 md:px-6 py-12 flex items-center justify-center'>
        <Card className='w-full max-w-md shadow-xl'>
          <CardHeader className='text-center'>
            <LogIn className='mx-auto h-12 w-12 text-primary mb-3' />
            <CardTitle className='text-3xl font-bold font-headline'>
              Login to UniShop
            </CardTitle>
            <CardDescription>Access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <Label className='mb-2 block font-medium'>Login as:</Label>
                <RadioGroup
                  name='loginRole'
                  value={loginRole}
                  onValueChange={(value: string) =>
                    setLoginRole(value as LoginRole)
                  }
                  className='grid grid-cols-2 gap-x-4 gap-y-2'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='student' id='role-student' />
                    <Label htmlFor='role-student'>Student</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='institution' id='role-institution' />
                    <Label htmlFor='role-institution'>Institution</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='dealer' id='role-dealer' />
                    <Label htmlFor='role-dealer'>Dealer</Label>
                  </div>
                </RadioGroup>
              </div>

              {loginRole === 'student' ? (
                <div>
                  <Label htmlFor='rollNumber'>Roll Number</Label>
                  <Input
                    id='rollNumber'
                    name='rollNumber'
                    placeholder='Enter your Roll Number'
                    required
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor='email'>Email Address</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Enter your Email Address'
                    required
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className='relative'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  required
                  disabled={isLoading}
                  className='pr-10'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-1 top-1/2 h-7 w-7 mt-3 text-muted-foreground hover:text-foreground'
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </Button>
              </div>

              <Button
                type='submit'
                size='lg'
                className='w-full bg-primary hover:bg-primary/90 text-primary-foreground'
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className='text-sm text-center text-muted-foreground space-y-1'>
                <p>
                  Don&apos;t have an account? Register as a{' '}
                  <Link
                    href='/register/student'
                    className='font-medium text-primary hover:underline'
                  >
                    Student
                  </Link>
                  ,{' '}
                  <Link
                    href='/register/institution'
                    className='font-medium text-primary hover:underline'
                  >
                    Institution
                  </Link>
                  , or{' '}
                  <Link
                    href='/register/dealer'
                    className='font-medium text-primary hover:underline'
                  >
                    Dealer
                  </Link>
                  .
                </p>
                <p>
                  <Link
                    href='/forgot-password'
                    className='font-medium text-primary hover:underline text-xs'
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
