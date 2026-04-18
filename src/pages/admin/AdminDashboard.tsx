import { useEffect, useState } from 'react'
import { adminDashboardService } from '@/services/admin-dashboard'
import { MetricsCards } from './components/MetricsCards'
import { FinancialCharts } from './components/FinancialCharts'
import { SubscribersTables } from './components/SubscribersTables'
import { ForecastTable } from './components/ForecastTable'
import { BusinessAlerts } from './components/BusinessAlerts'
import { Button } from '@/components/ui/button'
import { Download, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ExportDialog } from './components/ExportDialog'
import { ExportHistorySheet } from './components/ExportHistorySheet'

export default function AdminDashboard() {
  const [data, setData] = useState<{ metrics: any[]; subscribers: any[]; forecasts: any[] }>({
    metrics: [],
    subscribers: [],
    forecasts: [],
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        const [metrics, subscribers, forecasts] = await Promise.all([
          adminDashboardService.getMetrics(),
          adminDashboardService.getSubscribers(),
          adminDashboardService.getForecasts(),
        ])
        setData({ metrics, subscribers, forecasts })
      } catch (e: any) {
        toast({
          title: 'Erro',
          description: e.message || 'Falha ao carregar dados do dashboard.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Calculando métricas e carregando dashboard...
        </p>
      </div>
    )
  }

  const currentMetrics = data.metrics[data.metrics.length - 1] || null
  const previousMetrics = data.metrics[data.metrics.length - 2] || null

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard de Assinantes
          </h1>
          <p className="text-gray-500 mt-1">
            Gestão de monetização, retenção e previsões financeiras.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportHistorySheet />
          <ExportDialog />
        </div>
      </div>

      <BusinessAlerts subscribers={data.subscribers} metrics={currentMetrics} />
      <MetricsCards current={currentMetrics} previous={previousMetrics} />
      <FinancialCharts metrics={data.metrics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <SubscribersTables subscribers={data.subscribers} />
        </div>
        <div className="xl:col-span-1">
          <ForecastTable forecasts={data.forecasts} />
        </div>
      </div>
    </div>
  )
}
