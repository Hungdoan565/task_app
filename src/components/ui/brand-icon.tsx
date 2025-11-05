import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: {
    container: 'h-9 w-9 rounded-lg',
    icon: 'h-4 w-4',
  },
  md: {
    container: 'h-12 w-12 rounded-xl',
    icon: 'h-5 w-5',
  },
  lg: {
    container: 'h-16 w-16 rounded-2xl',
    icon: 'h-7 w-7',
  },
} as const

const variantClasses = {
  indigo: 'bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20',
  purple: 'bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20',
  blue: 'bg-sky-50 text-sky-600 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20',
  green: 'bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20',
  orange: 'bg-orange-50 text-orange-600 ring-orange-100 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/20',
  pink: 'bg-pink-50 text-pink-600 ring-pink-100 dark:bg-pink-500/10 dark:text-pink-300 dark:ring-pink-500/20',
  slate: 'bg-slate-50 text-slate-600 ring-slate-100 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-500/20',
} as const

type BrandIconVariant = keyof typeof variantClasses
type BrandIconSize = keyof typeof sizeClasses

interface BrandIconProps {
  icon: LucideIcon
  variant?: BrandIconVariant
  size?: BrandIconSize
  className?: string
  iconClassName?: string
}

export function BrandIcon({
  icon: Icon,
  variant = 'indigo',
  size = 'md',
  className,
  iconClassName,
}: BrandIconProps) {
  const sizeTokens = sizeClasses[size]

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center ring-1 ring-inset transition-colors',
        sizeTokens.container,
        variantClasses[variant],
        className,
      )}
    >
      <Icon className={cn('stroke-[1.5]', sizeTokens.icon, iconClassName)} />
    </div>
  )
}

export default BrandIcon


