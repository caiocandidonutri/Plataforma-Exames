export type Status = 'Pendente' | 'Transcrito' | 'Analisado'

export type PlanType = 'basic' | 'pro'
export type SubscriptionStatus = 'ativo' | 'expirado' | 'cancelado' | 'suspenso' | 'trial'

export interface Patient {
  id: string
  name: string
  age: number
  sex: 'M' | 'F'
  plan: PlanType
  subscriptionStatus: SubscriptionStatus
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

export type IntegrationStatus = 'ativo' | 'inativo' | 'erro' | 'pendente_autenticacao'
export type IntegrationType = 'polling' | 'webhook'

export interface LabIntegration {
  id: string
  patientId: string
  labName: string
  apiKey: string
  apiEndpoint: string
  status: IntegrationStatus
  configDate: string
  lastSyncDate?: string
  metadata?: Record<string, any>
  type: IntegrationType
}

export interface Appointment {
  id: string
  patientId: string
  professionalName: string
  date: string
  type: string
  status: 'pendente' | 'confirmada' | 'cancelada'
  calendarSynced: boolean
}

export interface Payment {
  id: string
  patientId: string
  amount: number
  date: string
  method: 'credit_card' | 'pix' | 'boleto'
  status: 'succeeded' | 'failed' | 'pending'
}

export type TipoRelatorio = 'basico' | 'completo' | 'premium'
export type StatusUrgencia = 'normal' | 'moderado' | 'critico'

export interface RelatorioExame {
  id: string
  pacienteId: string
  exameId: string
  dataGeracao: string
  tipoRelatorio: TipoRelatorio
  statusUrgencia: StatusUrgencia
  urlDownload: string
  profissionalId?: string
  telefoneProfissional?: string
  emailProfissional?: string
  dataExpiracao?: string
  historicoExames?: any[]
  metadados?: Record<string, any>
}

export interface Exam {
  id: string
  patientId: string
  date: string
  status: Status
  categories: ExamCategory[]
  recommendations: Recommendation[]
  sourceLab?: string
  audit?: {
    userId: string
    correlationId: string
    timestamp: string
  }
}

export interface MetricaMonetizacao {
  id: string
  data: string
  mrr: number
  arr: number
  totalAssinantes: number
  assinantesAtivos: number
  assinantesCancelados: number
  assinantesSuspensos: number
  cac: number
  ltv: number
  churnRate: number
  ticketMedio: number
  receitaNovosClientes: number
  receitaClientesExistentes: number
  custoAquisicaoTotal: number
  metadados?: Record<string, any>
}

export interface RelatorioAssinante {
  id: string
  assinanteId: string
  dataRelatorio: string
  planoAtual: 'basico' | 'pro' | 'empresa'
  dataInicioAssinatura: string
  dataProximaRenovacao: string
  valorMensal: number
  status: 'ativo' | 'cancelado' | 'suspenso' | 'expirado'
  motivoCancelamento?: string
  tempoAssinaturaDias: number
  examesProcessados: number
  relatoriosGerados: number
  conversasWhatsapp: number
  usoPlataformaPercentual: number
  riscoChurn: 'baixo' | 'medio' | 'alto'
  recomendacao?: string
}

export interface PrevisaoFinanceira {
  id: string
  dataPrevisao: string
  periodo: 'proximo_mes' | 'proximo_trimestre' | 'proximo_ano'
  mrrPrevisto: number
  arrPrevisto: number
  assinantesPrevistos: number
  churnPrevisto: number
  receitaNovosClientesPrevista: number
  cenario: 'conservador' | 'realista' | 'otimista'
  confianca: number
  metadados?: Record<string, any>
}
