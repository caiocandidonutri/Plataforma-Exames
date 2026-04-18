import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Mail, Smartphone, Activity, Loader2 } from 'lucide-react'

const alertTypes = [
  {
    key: 'alertas_criticos',
    label: 'Alertas Críticos',
    desc: 'Avisos imediatos sobre resultados fora do padrão ou urgências.',
  },
  {
    key: 'alertas_moderados',
    label: 'Alertas Moderados',
    desc: 'Atualizações importantes de rotina e acompanhamento.',
  },
  {
    key: 'alertas_baixos',
    label: 'Alertas Baixos',
    desc: 'Avisos de sistema, marketing e outras informações.',
  },
]

const eventTypes = [
  {
    key: 'novos_pacientes',
    label: 'Novos Pacientes',
    desc: 'Quando um novo paciente se cadastrar na plataforma.',
  },
  {
    key: 'conversas_whatsapp',
    label: 'Conversas WhatsApp',
    desc: 'Quando houver uma nova mensagem não lida.',
  },
  {
    key: 'pagamentos_vencidos',
    label: 'Pagamentos Vencidos',
    desc: 'Avisos de cobrança e inadimplência.',
  },
  {
    key: 'relatorios_prontos',
    label: 'Relatórios Prontos',
    desc: 'Quando uma exportação de dados estiver disponível.',
  },
  {
    key: 'atualizacoes_plataforma',
    label: 'Atualizações da Plataforma',
    desc: 'Novos recursos e melhorias no sistema.',
  },
]

export default function NotificationSettings() {
  const { toast } = useToast()
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('configuracoes_notificacao')
        .select('*')
        .eq('usuario_id', session.user.id)
        .single()

      if (data) {
        setConfig(data)
      } else {
        const { data: newData } = await supabase
          .from('configuracoes_notificacao')
          .insert({ usuario_id: session.user.id })
          .select()
          .single()
        setConfig(newData)
      }
      setLoading(false)
    }
    loadConfig()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('configuracoes_notificacao')
      .update(config)
      .eq('id', config.id)
    if (error)
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    else toast({ title: 'Sucesso', description: 'Configurações atualizadas com sucesso!' })
    setSaving(false)
  }

  const handleTest = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return
    toast({ title: 'Enviando teste...', description: 'Solicitando envio de notificação.' })

    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        tipo_evento: 'novo_paciente',
        usuario_id: session.user.id,
        payload: { paciente_nome: 'João Silva', especialidade: 'Geral' },
      },
    })

    if (error) toast({ title: 'Erro no envio', description: error.message, variant: 'destructive' })
    else
      toast({
        title: 'Notificação enviada',
        description: `Simulação concluída com ${data?.logged || 0} registros enviados.`,
      })
  }

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Notificação</h1>
          <p className="text-muted-foreground">
            Personalize como você recebe alertas e atualizações da plataforma.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTest}>
            <Bell className="w-4 h-4 mr-2" />
            Testar Notificação
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Canais de Comunicação
            </CardTitle>
            <CardDescription>Escolha por onde deseja ser avisado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações no seu endereço de e-mail.
                </p>
              </div>
              <Switch
                checked={config.email_ativado}
                onCheckedChange={(v) => setConfig({ ...config, email_ativado: v })}
              />
            </div>
            {config.email_ativado && (
              <div className="pl-6 pt-2 border-l-2 border-primary/20 space-y-4">
                <div className="space-y-2">
                  <Label>Frequência de E-mail</Label>
                  <Select
                    value={config.frequencia_email}
                    onValueChange={(v) => setConfig({ ...config, frequencia_email: v })}
                  >
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imediato">Imediato (tempo real)</SelectItem>
                      <SelectItem value="diario">Resumo Diário</SelectItem>
                      <SelectItem value="semanal">Resumo Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Notificações no aplicativo e dispositivo móvel.
                </p>
              </div>
              <Switch
                checked={config.push_ativado}
                onCheckedChange={(v) => setConfig({ ...config, push_ativado: v })}
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Activity className="w-4 h-4" /> SMS
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alertas curtos via mensagem de texto.
                </p>
              </div>
              <Switch
                checked={config.sms_ativado}
                onCheckedChange={(v) => setConfig({ ...config, sms_ativado: v })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Severidade dos Alertas</CardTitle>
            <CardDescription>
              Defina quais níveis de urgência devem disparar notificações.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertTypes.map((t) => (
              <div key={t.key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.label}</Label>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <Switch
                  checked={config[t.key]}
                  onCheckedChange={(v) => setConfig({ ...config, [t.key]: v })}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eventos Monitorados</CardTitle>
            <CardDescription>
              Escolha exatamente o que você quer acompanhar na plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eventTypes.map((t) => (
              <div key={t.key} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{t.label}</Label>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <Switch
                  checked={config[t.key]}
                  onCheckedChange={(v) => setConfig({ ...config, [t.key]: v })}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
