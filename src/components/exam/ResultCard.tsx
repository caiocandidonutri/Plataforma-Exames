import React from 'react'
import { ResultItem } from '@/types'
import { ReferenceBar } from '@/components/ReferenceBar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AlertCircle, Info, ActivitySquare, Network } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ResultCard({ item }: { item: ResultItem }) {
  const isLow = item.value < item.refMin
  const isHigh = item.value > item.refMax
  const isAbnormal = isLow || isHigh

  const severityColors = {
    alto: 'bg-rose-500 text-rose-600 dark:text-rose-400',
    moderado: 'bg-amber-500 text-amber-600 dark:text-amber-400',
    baixo: 'bg-yellow-400 text-yellow-500 dark:text-yellow-400',
    normal: 'bg-emerald-500 text-foreground',
  }

  const severity = item.severity || (isAbnormal ? 'moderado' : 'normal')
  const colorClass = severityColors[severity]
  const isCritical = severity === 'alto'

  return (
    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all group animate-fade-in-up">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              colorClass.split(' ')[0],
              isCritical && 'animate-pulse',
            )}
          />
          <h4 className="font-semibold text-sm">{item.name}</h4>
        </div>

        {(item.interpretation || item.differentialDiagnoses?.length) && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4 z-50">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className={cn(
                    'w-5 h-5 shrink-0',
                    isAbnormal ? 'text-amber-500' : 'text-emerald-500',
                  )}
                />
                <div className="space-y-3">
                  {item.interpretation && (
                    <div>
                      <h5 className="font-semibold text-sm mb-1">Interpretação Diagnóstica</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.interpretation}
                      </p>
                    </div>
                  )}

                  {item.differentialDiagnoses && item.differentialDiagnoses.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                        <ActivitySquare className="w-3.5 h-3.5" /> Diagnósticos Diferenciais
                      </h5>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                        {item.differentialDiagnoses.map((diag, i) => (
                          <li key={i}>{diag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.relatedExams && item.relatedExams.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-sm mb-1 flex items-center gap-1.5">
                        <Network className="w-3.5 h-3.5" /> Relações com Outros Exames
                      </h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.relatedExams.map((rel, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] font-medium"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
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
            isAbnormal && colorClass.split(' ').slice(1).join(' '),
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
