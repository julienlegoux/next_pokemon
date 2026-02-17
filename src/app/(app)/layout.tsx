'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { Navbar } from '@/components/ui/Navbar'
import { MobileNav } from '@/components/ui/MobileNav'
import { ToastProvider } from '@/components/ui/Toast'
import type { ReactNode } from 'react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ToastProvider>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 60px)', padding: '24px 20px', paddingBottom: '80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </main>
        <MobileNav />
      </ToastProvider>
    </AuthGuard>
  )
}
