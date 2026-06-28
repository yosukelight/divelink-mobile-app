/**
 * useSession hook — unit tests.
 *
 * Strategy: mock React's useEffect to invoke callbacks synchronously, and mock
 * all native/external dependencies so this file runs in Node via ts-jest.
 */

// ── Mocks (must be before imports) ─────────────────────────────────────────

const mockSetHydrated = jest.fn()
const mockSetLoading = jest.fn()
const mockSetAccessToken = jest.fn()
const mockSetIdentity = jest.fn()
const mockSignOut = jest.fn()
const mockSetSupabaseToken = jest.fn()
const mockRefresh = jest.fn()
const mockRemove = jest.fn()
const mockAddEventListener = jest.fn(() => ({ remove: mockRemove }))

let capturedEffectCallback: (() => (() => void) | void) | null = null

jest.mock('react', () => ({
  useEffect: jest.fn((cb: () => void) => {
    capturedEffectCallback = cb
  }),
  useRef: jest.fn((initialValue: unknown) => ({ current: initialValue })),
}))

jest.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: mockAddEventListener,
  },
}))

const mockMe = jest.fn()

jest.mock('../../lib/diveLinkApi', () => ({
  diveLinkApi: { auth: { refresh: mockRefresh }, divers: { me: mockMe } },
  DiveLinkApiError: class DiveLinkApiError extends Error {
    status: number
    code: string
    constructor(status: number, code: string, message: string) {
      super(message)
      this.status = status
      this.code = code
    }
  },
}))

jest.mock('../../lib/supabase', () => ({
  setSupabaseToken: mockSetSupabaseToken,
}))

const mockGetState = jest.fn()

jest.mock('../../stores/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    setIdentity: mockSetIdentity,
    setAccessToken: mockSetAccessToken,
    setHydrated: mockSetHydrated,
    setLoading: mockSetLoading,
    signOut: mockSignOut,
  })),
}))

// Apply getState after the mock is set up
import { useAuthStore } from '../../stores/authStore'
;(useAuthStore as unknown as { getState: jest.Mock }).getState = mockGetState

import { DiveLinkApiError } from '../../lib/diveLinkApi'
import { useSession } from '../../hooks/useSession'

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Invoke the hook to capture the effect callback, then run it. */
function runHook() {
  capturedEffectCallback = null
  useSession()
  if (!capturedEffectCallback) throw new Error('useEffect not called')
  return capturedEffectCallback as () => (() => void) | void
}

/** Capture the AppState handler by running the effect. */
function runEffectAndGetHandler(): (state: string) => Promise<void> {
  let appStateHandler: ((state: string) => Promise<void>) | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(mockAddEventListener as any).mockImplementation(
    (_event: string, cb: (state: string) => Promise<void>) => {
      appStateHandler = cb
      return { remove: mockRemove }
    },
  )
  const effect = runHook()
  effect()
  if (!appStateHandler) throw new Error('AppState handler not registered')
  return appStateHandler
}

// ── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks()
  mockAddEventListener.mockReturnValue({ remove: mockRemove })
})

describe('useSession', () => {
  test('calls setHydrated(true) on mount', () => {
    const effect = runHook()
    effect()
    expect(mockSetHydrated).toHaveBeenCalledWith(true)
  })

  test('registers AppState "change" listener on mount', () => {
    const effect = runHook()
    effect()
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  test('returns a cleanup function that removes the AppState listener', () => {
    const effect = runHook()
    const cleanup = effect()
    expect(typeof cleanup).toBe('function')
    ;(cleanup as () => void)()
    expect(mockRemove).toHaveBeenCalled()
  })

  test('does NOT call refresh if accessToken is null', async () => {
    mockGetState.mockReturnValue({ accessToken: null })
    const handler = runEffectAndGetHandler()
    // Simulate transition from background → active
    await handler('background')
    await handler('active')
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  test('calls refresh then me() when returning to foreground with accessToken', async () => {
    mockGetState.mockReturnValue({ accessToken: 'tok-abc' })
    mockRefresh.mockResolvedValue({ access_token: 'new-tok', refresh_token: 'rt', expires_in: 3600 })
    const mockDiver = { id: '1', email: 'a@b.com', display_name: 'Diver' }
    mockMe.mockResolvedValue(mockDiver)
    const handler = runEffectAndGetHandler()
    await handler('background')
    await handler('active')
    expect(mockRefresh).toHaveBeenCalledWith('tok-abc')
    expect(mockSetAccessToken).toHaveBeenCalledWith('new-tok')
    expect(mockSetSupabaseToken).toHaveBeenCalledWith('new-tok')
    expect(mockMe).toHaveBeenCalledWith('new-tok')
    expect(mockSetIdentity).toHaveBeenCalledWith(mockDiver)
  })

  test('does NOT call refresh transitioning from active → active', async () => {
    mockGetState.mockReturnValue({ accessToken: 'tok-xyz' })
    const handler = runEffectAndGetHandler()
    await handler('active') // stays active — no transition from background
    expect(mockRefresh).not.toHaveBeenCalled()
  })

  test('signs out when refresh returns 401', async () => {
    mockGetState.mockReturnValue({ accessToken: 'expired' })
    mockRefresh.mockRejectedValue(new DiveLinkApiError(401, 'UNAUTHORIZED', 'Expired'))
    const handler = runEffectAndGetHandler()
    await handler('background')
    await handler('active')
    expect(mockSignOut).toHaveBeenCalled()
    expect(mockSetSupabaseToken).toHaveBeenCalledWith(null)
  })

  test('does NOT sign out when refresh fails with non-401 error', async () => {
    mockGetState.mockReturnValue({ accessToken: 'tok' })
    mockRefresh.mockRejectedValue(new DiveLinkApiError(503, 'UNAVAILABLE', 'Server down'))
    const handler = runEffectAndGetHandler()
    await handler('background')
    await handler('active')
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  test('calls setLoading(true) then setLoading(false) around refresh', async () => {
    mockGetState.mockReturnValue({ accessToken: 'tok' })
    mockRefresh.mockResolvedValue({ access_token: 'new', refresh_token: 'rt', expires_in: 3600 })
    mockMe.mockResolvedValue({ id: '1' })
    const handler = runEffectAndGetHandler()
    await handler('background')
    await handler('active')
    expect(mockSetLoading).toHaveBeenNthCalledWith(1, true)
    expect(mockSetLoading).toHaveBeenNthCalledWith(2, false)
  })
})
