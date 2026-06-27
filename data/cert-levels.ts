import type { CmasCertificationLevel } from '../types/divelink'

/**
 * Maps CMAS certification level strings (from dive-link API) to the simplified
 * numeric tier (0-3) used for content gating in this app.
 * Instructor-grade certs grant full (tier 3) access.
 */
export const CERT_TIER_MAP: Record<CmasCertificationLevel, number> = {
  CMAS_1_STAR: 1,
  CMAS_2_STAR: 2,
  CMAS_3_STAR: 3,
  CMAS_INSTRUCTOR_1: 3,
  CMAS_INSTRUCTOR_2: 3,
  CMAS_INSTRUCTOR_3: 3,
}

export const INSTRUCTOR_LEVELS: CmasCertificationLevel[] = [
  'CMAS_INSTRUCTOR_1',
  'CMAS_INSTRUCTOR_2',
  'CMAS_INSTRUCTOR_3',
]

/** Returns the numeric content-gating tier for a level string, 0 if unknown. */
export function certLevelToTier(level: string): number {
  return CERT_TIER_MAP[level as CmasCertificationLevel] ?? 0
}

/** Returns true when the level string represents any instructor grade. */
export function isInstructorLevel(level: string): boolean {
  return INSTRUCTOR_LEVELS.includes(level as CmasCertificationLevel)
}
