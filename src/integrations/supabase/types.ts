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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          certificate_url: string | null
          created_at: string
          date_achieved: string | null
          description: string | null
          id: string
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          date_achieved?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          date_achieved?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_login_at: string | null
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string | null
          author_name: string
          blog_post_id: string
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          parent_comment_id: string | null
          updated_at: string
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name: string
          blog_post_id: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string
          blog_post_id?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_post_id: string
          created_at: string
          id: string
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          blog_post_id: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          blog_post_id?: string
          created_at?: string
          id?: string
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          external_link: string | null
          id: string
          image_url: string | null
          images: string[] | null
          order_index: number | null
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          order_index?: number | null
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          external_link?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          order_index?: number | null
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          certificate_url: string | null
          completion_date: string | null
          created_at: string
          description: string | null
          id: string
          institution: string | null
          is_favorite: boolean | null
          name: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution?: string | null
          is_favorite?: boolean | null
          name: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution?: string | null
          is_favorite?: boolean | null
          name?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          coursework: string[] | null
          created_at: string
          degree: string
          description: string | null
          duration: string
          gpa: string | null
          id: string
          institution: string
          location: string | null
          order_index: number | null
          updated_at: string
        }
        Insert: {
          coursework?: string[] | null
          created_at?: string
          degree: string
          description?: string | null
          duration: string
          gpa?: string | null
          id?: string
          institution: string
          location?: string | null
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          coursework?: string[] | null
          created_at?: string
          degree?: string
          description?: string | null
          duration?: string
          gpa?: string | null
          id?: string
          institution?: string
          location?: string | null
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          company: string
          created_at: string
          description: string[] | null
          duration: string
          id: string
          location: string | null
          order_index: number | null
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string[] | null
          duration: string
          id?: string
          location?: string | null
          order_index?: number | null
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string[] | null
          duration?: string
          id?: string
          location?: string | null
          order_index?: number | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string
          id: string
          level: string
          name: string
          order_index: number
          proficiency: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level: string
          name: string
          order_index?: number
          proficiency?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: string
          name?: string
          order_index?: number
          proficiency?: number
          updated_at?: string
        }
        Relationships: []
      }
      personal_info: {
        Row: {
          avatar_url: string | null
          bio: string
          codeforces: string | null
          created_at: string
          email: string | null
          github: string | null
          highlights: Json
          id: string
          instagram: string | null
          linkedin: string | null
          location: string | null
          medium: string | null
          name: string
          phone: string | null
          title: string
          twitter: string | null
          updated_at: string
          website: string | null
          youtube: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string
          codeforces?: string | null
          created_at?: string
          email?: string | null
          github?: string | null
          highlights?: Json
          id?: string
          instagram?: string | null
          linkedin?: string | null
          location?: string | null
          medium?: string | null
          name?: string
          phone?: string | null
          title?: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
          youtube?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string
          codeforces?: string | null
          created_at?: string
          email?: string | null
          github?: string | null
          highlights?: Json
          id?: string
          instagram?: string | null
          linkedin?: string | null
          location?: string | null
          medium?: string | null
          name?: string
          phone?: string | null
          title?: string
          twitter?: string | null
          updated_at?: string
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string
          featured: boolean
          forks: number | null
          github_url: string | null
          id: string
          image_url: string | null
          images: string[] | null
          is_contributed: boolean | null
          language: string | null
          language_color: string | null
          live_url: string | null
          order_index: number
          stars: number | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          featured?: boolean
          forks?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_contributed?: boolean | null
          language?: string | null
          language_color?: string | null
          live_url?: string | null
          order_index?: number
          stars?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          forks?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_contributed?: boolean | null
          language?: string | null
          language_color?: string | null
          live_url?: string | null
          order_index?: number
          stars?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          icon_url: string | null
          id: string
          order_index: number | null
          proficiency: number | null
          skill_name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          icon_url?: string | null
          id?: string
          order_index?: number | null
          proficiency?: number | null
          skill_name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          icon_url?: string | null
          id?: string
          order_index?: number | null
          proficiency?: number | null
          skill_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_requests: {
        Row: {
          additional_notes: string | null
          budget: string | null
          category: string
          created_at: string
          description: string | null
          due_date: string | null
          due_time: string | null
          estimated_duration: string | null
          id: string
          priority: string
          requester_email: string
          requester_name: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          budget?: string | null
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          estimated_duration?: string | null
          id?: string
          priority?: string
          requester_email: string
          requester_name: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          budget?: string | null
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          estimated_duration?: string | null
          id?: string
          priority?: string
          requester_email?: string
          requester_name?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
