import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../../stores/authStore'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const SLIDES = [
  {
    emoji: '🌊',
    title: 'Daily Dive Briefings',
    body: 'One Do, one Don\'t — delivered every morning to build real diving instincts over time.',
  },
  {
    emoji: '🧠',
    title: 'Adaptive Quiz System',
    body: 'Questions you miss come back sooner. Questions you ace stay quiet. Spaced repetition at work.',
  },
  {
    emoji: '⭐',
    title: 'XP & Levels Are Motivational',
    body: 'XP levels like "Divemaster" are in-app progress, separate from your CMAS certification. Your real cert badge shows separately.',
  },
  {
    emoji: '📓',
    title: 'Log Every Dive',
    body: 'Start with the BWRAF pre-dive checklist, then record depth, duration, buddy, and conditions.',
  },
] as const

export default function CarouselOnboardingScreen() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const setHydrated = useAuthStore((s) => s.setHydrated)
  const isLast = index === SLIDES.length - 1
  const slide = SLIDES[index]

  function handleNext() {
    if (isLast) {
      // Mark store as hydrated so root layout redirects to (app)
      setHydrated(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.slide}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get started' : 'Next'}
        >
          <Text style={styles.buttonText}>{isLast ? "Let's Dive In" : 'Next'}</Text>
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
  slide: {
    alignItems: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
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
  footer: {
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
  },
  dotActive: {
    backgroundColor: '#3B82F6',
    width: 20,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
