import { useQuizStore } from '../../stores/quizStore'
import type { QuizQuestion } from '../../types/app'

const Q1: QuizQuestion = {
  id: 'q1',
  question: 'What does BWRAF stand for?',
  options: ['A (wrong)', 'B — Buoyancy, Weights, Releases, Air, Final OK', 'C (wrong)', 'D (wrong)'],
  correct_index: 1,
  explanation: 'BWRAF is the pre-dive buddy check.',
  difficulty: 'easy',
  min_cert_tier: 0,
}

const Q2: QuizQuestion = {
  id: 'q2',
  question: 'Safe ascent rate?',
  options: ['18 m/min', '9 m/min', '5 m/min', '15 m/min'],
  correct_index: 1,
  explanation: '9 m/min or slower is the guideline.',
  difficulty: 'easy',
  min_cert_tier: 0,
}

const QUESTIONS = [Q1, Q2]

beforeEach(() => {
  useQuizStore.getState().reset()
})

describe('quizStore — startSession', () => {
  it('creates an active session', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    expect(useQuizStore.getState().activeSession).not.toBeNull()
  })

  it('stores userId and questions on the session', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    const session = useQuizStore.getState().activeSession!
    expect(session.user_id).toBe('user-1')
    expect(session.questions).toHaveLength(2)
  })

  it('resets answers and currentIndex to zero', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    expect(useQuizStore.getState().answers).toHaveLength(0)
    expect(useQuizStore.getState().currentIndex).toBe(0)
  })

  it('starting a new session replaces the previous one', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().startSession('user-2', [Q1])
    expect(useQuizStore.getState().activeSession!.user_id).toBe('user-2')
    expect(useQuizStore.getState().activeSession!.questions).toHaveLength(1)
  })
})

describe('quizStore — submitAnswer', () => {
  beforeEach(() => useQuizStore.getState().startSession('user-1', QUESTIONS))

  it('records a correct answer when selectedIndex matches correct_index', () => {
    useQuizStore.getState().submitAnswer('q1', 1)
    expect(useQuizStore.getState().answers[0].is_correct).toBe(true)
  })

  it('records an incorrect answer when selectedIndex differs', () => {
    useQuizStore.getState().submitAnswer('q1', 0)
    expect(useQuizStore.getState().answers[0].is_correct).toBe(false)
  })

  it('stores the selected_index on the answer', () => {
    useQuizStore.getState().submitAnswer('q1', 2)
    expect(useQuizStore.getState().answers[0].selected_index).toBe(2)
  })

  it('increments currentIndex after each answer', () => {
    useQuizStore.getState().submitAnswer('q1', 1)
    expect(useQuizStore.getState().currentIndex).toBe(1)
    useQuizStore.getState().submitAnswer('q2', 1)
    expect(useQuizStore.getState().currentIndex).toBe(2)
  })

  it('is a no-op when there is no active session', () => {
    useQuizStore.getState().reset()
    useQuizStore.getState().submitAnswer('q1', 1)
    expect(useQuizStore.getState().answers).toHaveLength(0)
  })

  it('is a no-op for an unknown question ID', () => {
    useQuizStore.getState().submitAnswer('unknown-id', 0)
    expect(useQuizStore.getState().answers).toHaveLength(0)
  })
})

describe('quizStore — endSession', () => {
  it('returns null when no session is active', () => {
    expect(useQuizStore.getState().endSession()).toBeNull()
  })

  it('returns QuizResults with correct count', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().submitAnswer('q1', 1) // correct
    useQuizStore.getState().submitAnswer('q2', 0) // wrong
    const r = useQuizStore.getState().endSession()!
    expect(r.total).toBe(2)
    expect(r.correct).toBe(1)
  })

  it('results include all answers', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().submitAnswer('q1', 1)
    const r = useQuizStore.getState().endSession()!
    expect(r.answers).toHaveLength(1)
  })

  it('clears activeSession after endSession', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().endSession()
    expect(useQuizStore.getState().activeSession).toBeNull()
  })

  it('streak_continued is true when at least one correct answer', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().submitAnswer('q1', 1) // correct
    useQuizStore.getState().submitAnswer('q2', 0) // wrong
    expect(useQuizStore.getState().endSession()!.streak_continued).toBe(true)
  })

  it('streak_continued is false when all answers are wrong', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().submitAnswer('q1', 0) // wrong
    useQuizStore.getState().submitAnswer('q2', 0) // wrong
    expect(useQuizStore.getState().endSession()!.streak_continued).toBe(false)
  })

  it('xp_earned is 0 (awarded externally via gamificationStore)', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().submitAnswer('q1', 1)
    expect(useQuizStore.getState().endSession()!.xp_earned).toBe(0)
  })
})

describe('quizStore — reset', () => {
  it('clears session, answers, and index', () => {
    useQuizStore.getState().startSession('user-1', QUESTIONS)
    useQuizStore.getState().submitAnswer('q1', 1)
    useQuizStore.getState().reset()
    expect(useQuizStore.getState().activeSession).toBeNull()
    expect(useQuizStore.getState().answers).toHaveLength(0)
    expect(useQuizStore.getState().currentIndex).toBe(0)
  })
})
