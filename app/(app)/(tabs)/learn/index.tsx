import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

const SECTIONS = [
  {
    title: 'Daily Quiz',
    description: '3 adaptive questions based on your weak spots',
    xp: '50 XP',
    color: '#3B82F6',
    route: '/(app)/(tabs)/learn/quiz/session',
  },
  {
    title: 'Flashcard Review',
    description: 'Rate cards you know vs. cards you need to revisit',
    xp: '30 XP',
    color: '#8B5CF6',
    route: '/(app)/(tabs)/learn/flashcards/session',
  },
  {
    title: 'Knowledge Base',
    description: 'Browse all Dos & Don\'ts by category',
    xp: null,
    color: '#06B6D4',
    route: '/(app)/(tabs)/learn/knowledge',
  },
  {
    title: 'Daily Briefings',
    description: 'Past briefing cards archive',
    xp: null,
    color: '#F59E0B',
    route: '/(app)/(tabs)/learn/briefings',
  },
] as const

export default function LearnScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Learn</Text>

      <View style={styles.grid}>
        {SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.title}
            style={[styles.card, { borderColor: section.color + '40' }]}
            onPress={() => router.push(section.route as never)}
            accessibilityRole="button"
            accessibilityLabel={section.title}
          >
            <View style={[styles.cardAccent, { backgroundColor: section.color }]} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardDesc}>{section.description}</Text>
              {section.xp && <Text style={[styles.cardXp, { color: section.color }]}>{section.xp}</Text>}
            </View>
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#0F1626',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 16,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  cardXp: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
})
