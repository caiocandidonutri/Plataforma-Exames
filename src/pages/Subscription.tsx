import { useState } from 'react'
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
  Receipt,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import useAppStore from '@/stores/use-app-store'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, addMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Payment } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Subscription() {
  const { currentUser, payments, addPayment, updateCurrentUserPlan } = useAppStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const isPro = currentUser.plan === 'pro' && currentUser.subscriptionStatus === 'ativo'

  const userPayments = payments.filter((p) => p.patientId === currentUser.id)

  const handleUpgrade = async () => {
    setIsProcessing(true)
    toast.info('Redirecionando para o gateway de pagamento...')

    setTimeout(() => {
      const newPayment: Payment = {
        id: `PAY-${Date.now()}`,
        patientId: currentUser.id,
        amount: 149.9,
        date: new Date().toISOString(),
        method: 'credit_card',
        status: 'succeeded',
      }
      addPayment(newPayment)
      updateCurrentUserPlan('pro', 'ativo')

      toast.success('Pagamento confirmado! Seu plano Pro foi ativado.', {
        description: 'Recursos ilimitados e integrações liberadas.',
      })
      setIsProcessing(false)
    }, 2000)
  }

  const handleSimulateFailure = () => {
    setIsProcessing(true)
    setTimeout(() => {
      const newPayment: Payment = {
        id: `PAY-${Date.now()}`,
        patientId: currentUser.id,
        amount: 149.9,
        date: new Date().toISOString(),
        method: 'credit_card',
        status: 'failed',
      }
      addPayment(newPayment)
      updateCurrentUserPlan('basic', 'suspenso')

      toast.error('Sua assinatura Pro foi suspensa.', {
        description: 'Falha no pagamento da renovação. A conta retornou ao plano Básico.',
      })
      setIsProcessing(false)
    }, 1500)
  }

  const handleCancel = () => {
    updateCurrentUserPlan('basic', 'cancelado')
    toast.error('Assinatura cancelada', {
      description: 'Sua assinatura Pro foi cancelada. Sua conta retornou ao plano Básico.',
    })
  }

  const getStatusBadge = () => {
    switch (currentUser.subscriptionStatus) {
      case 'ativo':
        return (
          <Badge className="bg-emerald-500">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Ativo
          </Badge>
        )
      case 'suspenso':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" /> Suspenso
          </Badge>
        )
      case 'cancelado':
        return (
          <Badge variant="secondary">
            <XCircle className="w-3 h-3 mr-1" /> Cancelado
          </Badge>
        )
      case 'expirado':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> Expirado
          </Badge>
        )
      case 'trial':
        return (
          <Badge className="bg-blue-500">
            <Clock className="w-3 h-3 mr-1" /> Trial
          </Badge>
        )
      default:
        return null
    }
  }

  const getMethodText = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Cartão de Crédito'
      case 'pix':
        return 'Pix'
      case 'boleto':
        return 'Boleto'
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assinatura e Faturamento</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gerencie seu plano, pagamentos e limites de uso.
        </p>
      </div>

      {currentUser.subscriptionStatus === 'suspenso' && (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Assinatura Suspensa</h3>
            <p className="text-sm">
              Sua assinatura Pro está suspensa devido a uma falha no pagamento. Você retornou ao
              plano Básico com limite de 3 exames/mês. Atualize sua forma de pagamento para
              restaurar o acesso.
            </p>
          </div>
        </div>
      )}

      {currentUser.subscriptionStatus === 'cancelado' && (
        <div className="p-4 bg-slate-100 text-slate-800 rounded-lg border border-slate-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Assinatura Cancelada</h3>
            <p className="text-sm">
              Sua assinatura Pro foi cancelada. Você retornou ao plano Básico com limite de 3
              exames/mês.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={isPro ? 'border-primary shadow-md relative overflow-hidden' : ''}>
          {isPro && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
              PLANO ATUAL
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-2xl">Pro</CardTitle>
              {isPro && getStatusBadge()}
            </div>
            <CardDescription>
              Acesso ilimitado e ferramentas avançadas para cuidar da sua saúde.
            </CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ 149,90</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500" /> Exames ilimitados
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500" /> Histórico completo e evolutivo
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500" /> Integrações com laboratórios (Webhook)
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500" /> Agendamento de consultas premium
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-emerald-500" /> Exportação de relatórios em PDF/Excel
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t pt-4">
            {!isPro ? (
              <Button className="w-full" onClick={handleUpgrade} disabled={isProcessing}>
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4 mr-2" />
                )}
                Assinar Plano Pro
              </Button>
            ) : (
              <>
                <div className="w-full text-center text-sm text-muted-foreground mb-2">
                  Próxima renovação:{' '}
                  {format(addMonths(new Date(), 1), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSimulateFailure}
                    disabled={isProcessing}
                  >
                    Simular Falha
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleCancel}
                    disabled={isProcessing}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </Card>

        <Card
          className={
            !isPro
              ? 'border-slate-300 relative overflow-hidden bg-slate-50'
              : 'bg-slate-50 opacity-70'
          }
        >
          {!isPro && (
            <div className="absolute top-0 right-0 bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              PLANO ATUAL
            </div>
          )}
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-2xl text-slate-700">Básico</CardTitle>
            </div>
            <CardDescription>O essencial para acompanhar seus últimos exames.</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">Gratuito</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-slate-400" /> Até 3 exames por mês
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-slate-400" /> Histórico de 30 dias
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Check className="w-4 h-4 text-slate-400" /> Análise básica com IA
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 line-through">
              <XCircle className="w-4 h-4 text-slate-300" /> Integrações com laboratórios
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 line-through">
              <XCircle className="w-4 h-4 text-slate-300" /> Exportação de relatórios
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" /> Histórico de Pagamentos
          </CardTitle>
          <CardDescription>Acompanhe suas últimas faturas e recibos emitidos.</CardDescription>
        </CardHeader>
        <CardContent>
          {userPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>R$ {payment.amount.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell>{getMethodText(payment.method)}</TableCell>
                    <TableCell>
                      {payment.status === 'succeeded' && (
                        <Badge className="bg-emerald-500">Pago</Badge>
                      )}
                      {payment.status === 'failed' && <Badge variant="destructive">Falhou</Badge>}
                      {payment.status === 'pending' && <Badge variant="secondary">Pendente</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg bg-slate-50">
              Nenhum histórico de pagamento encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
