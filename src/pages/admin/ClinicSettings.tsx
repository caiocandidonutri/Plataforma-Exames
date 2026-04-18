import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Building2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function ClinicSettings() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('clinica_config' as any)
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setConfig(data)
      } else {
        setConfig({
          nome_clinica: 'Sua Clínica',
          cor_primaria: '#000000',
          cor_secundaria: '#ffffff',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar configurações',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (config.id) {
        const { error } = await supabase
          .from('clinica_config' as any)
          .update({
            nome_clinica: config.nome_clinica,
            cnpj: config.cnpj,
            registro_profissional: config.registro_profissional,
            endereco: config.endereco,
            telefone: config.telefone,
            email_contato: config.email_contato,
            cor_primaria: config.cor_primaria,
            cor_secundaria: config.cor_secundaria,
            updated_at: new Date().toISOString(),
          })
          .eq('id', config.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('clinica_config' as any)
          .insert([config])
          .select()
          .single()
        if (error) throw error
        if (data) setConfig(data)
      }

      toast({
        title: 'Sucesso',
        description: 'Configurações de identidade e branding atualizadas com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const filePath = `logo-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('clinica_assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('clinica_assets').getPublicUrl(filePath)

      const logoUrl = publicUrlData.publicUrl

      if (config?.id) {
        const { error: updateError } = await supabase
          .from('clinica_config' as any)
          .update({ logo_url: logoUrl })
          .eq('id', config.id)
        if (updateError) throw updateError
      }

      setConfig((prev: any) => ({ ...prev, logo_url: logoUrl }))

      toast({
        title: 'Logo atualizada',
        description: 'O logotipo da clínica foi atualizado com sucesso.',
      })
    } catch (error: any) {
      toast({
        title: 'Erro no upload',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Identidade da Clínica</h1>
        <p className="text-muted-foreground">
          Gerencie o logotipo, as cores da marca e os dados da sua instituição que aparecerão na
          plataforma e nos relatórios.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Identidade Visual
            </CardTitle>
            <CardDescription>
              Faça o upload do seu logotipo e escolha as cores da marca.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {config?.logo_url ? (
                  <div className="relative h-32 w-32 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={config.logo_url}
                      alt="Logo da clínica"
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-lg border border-dashed flex items-center justify-center bg-muted/50">
                    <Building2 className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo">Logotipo</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recomendado: PNG ou JPG transparente, proporção 1:1 ou 16:9.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="max-w-[250px]"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                    {uploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cor_primaria">Cor Primária (Tema)</Label>
                <div className="flex gap-2">
                  <Input
                    id="cor_primaria"
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    value={config?.cor_primaria || '#000000'}
                    onChange={(e) => setConfig({ ...config, cor_primaria: e.target.value })}
                  />
                  <Input
                    type="text"
                    value={config?.cor_primaria || '#000000'}
                    onChange={(e) => setConfig({ ...config, cor_primaria: e.target.value })}
                    className="font-mono uppercase"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cor_secundaria">Cor Secundária (Detalhes)</Label>
                <div className="flex gap-2">
                  <Input
                    id="cor_secundaria"
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                    value={config?.cor_secundaria || '#ffffff'}
                    onChange={(e) => setConfig({ ...config, cor_secundaria: e.target.value })}
                  />
                  <Input
                    type="text"
                    value={config?.cor_secundaria || '#ffffff'}
                    onChange={(e) => setConfig({ ...config, cor_secundaria: e.target.value })}
                    className="font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dados Institucionais</CardTitle>
            <CardDescription>
              Informações que aparecerão em rodapés e cabeçalhos de relatórios e exames.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_clinica">Nome da Clínica / Profissional</Label>
                  <Input
                    id="nome_clinica"
                    value={config?.nome_clinica || ''}
                    onChange={(e) => setConfig({ ...config, nome_clinica: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ / CPF</Label>
                  <Input
                    id="cnpj"
                    value={config?.cnpj || ''}
                    onChange={(e) => setConfig({ ...config, cnpj: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registro_profissional">Registro Profissional (CRM/CRN/CRO)</Label>
                  <Input
                    id="registro_profissional"
                    value={config?.registro_profissional || ''}
                    onChange={(e) =>
                      setConfig({ ...config, registro_profissional: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_contato">E-mail de Contato</Label>
                  <Input
                    id="email_contato"
                    type="email"
                    value={config?.email_contato || ''}
                    onChange={(e) => setConfig({ ...config, email_contato: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    value={config?.endereco || ''}
                    onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                  <Input
                    id="telefone"
                    value={config?.telefone || ''}
                    onChange={(e) => setConfig({ ...config, telefone: e.target.value })}
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Configurações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
