import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  History,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { exportService } from '@/services/export'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'

export function ExportHistorySheet() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const loadHistory = async () => {
    if (!open) return
    setLoading(true)
    try {
      const data = await exportService.getExportHistory()
      setHistory(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [open])

  const getFormatIcon = (formato: string) => {
    switch (formato) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4 text-green-500" />
      case 'csv':
        return <FileJson className="w-4 h-4 text-blue-500" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="w-4 h-4" />
          Histórico
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Histórico de Exportações</SheetTitle>
          <SheetDescription>
            Visualize os relatórios gerados recentemente e baixe os arquivos (Links válidos por
            24h).
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 h-[calc(100vh-120px)]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
              <History className="w-8 h-8 mb-2 opacity-50" />
              Nenhuma exportação encontrada.
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(item.formato)}
                        <span className="font-medium capitalize">{item.tipo_relatorio}</span>
                      </div>
                      <Badge
                        variant={
                          item.status === 'pronto'
                            ? 'default'
                            : item.status === 'erro'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Solicitado em: {format(new Date(item.data_criacao), "dd/MM/yyyy 'às' HH:mm")}
                    </div>
                    {item.status === 'pronto' && item.url_download && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          exportService.logDownload(item.id)
                          window.open(item.url_download, '_blank')
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Arquivo
                      </Button>
                    )}
                    {item.status === 'erro' && (
                      <div className="flex items-center text-xs text-destructive bg-destructive/10 p-2 rounded">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Falha ao gerar relatório.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
