'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps = {}) {
  const pathname = usePathname()
  const isInterview = pathname === '/interview'

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm border-b z-50">
      <nav className="container mx-auto flex h-16 items-center justify-between" aria-label="Main navigation">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="text-2xl font-bold hover:text-primary transition-colors"
            aria-label="Ventro home"
          >
            Ventro
          </Link>
        </div>
        {!isInterview && (
          <div className="flex items-center gap-4">
            <Link href="/interview">
              <Button>
                Start Interview
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
} 