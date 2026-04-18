import { supabase } from '@/lib/supabase/client'

export const adminDashboardService = {
  async getMetrics() {
    const { data, error } = await supabase
      .from('metrica_monetizacao')
      .select('*')
      .order('data', { ascending: true })
    if (error) throw error
    return data || []
  },
  async getSubscribers() {
    const { data, error } = await supabase
      .from('relatorio_assinante')
      .select('*, patients(name)')
      .order('data_relatorio', { ascending: false })
    if (error) throw error
    return data || []
  },
  async getForecasts() {
    const { data, error } = await supabase
      .from('previsao_financeira')
      .select('*')
      .order('cenario', { ascending: true })
    if (error) throw error
    return data || []
  },
}
