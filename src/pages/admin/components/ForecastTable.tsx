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

export function ForecastTable({ forecasts }: { forecasts: any[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Previsões Financeiras</CardTitle>
        <CardDescription>Próximo Mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cenário</TableHead>
                <TableHead className="text-right">MRR</TableHead>
                <TableHead className="text-right">Assinantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecasts.map((f: any) => (
                <TableRow key={f.id}>
                  <TableCell>
                    <Badge
                      variant={f.cenario === 'realista' ? 'default' : 'outline'}
                      className="uppercase"
                    >
                      {f.cenario}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {f.mrr_previsto.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">{f.assinantes_previstos}</TableCell>
                </TableRow>
              ))}
              {forecasts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Sem dados de previsão.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
