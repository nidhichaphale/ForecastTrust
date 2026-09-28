import React from 'react'
import { cn } from '../../utils/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  className,
  orientation = 'horizontal',
  label,
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn('inline-block w-px self-stretch bg-[#1a2e4c]', className)}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div className={cn('relative flex py-2 items-center w-full', className)} {...props}>
        <div className="flex-grow border-t border-[#1a2e4c]" />
        <span className="flex-shrink mx-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className="flex-grow border-t border-[#1a2e4c]" />
      </div>
    )
  }

  return <hr className={cn('border-0 border-t border-[#1a2e4c] w-full my-3', className)} {...props} />
}
