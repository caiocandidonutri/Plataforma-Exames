import { supabase } from '@/lib/supabase/client'

export type LeadPayload = {
  nome: string
  email: string
  telefone?: string
  profissao: string
  especialidade?: string
  cidade?: string
  estado?: string
  empresa?: string
  tamanho_empresa?: string
  origem: string
  variacao_lp_id?: string
}

export async function submitLead(payload: LeadPayload) {
  // RULE-08: Score calculation
  let score = 10
  if (payload.email && payload.email.includes('@')) score += 5
  if (payload.telefone && payload.telefone.length > 8) score += 10
  if (payload.empresa) score += 15
  if (payload.especialidade) score += 20
  if (payload.tamanho_empresa && ['media', 'grande'].includes(payload.tamanho_empresa)) score += 15

  let status = 'novo'
  if (score >= 70) {
    status = 'qualificado'
  }

  // Insert into DB using typing bypass because leads table was added dynamically
  const { data, error } = await (supabase as any)
    .from('leads')
    .insert({
      nome: payload.nome,
      email: payload.email,
      telefone: payload.telefone || null,
      profissao: payload.profissao,
      especialidade: payload.especialidade || null,
      cidade: payload.cidade || null,
      estado: payload.estado || null,
      empresa: payload.empresa || null,
      tamanho_empresa: payload.tamanho_empresa || null,
      origem: payload.origem,
      variacao_lp_id: payload.variacao_lp_id || null,
      status,
      score_qualificacao: score,
      data_captura: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Este email já está registrado. Por favor, faça login ou recupere sua senha.')
    }
    throw new Error('Falha ao registrar lead. Verifique os dados preenchidos.')
  }

  return data
}

export async function getLandingPageVariation(profissao: string) {
  const { data, error } = await (supabase as any)
    .from('landing_page_variacoes')
    .select('*')
    .eq('profissao_alvo', profissao)
    .eq('status', 'ativo')
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}
