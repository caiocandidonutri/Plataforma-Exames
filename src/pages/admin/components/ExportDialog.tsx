import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Download, Loader2 } from 'lucide-react'
import { exportService } from '@/services/export'
import { useToast } from '@/hooks/use-toast'

export function ExportDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState('completo')
  const [formato, setFormato] = useState('pdf')
  const { toast } = useToast()

  const handleExport = async () => {
    setLoading(true)
    try {
      await exportService.requestExport({
        tipoRelatorio: tipo,
        formato,
      })
      toast({
        title: 'Exportação iniciada',
        description: 'O relatório foi processado e já está disponível no histórico.',
      })
      setOpen(false)
    } catch (e: any) {
      toast({
        title: 'Erro na exportação',
        description: e.message || 'Ocorreu um erro ao solicitar a exportação.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Relatório</DialogTitle>
          <DialogDescription>
            Selecione o tipo de relatório e o formato desejado. O sistema registrará esta ação para
            auditoria LGPD.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completo">Relatório Completo</SelectItem>
                <SelectItem value="assinantes">Assinantes Ativos/Cancelados</SelectItem>
                <SelectItem value="financeiro">Métricas Financeiras</SelectItem>
                <SelectItem value="exames">Histórico de Exames</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={formato} onValueChange={setFormato}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF (Recomendado)</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Gerar Relatório
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
