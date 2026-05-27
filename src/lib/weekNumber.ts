// ISO-vecka (1–53) enligt ISO 8601. Veckan börjar på måndag och vecka 1 är
// veckan som innehåller årets första torsdag.
export function getISOWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

// ISO-week-year (kan skilja sig från kalenderåret kring årsskiftet).
// Exempel: 31 dec 2024 tillhör ISO-vecka 1 av 2025 → returnerar 2025.
// Måste användas tillsammans med getISOWeekNumber() när vi slår upp
// lunchWeek-dokument i Sanity (där weekNumber + year är paret).
export function getISOWeekYear(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  // Sätt till samma veckas torsdag — vecka tillhör det år den torsdagen ligger i.
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  return d.getUTCFullYear()
}
