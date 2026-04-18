CREATE TABLE IF NOT EXISTS public.clinica_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_clinica TEXT NOT NULL DEFAULT 'Sua Clínica',
    cnpj TEXT,
    registro_profissional TEXT,
    endereco TEXT,
    telefone TEXT,
    email_contato TEXT,
    logo_url TEXT,
    cor_primaria TEXT DEFAULT '#000000',
    cor_secundaria TEXT DEFAULT '#ffffff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.clinica_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "clinica_config_select" ON public.clinica_config;
CREATE POLICY "clinica_config_select" ON public.clinica_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "clinica_config_insert_admin" ON public.clinica_config;
CREATE POLICY "clinica_config_insert_admin" ON public.clinica_config FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing'))
);

DROP POLICY IF EXISTS "clinica_config_update_admin" ON public.clinica_config;
CREATE POLICY "clinica_config_update_admin" ON public.clinica_config FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'marketing'))
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('clinica_assets', 'clinica_assets', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "clinica_assets_select" ON storage.objects;
CREATE POLICY "clinica_assets_select" ON storage.objects FOR SELECT USING (bucket_id = 'clinica_assets');

DROP POLICY IF EXISTS "clinica_assets_insert" ON storage.objects;
CREATE POLICY "clinica_assets_insert" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'clinica_assets' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "clinica_assets_update" ON storage.objects;
CREATE POLICY "clinica_assets_update" ON storage.objects FOR UPDATE USING (
    bucket_id = 'clinica_assets' AND auth.role() = 'authenticated'
);

DROP POLICY IF EXISTS "clinica_assets_delete" ON storage.objects;
CREATE POLICY "clinica_assets_delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'clinica_assets' AND auth.role() = 'authenticated'
);

-- Insert default row if none exists
DO $DO$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.clinica_config) THEN
        INSERT INTO public.clinica_config (nome_clinica) VALUES ('Sua Clínica');
    END IF;
END $DO$;
