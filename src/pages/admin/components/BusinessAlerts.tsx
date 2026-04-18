import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, AlertCircle } from 'lucide-react'

export function BusinessAlerts({ subscribers, metrics }: { subscribers: any[]; metrics: any }) {
  const alerts = []

  if (metrics && metrics.churn_rate > 0.05) {
    alerts.push({
      title: 'Atenção ao Churn',
      description: `O Churn Rate atual está em ${(metrics.churn_rate * 100).toFixed(1)}%, acima da meta de 5%. Ação necessária para reter assinantes.`,
      type: 'destructive',
      icon: AlertTriangle,
    })
  }

  const highRisk = subscribers.filter((s: any) => s.status === 'ativo' && s.risco_churn === 'alto')
  if (highRisk.length > 0) {
    alerts.push({
      title: 'Risco de Cancelamento',
      description: `${highRisk.length} assinantes com alto risco de churn detectado pelo baixo uso da plataforma. Recomenda-se contato imediato.`,
      type: 'warning',
      icon: AlertCircle,
    })
  }

  if (alerts.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alerts.map((a, i) => (
        <Alert
          key={i}
          variant={a.type === 'destructive' ? 'destructive' : 'default'}
          className={
            a.type === 'warning'
              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-500'
              : ''
          }
        >
          <a.icon className="h-4 w-4" />
          <AlertTitle>{a.title}</AlertTitle>
          <AlertDescription>{a.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}
