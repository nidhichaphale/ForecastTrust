import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full h-9 rounded-lg bg-[#0b172a] border border-[#1a2e4c] text-sm text-slate-100 pl-3 pr-8 appearance-none',
              'transition-colors duration-150 cursor-pointer',
              'focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-red-500/80',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0b172a] text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="text-xs text-red-400 pl-1">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
