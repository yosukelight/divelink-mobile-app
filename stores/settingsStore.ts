import { create } from 'zustand'
import type { UnitPref } from '../lib/units'

type SettingsState = {
  unitPref: UnitPref
  leaderboardOptIn: boolean
  notifTime: string
}

type SettingsActions = {
  setUnitPref: (pref: UnitPref) => void
  setLeaderboardOptIn: (optIn: boolean) => void
  setNotifTime: (time: string) => void
  hydrate: (settings: Partial<SettingsState>) => void
}

const DEFAULTS: SettingsState = {
  unitPref: 'metric',
  leaderboardOptIn: false,
  notifTime: '08:00',
}

export const useSettingsStore = create<SettingsState & SettingsActions>()((set) => ({
  ...DEFAULTS,

  setUnitPref: (unitPref) => set({ unitPref }),
  setLeaderboardOptIn: (leaderboardOptIn) => set({ leaderboardOptIn }),
  setNotifTime: (notifTime) => set({ notifTime }),
  hydrate: (settings) => set(settings),
}))
