import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 型安全なクライアント
export const createTypedClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// データベース型定義（実際のSupabaseスキーマに合わせて調整）
export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          area: string
          category: string
          x_link?: string
          instagram_link?: string
          website_link?: string
          x_post_url?: string
          description?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          area: string
          category: string
          x_link?: string
          instagram_link?: string
          website_link?: string
          x_post_url?: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          area?: string
          category?: string
          x_link?: string
          instagram_link?: string
          website_link?: string
          x_post_url?: string
          description?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          display_name: string
          description?: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          display_name: string
          description?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          display_name?: string
          description?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      areas: {
        Row: {
          id: number
          name: string
          prefecture: string
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          prefecture: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          prefecture?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
