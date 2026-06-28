import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>DiveLink</Text>
        <Text style={styles.tagline}>
          Master diving knowledge.{'\n'}Track every descent.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(auth)/login')}
          accessibilityRole="button"
          accessibilityLabel="Sign in to DiveLink"
        >
          <Text style={styles.primaryButtonText}>Sign In with DiveLink</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          New to DiveLink?{' '}
          <Text style={styles.hintLink}>Create an account at divelink.app</Text>
        </Text>
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
  hero: {
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 28,
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
  hint: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 14,
  },
  hintLink: {
    color: '#06B6D4',
  },
})
