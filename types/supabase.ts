/**
 * Minimal hand-written Database type that mirrors DATABASE_SCHEMA.md.
 * Replace with the generated output of `supabase gen types typescript` once
 * the Supabase project is linked.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type CardType = 'do' | 'dont'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type UnitPreference = 'metric' | 'imperial'
export type SyncStatus = 'synced' | 'pending' | 'conflict'
export type AchievementTriggerType =
  | 'dive_count'
  | 'streak_days'
  | 'quiz_perfect_week'
  | 'buddy_dive_count'
  | 'night_dive'
  | 'depth_threshold'
  | 'checklist_count'
  | 'card_mastery_count'
  | 'module_completion'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          xp: number
          level: number
          streak_days: number
          streak_last_active: string | null
          total_dives: number
          unit_pref: UnitPreference
          leaderboard_opt_in: boolean
          notif_time: string
          expo_push_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      dive_logs: {
        Row: {
          id: string
          user_id: string
          site_name: string
          dive_date: string
          max_depth_m: number
          duration_min: number
          buddy_name: string | null
          start_pressure_bar: number | null
          end_pressure_bar: number | null
          water_temp_c: number | null
          visibility_m: number | null
          notes: string | null
          sync_status: SyncStatus
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['dive_logs']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
        }
        Update: Partial<Database['public']['Tables']['dive_logs']['Row']>
      }
      knowledge_cards: {
        Row: {
          id: string
          type: CardType
          category: string
          title: string
          body: string
          explanation: string | null
          cert_tier: number
          difficulty: Difficulty
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['knowledge_cards']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
        }
        Update: Partial<Database['public']['Tables']['knowledge_cards']['Row']>
      }
      quiz_progress: {
        Row: {
          id: string
          user_id: string
          card_id: string
          ease_factor: number
          interval_days: number
          next_review: string
          repetitions: number
          last_quality: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quiz_progress']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string
        }
        Update: Partial<Database['public']['Tables']['quiz_progress']['Row']>
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_achievements']['Row'], 'id'> & { id?: string }
        Update: Partial<Database['public']['Tables']['user_achievements']['Row']>
      }
      xp_events: {
        Row: {
          id: string
          user_id: string
          source: string
          base_xp: number
          multiplier: number
          total_xp: number
          streak_days: number
          ref_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['xp_events']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['xp_events']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      card_type: CardType
      difficulty: Difficulty
      unit_preference: UnitPreference
      sync_status: SyncStatus
      achievement_trigger_type: AchievementTriggerType
    }
  }
}
