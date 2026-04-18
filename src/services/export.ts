import { supabase } from '@/lib/supabase/client'

export const exportService = {
  async requestExport(params: {
    tipoRelatorio: string
    formato: string
    dataInicio?: string
    dataFim?: string
  }) {
    const { data, error } = await supabase.functions.invoke('export-report', {
      body: params,
    })
    if (error) throw error
    if (data.error) throw new Error(data.error)
    return data
  },

  async getExportHistory() {
    const { data, error } = await supabase
      .from('exportacao_relatorio' as any)
      .select('*')
      .order('data_criacao', { ascending: false })
      .limit(20)
    if (error) throw error
    return data
  },

  async logDownload(exportacaoId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await supabase.from('log_exportacao' as any).insert({
        exportacao_id: exportacaoId,
        usuario_id: user.id,
        acao: 'baixada',
        detalhes: 'Usuário baixou o relatório pelo dashboard',
      })
    } catch (e) {
      console.error('Erro ao registrar log de download', e)
    }
  },
}
