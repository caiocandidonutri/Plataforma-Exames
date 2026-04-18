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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // Bypass RLS for webhook background processing
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const payload = await req.json()

    // Example handler for Twilio or generic WhatsApp Business API format
    if (payload.messages && Array.isArray(payload.messages)) {
      for (const msg of payload.messages) {
        const from = msg.from
        const text = msg.text?.body || msg.text
        const messageId = msg.id || msg.message_id
        
        if (!from || !text) continue;

        // Clean phone number format for matching
        const cleanPhone = from.replace(/\D/g, '')
        
        // Match patient based on phone
        const { data: patients } = await supabaseAdmin.from('patients').select('id, phone')
        
        const matchedPatient = patients?.find(p => p.phone?.replace(/\D/g, '') === cleanPhone)
        
        if (matchedPatient) {
          // Find primary professional
          const { data: prof } = await supabaseAdmin.from('contatos_profissionais').select('id').limit(1).single()
          
          if (prof) {
            // Insert received message into history
            await supabaseAdmin.from('historico_whatsapp').insert({
              paciente_id: matchedPatient.id,
              profissional_id: prof.id,
              mensagem_tipo: 'texto',
              remetente: 'profissional', // Simulating response from professional
              conteudo: text,
              status: 'entregue',
              whatsapp_message_id: messageId,
              metadados: { webhook_payload: msg }
            })
          }
        }
      }
    }

    return new Response(JSON.stringify({ status: 'recebido' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  } catch (err: any) {
    console.error('Webhook Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
