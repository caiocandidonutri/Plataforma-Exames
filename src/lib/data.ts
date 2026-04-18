import { Patient, Exam, Recommendation, ResultItem, ProtocoloExame } from '@/types'

export const mockPatients: Record<string, Patient> = {
  'PT-001': {
    id: 'PT-001',
    name: 'Maria Silva',
    age: 45,
    sex: 'F',
    plan: 'pro',
    subscriptionStatus: 'ativo',
  },
  'PT-002': {
    id: 'PT-002',
    name: 'João Santos',
    age: 32,
    sex: 'M',
    plan: 'basic',
    subscriptionStatus: 'ativo',
  },
  'PT-003': {
    id: 'PT-003',
    name: 'Ana Costa',
    age: 58,
    sex: 'F',
    plan: 'basic',
    subscriptionStatus: 'expirado',
  },
}

export const mockAppointments = [
  {
    id: 'APP-001',
    patientId: 'PT-001',
    professionalName: 'Dr. Caio Cândido',
    date: '2026-04-20T10:00:00Z',
    type: 'Retorno Nutricional',
    status: 'confirmada' as const,
    calendarSynced: true,
  },
]

export const mockPayments = [
  {
    id: 'PAY-001',
    patientId: 'PT-001',
    amount: 149.9,
    date: '2026-03-15T12:00:00Z',
    method: 'credit_card' as const,
    status: 'succeeded' as const,
  },
]

const generateResults = (): ResultItem[] => [
  {
    key: 'hemo',
    name: 'Hemoglobina',
    value: 11.2,
    unit: 'g/dL',
    refMin: 12.0,
    refMax: 15.5,
    interpretation: 'Anemia leve detectada. Pode indicar deficiência de ferro.',
  },
  {
    key: 'leuco',
    name: 'Leucócitos',
    value: 7500,
    unit: '/mm³',
    refMin: 4500,
    refMax: 11000,
    interpretation: 'Valores normais. Sem sinais de infecção aguda.',
  },
  {
    key: 'plaq',
    name: 'Plaquetas',
    value: 250000,
    unit: '/mm³',
    refMin: 150000,
    refMax: 450000,
    interpretation: 'Coagulação dentro dos padrões esperados.',
  },
]

const generateLipid = (): ResultItem[] => [
  {
    key: 'col_t',
    name: 'Colesterol Total',
    value: 245,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 190,
    interpretation: 'Hipercolesterolemia. Risco cardiovascular aumentado.',
  },
  {
    key: 'hdl',
    name: 'HDL',
    value: 42,
    unit: 'mg/dL',
    refMin: 40,
    refMax: 60,
    interpretation: 'Nível limítrofe baixo. Importante aumentar atividade física.',
  },
  {
    key: 'ldl',
    name: 'LDL',
    value: 165,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 130,
    interpretation: 'LDL elevado. Requer intervenção dietética.',
  },
  {
    key: 'trig',
    name: 'Triglicerídeos',
    value: 180,
    unit: 'mg/dL',
    refMin: 0,
    refMax: 150,
    interpretation: 'Elevado. Associado a consumo excessivo de carboidratos.',
  },
]

const generateThyroid = (): ResultItem[] => [
  {
    key: 'tsh',
    name: 'TSH',
    value: 4.8,
    unit: 'µUI/mL',
    refMin: 0.4,
    refMax: 4.5,
    interpretation: 'Hipotireoidismo subclínico possível.',
  },
  {
    key: 't4l',
    name: 'T4 Livre',
    value: 1.1,
    unit: 'ng/dL',
    refMin: 0.9,
    refMax: 1.7,
    interpretation: 'Função tireoidiana periférica normal.',
  },
]

const generateDiabetes = (): ResultItem[] => [
  {
    key: 'glic',
    name: 'Glicemia em jejum',
    value: 105,
    unit: 'mg/dL',
    refMin: 70,
    refMax: 99,
    interpretation: 'Glicemia de jejum alterada (Pré-diabetes).',
  },
  {
    key: 'hba1c',
    name: 'HbA1c',
    value: 5.9,
    unit: '%',
    refMin: 4.0,
    refMax: 5.6,
    interpretation: 'Risco aumentado para desenvolvimento de diabetes.',
  },
]

export const mockExams: Exam[] = [
  {
    id: 'EX-2026-001',
    patientId: 'PT-001',
    date: '2026-04-15',
    status: 'Transcrito',
    categories: [
      { name: 'Hemograma Completo', items: generateResults() },
      { name: 'Perfil Lipídico', items: generateLipid() },
      { name: 'Avaliação Tireoidiana', items: generateThyroid() },
      { name: 'Marcadores de Diabetes', items: generateDiabetes() },
    ],
    recommendations: [],
  },
  {
    id: 'EX-2026-002',
    patientId: 'PT-002',
    date: '2026-04-16',
    status: 'Pendente',
    categories: [],
    recommendations: [],
  },
  {
    id: 'EX-2026-003',
    patientId: 'PT-003',
    date: '2026-04-17',
    status: 'Analisado',
    categories: [
      {
        name: 'Hemograma Completo',
        items: [
          {
            key: 'hemo',
            name: 'Hemoglobina',
            value: 14.2,
            unit: 'g/dL',
            refMin: 12.0,
            refMax: 15.5,
            interpretation: 'Normal.',
          },
        ],
      },
    ],
    recommendations: [
      {
        id: 'R1',
        priority: 'Baixa',
        type: 'Estilo de Vida',
        text: 'Manter rotina de exercícios.',
        source: 'Diretriz SBC 2025',
      },
    ],
  },
]

export const mockProtocols: ProtocoloExame[] = [
  {
    id: 'PROTO-HEMO',
    Tipo_Exame: 'Hemoglobina',
    Parametros_Esperados: [{ nome: 'Hemoglobina', unidade: 'g/dL' }],
    Regras_Analise: {
      F: { min: 12.0, max: 15.5 },
      M: { min: 13.5, max: 17.5 },
    },
    Interpretacao_Diagnostica_Geral: 'Proteína nos glóbulos vermelhos que transporta oxigênio.',
    Relacoes_Com_Outros_Exames: ['Ferritina', 'Ferro Sérico', 'Hematócrito'],
    Diagnosticos_Diferenciais: ['Anemia Ferropriva', 'Talassemia', 'Sangramento crônico'],
    Templates_Recomendacao_Nutricional: [
      {
        condicao: 'baixo',
        alimentos_sugeridos: ['Carnes vermelhas', 'Feijão', 'Espinafre', 'Fígado'],
        alimentos_evitados: ['Excesso de cálcio junto com ferro', 'Café logo após refeições'],
      },
    ],
    Status: 'ativo',
    Data_Criacao: '2026-04-18T10:00:00.000Z',
    Data_Atualizacao: '2026-04-18T10:00:00.000Z',
    Fonte_Conhecimento: 'Diretrizes Brasileiras de Hematologia',
  },
  {
    id: 'PROTO-VITD',
    Tipo_Exame: 'Vitamina D',
    Parametros_Esperados: [{ nome: '25-OH Vitamina D', unidade: 'ng/mL' }],
    Regras_Analise: {
      F: { min: 20, max: 60 },
      M: { min: 20, max: 60 },
    },
    Interpretacao_Diagnostica_Geral: 'Essencial para a absorção de cálcio e saúde óssea.',
    Relacoes_Com_Outros_Exames: ['Cálcio Ionizado', 'PTH', 'Fósforo'],
    Diagnosticos_Diferenciais: [
      'Osteoporose',
      'Hiperparatireoidismo Secundário',
      'Deficiência nutricional',
    ],
    Templates_Recomendacao_Nutricional: [
      {
        condicao: 'baixo',
        alimentos_sugeridos: ['Salmão', 'Sardinha', 'Gema de ovo', 'Cogumelos'],
        alimentos_evitados: [],
      },
    ],
    Status: 'ativo',
    Data_Criacao: '2026-04-18T10:00:00.000Z',
    Data_Atualizacao: '2026-04-18T10:00:00.000Z',
    Fonte_Conhecimento: 'Sociedade Brasileira de Endocrinologia e Metabologia',
  },
]

export const getAnalyzedRecommendations = (): Recommendation[] => [
  {
    id: 'REC-01',
    priority: 'Alta',
    type: 'Médica',
    text: 'Considerar introdução de estatina devido ao LDL de 165 mg/dL associado a outros fatores de risco.',
    source: 'Diretrizes Brasileiras de Dislipidemias (2025)',
  },
  {
    id: 'REC-02',
    priority: 'Média',
    type: 'Nutricional',
    text: 'Reduzir ingestão de carboidratos simples para controle de Triglicerídeos (180 mg/dL) e Glicemia (105 mg/dL).',
    source: 'Protocolo Nutricional ADA',
    suggestedFoods: ['Aveia', 'Vegetais folhosos', 'Peixes', 'Azeite de oliva'],
    avoidedFoods: ['Doces', 'Pão branco', 'Refrigerantes', 'Frituras'],
  },
  {
    id: 'REC-03',
    priority: 'Alta',
    type: 'Médica',
    text: 'Investigar causa da anemia (Hb 11.2 g/dL). Solicitar ferritina e ferro sérico.',
    source: 'Consenso Hematologia',
  },
  {
    id: 'REC-04',
    priority: 'Média',
    type: 'Estilo de Vida',
    text: 'Aumentar atividade física aeróbica para melhora do HDL (42 mg/dL).',
    source: 'Guia Prático de Medicina Esportiva',
  },
  {
    id: 'REC-05',
    priority: 'Baixa',
    type: 'Médica',
    text: 'Repetir TSH em 3 meses para acompanhamento de hipotireoidismo subclínico (4.8 µUI/mL).',
    source: 'Endocrine Society Guidelines',
  },
]
