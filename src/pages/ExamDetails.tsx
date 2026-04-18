import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, User, Calendar, Beaker, BrainCircuit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useToast } from '@/hooks/use-toast'
import { mockExams, mockPatients, getAnalyzedRecommendations } from '@/lib/data'
import { Exam, Recommendation, Status } from '@/types'
import { ResultCard } from '@/components/exam/ResultCard'
import { RecommendationsPanel } from '@/components/exam/RecommendationsPanel'

export default function ExamDetails() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  const [exam, setExam] = useState<Exam | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [status, setStatus] = useState<Status>('Pendente')

  useEffect(() => {
    const foundExam = mockExams.find((e) => e.id === id)
    if (foundExam) {
      setExam(foundExam)
      setStatus(foundExam.status)
      setRecommendations(foundExam.recommendations || [])
    }
  }, [id])

  if (!exam)
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Carregando dados do exame...
      </div>
    )

  const patient = mockPatients[exam.patientId]

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // Simulate complex API call Flow-01
    setTimeout(() => {
      setIsAnalyzing(false)
      setStatus('Analisado')
      setRecommendations(getAnalyzedRecommendations())
      toast({
        title: 'Análise Concluída',
        description:
          'A inteligência diagnóstica gerou novas recomendações baseadas nos resultados.',
        className:
          'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-100 dark:border-emerald-800',
      })
    }, 2000)
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50/50 dark:bg-slate-950/50">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para Exames
            </Link>
          </Button>

          {/* Header Card */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />

            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <Badge
                  variant={status === 'Analisado' ? 'default' : 'secondary'}
                  className={status === 'Analisado' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                >
                  {status}
                </Badge>
                <span className="text-sm font-mono text-muted-foreground">{exam.id}</span>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">{patient?.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" /> {patient?.age} anos • Sexo {patient?.sex}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Coleta:{' '}
                    {new Date(exam.date).toLocaleDateString('pt-BR')}
                  </span>
                  {exam.audit && (
                    <span className="flex items-center gap-1.5 opacity-60 text-xs">
                      • Tracking: {exam.audit.correlationId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {status === 'Transcrito' && (
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full md:w-auto shadow-md transition-all active:scale-95"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analisando Dados...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="mr-2 h-5 w-5" /> Gerar Análise Diagnóstica
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Empty State / No Data */}
          {exam.categories.length === 0 && (
            <div className="p-12 text-center bg-card rounded-2xl border border-dashed">
              <Beaker className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Resultados Pendentes</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Os dados deste exame ainda não foram transcritos do laboratório.
              </p>
            </div>
          )}

          {/* Results Accordions */}
          {exam.categories.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold mb-4 px-1">Resultados Laboratoriais</h2>
              <Accordion
                type="multiple"
                defaultValue={[exam.categories[0]?.name]}
                className="w-full space-y-3"
              >
                {exam.categories.map((category) => (
                  <AccordionItem
                    key={category.name}
                    value={category.name}
                    className="bg-card border rounded-xl px-4 shadow-sm data-[state=open]:shadow-md transition-all"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 font-semibold text-[15px]">
                      {category.name}
                      <Badge variant="secondary" className="ml-3 font-normal text-xs">
                        {category.items.length} itens
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                        {category.items.map((item) => (
                          <ResultCard key={item.key} item={item} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations Sidebar (Fixed width on desktop, full width on mobile if needed) */}
      <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 border-t md:border-t-0 bg-background h-[50vh] md:h-full overflow-hidden flex flex-col">
        <RecommendationsPanel recommendations={recommendations} />
      </div>
    </div>
  )
}
