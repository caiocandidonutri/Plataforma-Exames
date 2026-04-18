import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { submitLead } from '@/services/leads'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '@/lib/analytics'

const formSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  profissao: z.string().min(1, 'Selecione uma profissão'),
  especialidade: z.string().optional(),
  tamanho_empresa: z.string().optional(),
  aceite: z.boolean().refine((val) => val === true, 'Aceite obrigatório'),
})

export function LeadForm({ variacaoId }: { variacaoId?: string }) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      profissao: '',
      especialidade: '',
      tamanho_empresa: '',
      aceite: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      trackEvent('form_submetido', { profissao: values.profissao })
      setLoading(true)
      await submitLead({
        nome: values.nome,
        email: values.email,
        telefone: values.telefone,
        profissao: values.profissao,
        especialidade: values.especialidade,
        tamanho_empresa: values.tamanho_empresa,
        origem: 'landing_page',
        variacao_lp_id: variacaoId,
      })
      navigate('/sucesso-lead')
    } catch (err: any) {
      trackEvent('form_erro', { error: err.message })
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card p-6 md:p-8 rounded-xl shadow-lg border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone (WhatsApp)</FormLabel>
                  <FormControl>
                    <Input placeholder="+55 11 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profissao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nutricionista">Nutricionista</SelectItem>
                      <SelectItem value="medico">Médico</SelectItem>
                      <SelectItem value="gestor">Gestor de Clínica</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="especialidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nutrição Esportiva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tamanho_empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho da Equipe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solo">Solo (Apenas eu)</SelectItem>
                      <SelectItem value="pequena">Pequena (2-5)</SelectItem>
                      <SelectItem value="media">Média (6-20)</SelectItem>
                      <SelectItem value="grande">Grande (21+)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="aceite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Aceito receber comunicações por e-mail e WhatsApp</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12 text-lg mt-4" disabled={loading}>
            {loading ? 'Processando...' : 'Começar Teste Gratuito'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
