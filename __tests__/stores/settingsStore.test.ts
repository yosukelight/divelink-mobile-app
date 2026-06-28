import { useSettingsStore } from '../../stores/settingsStore'

beforeEach(() => {
  useSettingsStore.setState({
    unitPref: 'metric',
    leaderboardOptIn: false,
    notifTime: '08:00',
  })
})

describe('settingsStore — defaults', () => {
  it('unit preference defaults to metric', () => {
    expect(useSettingsStore.getState().unitPref).toBe('metric')
  })

  it('leaderboard opt-in defaults to false', () => {
    expect(useSettingsStore.getState().leaderboardOptIn).toBe(false)
  })

  it('notification time defaults to 08:00', () => {
    expect(useSettingsStore.getState().notifTime).toBe('08:00')
  })
})

describe('settingsStore — setUnitPref', () => {
  it('switches to imperial', () => {
    useSettingsStore.getState().setUnitPref('imperial')
    expect(useSettingsStore.getState().unitPref).toBe('imperial')
  })

  it('switches back to metric', () => {
    useSettingsStore.getState().setUnitPref('imperial')
    useSettingsStore.getState().setUnitPref('metric')
    expect(useSettingsStore.getState().unitPref).toBe('metric')
  })
})

describe('settingsStore — setLeaderboardOptIn', () => {
  it('enables leaderboard opt-in', () => {
    useSettingsStore.getState().setLeaderboardOptIn(true)
    expect(useSettingsStore.getState().leaderboardOptIn).toBe(true)
  })

  it('can opt back out', () => {
    useSettingsStore.getState().setLeaderboardOptIn(true)
    useSettingsStore.getState().setLeaderboardOptIn(false)
    expect(useSettingsStore.getState().leaderboardOptIn).toBe(false)
  })
})

describe('settingsStore — setNotifTime', () => {
  it('updates the notification time', () => {
    useSettingsStore.getState().setNotifTime('07:30')
    expect(useSettingsStore.getState().notifTime).toBe('07:30')
  })

  it('accepts evening times', () => {
    useSettingsStore.getState().setNotifTime('20:00')
    expect(useSettingsStore.getState().notifTime).toBe('20:00')
  })
})

describe('settingsStore — hydrate', () => {
  it('merges partial settings without touching other fields', () => {
    useSettingsStore.getState().hydrate({ unitPref: 'imperial' })
    expect(useSettingsStore.getState().unitPref).toBe('imperial')
    expect(useSettingsStore.getState().leaderboardOptIn).toBe(false) // unchanged
    expect(useSettingsStore.getState().notifTime).toBe('08:00')      // unchanged
  })

  it('can overwrite all fields at once', () => {
    useSettingsStore.getState().hydrate({
      unitPref: 'imperial',
      leaderboardOptIn: true,
      notifTime: '20:00',
    })
    const s = useSettingsStore.getState()
    expect(s.unitPref).toBe('imperial')
    expect(s.leaderboardOptIn).toBe(true)
    expect(s.notifTime).toBe('20:00')
  })
})
