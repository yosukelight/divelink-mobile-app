import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import { diveLinkApi, DiveLinkApiError } from '../lib/diveLinkApi'
import { setSupabaseToken } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

/**
 * Manages session hydration and token refresh on app foreground.
 *
 * On first mount the store is already populated if the user just logged in via
 * the login screen. This hook handles:
 *  1. Marking the store as hydrated after initial population.
 *  2. Refreshing the access token when the app returns to foreground (using the
 *     refresh token from the store, if present). If refresh fails, signs the
 *     user out.
 */
export function useSession(): void {
  const { setIdentity, setAccessToken, setHydrated, setLoading, signOut } = useAuthStore()
  const appState = useRef<AppStateStatus>(AppState.currentState)

  useEffect(() => {
    // On first render the auth store may already have tokens if the user just
    // logged in. Mark as hydrated so the root layout can route correctly.
    setHydrated(true)

    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // App returned to foreground — attempt silent token refresh
        const store = useAuthStore.getState()
        if (!store.accessToken) return

        try {
          setLoading(true)
          const tokens = await diveLinkApi.auth.refresh(store.accessToken)
          setAccessToken(tokens.access_token)
          setSupabaseToken(tokens.access_token)
          // Re-fetch identity with new token to pick up any cert changes
          const diver = await diveLinkApi.divers.me(tokens.access_token)
          setIdentity(diver)
        } catch (err) {
          if (err instanceof DiveLinkApiError && err.status === 401) {
            setSupabaseToken(null)
            signOut()
          }
        } finally {
          setLoading(false)
        }
      }
      appState.current = nextState
    })

    return () => subscription.remove()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
