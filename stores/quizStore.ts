import { create } from 'zustand'
import type { QuizQuestion, QuizAnswer, QuizSession, QuizResults } from '../types/app'

type QuizState = {
  activeSession: QuizSession | null
  answers: QuizAnswer[]
  currentIndex: number
}

type QuizActions = {
  startSession: (userId: string, questions: QuizQuestion[]) => void
  submitAnswer: (questionId: string, selectedIndex: number) => void
  endSession: () => QuizResults | null
  reset: () => void
}

const INITIAL: QuizState = {
  activeSession: null,
  answers: [],
  currentIndex: 0,
}

export const useQuizStore = create<QuizState & QuizActions>()((set, get) => ({
  ...INITIAL,

  startSession: (userId, questions) =>
    set({
      activeSession: {
        id: `session-${Date.now()}`,
        user_id: userId,
        questions,
        started_at: new Date().toISOString(),
      },
      answers: [],
      currentIndex: 0,
    }),

  submitAnswer: (questionId, selectedIndex) => {
    const { activeSession } = get()
    if (!activeSession) return

    const question = activeSession.questions.find((q) => q.id === questionId)
    if (!question) return

    const answer: QuizAnswer = {
      question_id: questionId,
      selected_index: selectedIndex,
      is_correct: selectedIndex === question.correct_index,
      answered_at: new Date().toISOString(),
    }

    set((s) => ({
      answers: [...s.answers, answer],
      currentIndex: s.currentIndex + 1,
    }))
  },

  endSession: () => {
    const { activeSession, answers } = get()
    if (!activeSession) return null

    const correct = answers.filter((a) => a.is_correct).length
    const results: QuizResults = {
      session_id: activeSession.id,
      total: activeSession.questions.length,
      correct,
      xp_earned: 0, // caller awards XP via gamificationStore
      streak_continued: correct > 0,
      answers,
    }

    set(INITIAL)
    return results
  },

  reset: () => set(INITIAL),
}))
