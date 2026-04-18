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
import { mockPatients } from '@/lib/data'
import { MessageCircle, FileText } from 'lucide-react'

export function ActivePatients({ preview }: { preview?: boolean }) {
  const patients = Object.values(mockPatients)
  const displayPatients = preview ? patients.slice(0, 3) : patients

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pacientes Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status Urgência</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPatients.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>
                  <Badge variant={p.plan === 'pro' ? 'default' : 'secondary'} className="uppercase">
                    {p.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={p.id === 'PT-001' ? 'destructive' : 'outline'}>
                    {p.id === 'PT-001' ? 'Crítico' : 'Normal'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={p.subscriptionStatus === 'ativo' ? 'default' : 'destructive'}
                    className={
                      p.subscriptionStatus === 'ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                    }
                  >
                    {p.subscriptionStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" /> Histórico
                  </Button>
                  <Button variant="default" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
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
