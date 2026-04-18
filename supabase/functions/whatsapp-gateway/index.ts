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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SERVICE_ROLE_KEY') ?? ''

    const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
      global: { headers: { Authorization: authHeader } } 
    })
    
    // Service role client to bypass RLS when fetching critical global settings
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { action, payload } = await req.json()
    
    // Authorization Check: Must be admin or marketing
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin' && profile?.role !== 'marketing') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const safeFetch = async (url: string, options?: RequestInit) => {
      try {
        return await fetch(url, options)
      } catch (err: any) {
        console.error(`Network error when calling ${url}:`, err)
        throw new Error(`Falha de conexão com a API (${url}). A URL pode estar incorreta, inacessível (DNS/Name or service not known) ou a conexão foi recusada.`)
      }
    }

    const processGatewayResponse = async (res: Response) => {
      if (res.status === 401 || res.status === 403) {
          throw new Error('Acesso negado no Gateway. Verifique se o Token da API está correto.')
      }
      
      const text = await res.text()
      let data: any = {}
      try { data = text ? JSON.parse(text) : {} } catch(e) {}
      
      if (!res.ok) {
          if (res.status === 400 || res.status === 404) {
              throw new Error("A rota da API não foi encontrada ou os parâmetros são inválidos. Verifique as configurações.")
          }
          const msg = data?.message || data?.error || text || `HTTP Error ${res.status}`
          const msgStr = typeof msg === 'string' ? msg : JSON.stringify(msg)
          
          throw new Error(msgStr)
      }
      return data
    }

    const fetchGlobalSetting = async (key: string) => {
      const { data, error } = await supabaseAdmin.from('global_settings').select('value').eq('key', key).maybeSingle()
      if (error) {
        console.error(`Error fetching global setting ${key}:`, error)
        return null
      }
      if (!data || data.value === null || data.value === undefined) return null
      
      let val = data.value
      // Strip outer quotes if stored as a double-quoted string in JSONB
      if (typeof val === 'string') {
        if (val.startsWith('"') && val.endsWith('"')) {
            try { val = JSON.parse(val) } catch(e) {}
        }
      }
      return typeof val === 'string' ? val : String(val)
    }

    const getApiConfig = async (type: 'whatsapp' | 'hostinger' = 'whatsapp') => {
      if (type === 'hostinger') {
          let rawApiUrl = await fetchGlobalSetting('hostinger_api_url')
          let rawApiToken = await fetchGlobalSetting('hostinger_api_token')
          let apiUrl = rawApiUrl || 'https://developers.hostinger.com/api/vps/v1/'
          let apiToken = rawApiToken || ''
          
          if (typeof apiUrl === 'string') apiUrl = apiUrl.replace(/[\r\n\t\s]+/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '').replace(/\/+$/, '')
          if (typeof apiToken === 'string') apiToken = apiToken.replace(/[\r\n\t\s]+/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '')
          
          return { apiUrl, apiToken }
      }

      let rawApiUrl = await fetchGlobalSetting('whatsapp_api_url')
      let rawApiToken = await fetchGlobalSetting('whatsapp_api_token')

      let apiUrl = rawApiUrl || Deno.env.get('WHATSAPP_API_URL') || ''
      let apiToken = rawApiToken || Deno.env.get('WHATSAPP_API_TOKEN') || ''

      // Sanitize: remove non-printable characters, all whitespace
      if (typeof apiUrl === 'string') {
          apiUrl = apiUrl.replace(/[\r\n\t\s]+/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      }
      if (typeof apiToken === 'string') {
          apiToken = apiToken.replace(/[\r\n\t\s]+/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      }

      if (!apiUrl || apiUrl.includes('seudominio.com') || apiUrl.includes('sua-api-whatsapp.com') || !apiToken || apiToken.includes('seu-token')) {
          console.error('Gateway: API validation failed - missing or placeholder credentials.')
          throw new Error("A URL da API ainda está configurada com um valor de exemplo. Por favor, acesse 'Configurar Infraestrutura' e insira a URL correta da sua Evolution API.")
      }

      try {
          const parsedUrl = new URL(apiUrl)
          const noTrailingSlashes = parsedUrl.pathname.replace(/\/+$/, "")
          apiUrl = `${parsedUrl.protocol}//${parsedUrl.host}${noTrailingSlashes}`
      } catch (e) {
          console.error(`Gateway: Invalid URL format: ${apiUrl}`)
          throw new Error(`A URL configurada (${apiUrl}) não é válida. Verifique se começa com http:// ou https://`)
      }

      return { apiUrl, apiToken }
    }

    switch (action) {
      case 'testConnection': {
        const testUrl = payload.url;
        const testToken = payload.token;
        
        if (!testUrl || !testToken) {
             throw new Error('URL e Token são obrigatórios para testar a conexão.');
        }

        let apiUrl = testUrl;
        try { 
            const u = new URL(apiUrl); 
            apiUrl = `${u.protocol}//${u.host}${u.pathname.replace(/\/+$/, "")}`; 
        } catch(e) {}
        
        try {
            const res = await safeFetch(`${apiUrl}/instance/fetchInstances`, {
                method: 'GET',
                headers: { 'apikey': testToken }
            });
            if (res.status === 401 || res.status === 403) {
                return new Response(JSON.stringify({ error: 'Credenciais inválidas. Verifique a Evolution API Global Key.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            if (!res.ok) {
                 if (res.status === 404 || res.status === 400) {
                     return new Response(JSON.stringify({ error: 'Erro de Rota: Verifique se a URL da Evolution API está correta e se o Token é a Global API Key.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
                 }
                 return new Response(JSON.stringify({ error: `Erro no servidor da API: ${res.status}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            return new Response(JSON.stringify({ success: true, message: 'Conexão estabelecida com sucesso!' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        } catch (e: any) {
             return new Response(JSON.stringify({ error: `Servidor inacessível: ${e.message}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
      }

      case 'testHostingerConnection': {
        let testUrl = payload.url;
        let testToken = payload.token;
        
        if (!testUrl || !testToken) {
             const hConfig = await getApiConfig('hostinger');
             testUrl = hConfig.apiUrl;
             testToken = hConfig.apiToken;
        }

        if (!testUrl || !testToken) {
             throw new Error('URL e Token são obrigatórios para testar a conexão Hostinger.');
        }

        if (typeof testToken === 'string') {
             testToken = testToken.replace(/[\r\n\t]/g, '').trim();
        }

        try {
            new URL(testUrl);
        } catch (e) {
             return new Response(JSON.stringify({ error: `URL inválida para Hostinger: ${testUrl}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        const cleanUrl = testUrl.replace(/\/+$/, '');
        
        try {
            const res = await safeFetch(`${cleanUrl}/virtual-machines`, {
                method: 'GET',
                headers: { 
                  'Authorization': `Bearer ${testToken}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
            });
            if (res.status === 401 || res.status === 403) {
                return new Response(JSON.stringify({ error: 'Token da Hostinger inválido ou sem permissão.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            if (!res.ok) {
                 const text = await res.text();
                 let errorMsg = `Erro no servidor da Hostinger: ${res.status}`;
                 try {
                     const json = JSON.parse(text);
                     errorMsg = json.message || json.error || text.substring(0, 100);
                 } catch(e) {
                     errorMsg = text.substring(0, 100) || errorMsg;
                 }
                 return new Response(JSON.stringify({ error: errorMsg }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }
            const data = await res.json();
            return new Response(JSON.stringify({ success: true, message: 'Conexão estabelecida com sucesso!', data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        } catch (e: any) {
             return new Response(JSON.stringify({ error: `Servidor Hostinger inacessível: ${e.message}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
      }

      case 'createInstance': {
        const { apiUrl, apiToken } = await getApiConfig('whatsapp')

        const safeInstanceName = payload.instance_name.replace(/[^a-zA-Z0-9]/g, '') + '-' + crypto.randomUUID().split('-')[0]
        const instance_key = crypto.randomUUID()
        
        const res = await safeFetch(`${apiUrl}/instance/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': apiToken },
          body: JSON.stringify({ instanceName: safeInstanceName, qrcode: true, integration: 'WHATSAPP-BAILEYS' })
        })
        
        await processGatewayResponse(res)

        const { data, error } = await supabase.from('whatsapp_instances').insert({
          instance_name: safeInstanceName,
          friendly_name: payload.friendly_name || payload.instance_name,
          instance_key,
          status: 'disconnected',
          owner_id: user.id
        }).select().single()
        
        if (error) throw error
        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      case 'getQrCode': {
        const { apiUrl, apiToken } = await getApiConfig('whatsapp')

        const { data: instance } = await supabase.from('whatsapp_instances').select('instance_name').eq('id', payload.id).single()
        if (!instance) throw new Error('Instância não encontrada no banco de dados')

        const reqUrl = `${apiUrl}/instance/connect/${instance.instance_name}`
        console.log(`Gateway: Requesting QR Code from ${reqUrl}`)

        const res = await safeFetch(reqUrl, { headers: { 'apikey': apiToken } })
        const hostingerData = await processGatewayResponse(res)

        let qrBase64 = hostingerData?.base64
        if (!qrBase64) {
             if (hostingerData?.instance?.state === 'open') {
                 await supabase.from('whatsapp_instances').update({ status: 'connected' }).eq('id', payload.id)
                 return new Response(JSON.stringify({ success: true, status: 'connected' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
             }
             throw new Error('Não foi possível gerar o QR Code. A instância pode já estar conectada ou em estado inválido.')
        }
        
        if (!qrBase64.startsWith('data:image')) {
            qrBase64 = `data:image/png;base64,${qrBase64}`
        }

        const { error } = await supabase.from('whatsapp_instances')
          .update({ qr_code_base64: qrBase64, status: 'waiting_scan' })
          .eq('id', payload.id)

        if (error) throw error
        return new Response(JSON.stringify({ success: true, qr_code_base64: qrBase64 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      case 'checkStatus': {
        const { data: instance, error } = await supabase.from('whatsapp_instances').select('*').eq('id', payload.id).single()
        if (error) throw error
        
        let apiUrl, apiToken;
        try {
            const config = await getApiConfig('whatsapp')
            apiUrl = config.apiUrl
            apiToken = config.apiToken
        } catch (e) {
            return new Response(JSON.stringify({ status: instance.status, phone_number: instance.phone_number }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        try {
            const res = await safeFetch(`${apiUrl}/instance/connectionState/${instance.instance_name}`, { headers: { 'apikey': apiToken } })
            const hostingerData = await processGatewayResponse(res)

            const state = hostingerData?.instance?.state
            let newStatus = instance.status
            let phone = instance.phone_number

            if (state === 'open') newStatus = 'connected'
            else if (state === 'connecting') newStatus = 'connecting'
            else if (state === 'close') newStatus = 'disconnected'

            if (hostingerData?.instance?.ownerJid) {
                phone = hostingerData.instance.ownerJid.split('@')[0]
            }

            if (newStatus !== instance.status || phone !== instance.phone_number) {
                await supabase.from('whatsapp_instances').update({ status: newStatus, phone_number: phone }).eq('id', payload.id)
            }

            return new Response(JSON.stringify({ status: newStatus, phone_number: phone }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        } catch (e) {
            return new Response(JSON.stringify({ status: instance.status, phone_number: instance.phone_number }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }
      }
      
      case 'logoutInstance': {
        const { data: instance } = await supabase.from('whatsapp_instances').select('instance_name').eq('id', payload.id).single()
        
        try {
            const { apiUrl, apiToken } = await getApiConfig('whatsapp')
            if (instance) {
                const res = await safeFetch(`${apiUrl}/instance/logout/${instance.instance_name}`, {
                    method: 'DELETE',
                    headers: { 'apikey': apiToken }
                })
                await processGatewayResponse(res).catch(() => {}) // Ignore config errors on logout
            }
        } catch (e) {}

        const { error } = await supabase.from('whatsapp_instances').update({ 
          status: 'disconnected', 
          qr_code_base64: null, 
          phone_number: null 
        }).eq('id', payload.id)
        
        if (error) throw error
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      case 'deleteInstance': {
        const { data: instance } = await supabase.from('whatsapp_instances').select('instance_name').eq('id', payload.id).single()
        
        try {
            const { apiUrl, apiToken } = await getApiConfig('whatsapp')
            if (instance) {
                const res = await safeFetch(`${apiUrl}/instance/delete/${instance.instance_name}`, {
                    method: 'DELETE',
                    headers: { 'apikey': apiToken }
                })
                await processGatewayResponse(res).catch(() => {}) // Ignore config errors on delete
            }
        } catch (e) {}

        const { error } = await supabase.from('whatsapp_instances').delete().eq('id', payload.id)
        if (error) throw error
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      case 'executeFlow': {
        const { apiUrl, apiToken } = await getApiConfig('whatsapp')

        const { flow_id } = payload;
        const { data: flow } = await supabase.from('automated_flows').select('*, patient:patients(*)').eq('id', flow_id).single();
        if (!flow || !flow.patient) throw new Error('Jornada ou paciente não encontrado');

        const { data: instance } = await supabase.from('whatsapp_instances').select('*').eq('status', 'connected').limit(1).single();
        if (!instance) throw new Error('Nenhuma instância conectada para disparar a mensagem');

        let msgContent = `Olá ${flow.patient.name}! Esta é uma mensagem automática da jornada: ${flow.flow_type}.`;
        if (flow.status && flow.status !== 'pending' && flow.status.length > 20) {
            msgContent = flow.status;
        }

        const phone = flow.patient.phone;
        if (!phone) throw new Error('O paciente não possui telefone cadastrado');
        
        let cleanedPhone = phone.replace(/\D/g, '');
        if (!cleanedPhone.startsWith('55')) cleanedPhone = '55' + cleanedPhone;

        const reqUrl = `${apiUrl}/message/sendText/${instance.instance_name}`;
        const res = await safeFetch(reqUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': apiToken },
            body: JSON.stringify({ number: cleanedPhone, text: msgContent })
        });
        
        const resData = await processGatewayResponse(res)
        
        await supabase.from('automated_flows').update({ status: 'completed' }).eq('id', flow_id);
        return new Response(JSON.stringify({ success: true, result: resData }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
  } catch (err: any) {
    console.error('Gateway Error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    // Return 400 to force error parsing by supabase client and expose the JSON properly
    return new Response(JSON.stringify({ error: errorMessage }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})
