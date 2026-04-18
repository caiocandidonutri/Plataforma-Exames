CREATE TABLE IF NOT EXISTS public.contatos_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profissional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especialidade TEXT NOT NULL,
  telefone TEXT NOT NULL,
  whatsapp_numero TEXT NOT NULL,
  whatsapp_ativo BOOLEAN NOT NULL DEFAULT true,
  email TEXT NOT NULL,
  horario_atendimento JSONB,
  bio TEXT,
  foto_perfil TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'indisponivel')),
  metadados JSONB,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.historico_whatsapp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES public.contatos_profissionais(id) ON DELETE CASCADE,
  mensagem_tipo TEXT NOT NULL CHECK (mensagem_tipo IN ('texto', 'arquivo', 'imagem', 'relatorio')),
  remetente TEXT NOT NULL CHECK (remetente IN ('paciente', 'profissional')),
  conteudo TEXT NOT NULL,
  arquivo_id UUID,
  data_envio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_leitura TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'enviado' CHECK (status IN ('enviado', 'entregue', 'lido')),
  whatsapp_message_id TEXT,
  metadados JSONB
);

ALTER TABLE public.contatos_profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_whatsapp ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contatos_profissionais_select" ON public.contatos_profissionais;
CREATE POLICY "contatos_profissionais_select" ON public.contatos_profissionais FOR SELECT USING (true);

DROP POLICY IF EXISTS "contatos_profissionais_all_admin" ON public.contatos_profissionais;
CREATE POLICY "contatos_profissionais_all_admin" ON public.contatos_profissionais FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing'))
);

DROP POLICY IF EXISTS "historico_whatsapp_select" ON public.historico_whatsapp;
CREATE POLICY "historico_whatsapp_select" ON public.historico_whatsapp FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedora', 'estagiaria', 'marketing'))
);

DROP POLICY IF EXISTS "historico_whatsapp_insert" ON public.historico_whatsapp;
CREATE POLICY "historico_whatsapp_insert" ON public.historico_whatsapp FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedora', 'estagiaria', 'marketing'))
);

DROP POLICY IF EXISTS "historico_whatsapp_update" ON public.historico_whatsapp;
CREATE POLICY "historico_whatsapp_update" ON public.historico_whatsapp FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedora', 'estagiaria', 'marketing'))
);

-- Seed mock professional data if possible
DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM auth.users LIMIT 1;
  
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO public.contatos_profissionais (profissional_id, nome, especialidade, telefone, whatsapp_numero, email)
    VALUES (v_admin_id, 'Dr. Caio Cândido', 'Nutricionista Esportivo', '+5511999999999', '+5511999999999', 'contato@drexames.com')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
