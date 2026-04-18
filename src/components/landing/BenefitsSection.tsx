import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, FileText, MessageSquare, PieChart } from 'lucide-react'

export function BenefitsSection({ data }: { data: any }) {
  const beneficios = data?.beneficios_principais || [
    'Análise automática de 50+ tipos de exames',
    'Relatórios PDF personalizados em segundos',
    'Comunicação direta com pacientes via WhatsApp',
    'Dashboard com métricas de negócio',
  ]

  const icons = [Activity, FileText, MessageSquare, PieChart]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Benefícios Principais</h2>
          <p className="text-muted-foreground text-lg">
            Descubra como nossa plataforma otimiza seu dia a dia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {beneficios.map((ben: string, i: number) => {
            const Icon = icons[i % icons.length]
            return (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{ben}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aumente sua eficiência clínica e proporcione uma experiência superior ao seu
                    paciente.
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
