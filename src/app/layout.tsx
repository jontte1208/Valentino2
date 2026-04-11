import type { Metadata } from 'next'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Valentino — Autentisk Italiensk Restaurang i Stockholm',
  description:
    'Valentino — Autentisk italiensk restaurang i Stockholm. Njut av färsk pasta, pizza och traditionella rätter i en varm och välkomnande miljö sedan 1998.',
  keywords: 'italiensk restaurang, pizza, pasta, Stockholm, Valentino, lunch, middag',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
