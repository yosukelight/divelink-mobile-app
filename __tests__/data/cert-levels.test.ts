import { certLevelToTier, isInstructorLevel, CERT_TIER_MAP } from '../../data/cert-levels'

describe('certLevelToTier', () => {
  it('maps CMAS_1_STAR to tier 1', () => expect(certLevelToTier('CMAS_1_STAR')).toBe(1))
  it('maps CMAS_2_STAR to tier 2', () => expect(certLevelToTier('CMAS_2_STAR')).toBe(2))
  it('maps CMAS_3_STAR to tier 3', () => expect(certLevelToTier('CMAS_3_STAR')).toBe(3))

  it('maps all instructor levels to tier 3', () => {
    expect(certLevelToTier('CMAS_INSTRUCTOR_1')).toBe(3)
    expect(certLevelToTier('CMAS_INSTRUCTOR_2')).toBe(3)
    expect(certLevelToTier('CMAS_INSTRUCTOR_3')).toBe(3)
  })

  it('returns 0 for an unknown level string', () => {
    expect(certLevelToTier('PADI_OPEN_WATER')).toBe(0)
    expect(certLevelToTier('')).toBe(0)
  })

  it('all CERT_TIER_MAP values are between 1 and 3', () => {
    for (const tier of Object.values(CERT_TIER_MAP)) {
      expect(tier).toBeGreaterThanOrEqual(1)
      expect(tier).toBeLessThanOrEqual(3)
    }
  })
})

describe('isInstructorLevel', () => {
  it('returns true for all three instructor levels', () => {
    expect(isInstructorLevel('CMAS_INSTRUCTOR_1')).toBe(true)
    expect(isInstructorLevel('CMAS_INSTRUCTOR_2')).toBe(true)
    expect(isInstructorLevel('CMAS_INSTRUCTOR_3')).toBe(true)
  })

  it('returns false for diver levels', () => {
    expect(isInstructorLevel('CMAS_1_STAR')).toBe(false)
    expect(isInstructorLevel('CMAS_2_STAR')).toBe(false)
    expect(isInstructorLevel('CMAS_3_STAR')).toBe(false)
  })

  it('returns false for unknown strings', () => {
    expect(isInstructorLevel('UNKNOWN')).toBe(false)
    expect(isInstructorLevel('')).toBe(false)
  })
})
