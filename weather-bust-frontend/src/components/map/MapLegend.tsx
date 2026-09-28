import React from 'react'

interface MapLegendProps {
  className?: string
}

const LEGEND_ITEMS = [
  { label: 'Low Risk', color: '#22c55e', stroke: '#15803d' },
  { label: 'Moderate Risk', color: '#eab308', stroke: '#a16207' },
  { label: 'High Risk', color: '#ea580c', stroke: '#9a3412' },
  { label: 'Severe Risk', color: '#dc2626', stroke: '#991b1b' },
]

export const MapLegend: React.FC<MapLegendProps> = ({ className }) => {
  return (
    <div
      className={`rounded-lg px-3 py-2.5 ${className ?? ''}`}
      style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(0,0,0,0.15)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
        Forecast Risk
      </p>
      <div className="space-y-1.5">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: item.color,
                border: `2px solid ${item.stroke}`,
              }}
            />
            <span className="text-xs text-slate-700 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 mt-2 pt-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: '#dc2626', border: '2.5px solid white', boxShadow: '0 0 0 1.5px #dc2626' }}
          />
          <span className="text-xs text-slate-500 font-medium">Selected</span>
        </div>
      </div>
    </div>
  )
}
