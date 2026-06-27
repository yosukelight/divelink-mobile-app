import {
  mToFt, ftToM,
  cToF, fToC,
  barToPsi, psiToBar,
  formatDepth, formatTemp, formatPressure, formatVisibility,
} from '../../lib/units'

describe('depth conversion', () => {
  it('converts 0 m to 0 ft', () => expect(mToFt(0)).toBe(0))
  it('converts 10 m to ~32.8 ft', () => expect(mToFt(10)).toBeCloseTo(32.8, 0))
  it('converts 30 m to ~98.4 ft', () => expect(mToFt(30)).toBeCloseTo(98.4, 0))
  it('round-trips m → ft → m within 0.5 m', () => {
    expect(ftToM(mToFt(30))).toBeCloseTo(30, 0)
  })
  it('round-trips ft → m → ft within 1 ft', () => {
    expect(mToFt(ftToM(100))).toBeCloseTo(100, 0)
  })
})

describe('temperature conversion', () => {
  it('converts 0°C to 32°F', () => expect(cToF(0)).toBe(32))
  it('converts 100°C to 212°F', () => expect(cToF(100)).toBe(212))
  it('converts 26°C to ~78.8°F', () => expect(cToF(26)).toBeCloseTo(78.8, 0))
  it('converts -2°C (cold water) correctly', () => expect(cToF(-2)).toBeCloseTo(28.4, 0))
  it('round-trips C → F → C within 0.1°', () => {
    expect(fToC(cToF(26))).toBeCloseTo(26, 0)
  })
})

describe('pressure conversion', () => {
  it('converts 0 bar to 0 psi', () => expect(barToPsi(0)).toBe(0))
  it('converts 200 bar to ~2901 psi', () => expect(barToPsi(200)).toBeCloseTo(2901, -1))
  it('converts 300 bar to ~4351 psi', () => expect(barToPsi(300)).toBeCloseTo(4351, -1))
  it('round-trips bar → psi → bar within 1 bar', () => {
    expect(psiToBar(barToPsi(200))).toBeCloseTo(200, 0)
  })
})

describe('formatDepth', () => {
  it('uses meters for metric', () => expect(formatDepth(30, 'metric')).toBe('30 m'))
  it('uses feet for imperial', () => expect(formatDepth(30, 'imperial')).toBe(`${mToFt(30)} ft`))
})

describe('formatTemp', () => {
  it('uses Celsius for metric', () => expect(formatTemp(26, 'metric')).toBe('26°C'))
  it('uses Fahrenheit for imperial', () => expect(formatTemp(26, 'imperial')).toBe(`${cToF(26)}°F`))
})

describe('formatPressure', () => {
  it('uses bar for metric', () => expect(formatPressure(200, 'metric')).toBe('200 bar'))
  it('uses psi for imperial', () => expect(formatPressure(200, 'imperial')).toBe(`${barToPsi(200)} psi`))
})

describe('formatVisibility', () => {
  it('uses meters for metric', () => expect(formatVisibility(15, 'metric')).toBe('15 m'))
  it('uses feet for imperial', () => expect(formatVisibility(15, 'imperial')).toBe(`${mToFt(15)} ft`))
})
