import type { Achievement } from '../types/app'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_descent',
    title: 'First Descent',
    description: 'Log your first dive',
    icon: '🤿',
    xp_reward: 50,
    trigger: { type: 'dive_count', threshold: 1 },
  },
  {
    id: 'buddy_system',
    title: 'Buddy System',
    description: 'Log 5 dives with a buddy',
    icon: '👥',
    xp_reward: 75,
    trigger: { type: 'dive_count', threshold: 5 },
  },
  {
    id: 'ten_dives',
    title: 'Ten Down',
    description: 'Log 10 total dives',
    icon: '⚓',
    xp_reward: 100,
    trigger: { type: 'dive_count', threshold: 10 },
  },
  {
    id: 'surface_interval',
    title: 'Surface Interval',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    xp_reward: 100,
    trigger: { type: 'streak_days', threshold: 7 },
  },
  {
    id: 'thirty_day_streak',
    title: 'Relentless',
    description: 'Maintain a 30-day learning streak',
    icon: '🕯️',
    xp_reward: 200,
    trigger: { type: 'streak_days', threshold: 30 },
  },
  {
    id: 'deep_thinker',
    title: 'Deep Thinker',
    description: 'Log a dive deeper than 30 m',
    icon: '🌊',
    xp_reward: 100,
    trigger: { type: 'depth_reached', threshold_m: 30 },
  },
  {
    id: 'night_diver',
    title: 'Night Diver',
    description: 'Log a night dive',
    icon: '🌙',
    xp_reward: 75,
    trigger: { type: 'night_dive', threshold: 1 },
  },
  {
    id: 'perfect_week',
    title: 'Perfect Week',
    description: '7-day streak with a perfect daily quiz each day',
    icon: '⭐',
    xp_reward: 200,
    trigger: { type: 'perfect_quiz', threshold: 7 },
  },
  {
    id: 'safety_first',
    title: 'Safety First',
    description: 'Complete 10 pre-dive BWRAF checklists',
    icon: '✅',
    xp_reward: 75,
    trigger: { type: 'checklist_count', threshold: 10 },
  },
  {
    id: 'knowledge_hoarder',
    title: 'Knowledge Hoarder',
    description: 'Master 50 knowledge cards',
    icon: '📚',
    xp_reward: 150,
    trigger: { type: 'card_mastery_count', threshold: 50 },
  },
  {
    id: 'century_diver',
    title: '100 Dives',
    description: 'Log 100 total dives',
    icon: '🏆',
    xp_reward: 200,
    trigger: { type: 'dive_count', threshold: 100 },
  },
]

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export function getAchievementsByTriggerType(triggerType: string): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.trigger.type === triggerType)
}
