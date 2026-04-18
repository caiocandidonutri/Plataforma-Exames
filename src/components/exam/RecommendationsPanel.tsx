import React from 'react'
import { Recommendation } from '@/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Activity, Apple, Lightbulb, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react'

export function RecommendationsPanel({ recommendations }: { recommendations: Recommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border-l bg-slate-50/50 dark:bg-slate-900/50">
        <ShieldAlert className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
        <p className="text-muted-foreground font-medium">Nenhuma análise disponível.</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Gere a análise diagnóstica para visualizar as recomendações estruturadas.
        </p>
      </div>
    )
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />
      case 'Média':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Nutricional':
        return <Apple className="w-3 h-3 mr-1" />
      case 'Médica':
        return <Activity className="w-3 h-3 mr-1" />
      default:
        return <Lightbulb className="w-3 h-3 mr-1" />
    }
  }

  return (
    <div className="h-full border-l bg-slate-50/30 dark:bg-slate-900/30 flex flex-col">
      <div className="p-4 border-b bg-card">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Inteligência Diagnóstica
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Recomendações baseadas nos desvios encontrados.
        </p>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {recommendations.map((rec, i) => (
          <Alert
            key={rec.id}
            className="animate-fade-in-up bg-card"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {getPriorityIcon(rec.priority)}
            <AlertTitle className="flex items-center gap-2 mt-[-2px]">
              Recomendação {rec.priority}
              <Badge
                variant="outline"
                className="ml-auto text-[10px] h-5 px-1.5 font-normal flex items-center bg-transparent"
              >
                {getTypeIcon(rec.type)}
                {rec.type}
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm text-foreground/80 leading-relaxed">
              {rec.text}
              <div className="mt-3 text-[10px] text-muted-foreground/70 font-medium">
                Fonte: {rec.source}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <div className="p-4 bg-muted/50 border-t mt-auto text-xs text-muted-foreground text-center">
        Consulte um profissional de saúde para interpretação completa e plano de tratamento
        individualizado.
      </div>
    </div>
  )
}
