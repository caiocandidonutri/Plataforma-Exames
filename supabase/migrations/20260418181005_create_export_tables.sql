CREATE TABLE IF NOT EXISTS public.exportacao_relatorio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_relatorio TEXT NOT NULL CHECK (tipo_relatorio IN ('exames', 'assinantes', 'financeiro', 'completo')),
  formato TEXT NOT NULL CHECK (formato IN ('pdf', 'excel', 'csv')),
  data_inicio DATE,
  data_fim DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'pronto', 'erro')),
  url_download TEXT,
  tamanho_arquivo INTEGER,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_conclusao TIMESTAMPTZ,
  tempo_processamento INTEGER,
  metadados JSONB
);

CREATE TABLE IF NOT EXISTS public.log_exportacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exportacao_id UUID NOT NULL REFERENCES public.exportacao_relatorio(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  acao TEXT NOT NULL CHECK (acao IN ('criada', 'processando', 'pronta', 'erro', 'baixada', 'deletada')),
  data_acao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_origem TEXT,
  user_agent TEXT,
  detalhes TEXT
);

-- RLS
ALTER TABLE public.exportacao_relatorio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_exportacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "exportacao_relatorio_select" ON public.exportacao_relatorio;
CREATE POLICY "exportacao_relatorio_select" ON public.exportacao_relatorio FOR SELECT TO authenticated USING (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing')));

DROP POLICY IF EXISTS "exportacao_relatorio_insert" ON public.exportacao_relatorio;
CREATE POLICY "exportacao_relatorio_insert" ON public.exportacao_relatorio FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing')));

DROP POLICY IF EXISTS "exportacao_relatorio_update" ON public.exportacao_relatorio;
CREATE POLICY "exportacao_relatorio_update" ON public.exportacao_relatorio FOR UPDATE TO authenticated USING (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing')));

DROP POLICY IF EXISTS "log_exportacao_select" ON public.log_exportacao;
CREATE POLICY "log_exportacao_select" ON public.log_exportacao FOR SELECT TO authenticated USING (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing')));

DROP POLICY IF EXISTS "log_exportacao_insert" ON public.log_exportacao;
CREATE POLICY "log_exportacao_insert" ON public.log_exportacao FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing')));

-- Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('relatorios', 'relatorios', false) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
CREATE POLICY "Give users access to own folder" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'relatorios' AND (auth.uid()::text = (storage.foldername(name))[1] OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing'))));

DROP POLICY IF EXISTS "Give users upload access" ON storage.objects;
CREATE POLICY "Give users upload access" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'relatorios' AND auth.uid()::text = (storage.foldername(name))[1]);
