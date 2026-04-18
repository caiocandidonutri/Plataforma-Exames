CREATE TABLE IF NOT EXISTS public.landing_page_variacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    subtitulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    profissao_alvo TEXT NOT NULL,
    beneficios_principais JSONB NOT NULL,
    cta_primario TEXT NOT NULL,
    cta_secundario TEXT,
    imagem_hero TEXT,
    cor_primaria TEXT,
    cor_secundaria TEXT,
    preco_destaque NUMERIC,
    taxa_conversao NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ativo',
    metadados JSONB,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.landing_page_variacoes ADD CONSTRAINT variacoes_profissao_unique UNIQUE (profissao_alvo);

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT,
    profissao TEXT NOT NULL,
    especialidade TEXT,
    cidade TEXT,
    estado TEXT,
    empresa TEXT,
    tamanho_empresa TEXT,
    origem TEXT NOT NULL,
    variacao_lp_id UUID REFERENCES public.landing_page_variacoes(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'novo',
    score_qualificacao INT,
    metadados JSONB,
    data_captura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_ultima_interacao TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_leads_profissao ON public.leads(profissao);
CREATE INDEX IF NOT EXISTS idx_leads_data_captura ON public.leads(data_captura);

ALTER TABLE public.landing_page_variacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Variacoes publicas" ON public.landing_page_variacoes;
CREATE POLICY "Variacoes publicas" ON public.landing_page_variacoes FOR SELECT USING (status = 'ativo');

DROP POLICY IF EXISTS "Inserir leads publico" ON public.leads;
CREATE POLICY "Inserir leads publico" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Ver leads admin" ON public.leads;
CREATE POLICY "Ver leads admin" ON public.leads FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'vendedora'))
);

INSERT INTO public.landing_page_variacoes (titulo, subtitulo, descricao, profissao_alvo, beneficios_principais, cta_primario, cta_secundario)
VALUES
('Para Nutricionistas: Análise de Exames em 5 Minutos', 'Transforme a forma como você interpreta exames de seus pacientes', 'O Dr. Exames ajuda nutricionistas a focar no que importa: o paciente.', 'nutricionista', '["Análise automática de 50+ tipos de exames", "Relatórios PDF personalizados em segundos", "Comunicação direta com pacientes via WhatsApp", "Dashboard com métricas de negócio"]'::jsonb, 'Começar Teste Gratuito', 'Ver Demonstração'),
('Para Médicos: Decisões Clínicas Mais Rápidas', 'Apoio diagnóstico e histórico completo ao alcance de um clique', 'Agilize a análise de laudos laboratoriais com inteligência.', 'medico', '["Triagem de casos críticos", "Histórico de 6 meses unificado", "Relatórios profissionais", "Alertas automáticos"]'::jsonb, 'Começar Teste Gratuito', 'Agendar Demo'),
('Solução Completa para Gestão de Clínicas', 'Otimize a operação, retenha pacientes e escale seu atendimento', 'O Dr. Exames é a plataforma definitiva para clínicas de ponta.', 'gestor', '["Visão gerencial de toda clínica", "Relatórios customizados com sua marca", "Automação de WhatsApp", "Métricas financeiras e retenção"]'::jsonb, 'Falar com Consultor', 'Ver Demonstração')
ON CONFLICT (profissao_alvo) DO NOTHING;
