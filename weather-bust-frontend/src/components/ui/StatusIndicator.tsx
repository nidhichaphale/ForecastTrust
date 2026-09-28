import React from 'react'
import { cn } from '../../utils/cn'

export type StatusType = 'low' | 'moderate' | 'high' | 'severe' | 'operational' | 'neutral';

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: StatusType;
  label?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  className,
  status = 'operational',
  label,
  pulse = true,
  ...props
}) => {
  const colorMap: Record<StatusType, { dot: string; ping: string; text: string }> = {
    operational: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-400',
      text: 'text-emerald-400',
    },
    low: {
      dot: 'bg-emerald-400',
      ping: 'bg-emerald-400',
      text: 'text-emerald-400',
    },
    moderate: {
      dot: 'bg-amber-400',
      ping: 'bg-amber-400',
      text: 'text-amber-400',
    },
    high: {
      dot: 'bg-orange-400',
      ping: 'bg-orange-400',
      text: 'text-orange-400',
    },
    severe: {
      dot: 'bg-red-400',
      ping: 'bg-red-400',
      text: 'text-red-400',
    },
    neutral: {
      dot: 'bg-slate-400',
      ping: 'bg-slate-400',
      text: 'text-slate-400',
    },
  }

  const { dot, ping, text } = colorMap[status]

  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)} {...props}>
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              ping
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-2 w-2', dot)} />
      </span>
      {label && <span className={cn('text-xs font-medium', text)}>{label}</span>}
    </div>
  )
}
