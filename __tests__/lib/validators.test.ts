import { LoginSchema, DiveLogSchema, NotificationTimeSchema, AppProfileSchema } from '../../lib/validators'

describe('LoginSchema', () => {
  it('accepts valid credentials', () => {
    expect(() =>
      LoginSchema.parse({ email: 'diver@example.com', password: 'password123' })
    ).not.toThrow()
  })

  it('rejects invalid email', () => {
    expect(LoginSchema.safeParse({ email: 'notanemail', password: 'password123' }).success).toBe(false)
  })

  it('rejects email missing @', () => {
    expect(LoginSchema.safeParse({ email: 'diver.example.com', password: 'password123' }).success).toBe(false)
  })

  it('rejects password shorter than 8 characters', () => {
    expect(LoginSchema.safeParse({ email: 'diver@example.com', password: 'short' }).success).toBe(false)
  })

  it('accepts password of exactly 8 characters', () => {
    expect(LoginSchema.safeParse({ email: 'diver@example.com', password: '12345678' }).success).toBe(true)
  })
})

describe('DiveLogSchema', () => {
  const VALID: Record<string, unknown> = {
    site_name: 'Blue Hole',
    date: '2026-06-24',
    max_depth_m: 32,
    duration_min: 56,
    start_pressure_bar: 200,
    end_pressure_bar: 60,
    checklist_completed: true,
  }

  it('accepts a complete valid dive log', () => {
    expect(() => DiveLogSchema.parse(VALID)).not.toThrow()
  })

  it('defaults photo_urls to empty array when omitted', () => {
    expect(DiveLogSchema.parse(VALID).photo_urls).toEqual([])
  })

  it('rejects when end_pressure_bar > start_pressure_bar', () => {
    expect(
      DiveLogSchema.safeParse({ ...VALID, start_pressure_bar: 100, end_pressure_bar: 200 }).success
    ).toBe(false)
  })

  it('accepts equal start and end pressure', () => {
    expect(
      DiveLogSchema.safeParse({ ...VALID, start_pressure_bar: 50, end_pressure_bar: 50 }).success
    ).toBe(true)
  })

  it('rejects depth over 350 m', () => {
    expect(DiveLogSchema.safeParse({ ...VALID, max_depth_m: 400 }).success).toBe(false)
  })

  it('rejects negative depth', () => {
    expect(DiveLogSchema.safeParse({ ...VALID, max_depth_m: -5 }).success).toBe(false)
  })

  it('rejects duration over 600 minutes', () => {
    expect(DiveLogSchema.safeParse({ ...VALID, duration_min: 601 }).success).toBe(false)
  })

  it('rejects more than 5 photos', () => {
    expect(
      DiveLogSchema.safeParse({
        ...VALID,
        photo_urls: Array(6).fill('https://example.com/photo.jpg'),
      }).success
    ).toBe(false)
  })

  it('rejects invalid date format', () => {
    expect(DiveLogSchema.safeParse({ ...VALID, date: '24/06/2026' }).success).toBe(false)
    expect(DiveLogSchema.safeParse({ ...VALID, date: '2026-6-24' }).success).toBe(false)
  })

  it('rejects empty site name', () => {
    expect(DiveLogSchema.safeParse({ ...VALID, site_name: '' }).success).toBe(false)
  })

  it('rejects non-integer duration', () => {
    expect(DiveLogSchema.safeParse({ ...VALID, duration_min: 45.5 }).success).toBe(false)
  })
})

describe('NotificationTimeSchema', () => {
  it('accepts valid times', () => {
    expect(() => NotificationTimeSchema.parse({ notif_time: '08:00' })).not.toThrow()
    expect(() => NotificationTimeSchema.parse({ notif_time: '00:00' })).not.toThrow()
    expect(() => NotificationTimeSchema.parse({ notif_time: '23:59' })).not.toThrow()
  })

  it('rejects hour > 23', () => {
    expect(NotificationTimeSchema.safeParse({ notif_time: '25:00' }).success).toBe(false)
  })

  it('rejects minute > 59', () => {
    expect(NotificationTimeSchema.safeParse({ notif_time: '08:60' }).success).toBe(false)
  })

  it('rejects single-digit hour', () => {
    expect(NotificationTimeSchema.safeParse({ notif_time: '8:00' }).success).toBe(false)
  })

  it('rejects non-time strings', () => {
    expect(NotificationTimeSchema.safeParse({ notif_time: 'morning' }).success).toBe(false)
  })
})

describe('AppProfileSchema', () => {
  it('accepts valid profile settings', () => {
    expect(() =>
      AppProfileSchema.parse({
        unit_pref: 'metric',
        leaderboard_opt_in: false,
        notif_time: '08:00',
      })
    ).not.toThrow()
  })

  it('rejects unknown unit_pref', () => {
    expect(
      AppProfileSchema.safeParse({ unit_pref: 'furlongs', leaderboard_opt_in: false, notif_time: '08:00' }).success
    ).toBe(false)
  })
})
