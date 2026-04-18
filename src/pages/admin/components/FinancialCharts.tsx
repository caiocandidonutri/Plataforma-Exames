import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

export function FinancialCharts({ metrics }: { metrics: any[] }) {
  if (!metrics || metrics.length === 0) return null

  const formatData = metrics.map((m: any) => ({
    name: new Date(m.data).toLocaleDateString('pt-BR', { month: 'short' }),
    MRR: m.mrr,
    Assinantes: m.assinantes_ativos,
    Churn: m.churn_rate * 100,
  }))

  const chartConfig = {
    MRR: { label: 'MRR (R$)', color: 'hsl(var(--primary))' },
    Assinantes: { label: 'Assinantes Ativos', color: 'hsl(var(--primary))' },
    Churn: { label: 'Churn Rate (%)', color: 'hsl(var(--destructive))' },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Evolução do MRR</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={formatData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="MRR"
                stroke="var(--color-MRR)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assinantes e Churn</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={formatData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                yAxisId="left"
                dataKey="Assinantes"
                fill="var(--color-Assinantes)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Churn"
                stroke="var(--color-Churn)"
                strokeWidth={2}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
