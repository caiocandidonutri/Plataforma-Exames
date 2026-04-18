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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useAppStore from '@/stores/use-app-store'
import { mockPatients } from '@/lib/data'
import { useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'

export function PendingExams() {
  const { exams } = useAppStore()
  const pendingExams = exams.filter((e) => e.status !== 'Analisado')
  const navigate = useNavigate()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
          Exames Pendentes de Análise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Data do Upload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingExams.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  {mockPatients[e.patientId]?.name || e.patientId}
                </TableCell>
                <TableCell>{new Date(e.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                  >
                    {e.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" onClick={() => navigate(`/exame/${e.id}`)}>
                    Analisar Exame
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {pendingExams.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum exame pendente de análise no momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
