import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Shield, Search, Filter } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type AuditLog = {
  id: string
  acao: string
  data_acao: string
  ip_origem: string | null
  user_agent: string | null
  detalhes: string | null
  usuario_id: string
  user_name?: string
  user_email?: string
}

export default function AuditDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const [logsResponse, profilesResponse] = await Promise.all([
        supabase
          .from('log_exportacao')
          .select('*')
          .order('data_acao', { ascending: false })
          .limit(500),
        supabase.from('profiles').select('id, full_name, email'),
      ])

      if (logsResponse.error) throw logsResponse.error

      const profilesMap = new Map(profilesResponse.data?.map((p) => [p.id, p]) || [])

      const enrichedLogs = (logsResponse.data || []).map((log) => {
        const profile = profilesMap.get(log.usuario_id)
        return {
          ...log,
          user_name: profile?.full_name || 'Usuário Desconhecido',
          user_email: profile?.email || 'N/A',
        }
      })

      setLogs(enrichedLogs)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      log.acao.toLowerCase().includes(searchLower) ||
      log.user_name?.toLowerCase().includes(searchLower) ||
      log.user_email?.toLowerCase().includes(searchLower) ||
      log.detalhes?.toLowerCase().includes(searchLower)
    )
  })

  const getActionBadgeVariant = (
    acao: string,
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (acao) {
      case 'erro':
        return 'destructive'
      case 'processando':
        return 'secondary'
      case 'baixada':
        return 'outline'
      default:
        return 'default'
    }
  }

  const getActionLabel = (acao: string) => {
    const map: Record<string, string> = {
      criada: 'Criada',
      processando: 'Processando',
      pronta: 'Pronta',
      baixada: 'Baixada',
      erro: 'Erro',
      deletada: 'Deletada',
    }
    return map[acao] || acao
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Dashboard de Auditoria
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Sistema e Exportação</CardTitle>
          <CardDescription>
            Acompanhe o histórico de acesso e extração de dados da plataforma em conformidade com a
            LGPD.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário, ação ou detalhes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data / Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>IP Origem</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum registro encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.data_acao), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.user_name}</span>
                          <span className="text-xs text-muted-foreground">{log.user_email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getActionBadgeVariant(log.acao)}
                          className={log.acao === 'pronta' ? 'bg-green-600 hover:bg-green-700' : ''}
                        >
                          {getActionLabel(log.acao)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-sm">{log.ip_origem || '-'}</span>
                          <span
                            className="text-xs text-muted-foreground truncate max-w-[150px]"
                            title={log.user_agent || ''}
                          >
                            {log.user_agent ? log.user_agent.split(' ')[0] : '-'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate" title={log.detalhes || ''}>
                        {log.detalhes || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
