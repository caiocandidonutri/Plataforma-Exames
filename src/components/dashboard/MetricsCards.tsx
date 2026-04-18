import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, DollarSign, MessageCircle, CheckCircle, UserPlus } from 'lucide-react'

export function MetricsCards() {
  const metrics = [
    { title: 'Pacientes Ativos', value: '124', icon: Users, trend: '+12%' },
    { title: 'Exames Mês', value: '45', icon: FileText, trend: '+5%' },
    { title: 'Receita Mensal', value: 'R$ 8.450', icon: DollarSign, trend: '+18%' },
    { title: 'Chats Pendentes', value: '7', icon: MessageCircle, trend: '-2' },
    { title: 'Taxa de Resposta', value: '94%', icon: CheckCircle, trend: '+2%' },
    { title: 'Novos Pacientes', value: '18', icon: UserPlus, trend: '+4' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((m, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
            <m.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{m.value}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">{m.trend} no último mês</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
