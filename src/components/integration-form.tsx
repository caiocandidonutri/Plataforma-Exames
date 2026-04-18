import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { encryptAES256 } from '@/lib/crypto'
import { LabIntegration } from '@/types'

const integrationSchema = z.object({
  labName: z.enum(['Fleury', 'Labtest', 'Sabin'], { required_error: 'Selecione um laboratório.' }),
  apiKey: z.string().min(1, 'Configuração inválida. Verifique a chave API e o endpoint.'),
  apiEndpoint: z.string().url('Configuração inválida. Verifique a chave API e o endpoint.'),
  type: z.enum(['polling', 'webhook']),
})

type Props = {
  onSuccess: (integration: LabIntegration) => void
  onCancel: () => void
}

export function IntegrationForm({ onSuccess, onCancel }: Props) {
  const form = useForm<z.infer<typeof integrationSchema>>({
    resolver: zodResolver(integrationSchema),
    defaultValues: { type: 'polling', apiKey: '', apiEndpoint: '', labName: 'Fleury' },
  })

  const onSubmit = (data: z.infer<typeof integrationSchema>) => {
    const newIntegration: LabIntegration = {
      id: `INT-${Date.now()}`,
      patientId: 'PT-001',
      labName: data.labName,
      apiKey: encryptAES256(data.apiKey),
      apiEndpoint: data.apiEndpoint,
      status: 'pendente_autenticacao',
      configDate: new Date().toISOString(),
      type: data.type,
    }
    toast.success('Integração configurada e salva com sucesso (Status: Pendente).')
    onSuccess(newIntegration)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="labName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Laboratório</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Fleury">Fleury</SelectItem>
                  <SelectItem value="Labtest">Labtest</SelectItem>
                  <SelectItem value="Sabin">Sabin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave API (Digite 'invalid' para simular erro)</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Insira a chave fornecida" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiEndpoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://api.laboratorio.com.br/v1/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Integração</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="polling">Polling (Agendado)</SelectItem>
                  <SelectItem value="webhook">Webhook (Tempo Real)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Integração</Button>
        </div>
      </form>
    </Form>
  )
}
