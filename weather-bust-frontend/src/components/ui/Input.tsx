import React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-9 rounded-lg bg-[#0b172a] border border-[#1a2e4c] text-sm text-slate-100 placeholder:text-slate-500',
              'transition-colors duration-150',
              'focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
