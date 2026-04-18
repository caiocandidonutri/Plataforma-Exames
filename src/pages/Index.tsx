import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Clock, AlertTriangle, ArrowRight, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockExams, mockPatients } from '@/lib/data'
import { Status } from '@/types'

const statusColors: Record<Status, string> = {
  Pendente: 'border-muted-foreground/30 text-muted-foreground bg-transparent',
  Transcrito: 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
  Analisado:
    'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
}

export default function Index() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredExams = mockExams.filter((exam) => {
    const matchStatus = filter === 'all' || exam.status === filter
    const patientName = mockPatients[exam.patientId]?.name.toLowerCase() || ''
    const matchSearch =
      patientName.includes(search.toLowerCase()) ||
      exam.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Acompanhe e analise exames laboratoriais.
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Activity className="w-4 h-4" />
          Novo Exame
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="border-slate-200/60 shadow-subtle dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Exames
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-subtle dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Análises Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">42</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aguardando inteligência diagnóstica
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200/60 shadow-subtle dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertas Críticos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">7</div>
            <p className="text-xs text-muted-foreground mt-1">Requerem atenção imediata</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/60 shadow-subtle dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 className="font-semibold text-lg">Exames Recentes</h2>
          <div className="flex w-full sm:w-auto gap-2">
            <Input
              placeholder="Buscar paciente ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-[200px] h-9 text-sm bg-background"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px] h-9 text-sm bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Transcrito">Transcrito</SelectItem>
                <SelectItem value="Analisado">Analisado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900">
              <TableRow>
                <TableHead className="w-[120px]">ID do Exame</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => (
                <TableRow
                  key={exam.id}
                  className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/80"
                >
                  <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                    {exam.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {mockPatients[exam.patientId]?.name || 'Desconhecido'}
                    <div className="text-xs text-muted-foreground md:hidden">{exam.date}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {new Date(exam.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={exam.status === 'Pendente' ? 'outline' : 'secondary'}
                      className={statusColors[exam.status]}
                    >
                      {exam.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      <Link to={`/exame/${exam.id}`}>
                        Detalhes
                        <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredExams.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                    Nenhum exame encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
