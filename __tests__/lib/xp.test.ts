import {
  levelFromXp,
  streakMultiplier,
  calculateXp,
  LEVEL_THRESHOLDS,
} from '../../lib/xp'

describe('levelFromXp', () => {
  it('returns level 0 / Snorkeler at 0 XP', () => {
    const r = levelFromXp(0)
    expect(r.level).toBe(0)
    expect(r.title).toBe('Snorkeler')
  })

  it('returns level 1 / Open Water at exactly 500 XP', () => {
    const r = levelFromXp(500)
    expect(r.level).toBe(1)
    expect(r.title).toBe('Open Water')
  })

  it('progress is 0 at the start of a level', () => {
    expect(levelFromXp(500).progress).toBe(0)
    expect(levelFromXp(1500).progress).toBe(0)
  })

  it('progress is between 0 and 1 mid-level', () => {
    const r = levelFromXp(750)
    expect(r.progress).toBeGreaterThan(0)
    expect(r.progress).toBeLessThan(1)
  })

  it('returns max level and progress=1 at very high XP', () => {
    const r = levelFromXp(99999)
    expect(r.level).toBe(5)
    expect(r.title).toBe('Instructor')
    expect(r.nextLevelXp).toBeNull()
    expect(r.progress).toBe(1)
  })

  it('nextLevelXp is null at the highest level', () => {
    expect(levelFromXp(99999).nextLevelXp).toBeNull()
  })

  it('correctly maps every threshold boundary', () => {
    for (const { level, minXp } of LEVEL_THRESHOLDS) {
      expect(levelFromXp(minXp).level).toBe(level)
    }
  })

  it('XP just below a threshold stays in previous level', () => {
    expect(levelFromXp(499).level).toBe(0)
    expect(levelFromXp(1499).level).toBe(1)
  })
})

describe('streakMultiplier', () => {
  it('is 1.0 at 0 days', () => expect(streakMultiplier(0)).toBe(1.0))
  it('is 1.0 at 6 days (< 1 full week)', () => expect(streakMultiplier(6)).toBe(1.0))
  it('is 1.1 at 7 days', () => expect(streakMultiplier(7)).toBeCloseTo(1.1))
  it('is 1.2 at 14 days', () => expect(streakMultiplier(14)).toBeCloseTo(1.2))
  it('caps at 2.0 at 70 days', () => expect(streakMultiplier(70)).toBe(2.0))
  it('caps at 2.0 beyond 70 days', () => expect(streakMultiplier(999)).toBe(2.0))
})

describe('calculateXp', () => {
  it('awards 50 XP for quiz with no streak', () => {
    expect(calculateXp('quiz', 0)).toBe(50)
  })

  it('awards 75 XP for dive_log with no streak', () => {
    expect(calculateXp('dive_log', 0)).toBe(75)
  })

  it('awards 20 XP for checklist with no streak', () => {
    expect(calculateXp('checklist', 0)).toBe(20)
  })

  it('applies 1.1x multiplier at 7-day streak', () => {
    expect(calculateXp('quiz', 7)).toBe(55)
  })

  it('applies 2x multiplier at 70-day streak', () => {
    expect(calculateXp('dive_log', 70)).toBe(150)
  })

  it('always returns 0 for streak_bonus source', () => {
    expect(calculateXp('streak_bonus', 100)).toBe(0)
  })

  it('uses baseOverride for achievement XP', () => {
    expect(calculateXp('achievement', 0, 100)).toBe(100)
  })

  it('applies streak multiplier to baseOverride', () => {
    expect(calculateXp('achievement', 7, 100)).toBe(110)
  })
})
