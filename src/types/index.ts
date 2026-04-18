export type Status = 'Pendente' | 'Transcrito' | 'Analisado'

export interface Patient {
  id: string
  name: string
  age: number
  sex: 'M' | 'F'
}

export interface ResultItem {
  key: string
  name: string
  value: number
  unit: string
  refMin: number
  refMax: number
  interpretation?: string
  severity?: 'alto' | 'moderado' | 'baixo' | 'normal'
  differentialDiagnoses?: string[]
  relatedExams?: string[]
}

export interface ExamCategory {
  name: string
  items: ResultItem[]
}

export type Priority = 'Alta' | 'Média' | 'Baixa'
export type RecType = 'Nutricional' | 'Estilo de Vida' | 'Médica'

export interface Recommendation {
  id: string
  priority: Priority
  type: RecType
  text: string
  source: string
  suggestedFoods?: string[]
  avoidedFoods?: string[]
}

export type ProtocolStatus = 'ativo' | 'inativo' | 'pendente_catalogacao' | 'deprecado'

export interface ProtocoloExame {
  id: string
  Tipo_Exame: string
  Parametros_Esperados: { nome: string; unidade: string }[]
  Regras_Analise: Record<string, { min: number; max: number }>
  Interpretacao_Diagnostica_Geral: string
  Relacoes_Com_Outros_Exames: string[]
  Diagnosticos_Diferenciais: string[]
  Templates_Recomendacao_Nutricional: {
    condicao: string
    alimentos_sugeridos: string[]
    alimentos_evitados: string[]
  }[]
  Status: ProtocolStatus
  Data_Criacao: string
  Data_Atualizacao: string
  Fonte_Conhecimento: string
}

export interface Exam {
  id: string
  patientId: string
  date: string
  status: Status
  categories: ExamCategory[]
  recommendations: Recommendation[]
  audit?: {
    userId: string
    correlationId: string
    timestamp: string
  }
}
