import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  Activity,
  FileText,
  Calendar as CalendarIcon,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { mockPatients, getAnalyzedRecommendations } from '@/lib/data'

export default function Report() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { relatorios, exams } = useAppStore()

  const report = relatorios.find((r) => r.id === id)
  const exam = exams.find((e) => e.id === report?.exameId)

  const isPremium = report?.tipoRelatorio === 'premium'

  // Generate historical mock data for charts (Only for premium)
  const historicalData = useMemo(() => {
    if (!isPremium) return []
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      return {
        month: d.toLocaleDateString('pt-BR', { month: 'short' }),
        valor: 100 + Math.random() * 50 - i * 5,
      }
    })
  }, [isPremium])

  useEffect(() => {
    if (searchParams.get('print') === 'true') {
      const timer = setTimeout(() => window.print(), 1000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!report || !exam) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="text-2xl font-bold text-slate-700">Relatório não encontrado</h2>
          <p className="text-slate-500">O documento solicitado não existe ou expirou.</p>
        </div>
      </div>
    )
  }

  const patient = mockPatients[exam.patientId]

  // Determine urgency config
  const urgencyConfig = {
    critico: {
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      border: 'border-rose-200',
      icon: XCircle,
      label: 'Crítico',
      rec: 'Procure atendimento médico urgente',
    },
    moderado: {
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      border: 'border-amber-200',
      icon: AlertTriangle,
      label: 'Moderado',
      rec: 'Agende consulta em breve',
    },
    normal: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      label: 'Normal',
      rec: 'Continue monitoramento',
    },
  }[report.statusUrgencia]

  const UrgencyIcon = urgencyConfig.icon

  // Recommendations: fallback to analyzed if exam has none (due to mock data structure)
  const recommendations = exam.recommendations?.length
    ? exam.recommendations
    : getAnalyzedRecommendations()

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-4xl bg-white shadow-xl sm:rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* SECAO-01: CABECALHO */}
        <header className="bg-slate-900 text-slate-50 p-8 print:bg-slate-100 print:text-slate-900 print:!text-slate-900">
          <div className="flex justify-between items-start border-b border-slate-700 print:border-slate-300 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-lg print:bg-indigo-100">
                <Activity className="h-8 w-8 text-white print:text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dr. Exames</h1>
                <p className="text-sm text-slate-400 print:text-slate-500">
                  Inteligência Diagnóstica
                </p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold">Relatório de Análise</h2>
              <p className="text-sm text-slate-400 print:text-slate-500">
                Gerado em: {new Date(report.dataGeracao).toLocaleDateString('pt-BR')}
              </p>
              {isPremium && (
                <Badge
                  variant="secondary"
                  className="mt-2 bg-amber-500 text-amber-950 border-none print:hidden"
                >
                  Premium
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 print:text-slate-500 mb-1">Paciente</p>
              <p className="font-medium text-lg flex items-center gap-2 text-white print:text-slate-900">
                <User className="h-4 w-4 opacity-70" /> {patient?.name}
              </p>
              <p className="text-slate-300 print:text-slate-600">
                {patient?.age} anos • Sexo {patient?.sex}
              </p>
            </div>
            <div>
              <p className="text-slate-400 print:text-slate-500 mb-1">Detalhes do Exame</p>
              <p className="font-medium text-lg flex items-center gap-2 text-white print:text-slate-900">
                <CalendarIcon className="h-4 w-4 opacity-70" /> Coleta:{' '}
                {new Date(exam.date).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-slate-300 print:text-slate-600">ID: {exam.id}</p>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-10">
          {/* SECAO-02: RESUMO_EXECUTIVO */}
          <section>
            <div
              className={cn(
                'rounded-xl border p-6 flex flex-col md:flex-row items-center gap-6',
                urgencyConfig.bg,
                urgencyConfig.border,
              )}
            >
              <div className={cn('p-4 rounded-full bg-white/60', urgencyConfig.color)}>
                <UrgencyIcon className="h-10 w-10" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className={cn('text-xl font-bold mb-1', urgencyConfig.color)}>
                  Status Geral: {urgencyConfig.label}
                </h3>
                <p className="text-slate-700 font-medium">{urgencyConfig.rec}</p>
                <p className="text-sm text-slate-600 mt-2">
                  Análise agnóstica concluída com base em{' '}
                  {exam.categories.reduce((acc, cat) => acc + cat.items.length, 0)} parâmetros
                  avaliados.
                </p>
              </div>
            </div>
          </section>

          {/* SECAO-03: VALORES_OBTIDOS */}
          <section>
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">Valores Obtidos</h3>
            <div className="space-y-6">
              {exam.categories.map((category, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-lg border border-slate-200 print:break-inside-avoid"
                >
                  <div className="bg-slate-50 px-4 py-3 font-semibold text-slate-800 border-b border-slate-200">
                    {category.name}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {category.items.map((item, i) => {
                      const isLow = item.value < item.refMin
                      const isHigh = item.value > item.refMax
                      const isAbnormal = isLow || isHigh

                      return (
                        <div
                          key={i}
                          className="grid grid-cols-12 p-4 text-sm hover:bg-slate-50 transition-colors"
                        >
                          <div className="col-span-12 md:col-span-4 font-medium text-slate-900 flex items-center gap-2 mb-2 md:mb-0">
                            {isAbnormal ? (
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            )}
                            {item.name}
                          </div>
                          <div className="col-span-4 md:col-span-2">
                            <span
                              className={cn(
                                'font-bold text-base',
                                isAbnormal
                                  ? 'text-rose-600 print:!text-rose-600'
                                  : 'text-slate-700',
                              )}
                            >
                              {item.value}
                            </span>
                            <span className="text-xs text-slate-500 ml-1">{item.unit}</span>
                          </div>
                          <div className="col-span-8 md:col-span-4 text-slate-500">
                            Ref: {item.refMin} - {item.refMax} {item.unit}
                          </div>
                          <div className="col-span-12 md:col-span-2 mt-2 md:mt-0 flex items-center md:justify-end">
                            <Badge
                              variant={isAbnormal ? 'destructive' : 'secondary'}
                              className={cn(
                                !isAbnormal && 'bg-emerald-100 text-emerald-700 border-none',
                              )}
                            >
                              {isAbnormal ? (isLow ? 'Abaixo' : 'Acima') : 'Normal'}
                            </Badge>
                          </div>
                          {item.interpretation && (
                            <div className="col-span-12 mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                              <span className="font-semibold text-slate-700">Interpretação:</span>{' '}
                              {item.interpretation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECAO-04: HISTORICO_GRAFICO (Apenas Premium) */}
          {isPremium && (
            <section className="print:break-inside-avoid pt-4">
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" /> Histórico Gráfico (Últimos 6 meses)
              </h3>
              <Card className="border-slate-200 shadow-sm print:shadow-none">
                <CardContent className="p-6">
                  <div className="h-[250px] w-full">
                    <ChartContainer
                      config={{
                        valor: { label: 'Valor', color: 'hsl(var(--primary))' },
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalData}
                          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="valor"
                            stroke="hsl(var(--primary))"
                            strokeWidth={3}
                            dot={{
                              fill: 'hsl(var(--primary))',
                              r: 4,
                              strokeWidth: 2,
                              stroke: '#fff',
                            }}
                            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 text-center">
                    Evolução do Índice Metabólico Geral consolidado. Tendência de estabilidade nos
                    últimos 3 meses.
                  </p>
                </CardContent>
              </Card>
            </section>
          )}

          {/* SECAO-06: RECOMENDACOES */}
          <section className="print:break-inside-avoid pt-4">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-4">
              Plano de Ação e Recomendações
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {recommendations.map((rec) => {
                const isHigh = rec.priority === 'Alta'
                return (
                  <div
                    key={rec.id}
                    className={cn(
                      'p-4 rounded-xl border print:border-slate-300',
                      isHigh
                        ? 'border-rose-200 bg-rose-50 print:bg-white'
                        : 'border-slate-200 bg-white',
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          isHigh
                            ? 'border-rose-300 text-rose-700 bg-white'
                            : 'border-slate-300 text-slate-600 bg-slate-50',
                        )}
                      >
                        Prioridade {rec.priority}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-slate-600 print:bg-slate-200"
                      >
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-800 font-medium mb-3">{rec.text}</p>

                    {rec.suggestedFoods?.length || rec.avoidedFoods?.length ? (
                      <div className="space-y-2 mt-3 pt-3 border-t border-slate-200">
                        {rec.suggestedFoods && rec.suggestedFoods.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-emerald-700">Incluir:</span>
                            <p className="text-xs text-slate-600">
                              {rec.suggestedFoods.join(', ')}
                            </p>
                          </div>
                        )}
                        {rec.avoidedFoods && rec.avoidedFoods.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-rose-700">Evitar:</span>
                            <p className="text-xs text-slate-600">{rec.avoidedFoods.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </section>

          {/* SECAO-07: CONTATO_PROFISSIONAL */}
          <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 print:break-inside-avoid print:bg-white print:border-2">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Acompanhamento Profissional</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="font-semibold text-slate-800">Dr. Caio Cândido</p>
                <p className="text-sm text-slate-500 mb-4">Nutricionista Esportivo e Clínico</p>
                <div className="space-y-2">
                  <p className="text-sm flex items-center gap-2 text-slate-600">
                    <Phone className="h-4 w-4" />{' '}
                    {report.telefoneProfissional || '+55 11 99999-9999'}
                  </p>
                  <p className="text-sm flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />{' '}
                    {report.emailProfissional || 'contato@drexames.com'}
                  </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto print:hidden"
              >
                <a
                  href={`https://wa.me/${report.telefoneProfissional?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chamar no WhatsApp
                </a>
              </Button>
            </div>
          </section>
        </div>

        {/* SECAO-08: RODAPE */}
        <footer className="bg-slate-900 text-slate-400 p-6 text-center text-xs print:bg-white print:text-slate-500 print:border-t print:border-slate-300">
          <p className="mb-2">
            Este relatório é informativo, gerado por inteligência diagnóstica, e não substitui uma
            consulta médica presencial ou avaliação clínica detalhada.
          </p>
          <p>
            Documento ID: {report.id} • Válido até{' '}
            {new Date(report.dataExpiracao || '').toLocaleDateString('pt-BR')}
          </p>
        </footer>
      </div>

      {/* Floating Print Button for Screen View */}
      <div className="fixed bottom-6 right-6 print:hidden">
        <Button
          onClick={() => window.print()}
          size="lg"
          className="shadow-2xl rounded-full px-6 h-14 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <FileText className="mr-2 h-5 w-5" /> Imprimir / Salvar PDF
        </Button>
      </div>
    </div>
  )
}
