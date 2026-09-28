import React from 'react'
import { cn } from '../../utils/cn'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', icon, 'aria-label': ariaLabel, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:opacity-50 disabled:pointer-events-none rounded-lg'

    const sizeStyles = {
      sm: 'w-7 h-7 text-xs',
      md: 'w-9 h-9 text-sm',
      lg: 'w-10 h-10 text-base',
    }

    const variantStyles = {
      primary: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
      secondary: 'bg-[#10213d] hover:bg-[#172c50] text-slate-200 border border-[#1a2e4c]',
      outline: 'border border-[#1a2e4c] hover:bg-[#10213d] text-slate-300 hover:text-white',
      ghost: 'text-slate-400 hover:text-slate-100 hover:bg-[#10213d]',
    }

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
