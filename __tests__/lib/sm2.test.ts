import { sm2, SM2_MIN_EASE, SM2_DEFAULT_EASE } from '../../lib/sm2'

const FIXED_NOW = new Date('2026-01-01T00:00:00.000Z')
const BASE = { easeFactor: SM2_DEFAULT_EASE, intervalDays: 0, timesCorrect: 0 }

describe('sm2 — forgot (quality=0)', () => {
  it('resets interval to 1 day', () => {
    const result = sm2({ ...BASE, quality: 0 }, FIXED_NOW)
    expect(result.intervalDays).toBe(1)
  })

  it('resets a long interval back to 1 day', () => {
    const result = sm2({ ...BASE, intervalDays: 30, quality: 0 }, FIXED_NOW)
    expect(result.intervalDays).toBe(1)
  })

  it('does not change ease factor on forget', () => {
    const result = sm2({ ...BASE, quality: 0 }, FIXED_NOW)
    expect(result.easeFactor).toBe(SM2_DEFAULT_EASE)
  })
})

describe('sm2 — hard (quality=1)', () => {
  it('first hard answer sets interval to 1 day', () => {
    const result = sm2({ ...BASE, quality: 1 }, FIXED_NOW)
    expect(result.intervalDays).toBe(1)
  })

  it('second hard answer sets interval to 6 days', () => {
    const result = sm2({ ...BASE, intervalDays: 1, quality: 1 }, FIXED_NOW)
    expect(result.intervalDays).toBe(6)
  })

  it('decreases ease factor', () => {
    const result = sm2({ ...BASE, intervalDays: 6, quality: 1 }, FIXED_NOW)
    expect(result.easeFactor).toBeLessThan(SM2_DEFAULT_EASE)
  })

  it('ease factor never drops below SM2_MIN_EASE after repeated hard answers', () => {
    let state = { easeFactor: SM2_MIN_EASE + 0.1, intervalDays: 6, timesCorrect: 1 }
    for (let i = 0; i < 20; i++) {
      const out = sm2({ ...state, quality: 1 }, FIXED_NOW)
      state = { ...state, easeFactor: out.easeFactor, intervalDays: out.intervalDays }
    }
    expect(state.easeFactor).toBeGreaterThanOrEqual(SM2_MIN_EASE)
  })
})

describe('sm2 — got it (quality=2)', () => {
  it('first correct answer sets interval to 1 day', () => {
    const result = sm2({ ...BASE, quality: 2 }, FIXED_NOW)
    expect(result.intervalDays).toBe(1)
  })

  it('second correct answer sets interval to 6 days', () => {
    const result = sm2({ ...BASE, intervalDays: 1, quality: 2 }, FIXED_NOW)
    expect(result.intervalDays).toBe(6)
  })

  it('third correct answer multiplies interval by ease factor', () => {
    const result = sm2({ ...BASE, intervalDays: 6, quality: 2 }, FIXED_NOW)
    expect(result.intervalDays).toBe(Math.round(6 * SM2_DEFAULT_EASE))
  })

  it('increases ease factor', () => {
    const result = sm2({ ...BASE, intervalDays: 6, quality: 2 }, FIXED_NOW)
    expect(result.easeFactor).toBeGreaterThan(SM2_DEFAULT_EASE)
  })
})

describe('sm2 — nextReview', () => {
  it('nextReview is exactly intervalDays ahead of now', () => {
    const result = sm2({ ...BASE, intervalDays: 6, quality: 2 }, FIXED_NOW)
    const expected = new Date(FIXED_NOW)
    expected.setDate(expected.getDate() + result.intervalDays)
    expect(result.nextReview.toDateString()).toBe(expected.toDateString())
  })

  it('nextReview for a reset is 1 day ahead', () => {
    const result = sm2({ ...BASE, quality: 0 }, FIXED_NOW)
    const expected = new Date(FIXED_NOW)
    expected.setDate(expected.getDate() + 1)
    expect(result.nextReview.toDateString()).toBe(expected.toDateString())
  })
})
