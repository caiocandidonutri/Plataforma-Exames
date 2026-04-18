import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

function base64ToBlob(base64: string, type: string) {
  const binStr = atob(base64)
  const len = binStr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binStr.charCodeAt(i)
  }
  return new Blob([bytes], { type })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader)
      return new Response(JSON.stringify({ error: { message: 'Missing Authorization' } }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return new Response(JSON.stringify({ error: { message: 'Unauthorized' } }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin' && profile?.role !== 'marketing')
      return new Response(JSON.stringify({ error: { message: 'Forbidden' } }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    let action = 'validate',
      payload: any = {}
    if (req.method === 'POST') {
      const bodyText = await req.text()
      if (bodyText) {
        const body = JSON.parse(bodyText)
        action = body.action || 'validate'
        payload = body.payload || {}
      }
    }

    let access_token = payload.access_token
    let page_id = payload.page_id

    if (!access_token && payload.settings_id) {
      const { data: settings } = await supabase
        .from('api_settings')
        .select('*')
        .eq('id', payload.settings_id)
        .limit(1)
        .single()
      if (settings) {
        access_token = settings.access_token
        page_id = settings.waba_id
      }
    }

    if (!access_token)
      return new Response(
        JSON.stringify({ error: { message: 'API settings not found or missing token' } }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )

    if (action === 'validate_social') {
      const url = `https://graph.facebook.com/v21.0/me?access_token=${access_token}&fields=name,id`
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok)
        return new Response(JSON.stringify({ error: data.error }), {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let url = '',
      method = 'GET',
      fetchBody: any = undefined
    let headers: any = { Authorization: `Bearer ${access_token}` }
    const phoneId = payload.phone_number_id || page_id

    switch (action) {
      case 'validate':
        url = `https://graph.facebook.com/v21.0/${page_id}?fields=name,timezone_id,account_review_status,business_verification_status`
        break
      case 'send_message':
        url = `https://graph.facebook.com/v21.0/${phoneId}/messages`
        method = 'POST'
        headers['Content-Type'] = 'application/json'
        fetchBody = JSON.stringify(payload)
        break
      case 'get_profile':
        url = `https://graph.facebook.com/v21.0/${phoneId}/whatsapp_business_profile?fields=about,address,description,email,profile_picture_url,websites,vertical`
        break
      default:
        return new Response(JSON.stringify({ error: { message: 'Unknown action' } }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    const metaRes = await fetch(url, { method, headers, body: fetchBody })
    const metaResText = await metaRes.text()

    let metaData: any = {}
    if (metaResText) {
      try {
        metaData = JSON.parse(metaResText)
      } catch (e) {
        metaData = { raw: metaResText }
      }
    }

    if (!metaRes.ok)
      return new Response(
        JSON.stringify({
          error: metaData.error || { message: 'Meta API Error', details: metaData },
        }),
        { status: metaRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    return new Response(JSON.stringify({ data: metaData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
