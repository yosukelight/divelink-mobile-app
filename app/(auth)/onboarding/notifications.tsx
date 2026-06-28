import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { requestNotificationPermission, scheduleDailyBriefing } from '../../../lib/notifications'
import { useSettingsStore } from '../../../stores/settingsStore'

export default function NotificationsOnboardingScreen() {
  const router = useRouter()
  const notifTime = useSettingsStore((s) => s.notifTime)

  async function handleEnable() {
    const status = await requestNotificationPermission()
    if (status === 'granted') {
      await scheduleDailyBriefing(notifTime)
    }
    router.replace('/(auth)/onboarding/carousel')
  }

  function handleSkip() {
    router.replace('/(auth)/onboarding/carousel')
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔔</Text>
        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.body}>
          Get a daily diving tip at your preferred time. A quick Do & Don't every morning builds
          lasting safety habits.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEnable}
          accessibilityRole="button"
          accessibilityLabel="Enable daily notifications"
        >
          <Text style={styles.primaryButtonText}>Enable Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip} accessibilityRole="button" accessibilityLabel="Skip">
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C18',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 48,
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 26,
  },
  actions: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipText: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 15,
  },
})
