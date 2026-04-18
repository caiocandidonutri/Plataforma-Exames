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
import { FileText, Download, Send } from 'lucide-react'

const mockReports = [
  {
    id: 'REL-001',
    patient: 'Maria Silva',
    type: 'Hemograma Completo',
    date: 'Hoje, 14:30',
    status: 'Enviado',
  },
  {
    id: 'REL-002',
    patient: 'João Santos',
    type: 'Perfil Lipídico',
    date: 'Ontem, 09:15',
    status: 'Lido',
  },
  {
    id: 'REL-003',
    patient: 'Ana Costa',
    type: 'Avaliação Tireoidiana',
    date: '15/04/2026',
    status: 'Gerado',
  },
]

export function RecentReports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Relatórios Gerados Recentemente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Exame</TableHead>
              <TableHead>Data de Geração</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((rel) => (
              <TableRow key={rel.id}>
                <TableCell className="font-medium">{rel.patient}</TableCell>
                <TableCell>{rel.type}</TableCell>
                <TableCell>{rel.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={rel.status === 'Gerado' ? 'secondary' : 'default'}
                    className={rel.status === 'Lido' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {rel.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" title="Baixar PDF">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="icon" className="h-8 w-8" title="Enviar WhatsApp">
                    <Send className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
