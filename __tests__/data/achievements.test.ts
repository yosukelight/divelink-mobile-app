import {
  ACHIEVEMENTS,
  getAchievementById,
  getAchievementsByTriggerType,
} from '../../data/achievements'

describe('ACHIEVEMENTS catalog', () => {
  it('has no duplicate IDs', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every achievement has all required fields', () => {
    for (const a of ACHIEVEMENTS) {
      expect(typeof a.id).toBe('string')
      expect(a.id.length).toBeGreaterThan(0)
      expect(typeof a.title).toBe('string')
      expect(typeof a.icon).toBe('string')
      expect(a.xp_reward).toBeGreaterThan(0)
      expect(a.trigger).toBeDefined()
      expect(typeof a.trigger.type).toBe('string')
    }
  })

  it('all dive_count triggers have a positive threshold', () => {
    const diveAchievements = ACHIEVEMENTS.filter((a) => a.trigger.type === 'dive_count')
    for (const a of diveAchievements) {
      if (a.trigger.type === 'dive_count') {
        expect(a.trigger.threshold).toBeGreaterThan(0)
      }
    }
  })

  it('depth_reached trigger has a threshold_m field', () => {
    const deepAchievement = ACHIEVEMENTS.find((a) => a.trigger.type === 'depth_reached')
    expect(deepAchievement).toBeDefined()
    if (deepAchievement?.trigger.type === 'depth_reached') {
      expect(deepAchievement.trigger.threshold_m).toBeGreaterThan(0)
    }
  })
})

describe('getAchievementById', () => {
  it('returns the correct achievement', () => {
    const a = getAchievementById('first_descent')
    expect(a?.title).toBe('First Descent')
  })

  it('returns undefined for an unknown id', () => {
    expect(getAchievementById('nonexistent_badge')).toBeUndefined()
  })
})

describe('getAchievementsByTriggerType', () => {
  it('returns only achievements matching the trigger type', () => {
    const results = getAchievementsByTriggerType('dive_count')
    expect(results.length).toBeGreaterThan(0)
    for (const a of results) {
      expect(a.trigger.type).toBe('dive_count')
    }
  })

  it('returns multiple dive_count achievements at different thresholds', () => {
    const results = getAchievementsByTriggerType('dive_count')
    const thresholds = results
      .filter((a) => a.trigger.type === 'dive_count')
      .map((a) => (a.trigger as { type: 'dive_count'; threshold: number }).threshold)
    expect(new Set(thresholds).size).toBe(thresholds.length)
  })

  it('returns empty array for an unknown trigger type', () => {
    expect(getAchievementsByTriggerType('unknown_trigger')).toEqual([])
  })
})
