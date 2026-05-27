'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

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

  // reducedMotion="user" → respekterar OS-inställningen prefers-reduced-motion.
  // Animationer på sajten degraderas automatiskt till statiska tillstånd.
  return (
    <MotionConfig reducedMotion="user">
      {navbar}
      <main>{children}</main>
      {footer}
    </MotionConfig>
  )
}
