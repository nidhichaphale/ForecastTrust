import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Divider } from '../ui/Divider'
import { CloudRain, MapPin, Activity, BarChart3, AlertTriangle, Eye } from 'lucide-react'

interface SummaryItem {
  label: string
  value: string | number
  unit?: string
  icon: React.ComponentType<{ className?: string }>
  iconClass?: string
}

interface ForecastOperationalSummaryProps {
  items: SummaryItem[]
  date: string
}

export const ForecastOperationalSummary: React.FC<ForecastOperationalSummaryProps> = ({
  items,
  date,
}) => {
  return (
    <Card>
      <CardContent className="py-3 px-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
          <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider shrink-0">
            Operational Coverage · {date}
          </div>
          <Divider orientation="vertical" className="h-4 hidden sm:block" />
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <React.Fragment key={item.label}>
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${item.iconClass ?? 'text-sky-400'}`} />
                  <span className="text-slate-400">{item.label}:</span>
                  <span className="font-mono font-semibold text-slate-100">
                    {item.value}{item.unit ? ` ${item.unit}` : ''}
                  </span>
                </div>
                {idx < items.length - 1 && (
                  <Divider orientation="vertical" className="h-3 hidden md:block" />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Export icon helpers for use in Dashboard
export { CloudRain, MapPin, Activity, BarChart3, AlertTriangle, Eye }
