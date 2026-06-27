export type UnitPref = 'metric' | 'imperial'

// ── Depth ──────────────────────────────────────────────────────────────────

export function mToFt(m: number): number {
  return Math.round(m * 3.28084 * 10) / 10
}

export function ftToM(ft: number): number {
  return Math.round((ft / 3.28084) * 10) / 10
}

// ── Temperature ────────────────────────────────────────────────────────────

export function cToF(c: number): number {
  return Math.round((c * 9 / 5 + 32) * 10) / 10
}

export function fToC(f: number): number {
  return Math.round(((f - 32) * 5 / 9) * 10) / 10
}

// ── Pressure ───────────────────────────────────────────────────────────────

export function barToPsi(bar: number): number {
  return Math.round(bar * 14.5038)
}

export function psiToBar(psi: number): number {
  return Math.round((psi / 14.5038) * 100) / 100
}

// ── Formatted display ──────────────────────────────────────────────────────

export function formatDepth(m: number, pref: UnitPref): string {
  if (pref === 'imperial') return `${mToFt(m)} ft`
  return `${m} m`
}

export function formatTemp(c: number, pref: UnitPref): string {
  if (pref === 'imperial') return `${cToF(c)}°F`
  return `${c}°C`
}

export function formatPressure(bar: number, pref: UnitPref): string {
  if (pref === 'imperial') return `${barToPsi(bar)} psi`
  return `${bar} bar`
}

export function formatVisibility(m: number, pref: UnitPref): string {
  if (pref === 'imperial') return `${mToFt(m)} ft`
  return `${m} m`
}
