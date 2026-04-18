import { useState } from 'react'
import { toast } from 'sonner'
import {
  Beaker,
  Plus,
  RefreshCw,
  Webhook,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Link2,
  Search,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { IntegrationForm } from '@/components/integration-form'
import useAppStore from '@/stores/use-app-store'
import { LabIntegration, Exam, IntegrationStatus } from '@/types'
import { decryptAES256 } from '@/lib/crypto'
import { cn } from '@/lib/utils'

export default function Integrations() {
  const { integrations, exams, addIntegration, updateIntegration, addExam, updateExam } =
    useAppStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFormSuccess = (integration: LabIntegration) => {
    addIntegration(integration)
    setIsDialogOpen(false)
  }

  const runSync = async (integration: LabIntegration, isWebhook: boolean = false) => {
    const decryptedKey = decryptAES256(integration.apiKey)
    if (decryptedKey === 'invalid' || !decryptedKey) {
      updateIntegration(integration.id, { status: 'inativo' })
      toast.error(
        `Chave API inválida ou expirada para ${integration.labName}. Por favor, reconfigure a integração.`,
      )
      return
    }

    setSyncingId(integration.id)

    if (isWebhook) {
      toast.info(`Webhook recebido de ${integration.labName}. Validando assinatura HMAC-SHA256...`)
      await new Promise((r) => setTimeout(r, 800))
    }

    await new Promise((r) => setTimeout(r, 1200))
    updateIntegration(integration.id, { status: 'ativo', lastSyncDate: new Date().toISOString() })

    const examDate = new Date().toISOString().split('T')[0]
    const existing = exams.find(
      (e) =>
        e.patientId === integration.patientId &&
        e.date === examDate &&
        e.sourceLab === integration.labName,
    )

    if (existing) {
      toast.info('Exame já existe, ignorado.', {
        description: 'A base de dados já contém os resultados mais recentes.',
      })
      setSyncingId(null)
      return
    }

    const newExam: Exam = {
      id: `EX-${Date.now()}`,
      patientId: integration.patientId,
      date: examDate,
      status: 'Transcrito',
      sourceLab: integration.labName,
      categories: [
        {
          name: 'Hemograma Completo',
          items: [
            {
              key: 'hemo',
              name: 'Hemoglobina',
              value: 11.2,
              unit: 'g/dL',
              refMin: 12.0,
              refMax: 15.5,
            },
          ],
        },
      ],
      recommendations: [],
    }

    addExam(newExam)
    toast.success(
      'Exame importado com sucesso (Transcrito). Iniciando análise dinâmica (FLOW-04)...',
    )

    setTimeout(() => {
      updateExam(newExam.id, {
        status: 'Analisado',
        recommendations: [
          {
            id: `REC-${Date.now()}`,
            priority: 'Alta',
            type: 'Médica',
            text: 'Investigar causa da anemia (Hb 11.2 g/dL). Solicitar ferritina e ferro sérico.',
            source: 'Diretrizes Brasileiras',
          },
        ],
      })
      toast.success(
        `Novo exame de Hemograma Completo do laboratório ${integration.labName} disponível. Análise: Anemia leve detectada.`,
      )
      setSyncingId(null)
    }, 2500)
  }

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'ativo':
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
          </Badge>
        )
      case 'inativo':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> Inativo
          </Badge>
        )
      case 'erro':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Erro
          </Badge>
        )
      case 'pendente_autenticacao':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertCircle className="w-3 h-3 mr-1" /> Pendente
          </Badge>
        )
    }
  }

  const filteredIntegrations = integrations.filter((i) =>
    i.labName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Integrações Lab</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gerencie conexões automatizadas (ENTITY-05) com laboratórios parceiros.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Nova Integração
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Integração</DialogTitle>
              <DialogDescription>
                Configure as credenciais e endpoint fornecidos pelo laboratório.
              </DialogDescription>
            </DialogHeader>
            <IntegrationForm
              onSuccess={handleFormSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar integração..."
          className="pl-9 bg-white shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card
            key={integration.id}
            className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border-slate-200 flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-slate-100 rounded-md">
                    <Beaker className="w-4 h-4 text-primary" />
                  </div>
                  {integration.labName}
                </CardTitle>
                {getStatusBadge(integration.status)}
              </div>
              <CardDescription className="flex items-center gap-1.5 mt-3 text-xs">
                <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{integration.apiEndpoint}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2.5 pb-4 flex-1">
              <div className="flex justify-between items-center text-slate-600 border-b border-slate-50 pb-2">
                <span>Tipo de Sync</span>
                <Badge variant="outline" className="capitalize">
                  {integration.type}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Última Sincronização</span>
                <span className="font-medium text-slate-900 text-xs">
                  {integration.lastSyncDate
                    ? format(new Date(integration.lastSyncDate), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })
                    : 'Nunca'}
                </span>
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-slate-50/50 flex gap-2 rounded-b-xl mt-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white hover:bg-slate-50"
                onClick={() => runSync(integration, false)}
                disabled={syncingId === integration.id}
              >
                <RefreshCw
                  className={cn('w-3.5 h-3.5 mr-2', syncingId === integration.id && 'animate-spin')}
                />
                Sincronizar
              </Button>
              {integration.type === 'webhook' && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => runSync(integration, true)}
                  disabled={syncingId === integration.id}
                >
                  <Webhook className="w-3.5 h-3.5 mr-2" />
                  Testar Webhook
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {filteredIntegrations.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl border-slate-200 text-slate-500 bg-slate-50/50">
            <Beaker className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium">Nenhuma integração encontrada</p>
            <p className="text-sm mt-1">
              Tente buscar por outro termo ou adicione uma nova integração.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
