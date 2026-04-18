import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MetricsCards } from '@/components/dashboard/MetricsCards'
import { ActivePatients } from '@/components/dashboard/ActivePatients'
import { PendingExams } from '@/components/dashboard/PendingExams'
import { WhatsAppConversations } from '@/components/dashboard/WhatsAppConversations'
import { FinancialMetrics } from '@/components/dashboard/FinancialMetrics'
import { RecentReports } from '@/components/dashboard/RecentReports'
import { AlertTriangle, MessageCircle, DollarSign, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const mockAlerts = [
  {
    id: 1,
    type: 'critico',
    message: '3 pacientes com exames críticos',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-950/20',
  },
  {
    id: 2,
    type: 'alerta',
    message: '2 conversas sem resposta há 24h',
    icon: MessageCircle,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    id: 3,
    type: 'info',
    message: '1 pagamento vencido',
    icon: DollarSign,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: 4,
    type: 'novo',
    message: '5 novas solicitações de contato',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
]

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8 space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard do Profissional
        </h1>
        <p className="text-muted-foreground">
          Visão geral, pacientes, exames, comunicação e desempenho financeiro.
        </p>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockAlerts.map((alert) => (
          <Card
            key={alert.id}
            className={`${alert.bg} border-none shadow-sm transition-transform hover:-translate-y-1 duration-200`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div
                className={`p-3 rounded-full bg-white dark:bg-slate-900 shadow-sm shrink-0 ${alert.color}`}
              >
                <alert.icon className="h-5 w-5" />
              </div>
              <p className="font-medium text-sm text-slate-700 dark:text-slate-300">
                {alert.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 flex flex-wrap gap-1 w-full md:w-auto h-auto">
          <TabsTrigger value="overview" className="flex-grow md:flex-grow-0">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex-grow md:flex-grow-0">
            Pacientes
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex-grow md:flex-grow-0">
            Exames
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex-grow md:flex-grow-0">
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-grow md:flex-grow-0">
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex-grow md:flex-grow-0">
            Financeiro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FinancialMetrics />
            </div>
            <div className="lg:col-span-1">
              <WhatsAppConversations preview />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivePatients preview />
            <PendingExams />
          </div>
        </TabsContent>

        <TabsContent value="patients" className="animate-fade-in">
          <ActivePatients />
        </TabsContent>

        <TabsContent value="exams" className="animate-fade-in">
          <PendingExams />
        </TabsContent>

        <TabsContent value="whatsapp" className="animate-fade-in">
          <WhatsAppConversations />
        </TabsContent>

        <TabsContent value="reports" className="animate-fade-in">
          <RecentReports />
        </TabsContent>

        <TabsContent value="finance" className="animate-fade-in">
          <FinancialMetrics full />
        </TabsContent>
      </Tabs>
    </div>
  )
}
