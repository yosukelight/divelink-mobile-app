import type { DiverIdentity } from './divelink'

export type AppProfile = {
  id: string
  xp: number
  level: number
  streak_days: number
  streak_last_active: string
  unit_pref: 'metric' | 'imperial'
  leaderboard_opt_in: boolean
  notif_time: string
  expo_push_token: string | null
  created_at: string
}

export type User = DiverIdentity & AppProfile

export type DiveLog = {
  id: string
  user_id: string
  site_name: string
  date: string
  max_depth_m: number
  duration_min: number
  buddy_name?: string
  start_pressure_bar: number
  end_pressure_bar: number
  water_temp_c?: number
  visibility_m?: number
  notes?: string
  photo_urls: string[]
  checklist_completed: boolean
  created_at: string
}

export type KnowledgeCard = {
  id: string
  type: 'do' | 'dont'
  category: string
  min_cert_tier: number
  title: string
  body: string
  explanation: string
  tags: string[]
}

export type QuizQuestion = {
  id: string
  card_id?: string
  question: string
  options: string[]
  correct_index: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  min_cert_tier: number
}

export type QuizProgress = {
  user_id: string
  question_id: string
  times_seen: number
  times_correct: number
  last_seen: string
  next_review: string
  ease_factor: number
}

export type QuizAnswer = {
  question_id: string
  selected_index: number
  is_correct: boolean
  answered_at: string
}

export type QuizSession = {
  id: string
  user_id: string
  questions: QuizQuestion[]
  started_at: string
}

export type QuizResults = {
  session_id: string
  total: number
  correct: number
  xp_earned: number
  streak_continued: boolean
  answers: QuizAnswer[]
}

export type AchievementTriggerType =
  | 'dive_count'
  | 'streak_days'
  | 'perfect_quiz'
  | 'quiz_count'
  | 'checklist_count'
  | 'card_mastery_count'
  | 'first_action'
  | 'night_dive'
  | 'depth_reached'

export type AchievementTrigger =
  | { type: 'dive_count'; threshold: number }
  | { type: 'streak_days'; threshold: number }
  | { type: 'perfect_quiz'; threshold: number }
  | { type: 'quiz_count'; threshold: number }
  | { type: 'checklist_count'; threshold: number }
  | { type: 'card_mastery_count'; threshold: number }
  | { type: 'first_action'; action: string }
  | { type: 'night_dive'; threshold: number }
  | { type: 'depth_reached'; threshold_m: number }

export type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  xp_reward: number
  trigger: AchievementTrigger
}

export type UserAchievement = {
  user_id: string
  achievement_id: string
  unlocked_at: string
}

export type LearningGroup = {
  id: string
  instructor_id: string
  student_id: string
  group_name?: string
  enrolled_at: string
}

export type LearningAssignment = {
  id: string
  instructor_id: string
  student_id?: string
  group_name?: string
  module_id: string
  due_date?: string
  created_at: string
}

export type XpSource =
  | 'quiz'
  | 'perfect_quiz'
  | 'dive_log'
  | 'checklist'
  | 'streak_bonus'
  | 'achievement'
  | 'module_complete'
