// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      ai_personas: {
        Row: {
          created_at: string
          id: string
          knowledge_base: string
          name: string
          system_prompt: string
        }
        Insert: {
          created_at?: string
          id?: string
          knowledge_base: string
          name: string
          system_prompt: string
        }
        Update: {
          created_at?: string
          id?: string
          knowledge_base?: string
          name?: string
          system_prompt?: string
        }
        Relationships: []
      }
      api_settings: {
        Row: {
          access_token: string
          api_version: string | null
          business_id: string | null
          business_public_key: string | null
          connection_status: string | null
          display_phone_number: string | null
          encryption_status: string | null
          id: string
          migration_intent_id: string | null
          phone_name: string | null
          phone_number_id: string
          solution_id: string | null
          updated_at: string | null
          waba_id: string
        }
        Insert: {
          access_token: string
          api_version?: string | null
          business_id?: string | null
          business_public_key?: string | null
          connection_status?: string | null
          display_phone_number?: string | null
          encryption_status?: string | null
          id?: string
          migration_intent_id?: string | null
          phone_name?: string | null
          phone_number_id: string
          solution_id?: string | null
          updated_at?: string | null
          waba_id: string
        }
        Update: {
          access_token?: string
          api_version?: string | null
          business_id?: string | null
          business_public_key?: string | null
          connection_status?: string | null
          display_phone_number?: string | null
          encryption_status?: string | null
          id?: string
          migration_intent_id?: string | null
          phone_name?: string | null
          phone_number_id?: string
          solution_id?: string | null
          updated_at?: string | null
          waba_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          created_at: string
          id: string
          location: string | null
          patient_id: string | null
          status: string
        }
        Insert: {
          appointment_date: string
          created_at?: string
          id?: string
          location?: string | null
          patient_id?: string | null
          status?: string
        }
        Update: {
          appointment_date?: string
          created_at?: string
          id?: string
          location?: string | null
          patient_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      automated_flows: {
        Row: {
          attachment_url: string | null
          created_at: string
          flow_type: string
          has_attachment: boolean | null
          id: string
          patient_id: string | null
          scheduled_date: string
          status: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          flow_type: string
          has_attachment?: boolean | null
          id?: string
          patient_id?: string | null
          scheduled_date: string
          status?: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          flow_type?: string
          has_attachment?: boolean | null
          id?: string
          patient_id?: string | null
          scheduled_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'automated_flows_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      broadcasts: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: 'broadcasts_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      contatos_profissionais: {
        Row: {
          bio: string | null
          data_criacao: string
          email: string
          especialidade: string
          foto_perfil: string | null
          horario_atendimento: Json | null
          id: string
          metadados: Json | null
          nome: string
          profissional_id: string | null
          status: string
          telefone: string
          whatsapp_ativo: boolean
          whatsapp_numero: string
        }
        Insert: {
          bio?: string | null
          data_criacao?: string
          email: string
          especialidade: string
          foto_perfil?: string | null
          horario_atendimento?: Json | null
          id?: string
          metadados?: Json | null
          nome: string
          profissional_id?: string | null
          status?: string
          telefone: string
          whatsapp_ativo?: boolean
          whatsapp_numero: string
        }
        Update: {
          bio?: string | null
          data_criacao?: string
          email?: string
          especialidade?: string
          foto_perfil?: string | null
          horario_atendimento?: Json | null
          id?: string
          metadados?: Json | null
          nome?: string
          profissional_id?: string | null
          status?: string
          telefone?: string
          whatsapp_ativo?: boolean
          whatsapp_numero?: string
        }
        Relationships: []
      }
      financial_records: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          description: string
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      global_settings: {
        Row: {
          id: string
          key: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          value?: Json
        }
        Relationships: []
      }
      historico_whatsapp: {
        Row: {
          arquivo_id: string | null
          conteudo: string
          data_envio: string
          data_leitura: string | null
          id: string
          mensagem_tipo: string
          metadados: Json | null
          paciente_id: string | null
          profissional_id: string | null
          remetente: string
          status: string
          whatsapp_message_id: string | null
        }
        Insert: {
          arquivo_id?: string | null
          conteudo: string
          data_envio?: string
          data_leitura?: string | null
          id?: string
          mensagem_tipo: string
          metadados?: Json | null
          paciente_id?: string | null
          profissional_id?: string | null
          remetente: string
          status?: string
          whatsapp_message_id?: string | null
        }
        Update: {
          arquivo_id?: string | null
          conteudo?: string
          data_envio?: string
          data_leitura?: string | null
          id?: string
          mensagem_tipo?: string
          metadados?: Json | null
          paciente_id?: string | null
          profissional_id?: string | null
          remetente?: string
          status?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'historico_whatsapp_paciente_id_fkey'
            columns: ['paciente_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_whatsapp_profissional_id_fkey'
            columns: ['profissional_id']
            isOneToOne: false
            referencedRelation: 'contatos_profissionais'
            referencedColumns: ['id']
          },
        ]
      }
      landing_page_variacoes: {
        Row: {
          beneficios_principais: Json
          cor_primaria: string | null
          cor_secundaria: string | null
          cta_primario: string
          cta_secundario: string | null
          data_criacao: string
          descricao: string
          id: string
          imagem_hero: string | null
          metadados: Json | null
          preco_destaque: number | null
          profissao_alvo: string
          status: string
          subtitulo: string
          taxa_conversao: number | null
          titulo: string
        }
        Insert: {
          beneficios_principais: Json
          cor_primaria?: string | null
          cor_secundaria?: string | null
          cta_primario: string
          cta_secundario?: string | null
          data_criacao?: string
          descricao: string
          id?: string
          imagem_hero?: string | null
          metadados?: Json | null
          preco_destaque?: number | null
          profissao_alvo: string
          status?: string
          subtitulo: string
          taxa_conversao?: number | null
          titulo: string
        }
        Update: {
          beneficios_principais?: Json
          cor_primaria?: string | null
          cor_secundaria?: string | null
          cta_primario?: string
          cta_secundario?: string | null
          data_criacao?: string
          descricao?: string
          id?: string
          imagem_hero?: string | null
          metadados?: Json | null
          preco_destaque?: number | null
          profissao_alvo?: string
          status?: string
          subtitulo?: string
          taxa_conversao?: number | null
          titulo?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          cidade: string | null
          data_captura: string
          data_ultima_interacao: string | null
          email: string
          empresa: string | null
          especialidade: string | null
          estado: string | null
          id: string
          metadados: Json | null
          nome: string
          origem: string
          profissao: string
          score_qualificacao: number | null
          status: string
          tamanho_empresa: string | null
          telefone: string | null
          variacao_lp_id: string | null
        }
        Insert: {
          cidade?: string | null
          data_captura?: string
          data_ultima_interacao?: string | null
          email: string
          empresa?: string | null
          especialidade?: string | null
          estado?: string | null
          id?: string
          metadados?: Json | null
          nome: string
          origem: string
          profissao: string
          score_qualificacao?: number | null
          status?: string
          tamanho_empresa?: string | null
          telefone?: string | null
          variacao_lp_id?: string | null
        }
        Update: {
          cidade?: string | null
          data_captura?: string
          data_ultima_interacao?: string | null
          email?: string
          empresa?: string | null
          especialidade?: string | null
          estado?: string | null
          id?: string
          metadados?: Json | null
          nome?: string
          origem?: string
          profissao?: string
          score_qualificacao?: number | null
          status?: string
          tamanho_empresa?: string | null
          telefone?: string | null
          variacao_lp_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'leads_variacao_lp_id_fkey'
            columns: ['variacao_lp_id']
            isOneToOne: false
            referencedRelation: 'landing_page_variacoes'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          broadcast_id: string | null
          content: string
          created_at: string
          id: string
          patient_id: string | null
          platform: string
          sender_type: string
          status: string
        }
        Insert: {
          broadcast_id?: string | null
          content: string
          created_at?: string
          id?: string
          patient_id?: string | null
          platform?: string
          sender_type: string
          status?: string
        }
        Update: {
          broadcast_id?: string | null
          content?: string
          created_at?: string
          id?: string
          patient_id?: string | null
          platform?: string
          sender_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_broadcast_id_fkey'
            columns: ['broadcast_id']
            isOneToOne: false
            referencedRelation: 'broadcasts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      metrica_monetizacao: {
        Row: {
          arr: number
          assinantes_ativos: number
          assinantes_cancelados: number
          assinantes_suspensos: number
          cac: number
          churn_rate: number
          created_at: string
          custo_aquisicao_total: number
          data: string
          id: string
          ltv: number
          metadados: Json | null
          mrr: number
          receita_clientes_existentes: number
          receita_novos_clientes: number
          ticket_medio: number
          total_assinantes: number
        }
        Insert: {
          arr: number
          assinantes_ativos: number
          assinantes_cancelados: number
          assinantes_suspensos: number
          cac: number
          churn_rate: number
          created_at?: string
          custo_aquisicao_total: number
          data: string
          id?: string
          ltv: number
          metadados?: Json | null
          mrr: number
          receita_clientes_existentes: number
          receita_novos_clientes: number
          ticket_medio: number
          total_assinantes: number
        }
        Update: {
          arr?: number
          assinantes_ativos?: number
          assinantes_cancelados?: number
          assinantes_suspensos?: number
          cac?: number
          churn_rate?: number
          created_at?: string
          custo_aquisicao_total?: number
          data?: string
          id?: string
          ltv?: number
          metadados?: Json | null
          mrr?: number
          receita_clientes_existentes?: number
          receita_novos_clientes?: number
          ticket_medio?: number
          total_assinantes?: number
        }
        Relationships: []
      }
      patients: {
        Row: {
          ai_enabled: boolean
          created_at: string
          id: string
          last_interaction: string | null
          name: string
          needs_attention: boolean
          origin: string
          phone: string | null
          priority_level: string
          status: string
        }
        Insert: {
          ai_enabled?: boolean
          created_at?: string
          id?: string
          last_interaction?: string | null
          name: string
          needs_attention?: boolean
          origin?: string
          phone?: string | null
          priority_level?: string
          status?: string
        }
        Update: {
          ai_enabled?: boolean
          created_at?: string
          id?: string
          last_interaction?: string | null
          name?: string
          needs_attention?: boolean
          origin?: string
          phone?: string | null
          priority_level?: string
          status?: string
        }
        Relationships: []
      }
      previsao_financeira: {
        Row: {
          arr_previsto: number
          assinantes_previstos: number
          cenario: string
          churn_previsto: number
          confianca: number
          created_at: string
          data_previsao: string
          id: string
          metadados: Json | null
          mrr_previsto: number
          periodo: string
          receita_novos_clientes_prevista: number
        }
        Insert: {
          arr_previsto: number
          assinantes_previstos: number
          cenario: string
          churn_previsto: number
          confianca: number
          created_at?: string
          data_previsao: string
          id?: string
          metadados?: Json | null
          mrr_previsto: number
          periodo: string
          receita_novos_clientes_prevista: number
        }
        Update: {
          arr_previsto?: number
          assinantes_previstos?: number
          cenario?: string
          churn_previsto?: number
          confianca?: number
          created_at?: string
          data_previsao?: string
          id?: string
          metadados?: Json | null
          mrr_previsto?: number
          periodo?: string
          receita_novos_clientes_prevista?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          role: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id: string
          is_active?: boolean
          role?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          role?: string
        }
        Relationships: []
      }
      relatorio_assinante: {
        Row: {
          assinante_id: string
          conversas_whatsapp: number
          created_at: string
          data_inicio_assinatura: string
          data_proxima_renovacao: string
          data_relatorio: string
          exames_processados: number
          id: string
          motivo_cancelamento: string | null
          plano_atual: string
          recomendacao: string | null
          relatorios_gerados: number
          risco_churn: string
          status: string
          tempo_assinatura_dias: number
          uso_plataforma_percentual: number
          valor_mensal: number
        }
        Insert: {
          assinante_id: string
          conversas_whatsapp: number
          created_at?: string
          data_inicio_assinatura: string
          data_proxima_renovacao: string
          data_relatorio?: string
          exames_processados: number
          id?: string
          motivo_cancelamento?: string | null
          plano_atual: string
          recomendacao?: string | null
          relatorios_gerados: number
          risco_churn: string
          status: string
          tempo_assinatura_dias: number
          uso_plataforma_percentual: number
          valor_mensal: number
        }
        Update: {
          assinante_id?: string
          conversas_whatsapp?: number
          created_at?: string
          data_inicio_assinatura?: string
          data_proxima_renovacao?: string
          data_relatorio?: string
          exames_processados?: number
          id?: string
          motivo_cancelamento?: string | null
          plano_atual?: string
          recomendacao?: string | null
          relatorios_gerados?: number
          risco_churn?: string
          status?: string
          tempo_assinatura_dias?: number
          uso_plataforma_percentual?: number
          valor_mensal?: number
        }
        Relationships: [
          {
            foreignKeyName: 'relatorio_assinante_assinante_id_fkey'
            columns: ['assinante_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      social_connections: {
        Row: {
          access_token: string | null
          id: string
          owner_id: string | null
          page_id: string | null
          persona_id: string | null
          platform: string
          status: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          id?: string
          owner_id?: string | null
          page_id?: string | null
          persona_id?: string | null
          platform: string
          status?: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          id?: string
          owner_id?: string | null
          page_id?: string | null
          persona_id?: string | null
          platform?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'social_connections_persona_id_fkey'
            columns: ['persona_id']
            isOneToOne: false
            referencedRelation: 'ai_personas'
            referencedColumns: ['id']
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          created_at: string
          friendly_name: string | null
          id: string
          instance_key: string
          instance_name: string
          owner_id: string
          persona_id: string | null
          phone_number: string | null
          qr_code_base64: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          friendly_name?: string | null
          id?: string
          instance_key: string
          instance_name: string
          owner_id: string
          persona_id?: string | null
          phone_number?: string | null
          qr_code_base64?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          friendly_name?: string | null
          id?: string
          instance_key?: string
          instance_name?: string
          owner_id?: string
          persona_id?: string | null
          phone_number?: string | null
          qr_code_base64?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'whatsapp_instances_owner_id_fkey'
            columns: ['owner_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'whatsapp_instances_persona_id_fkey'
            columns: ['persona_id']
            isOneToOne: false
            referencedRelation: 'ai_personas'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_manage_user: {
        Args: {
          p_action: string
          p_email: string
          p_full_name: string
          p_is_active: boolean
          p_password: string
          p_role: string
          p_user_id: string
        }
        Returns: Json
      }
      get_marketing_metrics: { Args: never; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: ai_personas
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   system_prompt: text (not null)
//   knowledge_base: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: api_settings
//   id: uuid (not null, default: gen_random_uuid())
//   waba_id: text (not null)
//   phone_number_id: text (not null)
//   access_token: text (not null)
//   api_version: text (nullable, default: 'v21.0'::text)
//   updated_at: timestamp with time zone (nullable, default: now())
//   solution_id: text (nullable)
//   business_id: text (nullable)
//   business_public_key: text (nullable)
//   encryption_status: text (nullable)
//   migration_intent_id: text (nullable)
//   phone_name: text (nullable)
//   display_phone_number: text (nullable)
//   connection_status: text (nullable, default: 'disconnected'::text)
// Table: appointments
//   id: uuid (not null, default: gen_random_uuid())
//   patient_id: uuid (nullable)
//   appointment_date: timestamp with time zone (not null)
//   status: text (not null, default: 'scheduled'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   location: text (nullable, default: 'Todas as Cidades'::text)
// Table: automated_flows
//   id: uuid (not null, default: gen_random_uuid())
//   patient_id: uuid (nullable)
//   flow_type: text (not null)
//   scheduled_date: timestamp with time zone (not null)
//   status: text (not null, default: 'pending'::text)
//   has_attachment: boolean (nullable, default: false)
//   attachment_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: broadcasts
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   type: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   created_by: uuid (nullable)
// Table: contatos_profissionais
//   id: uuid (not null, default: gen_random_uuid())
//   profissional_id: uuid (nullable)
//   nome: text (not null)
//   especialidade: text (not null)
//   telefone: text (not null)
//   whatsapp_numero: text (not null)
//   whatsapp_ativo: boolean (not null, default: true)
//   email: text (not null)
//   horario_atendimento: jsonb (nullable)
//   bio: text (nullable)
//   foto_perfil: text (nullable)
//   status: text (not null, default: 'ativo'::text)
//   metadados: jsonb (nullable)
//   data_criacao: timestamp with time zone (not null, default: now())
// Table: financial_records
//   id: uuid (not null, default: gen_random_uuid())
//   amount: numeric (not null)
//   description: text (not null)
//   date: timestamp with time zone (not null, default: now())
//   created_at: timestamp with time zone (not null, default: now())
// Table: global_settings
//   id: uuid (not null, default: gen_random_uuid())
//   key: text (not null)
//   value: jsonb (not null)
// Table: historico_whatsapp
//   id: uuid (not null, default: gen_random_uuid())
//   paciente_id: uuid (nullable)
//   profissional_id: uuid (nullable)
//   mensagem_tipo: text (not null)
//   remetente: text (not null)
//   conteudo: text (not null)
//   arquivo_id: uuid (nullable)
//   data_envio: timestamp with time zone (not null, default: now())
//   data_leitura: timestamp with time zone (nullable)
//   status: text (not null, default: 'enviado'::text)
//   whatsapp_message_id: text (nullable)
//   metadados: jsonb (nullable)
// Table: landing_page_variacoes
//   id: uuid (not null, default: gen_random_uuid())
//   titulo: text (not null)
//   subtitulo: text (not null)
//   descricao: text (not null)
//   profissao_alvo: text (not null)
//   beneficios_principais: jsonb (not null)
//   cta_primario: text (not null)
//   cta_secundario: text (nullable)
//   imagem_hero: text (nullable)
//   cor_primaria: text (nullable)
//   cor_secundaria: text (nullable)
//   preco_destaque: numeric (nullable)
//   taxa_conversao: numeric (nullable, default: 0)
//   status: text (not null, default: 'ativo'::text)
//   metadados: jsonb (nullable)
//   data_criacao: timestamp with time zone (not null, default: now())
// Table: leads
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   email: text (not null)
//   telefone: text (nullable)
//   profissao: text (not null)
//   especialidade: text (nullable)
//   cidade: text (nullable)
//   estado: text (nullable)
//   empresa: text (nullable)
//   tamanho_empresa: text (nullable)
//   origem: text (not null)
//   variacao_lp_id: uuid (nullable)
//   status: text (not null, default: 'novo'::text)
//   score_qualificacao: integer (nullable)
//   metadados: jsonb (nullable)
//   data_captura: timestamp with time zone (not null, default: now())
//   data_ultima_interacao: timestamp with time zone (nullable)
// Table: messages
//   id: uuid (not null, default: gen_random_uuid())
//   patient_id: uuid (nullable)
//   content: text (not null)
//   sender_type: text (not null)
//   platform: text (not null, default: 'whatsapp'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   status: text (not null, default: 'sent'::text)
//   broadcast_id: uuid (nullable)
// Table: metrica_monetizacao
//   id: uuid (not null, default: gen_random_uuid())
//   data: date (not null)
//   mrr: numeric (not null)
//   arr: numeric (not null)
//   total_assinantes: integer (not null)
//   assinantes_ativos: integer (not null)
//   assinantes_cancelados: integer (not null)
//   assinantes_suspensos: integer (not null)
//   cac: numeric (not null)
//   ltv: numeric (not null)
//   churn_rate: numeric (not null)
//   ticket_medio: numeric (not null)
//   receita_novos_clientes: numeric (not null)
//   receita_clientes_existentes: numeric (not null)
//   custo_aquisicao_total: numeric (not null)
//   metadados: jsonb (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: patients
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   phone: text (nullable)
//   status: text (not null, default: 'Interested'::text)
//   last_interaction: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (not null, default: now())
//   origin: text (not null, default: 'whatsapp'::text)
//   needs_attention: boolean (not null, default: false)
//   priority_level: text (not null, default: 'medium'::text)
//   ai_enabled: boolean (not null, default: true)
// Table: previsao_financeira
//   id: uuid (not null, default: gen_random_uuid())
//   data_previsao: date (not null)
//   periodo: text (not null)
//   mrr_previsto: numeric (not null)
//   arr_previsto: numeric (not null)
//   assinantes_previstos: integer (not null)
//   churn_previsto: numeric (not null)
//   receita_novos_clientes_prevista: numeric (not null)
//   cenario: text (not null)
//   confianca: numeric (not null)
//   metadados: jsonb (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   full_name: text (not null)
//   role: text (not null, default: 'staff'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   is_active: boolean (not null, default: true)
//   email: text (nullable)
// Table: relatorio_assinante
//   id: uuid (not null, default: gen_random_uuid())
//   assinante_id: uuid (not null)
//   data_relatorio: timestamp with time zone (not null, default: now())
//   plano_atual: text (not null)
//   data_inicio_assinatura: date (not null)
//   data_proxima_renovacao: date (not null)
//   valor_mensal: numeric (not null)
//   status: text (not null)
//   motivo_cancelamento: text (nullable)
//   tempo_assinatura_dias: integer (not null)
//   exames_processados: integer (not null)
//   relatorios_gerados: integer (not null)
//   conversas_whatsapp: integer (not null)
//   uso_plataforma_percentual: integer (not null)
//   risco_churn: text (not null)
//   recomendacao: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: social_connections
//   id: uuid (not null, default: gen_random_uuid())
//   platform: text (not null)
//   status: text (not null, default: 'disconnected'::text)
//   access_token: text (nullable)
//   page_id: text (nullable)
//   persona_id: uuid (nullable)
//   updated_at: timestamp with time zone (not null, default: now())
//   owner_id: uuid (nullable)
// Table: whatsapp_instances
//   id: uuid (not null, default: gen_random_uuid())
//   instance_name: text (not null)
//   instance_key: text (not null)
//   status: text (not null, default: 'disconnected'::text)
//   qr_code_base64: text (nullable)
//   phone_number: text (nullable)
//   owner_id: uuid (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   friendly_name: text (nullable)
//   persona_id: uuid (nullable)

// --- CONSTRAINTS ---
// Table: ai_personas
//   PRIMARY KEY ai_personas_pkey: PRIMARY KEY (id)
// Table: api_settings
//   PRIMARY KEY api_settings_pkey: PRIMARY KEY (id)
// Table: appointments
//   FOREIGN KEY appointments_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY appointments_pkey: PRIMARY KEY (id)
// Table: automated_flows
//   FOREIGN KEY automated_flows_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY automated_flows_pkey: PRIMARY KEY (id)
// Table: broadcasts
//   FOREIGN KEY broadcasts_created_by_fkey: FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL
//   PRIMARY KEY broadcasts_pkey: PRIMARY KEY (id)
// Table: contatos_profissionais
//   PRIMARY KEY contatos_profissionais_pkey: PRIMARY KEY (id)
//   FOREIGN KEY contatos_profissionais_profissional_id_fkey: FOREIGN KEY (profissional_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   CHECK contatos_profissionais_status_check: CHECK ((status = ANY (ARRAY['ativo'::text, 'inativo'::text, 'indisponivel'::text])))
// Table: financial_records
//   PRIMARY KEY financial_records_pkey: PRIMARY KEY (id)
// Table: global_settings
//   UNIQUE global_settings_key_key: UNIQUE (key)
//   PRIMARY KEY global_settings_pkey: PRIMARY KEY (id)
// Table: historico_whatsapp
//   CHECK historico_whatsapp_mensagem_tipo_check: CHECK ((mensagem_tipo = ANY (ARRAY['texto'::text, 'arquivo'::text, 'imagem'::text, 'relatorio'::text])))
//   FOREIGN KEY historico_whatsapp_paciente_id_fkey: FOREIGN KEY (paciente_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY historico_whatsapp_pkey: PRIMARY KEY (id)
//   FOREIGN KEY historico_whatsapp_profissional_id_fkey: FOREIGN KEY (profissional_id) REFERENCES contatos_profissionais(id) ON DELETE CASCADE
//   CHECK historico_whatsapp_remetente_check: CHECK ((remetente = ANY (ARRAY['paciente'::text, 'profissional'::text])))
//   CHECK historico_whatsapp_status_check: CHECK ((status = ANY (ARRAY['enviado'::text, 'entregue'::text, 'lido'::text])))
// Table: landing_page_variacoes
//   PRIMARY KEY landing_page_variacoes_pkey: PRIMARY KEY (id)
//   UNIQUE variacoes_profissao_unique: UNIQUE (profissao_alvo)
// Table: leads
//   UNIQUE leads_email_key: UNIQUE (email)
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
//   FOREIGN KEY leads_variacao_lp_id_fkey: FOREIGN KEY (variacao_lp_id) REFERENCES landing_page_variacoes(id) ON DELETE SET NULL
// Table: messages
//   FOREIGN KEY messages_broadcast_id_fkey: FOREIGN KEY (broadcast_id) REFERENCES broadcasts(id) ON DELETE SET NULL
//   FOREIGN KEY messages_patient_id_fkey: FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY messages_pkey: PRIMARY KEY (id)
//   CHECK messages_sender_type_check: CHECK ((sender_type = ANY (ARRAY['patient'::text, 'staff'::text, 'ia'::text])))
// Table: metrica_monetizacao
//   PRIMARY KEY metrica_monetizacao_pkey: PRIMARY KEY (id)
// Table: patients
//   PRIMARY KEY patients_pkey: PRIMARY KEY (id)
//   CHECK patients_priority_level_check: CHECK ((priority_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])))
// Table: previsao_financeira
//   PRIMARY KEY previsao_financeira_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   CHECK profiles_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'vendedora'::text, 'estagiaria'::text, 'marketing'::text])))
// Table: relatorio_assinante
//   FOREIGN KEY relatorio_assinante_assinante_id_fkey: FOREIGN KEY (assinante_id) REFERENCES patients(id) ON DELETE CASCADE
//   PRIMARY KEY relatorio_assinante_pkey: PRIMARY KEY (id)
// Table: social_connections
//   FOREIGN KEY social_connections_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE
//   FOREIGN KEY social_connections_persona_id_fkey: FOREIGN KEY (persona_id) REFERENCES ai_personas(id) ON DELETE SET NULL
//   PRIMARY KEY social_connections_pkey: PRIMARY KEY (id)
//   CHECK social_connections_platform_check: CHECK ((platform = ANY (ARRAY['instagram'::text, 'facebook'::text, 'google'::text])))
// Table: whatsapp_instances
//   FOREIGN KEY whatsapp_instances_owner_id_fkey: FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE
//   FOREIGN KEY whatsapp_instances_persona_id_fkey: FOREIGN KEY (persona_id) REFERENCES ai_personas(id) ON DELETE SET NULL
//   PRIMARY KEY whatsapp_instances_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_personas
//   Policy "admin_mkt_all_ai_personas" (ALL, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text]))
//     WITH CHECK: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text]))
// Table: api_settings
//   Policy "API settings delete admin only" (DELETE, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//   Policy "API settings insert admin only" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//   Policy "API settings select admin only" (SELECT, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//   Policy "API settings update admin only" (UPDATE, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
// Table: appointments
//   Policy "Appointments insertable by everyone" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Appointments updatable by everyone" (UPDATE, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Appointments viewable by everyone" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: automated_flows
//   Policy "automated_flows_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "automated_flows_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "automated_flows_marketing_all" (ALL, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text]))
//     WITH CHECK: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text]))
//   Policy "automated_flows_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "automated_flows_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: broadcasts
//   Policy "Broadcasts insertable by everyone" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Broadcasts updatable by everyone" (UPDATE, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Broadcasts viewable by everyone" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: contatos_profissionais
//   Policy "contatos_profissionais_all_admin" (ALL, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])))))
//   Policy "contatos_profissionais_select" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: financial_records
//   Policy "Financials are insertable by admin" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//   Policy "Financials are viewable by admin" (SELECT, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
// Table: global_settings
//   Policy "global_settings_all_admin" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//     WITH CHECK: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//   Policy "global_settings_manage_api_keys_marketing" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text])) AND (key = ANY (ARRAY['whatsapp_api_url'::text, 'whatsapp_api_token'::text, 'hostinger_api_url'::text, 'hostinger_api_token'::text])))
//     WITH CHECK: ((( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text])) AND (key = ANY (ARRAY['whatsapp_api_url'::text, 'whatsapp_api_token'::text, 'hostinger_api_url'::text, 'hostinger_api_token'::text])))
//   Policy "global_settings_select_authenticated" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: historico_whatsapp
//   Policy "historico_whatsapp_insert" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'vendedora'::text, 'estagiaria'::text, 'marketing'::text])))))
//   Policy "historico_whatsapp_select" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'vendedora'::text, 'estagiaria'::text, 'marketing'::text])))))
//   Policy "historico_whatsapp_update" (UPDATE, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'vendedora'::text, 'estagiaria'::text, 'marketing'::text])))))
// Table: landing_page_variacoes
//   Policy "Variacoes publicas" (SELECT, PERMISSIVE) roles={public}
//     USING: (status = 'ativo'::text)
// Table: leads
//   Policy "Inserir leads publico" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Ver leads admin" (SELECT, PERMISSIVE) roles={public}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text, 'vendedora'::text])))))
// Table: messages
//   Policy "Messages insertable by everyone" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Messages viewable by authorized" (SELECT, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'vendedora'::text, 'estagiaria'::text]))
// Table: metrica_monetizacao
//   Policy "admin_all_metrica_monetizacao" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])))))
// Table: patients
//   Policy "Patients are deletable by admin" (DELETE, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = 'admin'::text)
//   Policy "Patients are insertable by everyone" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Patients are updatable by everyone" (UPDATE, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Patients are viewable by authorized" (SELECT, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'vendedora'::text, 'estagiaria'::text]))
// Table: previsao_financeira
//   Policy "admin_all_previsao_financeira" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])))))
// Table: profiles
//   Policy "Profiles are viewable by everyone" (SELECT, PERMISSIVE) roles={public}
//     USING: true
//   Policy "Profiles can be updated by admin" (UPDATE, PERMISSIVE) roles={public}
//     USING: (( SELECT profiles_1.role    FROM profiles profiles_1   WHERE (profiles_1.id = auth.uid())) = 'admin'::text)
// Table: relatorio_assinante
//   Policy "admin_all_relatorio_assinante" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (EXISTS ( SELECT 1    FROM profiles   WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::text, 'marketing'::text])))))
// Table: social_connections
//   Policy "social_connections_owner_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((owner_id = auth.uid()) OR (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text])))
//     WITH CHECK: ((owner_id = auth.uid()) OR (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text])))
// Table: whatsapp_instances
//   Policy "whatsapp_instances_owner_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((owner_id = auth.uid()) OR (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text])))
//     WITH CHECK: ((owner_id = auth.uid()) OR (( SELECT profiles.role    FROM profiles   WHERE (profiles.id = auth.uid())) = ANY (ARRAY['admin'::text, 'marketing'::text])))

// --- DATABASE FUNCTIONS ---
// FUNCTION admin_manage_user(text, uuid, text, text, text, text, boolean)
//   CREATE OR REPLACE FUNCTION public.admin_manage_user(p_action text, p_user_id uuid, p_email text, p_password text, p_full_name text, p_role text, p_is_active boolean)
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_uid uuid;
//     v_admin_role text;
//   BEGIN
//     -- Verify caller is admin
//     SELECT role INTO v_admin_role FROM public.profiles WHERE id = auth.uid();
//     IF v_admin_role != 'admin' THEN
//       RAISE EXCEPTION 'Acesso negado. Apenas administradores podem gerenciar usuários.';
//     END IF;
//
//     IF p_action = 'create' THEN
//       v_uid := gen_random_uuid();
//       INSERT INTO auth.users (
//         id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
//         raw_app_meta_data, raw_user_meta_data, is_super_admin, role, aud,
//         confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current,
//         phone, phone_change, phone_change_token, reauthentication_token
//       ) VALUES (
//         v_uid, '00000000-0000-0000-0000-000000000000', p_email, crypt(p_password, gen_salt('bf')),
//         NOW(), NOW(), NOW(),
//         '{"provider": "email", "providers": ["email"]}',
//         jsonb_build_object('name', p_full_name),
//         false, 'authenticated', 'authenticated',
//         '', '', '', '', '', NULL, '', '', ''
//       );
//
//       -- Triggers should have created the profile, so we just update it
//       UPDATE public.profiles SET role = p_role, is_active = p_is_active, full_name = p_full_name, email = p_email WHERE id = v_uid;
//       RETURN jsonb_build_object('success', true, 'id', v_uid);
//
//     ELSIF p_action = 'update' THEN
//       IF p_email IS NOT NULL THEN
//         UPDATE auth.users SET email = p_email, updated_at = NOW() WHERE id = p_user_id;
//       END IF;
//
//       IF p_password IS NOT NULL AND p_password != '' THEN
//         UPDATE auth.users SET encrypted_password = crypt(p_password, gen_salt('bf')), updated_at = NOW() WHERE id = p_user_id;
//       END IF;
//
//       UPDATE public.profiles SET
//         role = COALESCE(p_role, role),
//         is_active = COALESCE(p_is_active, is_active),
//         full_name = COALESCE(p_full_name, full_name),
//         email = COALESCE(p_email, email)
//       WHERE id = p_user_id;
//
//       RETURN jsonb_build_object('success', true, 'id', p_user_id);
//     ELSE
//       RAISE EXCEPTION 'Ação inválida';
//     END IF;
//   END;
//   $function$
//
// FUNCTION get_marketing_metrics()
//   CREATE OR REPLACE FUNCTION public.get_marketing_metrics()
//    RETURNS jsonb
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_role text;
//     v_leads_total int;
//     v_leads_by_origin jsonb;
//     v_conversion_rate numeric;
//     v_messages_volume int;
//     v_weekly_data jsonb;
//   BEGIN
//     -- Check access
//     SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
//     IF v_role NOT IN ('admin', 'vendedora', 'marketing') THEN
//       RAISE EXCEPTION 'Acesso negado.';
//     END IF;
//
//     -- Leads Volume
//     SELECT count(*) INTO v_leads_total FROM public.patients;
//
//     SELECT jsonb_object_agg(origin, count) INTO v_leads_by_origin
//     FROM (SELECT origin, count(*) FROM public.patients GROUP BY origin) t;
//
//     -- Messages Volume
//     SELECT count(*) INTO v_messages_volume FROM public.messages;
//
//     -- Conversion Rate (Completed or Active flows / total)
//     SELECT
//       CASE WHEN count(*) = 0 THEN 0
//       ELSE (count(*) FILTER (WHERE status IN ('Scheduled', 'Attended', 'Follow-up'))::numeric / count(*)) * 100
//       END INTO v_conversion_rate
//     FROM public.patients;
//
//     -- Aggregated weekly sample for charts
//     v_weekly_data := '[
//       {"name": "Seg", "leads": 40, "perdidos": 5},
//       {"name": "Ter", "leads": 30, "perdidos": 2},
//       {"name": "Qua", "leads": 55, "perdidos": 8},
//       {"name": "Qui", "leads": 45, "perdidos": 3},
//       {"name": "Sex", "leads": 60, "perdidos": 4},
//       {"name": "Sáb", "leads": 25, "perdidos": 1},
//       {"name": "Dom", "leads": 35, "perdidos": 2}
//     ]'::jsonb;
//
//     RETURN jsonb_build_object(
//       'leads_total', v_leads_total,
//       'leads_by_origin', COALESCE(v_leads_by_origin, '{}'::jsonb),
//       'conversion_rate', round(v_conversion_rate, 1),
//       'messages_volume', v_messages_volume,
//       'chart_data', v_weekly_data
//     );
//   END;
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, full_name, email, role, is_active)
//     VALUES (
//       NEW.id,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       NEW.email,
//       'estagiaria',
//       true
//     ) ON CONFLICT (id) DO UPDATE SET
//       email = EXCLUDED.email;
//     RETURN NEW;
//   END;
//   $function$
//

// --- INDEXES ---
// Table: global_settings
//   CREATE UNIQUE INDEX global_settings_key_key ON public.global_settings USING btree (key)
// Table: landing_page_variacoes
//   CREATE UNIQUE INDEX variacoes_profissao_unique ON public.landing_page_variacoes USING btree (profissao_alvo)
// Table: leads
//   CREATE INDEX idx_leads_data_captura ON public.leads USING btree (data_captura)
//   CREATE INDEX idx_leads_profissao ON public.leads USING btree (profissao)
//   CREATE UNIQUE INDEX leads_email_key ON public.leads USING btree (email)
