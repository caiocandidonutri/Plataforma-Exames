import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, Activity, TrendingUp, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MetricsCards({ current, previous }: { current: any; previous: any }) {
  if (!current) return null

  const cards = [
    {
      title: 'MRR',
      value: `R$ ${current.mrr.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      trend: calculateTrend(current.mrr, previous?.mrr),
    },
    {
      title: 'ARR',
      value: `R$ ${current.arr.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      trend: calculateTrend(current.arr, previous?.arr),
    },
    {
      title: 'Assinantes Ativos',
      value: current.assinantes_ativos,
      icon: Users,
      trend: calculateTrend(current.assinantes_ativos, previous?.assinantes_ativos),
    },
    {
      title: 'Churn Rate',
      value: `${(current.churn_rate * 100).toFixed(1)}%`,
      icon: Activity,
      trend: calculateTrend(current.churn_rate, previous?.churn_rate, true),
    },
    {
      title: 'CAC',
      value: `R$ ${current.cac.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Target,
      trend: calculateTrend(current.cac, previous?.cac, true),
    },
    {
      title: 'LTV',
      value: `R$ ${current.ltv.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      trend: calculateTrend(current.ltv, previous?.ltv),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
            <c.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
            <p
              className={cn('text-xs mt-1', c.trend.isPositive ? 'text-green-500' : 'text-red-500')}
            >
              {c.trend.isPositive ? '+' : ''}
              {c.trend.value}% vs mês ant.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function calculateTrend(current: number, previous: number, lowerIsBetter = false) {
  if (!previous) return { value: '0.0', isPositive: true }
  const diff = ((current - previous) / previous) * 100
  const isPositive = lowerIsBetter ? diff <= 0 : diff >= 0
  return { value: diff.toFixed(1), isPositive }
}
