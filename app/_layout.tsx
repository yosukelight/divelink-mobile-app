import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useAuthStore, selectIsAuthenticated } from '../stores/authStore'
import { configureForegroundHandler } from '../lib/notifications'

configureForegroundHandler()

export default function RootLayout() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (!isHydrated) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)')
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)')
    }
  }, [isAuthenticated, isHydrated, segments, router])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  )
}
