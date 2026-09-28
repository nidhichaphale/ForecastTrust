import React from 'react'
import { cn } from '../../utils/cn'

interface SettingFieldProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  layout?: 'horizontal' | 'vertical'
}

export const SettingField: React.FC<SettingFieldProps> = ({
  title,
  description,
  children,
  className,
  layout = 'horizontal',
}) => {
  return (
    <div
      className={cn(
        'py-4 border-b border-[#1a2e4c]/60 last:border-b-0 transition-colors',
        layout === 'horizontal'
          ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'
          : 'flex flex-col gap-3',
        className
      )}
    >
      <div className="space-y-1 max-w-xl">
        <label className="text-xs font-semibold text-slate-200 block">
          {title}
        </label>
        {description && (
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 flex items-center">{children}</div>
    </div>
  )
}
