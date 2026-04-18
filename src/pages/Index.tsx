import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Download,
  Lock,
  Calendar,
  ChevronRight,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { format, subDays, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import useAppStore from '@/stores/use-app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ExamUpload } from '@/components/exam/ExamUpload'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Index() {
  const { currentUser, exams } = useAppStore()
  const [isExporting, setIsExporting] = useState(false)

  const userExams = exams.filter((e) => e.patientId === currentUser.id)

  const thirtyDaysAgo = subDays(new Date(), 30)

  const visibleExams =
    currentUser.plan === 'basic'
      ? userExams.filter((e) => isAfter(new Date(e.date), thirtyDaysAgo))
      : userExams

  const hiddenExamsCount = userExams.length - visibleExams.length

  const handleExport = (format: string) => {
    setIsExporting(true)
    toast.info(`Gerando relatório evolutivo em ${format}...`, {
      description: 'Isolando dados em ambiente seguro.',
    })

    setTimeout(() => {
      toast.success(`Relatório em ${format} pronto!`, {
        description: 'O download foi iniciado.',
      })
      setIsExporting(false)
    }, 2500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Analisado':
        return <Badge className="bg-emerald-500">Analisado</Badge>
      case 'Transcrito':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Transcrito
          </Badge>
        )
      case 'Pendente':
        return <Badge variant="outline">Pendente</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Meus Exames</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie e analise seus resultados laboratoriais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.plan === 'pro' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={isExporting}>
                  <Download className="w-4 h-4" /> Exportar Histórico
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Formato do Relatório</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('PDF')}>
                  PDF (Completo com Gráficos)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('Excel')}>
                  Excel (Dados Brutos)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('CSV')}>
                  CSV (Integração)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 text-slate-400 border-slate-200">
                  <Lock className="w-4 h-4" /> Exportar Histórico
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-4">
                <div className="text-center">
                  <Lock className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-sm font-medium mb-1">Recurso Pro</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    A exportação de histórico e relatórios evolutivos é exclusiva do plano Pro.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link to="/assinatura">Fazer Upgrade</Link>
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ExamUpload />
        </div>
      </div>

      {currentUser.plan === 'basic' && hiddenExamsCount > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Histórico Limitado</AlertTitle>
          <AlertDescription className="text-amber-700 mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
            <span>
              Você tem {hiddenExamsCount} exame(s) arquivado(s) com mais de 30 dias. O plano Básico
              permite visualizar apenas o histórico recente.
            </span>
            <Link to="/assinatura" className="font-semibold underline shrink-0">
              Desbloquear histórico com o Pro
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleExams.map((exam) => (
          <Link key={exam.id} to={`/exame/${exam.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-slate-200 hover:border-primary/50 group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  {getStatusBadge(exam.status)}
                </div>
                <CardTitle className="mt-4 text-lg">
                  {exam.categories.length > 0
                    ? exam.categories.map((c) => c.name).join(', ')
                    : 'Exame em Processamento'}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(exam.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center text-sm text-primary font-medium mt-2">
                  Ver resultados detalhados <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {visibleExams.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl border-slate-200">
            <Activity className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Nenhum exame recente</h3>
            <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
              Você ainda não enviou nenhum exame ou não possui exames nos últimos 30 dias.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
