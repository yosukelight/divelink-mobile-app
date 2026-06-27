/**
 * SM-2 spaced repetition algorithm.
 * Pure function — no side effects, no imports.
 *
 * quality: 0 = Forgot, 1 = Hard, 2 = Got it
 * Internally maps to the classic SM-2 quality scale (1, 3, 5) so that
 * "Hard" measurably lowers the ease factor.
 */

export type SM2Input = {
  easeFactor: number   // default 2.5
  intervalDays: number // 0 = never reviewed
  timesCorrect: number
  quality: 0 | 1 | 2
}

export type SM2Output = {
  easeFactor: number
  intervalDays: number
  nextReview: Date
}

export const SM2_MIN_EASE = 1.3
export const SM2_DEFAULT_EASE = 2.5

// Maps our 0-2 quality to SM-2's 0-5 scale (0→1, 1→3, 2→5)
const QUALITY_MAP: Record<0 | 1 | 2, number> = { 0: 1, 1: 3, 2: 5 }

export function sm2(input: SM2Input, now = new Date()): SM2Output {
  const { quality } = input
  let { easeFactor, intervalDays } = input

  const q5 = QUALITY_MAP[quality]

  if (q5 < 3) {
    // Forgot: reset to 1 day, keep ease factor
    intervalDays = 1
  } else {
    // Progress the interval
    if (intervalDays === 0) {
      intervalDays = 1
    } else if (intervalDays === 1) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(intervalDays * easeFactor)
    }
    // Update ease factor using SM-2 formula
    const delta = 0.1 - (5 - q5) * (0.08 + (5 - q5) * 0.02)
    easeFactor = Math.max(SM2_MIN_EASE, easeFactor + delta)
  }

  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + intervalDays)

  return { easeFactor, intervalDays, nextReview }
}
