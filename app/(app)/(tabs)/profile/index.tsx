import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore, selectIsInstructor, selectCertTier } from '../../../../stores/authStore'
import { useSettingsStore } from '../../../../stores/settingsStore'
import { setSupabaseToken } from '../../../../lib/supabase'
import { diveLinkApi } from '../../../../lib/diveLinkApi'
import { cancelDailyBriefing } from '../../../../lib/notifications'

const CERT_TIER_LABELS = ['Not certified', 'CMAS 1 ★', 'CMAS 2 ★★', 'CMAS 3 ★★★'] as const

export default function ProfileScreen() {
  const router = useRouter()
  const identity = useAuthStore((s) => s.identity)
  const accessToken = useAuthStore((s) => s.accessToken)
  const isInstructor = useAuthStore(selectIsInstructor)
  const certTier = useAuthStore(selectCertTier)
  const signOut = useAuthStore((s) => s.signOut)
  const unitPref = useSettingsStore((s) => s.unitPref)
  const setUnitPref = useSettingsStore((s) => s.setUnitPref)

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            if (accessToken) {
              await diveLinkApi.auth.logout(accessToken).catch(() => {})
            }
          } finally {
            await cancelDailyBriefing()
            setSupabaseToken(null)
            signOut()
          }
        },
      },
    ])
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.displayName}>{identity?.display_name ?? '—'}</Text>
        <Text style={styles.email}>{identity?.email ?? '—'}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{CERT_TIER_LABELS[certTier] ?? '—'}</Text>
          </View>
          {isInstructor && (
            <View style={[styles.badge, styles.instructorBadge]}>
              <Text style={styles.badgeText}>Instructor</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Units</Text>
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleOption, unitPref === 'metric' && styles.toggleActive]}
              onPress={() => setUnitPref('metric')}
              accessibilityRole="radio"
              accessibilityState={{ checked: unitPref === 'metric' }}
            >
              <Text style={[styles.toggleText, unitPref === 'metric' && styles.toggleTextActive]}>
                Metric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, unitPref === 'imperial' && styles.toggleActive]}
              onPress={() => setUnitPref('imperial')}
              accessibilityRole="radio"
              accessibilityState={{ checked: unitPref === 'imperial' }}
            >
              <Text style={[styles.toggleText, unitPref === 'imperial' && styles.toggleTextActive]}>
                Imperial
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#080C18',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 48,
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  card: {
    backgroundColor: '#0F1626',
    borderRadius: 16,
    padding: 20,
    gap: 6,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  email: {
    fontSize: 14,
    color: '#64748B',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#06B6D420',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#06B6D440',
  },
  instructorBadge: {
    backgroundColor: '#F59E0B20',
    borderColor: '#F59E0B40',
  },
  badgeText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    backgroundColor: '#0F1626',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: '#CBD5E1',
    fontSize: 15,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 2,
  },
  toggleOption: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  signOutButton: {
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  signOutText: {
    color: '#F87171',
    fontSize: 15,
    fontWeight: '600',
  },
})
