import { parseNotifTime } from '../../lib/notifications'

// parseNotifTime is a pure function — no Expo mocks needed
describe('parseNotifTime', () => {
  test('parses valid 24-hour time', () => {
    expect(parseNotifTime('08:00')).toEqual({ hour: 8, minute: 0 })
    expect(parseNotifTime('14:30')).toEqual({ hour: 14, minute: 30 })
    expect(parseNotifTime('00:00')).toEqual({ hour: 0, minute: 0 })
    expect(parseNotifTime('23:59')).toEqual({ hour: 23, minute: 59 })
  })

  test('returns default { hour: 8, minute: 0 } for empty string', () => {
    expect(parseNotifTime('')).toEqual({ hour: 8, minute: 0 })
  })

  test('returns default for non-numeric input', () => {
    expect(parseNotifTime('abc:def')).toEqual({ hour: 8, minute: 0 })
  })

  test('returns default when hour is out of range', () => {
    expect(parseNotifTime('24:00')).toEqual({ hour: 8, minute: 0 })
    expect(parseNotifTime('-1:00')).toEqual({ hour: 8, minute: 0 })
  })

  test('returns default when minute is out of range', () => {
    expect(parseNotifTime('08:60')).toEqual({ hour: 8, minute: 0 })
    expect(parseNotifTime('08:-1')).toEqual({ hour: 8, minute: 0 })
  })

  test('handles single-digit hour and minute', () => {
    expect(parseNotifTime('9:5')).toEqual({ hour: 9, minute: 5 })
  })

  test('handles missing minute part gracefully', () => {
    // '08' splits to ['08'], minute part defaults to '0'
    expect(parseNotifTime('08')).toEqual({ hour: 8, minute: 0 })
  })
})
