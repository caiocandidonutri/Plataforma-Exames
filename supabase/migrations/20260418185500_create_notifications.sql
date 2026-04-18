CREATE TABLE IF NOT EXISTS public.configuracoes_notificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_ativado BOOLEAN NOT NULL DEFAULT true,
  push_ativado BOOLEAN NOT NULL DEFAULT true,
  sms_ativado BOOLEAN NOT NULL DEFAULT false,
  frequencia_email TEXT NOT NULL DEFAULT 'diario' CHECK (frequencia_email IN ('imediato', 'diario', 'semanal', 'nunca')),
  frequencia_push TEXT NOT NULL DEFAULT 'imediato' CHECK (frequencia_push IN ('imediato', 'diario', 'semanal', 'nunca')),
  horario_preferido TIME,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  alertas_criticos BOOLEAN NOT NULL DEFAULT true,
  alertas_moderados BOOLEAN NOT NULL DEFAULT true,
  alertas_baixos BOOLEAN NOT NULL DEFAULT false,
  novos_pacientes BOOLEAN NOT NULL DEFAULT true,
  conversas_whatsapp BOOLEAN NOT NULL DEFAULT true,
  pagamentos_vencidos BOOLEAN NOT NULL DEFAULT true,
  relatorios_prontos BOOLEAN NOT NULL DEFAULT true,
  atualizacoes_plataforma BOOLEAN NOT NULL DEFAULT true,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_atualizacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadados JSONB,
  UNIQUE(usuario_id)
);

CREATE OR REPLACE FUNCTION public.update_config_notificacao_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_configuracoes_notificacao_modtime ON public.configuracoes_notificacao;
CREATE TRIGGER trg_configuracoes_notificacao_modtime
BEFORE UPDATE ON public.configuracoes_notificacao
FOR EACH ROW
EXECUTE FUNCTION public.update_config_notificacao_modtime();

CREATE TABLE IF NOT EXISTS public.template_notificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo_evento TEXT NOT NULL CHECK (tipo_evento IN ('exame_critico', 'exame_moderado', 'novo_paciente', 'conversa_whatsapp', 'pagamento_vencido', 'relatorio_pronto', 'atualizacao_plataforma')),
  assunto_email TEXT NOT NULL,
  corpo_email TEXT NOT NULL,
  titulo_push TEXT NOT NULL,
  corpo_push TEXT NOT NULL,
  corpo_sms TEXT,
  icone_push TEXT,
  prioridade TEXT NOT NULL CHECK (prioridade IN ('alta', 'media', 'baixa')),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadados JSONB
);

CREATE TABLE IF NOT EXISTS public.log_notificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_notificacao TEXT NOT NULL CHECK (tipo_notificacao IN ('email', 'push', 'sms')),
  assunto TEXT NOT NULL,
  corpo TEXT NOT NULL,
  severidade TEXT NOT NULL CHECK (severidade IN ('critica', 'moderada', 'baixa')),
  data_envio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  data_leitura TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'enviado' CHECK (status IN ('enviado', 'entregue', 'lido', 'falha', 'skipped')),
  motivo_falha TEXT,
  template_id UUID REFERENCES public.template_notificacao(id) ON DELETE SET NULL,
  metadados JSONB
);

INSERT INTO public.template_notificacao (nome, tipo_evento, assunto_email, corpo_email, titulo_push, corpo_push, corpo_sms, prioridade)
VALUES
  ('Exame Crítico', 'exame_critico', '⚠️ Alerta Crítico: Exame de {{paciente_nome}}', 'Olá,\n\nExame crítico detectado: {{tipo_exame}}\nValor: {{valor}} (referência: {{referencia}})\nAção recomendada: {{recomendacao}}\n\nAcesse o sistema para ver detalhes.', 'Exame Crítico: {{paciente_nome}}', '{{tipo_exame}} requer atenção imediata', 'Alerta Crítico: O exame {{tipo_exame}} de {{paciente_nome}} apresentou valor fora do padrão. Verifique o sistema.', 'alta'),
  ('Novo Paciente', 'novo_paciente', 'Novo paciente registrado: {{paciente_nome}}', 'Bem-vindo {{paciente_nome}}!\n\nEspecialidade de interesse: {{especialidade}}\n\nAcesse o perfil no sistema.', 'Novo Paciente', '{{paciente_nome}} se registrou', 'Novo paciente registrado: {{paciente_nome}} ({{especialidade}}).', 'baixa'),
  ('Relatório Pronto', 'relatorio_pronto', 'Seu relatório está pronto', 'O relatório de {{tipo_relatorio}} foi gerado com sucesso.\nPeríodo: {{data_inicio}} a {{data_fim}}.\n\nBaixe pelo sistema.', 'Relatório Pronto', '{{tipo_relatorio}} disponível para download', 'Seu relatório de {{tipo_relatorio}} foi concluído e está disponível no sistema.', 'media')
ON CONFLICT DO NOTHING;

ALTER TABLE public.configuracoes_notificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_notificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_notificacao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "config_select" ON public.configuracoes_notificacao;
CREATE POLICY "config_select" ON public.configuracoes_notificacao FOR SELECT TO authenticated USING (usuario_id = auth.uid());

DROP POLICY IF EXISTS "config_insert" ON public.configuracoes_notificacao;
CREATE POLICY "config_insert" ON public.configuracoes_notificacao FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "config_update" ON public.configuracoes_notificacao;
CREATE POLICY "config_update" ON public.configuracoes_notificacao FOR UPDATE TO authenticated USING (usuario_id = auth.uid()) WITH CHECK (usuario_id = auth.uid());

DROP POLICY IF EXISTS "template_select" ON public.template_notificacao;
CREATE POLICY "template_select" ON public.template_notificacao FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "log_select" ON public.log_notificacao;
CREATE POLICY "log_select" ON public.log_notificacao FOR SELECT TO authenticated USING (usuario_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing')));

DROP POLICY IF EXISTS "log_update" ON public.log_notificacao;
CREATE POLICY "log_update" ON public.log_notificacao FOR UPDATE TO authenticated USING (usuario_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user_notifications()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.configuracoes_notificacao (usuario_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_notifications ON auth.users;
CREATE TRIGGER on_auth_user_created_notifications
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_notifications();

DO $$
BEGIN
  INSERT INTO public.configuracoes_notificacao (usuario_id)
  SELECT id FROM auth.users
  ON CONFLICT (usuario_id) DO NOTHING;
END $$;
