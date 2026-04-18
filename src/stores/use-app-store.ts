import { useSyncExternalStore } from 'react'
import { Exam, LabIntegration } from '@/types'

interface AppState {
  integrations: LabIntegration[]
  exams: Exam[]
}

let state: AppState = {
  integrations: [
    {
      id: 'INT-MOCK-1',
      patientId: 'PT-001',
      labName: 'Fleury',
      apiKey: 'YWVzMjU2OnZhbGlkLWtleS0xMjM=', // valid
      apiEndpoint: 'https://api.fleury.com.br/v1/webhook',
      status: 'ativo',
      configDate: new Date(Date.now() - 86400000).toISOString(),
      lastSyncDate: new Date(Date.now() - 3600000).toISOString(),
      type: 'webhook',
    },
    {
      id: 'INT-MOCK-2',
      patientId: 'PT-002',
      labName: 'Sabin',
      apiKey: 'YWVzMjU2OmludmFsaWQ=', // decrypted to 'invalid'
      apiEndpoint: 'https://api.sabin.com.br/v1/exams',
      status: 'erro',
      configDate: new Date(Date.now() - 172800000).toISOString(),
      type: 'polling',
    },
  ],
  exams: [],
}

const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => state

export const setAppState = (
  newState: Partial<AppState> | ((curr: AppState) => Partial<AppState>),
) => {
  const next = typeof newState === 'function' ? newState(state) : newState
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export default function useAppStore() {
  const storeState = useSyncExternalStore(subscribe, getSnapshot)

  return {
    ...storeState,
    addIntegration: (integration: LabIntegration) => {
      setAppState((prev) => ({ integrations: [...prev.integrations, integration] }))
    },
    updateIntegration: (id: string, updates: Partial<LabIntegration>) => {
      setAppState((prev) => ({
        integrations: prev.integrations.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      }))
    },
    addExam: (exam: Exam) => {
      setAppState((prev) => ({ exams: [...prev.exams, exam] }))
    },
    updateExam: (id: string, updates: Partial<Exam>) => {
      setAppState((prev) => ({
        exams: prev.exams.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }))
    },
  }
}
