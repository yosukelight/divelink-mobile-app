import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

export default function LogScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Dive Log</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push('/(app)/(tabs)/log/new/checklist' as never)}
          accessibilityRole="button"
          accessibilityLabel="Log a new dive"
        >
          <Text style={styles.newButtonText}>+ New Dive</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>🤿</Text>
        <Text style={styles.emptyTitle}>No dives logged yet</Text>
        <Text style={styles.emptyBody}>
          Start with the pre-dive BWRAF checklist to log your first dive and earn 75 XP.
        </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  newButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  newButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  empty: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 64,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  emptyBody: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
})
