import React from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sky' | 'cyan' | 'low' | 'moderate' | 'high' | 'severe' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  }

  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    sky: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
    low: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    moderate: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    high: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
    severe: 'bg-red-500/10 text-red-400 border border-red-500/30',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full select-none leading-none tracking-tight',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
