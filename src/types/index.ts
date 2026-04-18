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
}

export interface Exam {
  id: string
  patientId: string
  date: string
  status: Status
  categories: ExamCategory[]
  recommendations: Recommendation[]
}
