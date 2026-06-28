import { create } from 'zustand'
import type { DiverIdentity } from '../types/divelink'
import type { AppProfile } from '../types/app'

type AuthState = {
  identity: DiverIdentity | null
  accessToken: string | null
  appProfile: AppProfile | null
  isLoading: boolean
  isHydrated: boolean
}

type AuthActions = {
  setIdentity: (identity: DiverIdentity | null) => void
  setAccessToken: (token: string | null) => void
  setAppProfile: (profile: AppProfile | null) => void
  setLoading: (loading: boolean) => void
  setHydrated: (hydrated: boolean) => void
  signOut: () => void
}

export type AuthStore = AuthState & AuthActions

const INITIAL_STATE: AuthState = {
  identity: null,
  accessToken: null,
  appProfile: null,
  isLoading: false,
  isHydrated: false,
}

export const useAuthStore = create<AuthStore>()((set) => ({
  ...INITIAL_STATE,

  setIdentity: (identity) => set({ identity }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setAppProfile: (appProfile) => set({ appProfile }),
  setLoading: (isLoading) => set({ isLoading }),
  setHydrated: (isHydrated) => set({ isHydrated }),

  signOut: () =>
    set({ identity: null, accessToken: null, appProfile: null }),
}))

// ── Selectors ──────────────────────────────────────────────────────────────

export const selectIsAuthenticated = (s: AuthStore): boolean =>
  s.identity !== null && s.accessToken !== null

export const selectIsInstructor = (s: AuthStore): boolean =>
  s.identity?.is_instructor ?? false

/** Numeric content-gating tier (0-3) from the user's highest active CMAS cert. */
export const selectCertTier = (s: AuthStore): number =>
  s.identity?.highest_active_certification?.cert_tier ?? 0
