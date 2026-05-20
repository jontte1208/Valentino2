'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface ConditionalLayoutProps {
  navbar: ReactNode
  footer: ReactNode
  children: ReactNode
}

export default function ConditionalLayout({
  navbar,
  footer,
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname.startsWith('/studio')

  if (isStudioRoute) {
    return <>{children}</>
  }

  return (
    <>
      {navbar}
      <main>{children}</main>
      {footer}
    </>
  )
}
