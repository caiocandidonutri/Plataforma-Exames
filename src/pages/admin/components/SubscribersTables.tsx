import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export function SubscribersTables({ subscribers }: { subscribers: any[] }) {
  const ativos = subscribers.filter((s: any) => s.status === 'ativo')
  const cancelados = subscribers.filter((s: any) => s.status === 'cancelado')

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Gestão de Assinantes</CardTitle>
        <CardDescription>Gerencie assinaturas, analise riscos e histórico.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ativos">
          <TabsList className="mb-4">
            <TabsTrigger value="ativos">Ativos ({ativos.length})</TabsTrigger>
            <TabsTrigger value="cancelados">Cancelados ({cancelados.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="ativos">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assinante</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Uso (%)</TableHead>
                    <TableHead>Risco de Churn</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ativos.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.patients?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {s.plano_atual}
                        </Badge>
                      </TableCell>
                      <TableCell>{s.uso_plataforma_percentual}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            s.risco_churn === 'alto'
                              ? 'destructive'
                              : s.risco_churn === 'medio'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {s.risco_churn}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Contatar">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {ativos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Nenhum assinante ativo.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cancelados">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assinante</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Tempo (Dias)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cancelados.map((s: any) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.patients?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {s.plano_atual}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {s.motivo_cancelamento || '-'}
                      </TableCell>
                      <TableCell>{s.tempo_assinatura_dias} dias</TableCell>
                    </TableRow>
                  ))}
                  {cancelados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhum assinante cancelado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
