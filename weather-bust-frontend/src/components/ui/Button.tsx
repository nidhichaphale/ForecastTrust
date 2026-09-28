import React from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 disabled:opacity-50 disabled:pointer-events-none select-none'

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
      md: 'h-9 px-4 text-sm gap-2 rounded-lg',
      lg: 'h-11 px-5 text-base gap-2.5 rounded-lg',
    }

    const variantStyles = {
      primary:
        'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-sm shadow-sky-950/50 active:bg-sky-600',
      secondary:
        'bg-[#10213d] hover:bg-[#172c50] text-slate-100 border border-[#1a2e4c] active:bg-[#1e3860]',
      outline:
        'bg-transparent hover:bg-[#10213d] text-slate-200 border border-[#1a2e4c] active:bg-[#172c50]',
      ghost:
        'bg-transparent hover:bg-[#10213d] text-slate-300 hover:text-white active:bg-[#172c50]',
      danger:
        'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 active:bg-red-500/30',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
