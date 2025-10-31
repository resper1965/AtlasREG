/**
 * Tipos do banco de dados Supabase
 *
 * Para gerar automaticamente, execute:
 * npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
          created_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
      }
      role_permissions: {
        Row: {
          role: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
          permission_id: string
        }
        Insert: {
          role: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
          permission_id: string
        }
        Update: {
          role?: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
          permission_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'analyst' | 'member' | 'viewer' | 'external'
    }
  }
}
