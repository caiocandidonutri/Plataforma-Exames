import React from 'react'
import { ResultItem } from '@/types'
import { ReferenceBar } from '@/components/ReferenceBar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ResultCard({ item }: { item: ResultItem }) {
  const isLow = item.value < item.refMin
  const isHigh = item.value > item.refMax
  const isAbnormal = isLow || isHigh

  return (
    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all group animate-fade-in-up">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              !isAbnormal ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse',
            )}
          />
          <h4 className="font-semibold text-sm">{item.name}</h4>
        </div>

        {item.interpretation && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={cn(
                    'w-5 h-5 shrink-0',
                    isAbnormal ? 'text-amber-500' : 'text-emerald-500',
                  )}
                />
                <div>
                  <h5 className="font-semibold text-sm mb-1">Interpretação Diagnóstica</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.interpretation}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-2">
        <span
          className={cn(
            'text-2xl font-bold tracking-tight',
            isAbnormal && 'text-rose-600 dark:text-rose-400',
          )}
        >
          {item.value}
        </span>
        <span className="text-sm text-muted-foreground">{item.unit}</span>
      </div>

      <ReferenceBar value={item.value} min={item.refMin} max={item.refMax} />
    </div>
  )
}
