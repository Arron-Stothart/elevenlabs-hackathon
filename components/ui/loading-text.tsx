import { cn } from '@/lib/utils'

interface LoadingTextProps {
  children: React.ReactNode
  className?: string
}

export function LoadingText({ children, className }: LoadingTextProps) {
  return (
    <span className={cn("animate-pulse", className)}>
      {children}
    </span>
  )
} 