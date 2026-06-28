import type { XpSource } from '../types/app'

export const XP_TABLE: Record<XpSource, number> = {
  quiz: 50,
  perfect_quiz: 25,    // bonus awarded on top of quiz XP
  dive_log: 75,
  checklist: 20,
  streak_bonus: 0,     // calculated dynamically via streakMultiplier
  achievement: 0,      // badge-specific, supplied as baseOverride
  module_complete: 100,
}

export const LEVEL_THRESHOLDS = [
  { level: 0, minXp: 0,     title: 'Snorkeler' },
  { level: 1, minXp: 500,   title: 'Open Water' },
  { level: 2, minXp: 1500,  title: 'Advanced' },
  { level: 3, minXp: 3500,  title: 'Rescue Diver' },
  { level: 4, minXp: 7000,  title: 'Divemaster' },
  { level: 5, minXp: 14000, title: 'Instructor' },
] as const

export type LevelInfo = {
  level: number
  title: string
  nextLevelXp: number | null
  progress: number  // 0-1 fraction through current level
}

export function levelFromXp(xp: number): LevelInfo {
  let current: (typeof LEVEL_THRESHOLDS)[number] = LEVEL_THRESHOLDS[0]
  let currentIdx = 0

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) {
      current = LEVEL_THRESHOLDS[i]
      currentIdx = i
    } else {
      break
    }
  }

  const next = currentIdx < LEVEL_THRESHOLDS.length - 1
    ? LEVEL_THRESHOLDS[currentIdx + 1]
    : null

  const rangeStart = current.minXp
  const rangeEnd = next?.minXp ?? rangeStart + 1
  const progress = next
    ? (xp - rangeStart) / (rangeEnd - rangeStart)
    : 1

  return {
    level: current.level,
    title: current.title,
    nextLevelXp: next?.minXp ?? null,
    progress: Math.min(1, Math.max(0, progress)),
  }
}

/** XP multiplier based on streak length. +10% per completed week, capped at 2×. */
export function streakMultiplier(streakDays: number): number {
  const weeks = Math.floor(streakDays / 7)
  return Math.min(2.0, 1.0 + weeks * 0.1)
}

/**
 * Calculate XP to award for a given source.
 * @param source  XP source type
 * @param streakDays  Current streak length for multiplier
 * @param baseOverride  Override the table value (used for achievement XP)
 */
export function calculateXp(
  source: XpSource,
  streakDays = 0,
  baseOverride?: number,
): number {
  if (source === 'streak_bonus') return 0

  const base = baseOverride ?? XP_TABLE[source]
  const multiplier = streakMultiplier(streakDays)
  return Math.round(base * multiplier)
}
