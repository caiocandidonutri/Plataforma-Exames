import React from 'react'
import { cn } from '@/lib/utils'

interface ReferenceBarProps {
  value: number
  min: number
  max: number
}

export function ReferenceBar({ value, min, max }: ReferenceBarProps) {
  const span = max - min || min
  const visualMin = min - span
  const visualMax = max + span
  const totalSpan = visualMax - visualMin

  const valuePercent = Math.max(0, Math.min(100, ((value - visualMin) / totalSpan) * 100))
  const minPercent = ((min - visualMin) / totalSpan) * 100
  const maxPercent = ((max - visualMin) / totalSpan) * 100

  const isLow = value < min
  const isHigh = value > max
  const isNormal = !isLow && !isHigh

  return (
    <div className="w-full flex flex-col gap-1 mt-2">
      <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        {/* Normal Range Highlight */}
        <div
          className="absolute h-full bg-emerald-100 dark:bg-emerald-900/30 border-x border-emerald-300 dark:border-emerald-700"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />

        {/* Value Indicator */}
        <div
          className={cn(
            'absolute h-full w-2 -ml-1 rounded-full shadow-sm transition-all duration-700 ease-out',
            isNormal ? 'bg-emerald-500' : isLow ? 'bg-amber-500' : 'bg-rose-500',
          )}
          style={{ left: `${valuePercent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1">
        <span></span>
        <div
          className="flex w-full justify-between"
          style={{ paddingLeft: `${minPercent}%`, paddingRight: `${100 - maxPercent}%` }}
        >
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}
