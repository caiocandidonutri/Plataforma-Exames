import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { tipoRelatorio, formato, dataInicio, dataFim } = await req.json()

    const { data: exportacao, error: createError } = await supabase
      .from('exportacao_relatorio')
      .insert({
        usuario_id: user.id,
        tipo_relatorio: tipoRelatorio || 'completo',
        formato: formato || 'csv',
        data_inicio: dataInicio || null,
        data_fim: dataFim || null,
        status: 'processando',
      })
      .select()
      .single()

    if (createError || !exportacao) throw createError

    await supabase.from('log_exportacao').insert({
      exportacao_id: exportacao.id,
      usuario_id: user.id,
      acao: 'criada',
      detalhes: 'Iniciando processamento do relatório',
    })

    const startTime = Date.now()

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const fileContent = `Relatorio: ${tipoRelatorio}\nFormato: ${formato}\nGerado em: ${new Date().toISOString()}\n\n-- DADOS --\nRegistro 1; Valor 1\nRegistro 2; Valor 2\n\n[LGPD] Este documento contém dados sensíveis. Uso restrito e confidencial.`
    const extension = formato === 'excel' ? 'xlsx' : formato
    const fileName = `${user.id}/${tipoRelatorio}_${Date.now()}.${extension}`

    const contentType =
      formato === 'csv'
        ? 'text/csv'
        : formato === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    const { error: uploadError } = await supabase.storage
      .from('relatorios')
      .upload(fileName, fileContent, {
        contentType,
        upsert: false,
      })

    if (uploadError) {
      await supabase.from('exportacao_relatorio').update({ status: 'erro' }).eq('id', exportacao.id)
      await supabase.from('log_exportacao').insert({
        exportacao_id: exportacao.id,
        usuario_id: user.id,
        acao: 'erro',
        detalhes: `Erro no upload: ${uploadError.message}`,
      })
      throw uploadError
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from('relatorios')
      .createSignedUrl(fileName, 60 * 60 * 24)

    if (signedError || !signedData) throw signedError

    const processTime = Math.round((Date.now() - startTime) / 1000)

    await supabase
      .from('exportacao_relatorio')
      .update({
        status: 'pronto',
        url_download: signedData.signedUrl,
        tamanho_arquivo: fileContent.length,
        data_conclusao: new Date().toISOString(),
        tempo_processamento: processTime,
      })
      .eq('id', exportacao.id)

    await supabase.from('log_exportacao').insert({
      exportacao_id: exportacao.id,
      usuario_id: user.id,
      acao: 'pronta',
      detalhes: 'Processamento concluído com sucesso',
    })

    return new Response(
      JSON.stringify({ success: true, id: exportacao.id, url: signedData.signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err: any) {
    console.error('Export Error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
