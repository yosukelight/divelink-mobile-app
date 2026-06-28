import { create } from 'zustand'
import type { Achievement, XpSource } from '../types/app'

type XpEvent = {
  id: string
  source: XpSource
  amount: number
}

type GamificationState = {
  pendingXpEvents: XpEvent[]
  pendingAchievements: Achievement[]
}

type GamificationActions = {
  addXpEvent: (source: XpSource, amount: number) => void
  clearXpEvents: () => void
  addPendingAchievement: (achievement: Achievement) => void
  dismissAchievement: (id: string) => void
  reset: () => void
}

let _eventSeq = 0

export const useGamificationStore = create<GamificationState & GamificationActions>()(
  (set) => ({
    pendingXpEvents: [],
    pendingAchievements: [],

    addXpEvent: (source, amount) =>
      set((s) => ({
        pendingXpEvents: [
          ...s.pendingXpEvents,
          { id: `xp-${++_eventSeq}`, source, amount },
        ],
      })),

    clearXpEvents: () => set({ pendingXpEvents: [] }),

    addPendingAchievement: (achievement) =>
      set((s) => ({
        pendingAchievements: [...s.pendingAchievements, achievement],
      })),

    dismissAchievement: (id) =>
      set((s) => ({
        pendingAchievements: s.pendingAchievements.filter((a) => a.id !== id),
      })),

    reset: () =>
      set({ pendingXpEvents: [], pendingAchievements: [] }),
  }),
)
