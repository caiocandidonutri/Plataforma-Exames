import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', { auth: { autoRefreshToken: false, persistSession: false } })
    const { tipo_evento, usuario_id, payload } = await req.json()

    if (!tipo_evento || !usuario_id) return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: tmpl } = await supabaseAdmin.from('template_notificacao').select('*').eq('tipo_evento', tipo_evento).eq('status', 'ativo').single()
    if (!tmpl) return new Response(JSON.stringify({ error: 'Template not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: cfg } = await supabaseAdmin.from('configuracoes_notificacao').select('*').eq('usuario_id', usuario_id).single()
    if (!cfg) return new Response(JSON.stringify({ error: 'User config not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const prio = tmpl.prioridade
    if ((prio === 'alta' && !cfg.alertas_criticos) || (prio === 'media' && !cfg.alertas_moderados) || (prio === 'baixa' && !cfg.alertas_baixos)) {
      return new Response(JSON.stringify({ status: 'skipped' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const checks: Record<string, boolean> = { novo_paciente: cfg.novos_pacientes, conversa_whatsapp: cfg.conversas_whatsapp, pagamento_vencido: cfg.pagamentos_vencidos, relatorio_pronto: cfg.relatorios_prontos, atualizacao_plataforma: cfg.atualizacoes_plataforma }
    if (checks[tipo_evento] === false) return new Response(JSON.stringify({ status: 'skipped' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    let [assunto, cEmail, cPush, cSms] = [tmpl.assunto_email, tmpl.corpo_email, tmpl.corpo_push, tmpl.corpo_sms || '']
    if (payload) {
      for (const [k, v] of Object.entries(payload)) {
        const re = new RegExp(`{{${k}}}`, 'g')
        assunto = assunto.replace(re, String(v))
        cEmail = cEmail.replace(re, String(v))
        cPush = cPush.replace(re, String(v))
        cSms = cSms.replace(re, String(v))
      }
    }

    const logs = []
    const sev = prio === 'alta' ? 'critica' : prio === 'media' ? 'moderada' : 'baixa'
    
    if (cfg.email_ativado) logs.push({ usuario_id, tipo_notificacao: 'email', assunto, corpo: cEmail, severidade: sev, template_id: tmpl.id })
    if (cfg.push_ativado) logs.push({ usuario_id, tipo_notificacao: 'push', assunto: tmpl.titulo_push, corpo: cPush, severidade: sev, template_id: tmpl.id })
    if (cfg.sms_ativado && cSms) logs.push({ usuario_id, tipo_notificacao: 'sms', assunto: 'SMS Alert', corpo: cSms, severidade: sev, template_id: tmpl.id })

    if (logs.length > 0) await supabaseAdmin.from('log_notificacao').insert(logs)

    return new Response(JSON.stringify({ success: true, logged: logs.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
