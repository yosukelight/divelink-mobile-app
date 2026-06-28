import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuthStore, selectCertTier } from '../../../../stores/authStore'
import { levelFromXp, LEVEL_THRESHOLDS } from '../../../../lib/xp'
import type { AppProfile } from '../../../../types/app'

function XpProgressBar({ xp }: { xp: number }) {
  const currentLevel = levelFromXp(xp)
  const current = LEVEL_THRESHOLDS[currentLevel]
  const next = LEVEL_THRESHOLDS[currentLevel + 1]

  if (!next) {
    return (
      <View style={styles.xpContainer}>
        <Text style={styles.xpLabel}>Max Level — {current.title}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>
    )
  }

  const progress = Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp))

  return (
    <View style={styles.xpContainer}>
      <View style={styles.xpRow}>
        <Text style={styles.xpLabel}>{current.title}</Text>
        <Text style={styles.xpValue}>{xp} XP</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text style={styles.xpNext}>
        {next.minXp - xp} XP to {next.title}
      </Text>
    </View>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

export default function HomeScreen() {
  const identity = useAuthStore((s) => s.identity)
  const appProfile = useAuthStore((s) => s.appProfile)
  const certTier = useAuthStore(selectCertTier)
  const xp = appProfile?.xp ?? 0
  const streakDays = appProfile?.streak_days ?? 0
  const totalDives = appProfile?.total_dives ?? 0

  const certTierLabel = ['—', '★', '★★', '★★★'][certTier] ?? '—'

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back,{' '}
          <Text style={styles.name}>{identity?.display_name ?? 'Diver'}</Text>
        </Text>
        {certTier > 0 && (
          <View style={styles.certBadge}>
            <Text style={styles.certBadgeText}>CMAS {certTierLabel}</Text>
          </View>
        )}
      </View>

      <XpProgressBar xp={xp} />

      <View style={styles.statsRow}>
        <StatCard label="Streak" value={`${streakDays}d`} />
        <StatCard label="Dives" value={totalDives} />
        <StatCard label="Cert Tier" value={certTierLabel} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Briefing</Text>
        <TouchableOpacity style={styles.briefingCard}>
          <View style={styles.briefingBadge}>
            <Text style={styles.briefingBadgeText}>DO</Text>
          </View>
          <Text style={styles.briefingText}>
            Always perform a BWRAF check before every dive, even on repeat dives at the same site.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Quiz</Text>
        <TouchableOpacity style={styles.quizCard}>
          <Text style={styles.quizCardText}>Start today's quiz →</Text>
          <Text style={styles.quizCardSub}>3 questions · ~2 min · 50 XP</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 32,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 22,
    color: '#94A3B8',
    flex: 1,
  },
  name: {
    color: '#F1F5F9',
    fontWeight: '700',
  },
  certBadge: {
    backgroundColor: '#06B6D420',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#06B6D440',
  },
  certBadgeText: {
    color: '#06B6D4',
    fontSize: 12,
    fontWeight: '700',
  },
  xpContainer: {
    backgroundColor: '#0F1626',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  xpValue: {
    color: '#3B82F6',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  xpNext: {
    color: '#475569',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0F1626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  briefingCard: {
    backgroundColor: '#0F1626',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  briefingBadge: {
    backgroundColor: '#22C55E20',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#22C55E40',
  },
  briefingBadgeText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '700',
  },
  briefingText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 22,
  },
  quizCard: {
    backgroundColor: '#3B82F610',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3B82F640',
    gap: 6,
  },
  quizCardText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
  quizCardSub: {
    color: '#475569',
    fontSize: 13,
  },
})
