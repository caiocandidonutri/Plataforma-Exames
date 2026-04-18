import { Patient, Exam, Recommendation, ResultItem } from '@/types'

export const mockPatients: Record<string, Patient> = {
  'PT-001': { id: 'PT-001', name: 'Maria Silva', age: 45, sex: 'F' },
  'PT-002': { id: 'PT-002', name: 'João Santos', age: 32, sex: 'M' },
  'PT-003': { id: 'PT-003', name: 'Ana Costa', age: 58, sex: 'F' },
}

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
