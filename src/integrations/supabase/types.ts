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
          cor: string
          created_at: string
          dias_postagem: string[]
          freq_postagem: string
          horarios_postagem: string[]
          id: string
          lingua: string
          link: string
          logo_url: string | null
          micro_nicho: string
          nicho: string
          nome: string
          sub_nicho: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cor: string
          created_at?: string
          dias_postagem?: string[]
          freq_postagem: string
          horarios_postagem?: string[]
          id?: string
          lingua: string
          link: string
          logo_url?: string | null
          micro_nicho: string
          nicho: string
          nome: string
          sub_nicho: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cor?: string
          created_at?: string
          dias_postagem?: string[]
          freq_postagem?: string
          horarios_postagem?: string[]
          id?: string
          lingua?: string
          link?: string
          logo_url?: string | null
          micro_nicho?: string
          nicho?: string
          nome?: string
          sub_nicho?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      canais_concorrentes: {
        Row: {
          created_at: string
          detalhes: string | null
          endereco_canal: string
          favorito: boolean | null
          id: string
          nicho: string
          nome: string
          observacao: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          detalhes?: string | null
          endereco_canal: string
          favorito?: boolean | null
          id?: string
          nicho: string
          nome: string
          observacao?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          detalhes?: string | null
          endereco_canal?: string
          favorito?: boolean | null
          id?: string
          nicho?: string
          nome?: string
          observacao?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ideias: {
        Row: {
          canal_id: string
          created_at: string
          data_criacao: string
          descricao: string | null
          id: string
          status: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          canal_id: string
          created_at?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          status?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          canal_id?: string
          created_at?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          status?: string
          titulo?: string
          updated_at?: string
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
      member_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          member_id: string
          session_token: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          member_id: string
          session_token: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          member_id?: string
          session_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_sessions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_video_assignments: {
        Row: {
          admin_id: string
          created_at: string
          funcao_no_video: string | null
          id: string
          member_id: string
          video_id: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          funcao_no_video?: string | null
          id?: string
          member_id: string
          video_id: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          funcao_no_video?: string | null
          id?: string
          member_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_video_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_video_assignments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          admin_id: string
          created_at: string
          email: string
          funcao: string | null
          id: string
          is_active: boolean
          nome: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          email: string
          funcao?: string | null
          id?: string
          is_active?: boolean
          nome: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          email?: string
          funcao?: string | null
          id?: string
          is_active?: boolean
          nome?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number
          created_at: string
          currency: string
          description: string | null
          id: string
          status: string
          stripe_payment_intent_id: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          status: string
          stripe_payment_intent_id: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          status?: string
          stripe_payment_intent_id?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nome: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nome: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_videos: {
        Row: {
          canal_id: string
          created_at: string
          data_agendada: string
          hora_agendada: string
          id: string
          link_youtube: string | null
          status: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          canal_id: string
          created_at?: string
          data_agendada: string
          hora_agendada: string
          id?: string
          link_youtube?: string | null
          status?: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          canal_id?: string
          created_at?: string
          data_agendada?: string
          hora_agendada?: string
          id?: string
          link_youtube?: string | null
          status?: string
          titulo?: string
          updated_at?: string
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
      subscription_audit_log: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: number
          metadata: Json | null
          new_status: string | null
          old_status: string | null
          subscription_id: string | null
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          metadata?: Json | null
          new_status?: string | null
          old_status?: string | null
          subscription_id?: string | null
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: number
          metadata?: Json | null
          new_status?: string | null
          old_status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_audit_log_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          metadata: Json | null
          price_id: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          metadata?: Json | null
          price_id?: string | null
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          metadata?: Json | null
          price_id?: string | null
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          granted_by: string | null
          id: string
          permission: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: string
          user_id?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          canal_id: string
          created_at: string
          data_agendada: string | null
          data_criacao: string
          descricao: string | null
          google_drive_link: string | null
          hora_agendada: string | null
          id: string
          responsavel_id: string | null
          status: string
          thumbnail_pronta: boolean
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          canal_id: string
          created_at?: string
          data_agendada?: string | null
          data_criacao?: string
          descricao?: string | null
          google_drive_link?: string | null
          hora_agendada?: string | null
          id?: string
          responsavel_id?: string | null
          status: string
          thumbnail_pronta?: boolean
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          canal_id?: string
          created_at?: string
          data_agendada?: string | null
          data_criacao?: string
          descricao?: string | null
          google_drive_link?: string | null
          hora_agendada?: string | null
          id?: string
          responsavel_id?: string | null
          status?: string
          thumbnail_pronta?: boolean
          titulo?: string
          updated_at?: string
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
      assign_member_to_project: {
        Args: { p_member_id: string; p_project_id: string }
        Returns: boolean
      }
      authenticate_member: {
        Args: { p_password: string; p_username: string }
        Returns: {
          member_id: string
          member_name: string
          session_token: string
        }[]
      }
      cleanup_test_data: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_project: {
        Args: { p_description?: string; p_name: string }
        Returns: string
      }
      delete_project: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      get_admin_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          description: string
          id: string
          member_count: number
          name: string
          updated_at: string
        }[]
      }
      get_integration_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: string
        }[]
      }
      get_member_project_videos: {
        Args: { p_member_token: string }
        Returns: {
          canal_id: string
          canal_nome: string
          project_id: string
          project_name: string
          video_id: string
          video_status: string
          video_title: string
        }[]
      }
      get_member_projects: {
        Args: { p_member_token: string }
        Returns: {
          project_description: string
          project_id: string
          project_name: string
        }[]
      }
      get_member_videos: {
        Args: { p_session_token: string }
        Returns: {
          canal_nome: string
          data_agendada: string
          data_criacao: string
          hora_agendada: string
          status: string
          thumbnail_pronta: boolean
          titulo: string
          video_id: string
        }[]
      }
      get_project_members: {
        Args: { p_project_id: string }
        Returns: {
          assigned_at: string
          member_email: string
          member_id: string
          member_name: string
          member_username: string
        }[]
      }
      get_subscription_by_customer_id: {
        Args: { customer_id: string }
        Returns: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          metadata: Json
          status: string
          stripe_customer_id: string
          stripe_price_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }[]
      }
      get_user_subscription: {
        Args: { user_uuid: string }
        Returns: {
          current_period_end: string
          is_trial: boolean
          status: string
          subscription_id: string
          trial_end: string
        }[]
      }
      has_active_subscription: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      logout_member: {
        Args: { p_session_token: string }
        Returns: boolean
      }
      remove_member_from_project: {
        Args: { p_member_id: string; p_project_id: string }
        Returns: boolean
      }
      update_member_video_status: {
        Args: {
          p_new_status: string
          p_session_token: string
          p_video_id: string
        }
        Returns: boolean
      }
      update_project: {
        Args: { p_description?: string; p_name: string; p_project_id: string }
        Returns: boolean
      }
      update_subscription_status: {
        Args: {
          new_current_period_end: string
          new_current_period_start: string
          new_status: string
          new_trial_end?: string
          stripe_subscription_id_param: string
        }
        Returns: undefined
      }
      upsert_subscription: {
        Args: {
          p_cancel_at_period_end?: boolean
          p_current_period_end: string
          p_current_period_start: string
          p_metadata?: Json
          p_status: string
          p_stripe_customer_id: string
          p_stripe_price_id: string
          p_stripe_subscription_id: string
          p_user_id: string
        }
        Returns: string
      }
      validate_member_session: {
        Args: { p_session_token: string }
        Returns: {
          admin_id: string
          member_id: string
          member_name: string
        }[]
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
