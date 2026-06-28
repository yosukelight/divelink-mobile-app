import {
  useAuthStore,
  selectIsAuthenticated,
  selectIsInstructor,
  selectCertTier,
} from '../../stores/authStore'
import type { DiverIdentity } from '../../types/divelink'
import type { AppProfile } from '../../types/app'

const IDENTITY: DiverIdentity = {
  id: 'user-123',
  email: 'diver@example.com',
  display_name: 'Test Diver',
  cmas_membership_number: 'CM-001',
  roles: ['DIVER'],
  certifications: [],
  highest_active_certification: {
    id: 'cert-1',
    level: 'CMAS_2_STAR',
    status: 'ACTIVE',
    issued_at: '2023-01-01',
    expires_at: null,
    cert_tier: 2,
  },
  is_instructor: false,
}

const PROFILE: AppProfile = {
  id: 'user-123',
  xp: 500,
  level: 1,
  streak_days: 7,
  streak_last_active: '2026-06-28',
  unit_pref: 'metric',
  leaderboard_opt_in: false,
  notif_time: '08:00',
  expo_push_token: null,
  created_at: '2026-01-01T00:00:00.000Z',
}

beforeEach(() => {
  useAuthStore.setState({
    identity: null,
    accessToken: null,
    appProfile: null,
    isLoading: false,
    isHydrated: false,
  })
})

describe('authStore — initial state', () => {
  it('identity is null', () => expect(useAuthStore.getState().identity).toBeNull())
  it('accessToken is null', () => expect(useAuthStore.getState().accessToken).toBeNull())
  it('appProfile is null', () => expect(useAuthStore.getState().appProfile).toBeNull())
  it('isLoading is false', () => expect(useAuthStore.getState().isLoading).toBe(false))
  it('isHydrated is false', () => expect(useAuthStore.getState().isHydrated).toBe(false))
})

describe('authStore — setIdentity', () => {
  it('stores diver identity', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    expect(useAuthStore.getState().identity?.id).toBe('user-123')
  })

  it('clears identity when set to null', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    useAuthStore.getState().setIdentity(null)
    expect(useAuthStore.getState().identity).toBeNull()
  })
})

describe('authStore — setAccessToken', () => {
  it('stores the token string', () => {
    useAuthStore.getState().setAccessToken('my-jwt')
    expect(useAuthStore.getState().accessToken).toBe('my-jwt')
  })
})

describe('authStore — setAppProfile', () => {
  it('stores the app profile', () => {
    useAuthStore.getState().setAppProfile(PROFILE)
    expect(useAuthStore.getState().appProfile?.xp).toBe(500)
    expect(useAuthStore.getState().appProfile?.streak_days).toBe(7)
  })
})

describe('authStore — setLoading / setHydrated', () => {
  it('setLoading toggles isLoading', () => {
    useAuthStore.getState().setLoading(true)
    expect(useAuthStore.getState().isLoading).toBe(true)
    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)
  })

  it('setHydrated marks the store as hydrated', () => {
    useAuthStore.getState().setHydrated(true)
    expect(useAuthStore.getState().isHydrated).toBe(true)
  })
})

describe('authStore — signOut', () => {
  it('clears identity, token, and profile', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    useAuthStore.getState().setAccessToken('jwt')
    useAuthStore.getState().setAppProfile(PROFILE)
    useAuthStore.getState().signOut()
    const s = useAuthStore.getState()
    expect(s.identity).toBeNull()
    expect(s.accessToken).toBeNull()
    expect(s.appProfile).toBeNull()
  })

  it('does not affect isLoading or isHydrated', () => {
    useAuthStore.getState().setLoading(true)
    useAuthStore.getState().setHydrated(true)
    useAuthStore.getState().signOut()
    expect(useAuthStore.getState().isLoading).toBe(true)
    expect(useAuthStore.getState().isHydrated).toBe(true)
  })
})

describe('selectors', () => {
  it('selectIsAuthenticated is false with no identity or token', () => {
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
  })

  it('selectIsAuthenticated is false with identity but no token', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)
  })

  it('selectIsAuthenticated is true when both identity and token are set', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    useAuthStore.getState().setAccessToken('jwt')
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
  })

  it('selectIsInstructor is false for a diver', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    expect(selectIsInstructor(useAuthStore.getState())).toBe(false)
  })

  it('selectIsInstructor is true when identity.is_instructor is true', () => {
    useAuthStore.getState().setIdentity({ ...IDENTITY, is_instructor: true })
    expect(selectIsInstructor(useAuthStore.getState())).toBe(true)
  })

  it('selectCertTier is 0 when not signed in', () => {
    expect(selectCertTier(useAuthStore.getState())).toBe(0)
  })

  it('selectCertTier returns the cert_tier from highest_active_certification', () => {
    useAuthStore.getState().setIdentity(IDENTITY)
    expect(selectCertTier(useAuthStore.getState())).toBe(2)
  })

  it('selectCertTier is 0 when no active certification', () => {
    useAuthStore.getState().setIdentity({ ...IDENTITY, highest_active_certification: null })
    expect(selectCertTier(useAuthStore.getState())).toBe(0)
  })
})
