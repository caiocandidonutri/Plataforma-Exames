import { useState, useRef, useCallback } from 'react'
import { UploadCloud, AlertCircle, Loader2, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { mockExams, mockProtocols, mockPatients } from '@/lib/data'
import { Exam, ResultItem, Recommendation, ProtocoloExame } from '@/types'
import { cn } from '@/lib/utils'

export function ExamUpload() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const navigate = useNavigate()

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileProcess = async (file: File) => {
    setError(null)
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type) || file.size > 50 * 1024 * 1024) {
      setError('Arquivo inválido. Formatos aceitos: PDF, JPG, PNG, GIF. Tamanho máximo: 50MB.')
      return
    }

    setIsUploading(true)

    // Simulate FLOW-04 (Analysis within 60s)
    await new Promise((r) => setTimeout(r, 2000))

    // Mock Confidence Logic based on file size (just for demonstration)
    const sizeKB = file.size / 1024
    const isVeryLowConfidence = sizeKB > 0 && sizeKB < 50
    const isLowConfidence = sizeKB >= 50 && sizeKB < 150
    const isUnknown = sizeKB >= 150 && sizeKB < 250

    if (isVeryLowConfidence) {
      setError(
        'Não foi possível extrair dados do arquivo ou identificar o exame com confiança. Tente novamente com uma imagem mais clara ou insira manualmente.',
      )
      setIsUploading(false)
      return
    }

    if (isLowConfidence) {
      toast({
        variant: 'destructive',
        title: 'Aviso de Confiança',
        description: 'Exame com baixa confiança na identificação. Revisão manual recomendada.',
      })
    }

    let protocol = isUnknown ? null : mockProtocols[0]

    if (!protocol) {
      const newProtocol: ProtocoloExame = {
        id: `PROTO-NEW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        Tipo_Exame: 'Exame Desconhecido',
        Parametros_Esperados: [],
        Regras_Analise: {},
        Interpretacao_Diagnostica_Geral: '',
        Relacoes_Com_Outros_Exames: [],
        Diagnosticos_Diferenciais: [],
        Templates_Recomendacao_Nutricional: [],
        Status: 'pendente_catalogacao',
        Data_Criacao: new Date().toISOString(),
        Data_Atualizacao: new Date().toISOString(),
        Fonte_Conhecimento: 'IA',
      }
      mockProtocols.push(newProtocol)

      toast({
        title: 'Novo Exame Detectado',
        description: 'Novo tipo de exame detectado. Protocolo em construção.',
      })
    }

    const examId = `EX-2026-${Math.floor(Math.random() * 1000 + 100)}`
    const patientId = 'PT-001'
    const patient = mockPatients[patientId]

    let items: ResultItem[] = []
    let recommendations: Recommendation[] = []

    if (protocol) {
      // Mock result value (triggering abnormal)
      const val = 11.0
      const rules = protocol.Regras_Analise[patient.sex]
      const isLow = val < rules?.min
      const isHigh = val > rules?.max
      const severity = isLow || isHigh ? 'alto' : 'normal'

      items.push({
        key: `${protocol.id.toLowerCase()}_1`,
        name: protocol.Parametros_Esperados[0]?.nome || protocol.Tipo_Exame,
        value: val,
        unit: protocol.Parametros_Esperados[0]?.unidade || '',
        refMin: rules?.min || 0,
        refMax: rules?.max || 100,
        interpretation: protocol.Interpretacao_Diagnostica_Geral,
        severity,
        differentialDiagnoses: protocol.Diagnosticos_Diferenciais,
        relatedExams: protocol.Relacoes_Com_Outros_Exames,
      })

      if ((isLow || isHigh) && protocol.Templates_Recomendacao_Nutricional.length > 0) {
        const condition = isLow ? 'baixo' : 'alto'
        const recTpl = protocol.Templates_Recomendacao_Nutricional.find(
          (t: any) => t.condicao === condition,
        )

        if (recTpl) {
          recommendations.push({
            id: `REC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            priority: severity === 'alto' ? 'Alta' : 'Média',
            type: 'Nutricional',
            text: `Recomendações baseadas nos resultados de ${protocol.Tipo_Exame}.`,
            source: protocol.Fonte_Conhecimento,
            suggestedFoods: recTpl.alimentos_sugeridos,
            avoidedFoods: recTpl.alimentos_evitados,
          })
        }
      }
    }

    const newExam: Exam = {
      id: examId,
      patientId,
      date: new Date().toISOString(),
      status: 'Analisado',
      categories: protocol ? [{ name: protocol.Tipo_Exame, items }] : [],
      recommendations,
      audit: {
        userId: 'USR-999',
        correlationId: `CORR-${Math.random().toString(36).slice(2, 10)}`,
        timestamp:
          new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).replace(' ', 'T') +
          'Z',
      },
    }

    mockExams.unshift(newExam)

    setIsUploading(false)
    setIsOpen(false)
    navigate(`/exame/${examId}`)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0])
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isUploading) {
      setIsOpen(false)
      setError(null)
    } else if (open) {
      setIsOpen(true)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm">
          <Upload className="w-4 h-4" />
          Novo Exame
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fazer Upload de Exame</DialogTitle>
          <DialogDescription>
            Faça upload do arquivo PDF ou imagem. O sistema irá extrair e analisar os dados
            automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            'mt-4 p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50',
            isUploading && 'pointer-events-none opacity-50',
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.gif"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-medium text-sm">Processando com IA...</p>
            </div>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-sm mb-1">Clique ou arraste o arquivo aqui</h3>
              <p className="text-xs text-muted-foreground">PDF, JPG, PNG, GIF (Max. 50MB)</p>
            </>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}
