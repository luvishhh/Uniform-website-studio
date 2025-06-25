import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import AppProviders from '@/components/AppProviders'
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE',
  tracesSampleRate: 1.0,
  // Add more config as needed
})

export const metadata: Metadata = {
  title: 'UniShop - Your Uniform Destination',
  description:
    'Seamless, user-friendly, and secure online shopping for school, corporate, and healthcare uniforms.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='font-body antialiased min-h-screen flex flex-col'>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  )
}
