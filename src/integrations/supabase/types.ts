export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      canais: {
        Row: {
          alarme_alerta_dias: number | null
          alarme_minimo_videos: number | null
          alarme_tipo: string | null
          alarme_urgente_dias: number | null
          cor: string
          created_at: string | null
          dias_postagem: string[] | null
          freq_postagem: string
          horarios_postagem: string[] | null
          id: string
          lingua: string
          link: string
          logo_url: string | null
          micro_nicho: string
          nicho: string
          nome: string
          sub_nicho: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alarme_alerta_dias?: number | null
          alarme_minimo_videos?: number | null
          alarme_tipo?: string | null
          alarme_urgente_dias?: number | null
          cor: string
          created_at?: string | null
          dias_postagem?: string[] | null
          freq_postagem: string
          horarios_postagem?: string[] | null
          id?: string
          lingua: string
          link: string
          logo_url?: string | null
          micro_nicho: string
          nicho: string
          nome: string
          sub_nicho: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alarme_alerta_dias?: number | null
          alarme_minimo_videos?: number | null
          alarme_tipo?: string | null
          alarme_urgente_dias?: number | null
          cor?: string
          created_at?: string | null
          dias_postagem?: string[] | null
          freq_postagem?: string
          horarios_postagem?: string[] | null
          id?: string
          lingua?: string
          link?: string
          logo_url?: string | null
          micro_nicho?: string
          nicho?: string
          nome?: string
          sub_nicho?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      competitor_channels: {
        Row: {
          avg_views: number | null
          content_style: string | null
          created_at: string
          id: string
          link: string
          nicho: string | null
          nome: string
          notes: string | null
          subscribers_count: number | null
          updated_at: string
          upload_frequency: string | null
          user_id: string
        }
        Insert: {
          avg_views?: number | null
          content_style?: string | null
          created_at?: string
          id?: string
          link: string
          nicho?: string | null
          nome: string
          notes?: string | null
          subscribers_count?: number | null
          updated_at?: string
          upload_frequency?: string | null
          user_id: string
        }
        Update: {
          avg_views?: number | null
          content_style?: string | null
          created_at?: string
          id?: string
          link?: string
          nicho?: string | null
          nome?: string
          notes?: string | null
          subscribers_count?: number | null
          updated_at?: string
          upload_frequency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ideias: {
        Row: {
          canal_id: string
          created_at: string | null
          data_criacao: string | null
          descricao: string | null
          id: string
          status: string
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canal_id: string
          created_at?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          status?: string
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canal_id?: string
          created_at?: string | null
          data_criacao?: string | null
          descricao?: string | null
          id?: string
          status?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideias_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nome: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_videos: {
        Row: {
          canal_id: string
          created_at: string | null
          data_agendada: string
          hora_agendada: string
          id: string
          link_youtube: string | null
          status: string
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canal_id: string
          created_at?: string | null
          data_agendada: string
          hora_agendada: string
          id?: string
          link_youtube?: string | null
          status?: string
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canal_id?: string
          created_at?: string | null
          data_agendada?: string
          hora_agendada?: string
          id?: string
          link_youtube?: string | null
          status?: string
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_videos_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          canal_id: string
          created_at: string | null
          data_agendada: string | null
          data_criacao: string | null
          google_drive_folder_link: string | null
          google_drive_link: string | null
          hora_agendada: string | null
          id: string
          responsavel_id: string | null
          status: string
          thumbnail_pronta: boolean | null
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          canal_id: string
          created_at?: string | null
          data_agendada?: string | null
          data_criacao?: string | null
          google_drive_folder_link?: string | null
          google_drive_link?: string | null
          hora_agendada?: string | null
          id?: string
          responsavel_id?: string | null
          status?: string
          thumbnail_pronta?: boolean | null
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          canal_id?: string
          created_at?: string | null
          data_agendada?: string | null
          data_criacao?: string | null
          google_drive_folder_link?: string | null
          google_drive_link?: string | null
          hora_agendada?: string | null
          id?: string
          responsavel_id?: string | null
          status?: string
          thumbnail_pronta?: boolean | null
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_member: {
        Args: { p_password: string; p_username: string }
        Returns: {
          member_id: string
          member_name: string
          session_token: string
        }[]
      }
      create_team_member: {
        Args: {
          p_email: string
          p_nome: string
          p_password: string
          p_role?: string
        }
        Returns: string
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
