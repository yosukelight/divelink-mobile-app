import { useGamificationStore } from '../../stores/gamificationStore'
import type { Achievement } from '../../types/app'

const ACHIEVEMENT: Achievement = {
  id: 'first_descent',
  title: 'First Descent',
  description: 'Log your first dive',
  icon: '🤿',
  xp_reward: 50,
  trigger: { type: 'dive_count', threshold: 1 },
}

const ACHIEVEMENT_2: Achievement = {
  id: 'surface_interval',
  title: 'Surface Interval',
  description: '7-day streak',
  icon: '🔥',
  xp_reward: 100,
  trigger: { type: 'streak_days', threshold: 7 },
}

beforeEach(() => {
  useGamificationStore.getState().reset()
})

describe('gamificationStore — XP events', () => {
  it('starts with no pending XP events', () => {
    expect(useGamificationStore.getState().pendingXpEvents).toHaveLength(0)
  })

  it('addXpEvent appends an event with source and amount', () => {
    useGamificationStore.getState().addXpEvent('quiz', 50)
    const events = useGamificationStore.getState().pendingXpEvents
    expect(events).toHaveLength(1)
    expect(events[0].source).toBe('quiz')
    expect(events[0].amount).toBe(50)
  })

  it('multiple addXpEvent calls accumulate', () => {
    useGamificationStore.getState().addXpEvent('quiz', 50)
    useGamificationStore.getState().addXpEvent('checklist', 20)
    useGamificationStore.getState().addXpEvent('dive_log', 75)
    expect(useGamificationStore.getState().pendingXpEvents).toHaveLength(3)
  })

  it('each event has a unique ID', () => {
    useGamificationStore.getState().addXpEvent('quiz', 50)
    useGamificationStore.getState().addXpEvent('dive_log', 75)
    const ids = useGamificationStore.getState().pendingXpEvents.map((e) => e.id)
    expect(new Set(ids).size).toBe(2)
  })

  it('clearXpEvents removes all events', () => {
    useGamificationStore.getState().addXpEvent('quiz', 50)
    useGamificationStore.getState().clearXpEvents()
    expect(useGamificationStore.getState().pendingXpEvents).toHaveLength(0)
  })
})

describe('gamificationStore — achievement queue', () => {
  it('starts with no pending achievements', () => {
    expect(useGamificationStore.getState().pendingAchievements).toHaveLength(0)
  })

  it('addPendingAchievement enqueues an achievement', () => {
    useGamificationStore.getState().addPendingAchievement(ACHIEVEMENT)
    expect(useGamificationStore.getState().pendingAchievements).toHaveLength(1)
    expect(useGamificationStore.getState().pendingAchievements[0].id).toBe('first_descent')
  })

  it('dismissAchievement removes the matching achievement', () => {
    useGamificationStore.getState().addPendingAchievement(ACHIEVEMENT)
    useGamificationStore.getState().dismissAchievement('first_descent')
    expect(useGamificationStore.getState().pendingAchievements).toHaveLength(0)
  })

  it('dismissAchievement only removes the targeted achievement', () => {
    useGamificationStore.getState().addPendingAchievement(ACHIEVEMENT)
    useGamificationStore.getState().addPendingAchievement(ACHIEVEMENT_2)
    useGamificationStore.getState().dismissAchievement('first_descent')
    const remaining = useGamificationStore.getState().pendingAchievements
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe('surface_interval')
  })

  it('dismissAchievement with unknown id is a no-op', () => {
    useGamificationStore.getState().addPendingAchievement(ACHIEVEMENT)
    useGamificationStore.getState().dismissAchievement('nonexistent')
    expect(useGamificationStore.getState().pendingAchievements).toHaveLength(1)
  })
})

describe('gamificationStore — reset', () => {
  it('clears XP events and pending achievements', () => {
    useGamificationStore.getState().addXpEvent('quiz', 50)
    useGamificationStore.getState().addPendingAchievement(ACHIEVEMENT)
    useGamificationStore.getState().reset()
    expect(useGamificationStore.getState().pendingXpEvents).toHaveLength(0)
    expect(useGamificationStore.getState().pendingAchievements).toHaveLength(0)
  })
})
