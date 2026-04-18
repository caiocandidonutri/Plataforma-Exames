CREATE TABLE IF NOT EXISTS public.metrica_monetizacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data DATE NOT NULL,
    mrr NUMERIC NOT NULL,
    arr NUMERIC NOT NULL,
    total_assinantes INTEGER NOT NULL,
    assinantes_ativos INTEGER NOT NULL,
    assinantes_cancelados INTEGER NOT NULL,
    assinantes_suspensos INTEGER NOT NULL,
    cac NUMERIC NOT NULL,
    ltv NUMERIC NOT NULL,
    churn_rate NUMERIC NOT NULL,
    ticket_medio NUMERIC NOT NULL,
    receita_novos_clientes NUMERIC NOT NULL,
    receita_clientes_existentes NUMERIC NOT NULL,
    custo_aquisicao_total NUMERIC NOT NULL,
    metadados JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.relatorio_assinante (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assinante_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    data_relatorio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    plano_atual TEXT NOT NULL,
    data_inicio_assinatura DATE NOT NULL,
    data_proxima_renovacao DATE NOT NULL,
    valor_mensal NUMERIC NOT NULL,
    status TEXT NOT NULL,
    motivo_cancelamento TEXT,
    tempo_assinatura_dias INTEGER NOT NULL,
    exames_processados INTEGER NOT NULL,
    relatorios_gerados INTEGER NOT NULL,
    conversas_whatsapp INTEGER NOT NULL,
    uso_plataforma_percentual INTEGER NOT NULL,
    risco_churn TEXT NOT NULL,
    recomendacao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.previsao_financeira (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_previsao DATE NOT NULL,
    periodo TEXT NOT NULL,
    mrr_previsto NUMERIC NOT NULL,
    arr_previsto NUMERIC NOT NULL,
    assinantes_previstos INTEGER NOT NULL,
    churn_previsto NUMERIC NOT NULL,
    receita_novos_clientes_prevista NUMERIC NOT NULL,
    cenario TEXT NOT NULL,
    confianca NUMERIC NOT NULL,
    metadados JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.metrica_monetizacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relatorio_assinante ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previsao_financeira ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_metrica_monetizacao" ON public.metrica_monetizacao;
CREATE POLICY "admin_all_metrica_monetizacao" ON public.metrica_monetizacao
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])));

DROP POLICY IF EXISTS "admin_all_relatorio_assinante" ON public.relatorio_assinante;
CREATE POLICY "admin_all_relatorio_assinante" ON public.relatorio_assinante
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])));

DROP POLICY IF EXISTS "admin_all_previsao_financeira" ON public.previsao_financeira;
CREATE POLICY "admin_all_previsao_financeira" ON public.previsao_financeira
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])));

-- Seed Dummy Data for the Dashboard
DO $$
DECLARE
    v_patient_id UUID;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.metrica_monetizacao LIMIT 1) THEN
        INSERT INTO public.metrica_monetizacao (data, mrr, arr, total_assinantes, assinantes_ativos, assinantes_cancelados, assinantes_suspensos, cac, ltv, churn_rate, ticket_medio, receita_novos_clientes, receita_clientes_existentes, custo_aquisicao_total)
        VALUES 
        (CURRENT_DATE - INTERVAL '5 months', 5000, 60000, 100, 90, 5, 5, 50, 1500, 0.05, 55.5, 1000, 4000, 1500),
        (CURRENT_DATE - INTERVAL '4 months', 5500, 66000, 110, 100, 6, 4, 48, 1550, 0.04, 55.0, 1100, 4400, 1400),
        (CURRENT_DATE - INTERVAL '3 months', 6200, 74400, 125, 115, 7, 3, 45, 1600, 0.045, 53.9, 1200, 5000, 1300),
        (CURRENT_DATE - INTERVAL '2 months', 7000, 84000, 140, 130, 8, 2, 42, 1650, 0.03, 53.8, 1500, 5500, 1200),
        (CURRENT_DATE - INTERVAL '1 month',  8500, 102000, 160, 150, 5, 5, 40, 1700, 0.02, 56.6, 2000, 6500, 1000),
        (CURRENT_DATE,                       10000, 120000, 180, 170, 4, 6, 38, 1800, 0.015, 58.8, 2500, 7500, 900);
    END IF;
    
    SELECT id INTO v_patient_id FROM public.patients LIMIT 1;
    IF v_patient_id IS NULL THEN
        v_patient_id := gen_random_uuid();
        INSERT INTO public.patients (id, name, phone, status, origin, priority_level)
        VALUES (v_patient_id, 'João Silva (Assinante)', '5511999999999', 'Active', 'website', 'high');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.relatorio_assinante LIMIT 1) THEN
        INSERT INTO public.relatorio_assinante (assinante_id, plano_atual, data_inicio_assinatura, data_proxima_renovacao, valor_mensal, status, tempo_assinatura_dias, exames_processados, relatorios_gerados, conversas_whatsapp, uso_plataforma_percentual, risco_churn, recomendacao)
        VALUES 
        (v_patient_id, 'pro', CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '10 days', 99.90, 'ativo', 180, 45, 40, 120, 85, 'baixo', 'Cliente engajado, oferecer upgrade anual.'),
        (v_patient_id, 'basico', CURRENT_DATE - INTERVAL '2 months', CURRENT_DATE - INTERVAL '5 days', 29.90, 'cancelado', 60, 2, 2, 5, 10, 'alto', 'Contato para entender motivo do cancelamento e oferecer desconto.'),
        (v_patient_id, 'empresa', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '20 days', 299.90, 'ativo', 30, 5, 3, 2, 25, 'alto', 'Baixo engajamento inicial. Agendar reunião de onboarding.');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.previsao_financeira LIMIT 1) THEN
        INSERT INTO public.previsao_financeira (data_previsao, periodo, mrr_previsto, arr_previsto, assinantes_previstos, churn_previsto, receita_novos_clientes_prevista, cenario, confianca)
        VALUES 
        (CURRENT_DATE + INTERVAL '1 month', 'proximo_mes', 10500, 126000, 190, 0.02, 1000, 'conservador', 90),
        (CURRENT_DATE + INTERVAL '1 month', 'proximo_mes', 11000, 132000, 195, 0.015, 1500, 'realista', 75),
        (CURRENT_DATE + INTERVAL '1 month', 'proximo_mes', 12000, 144000, 210, 0.01, 2500, 'otimista', 50);
    END IF;
END $$;
