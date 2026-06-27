export type ChecklistItem = {
  id: string
  label: string
}

export type ChecklistSection = {
  id: string
  letter: string
  title: string
  description: string
  items: ChecklistItem[]
}

export const BWRAF_CHECKLIST: ChecklistSection[] = [
  {
    id: 'buoyancy',
    letter: 'B',
    title: 'Buoyancy',
    description: 'Check BCD and weighting',
    items: [
      { id: 'bcd_inflate', label: 'BCD inflates & deflates correctly' },
      { id: 'bcd_weight', label: 'Weight is correct for the site' },
    ],
  },
  {
    id: 'weights',
    letter: 'W',
    title: 'Weights',
    description: 'Check weight system',
    items: [
      { id: 'weight_place', label: 'Weight belt / pockets in place' },
      { id: 'weight_release', label: 'Quick-release checked & accessible' },
    ],
  },
  {
    id: 'releases',
    letter: 'R',
    title: 'Releases',
    description: 'Check all buckles and releases',
    items: [
      { id: 'releases_all', label: 'All buckles accessible & functional' },
      { id: 'releases_buddy', label: 'Buddy can locate & release them' },
    ],
  },
  {
    id: 'air',
    letter: 'A',
    title: 'Air',
    description: 'Check air supply',
    items: [
      { id: 'air_on', label: 'Air turned on fully' },
      { id: 'air_pressure', label: 'Adequate pressure for the planned dive' },
      { id: 'air_reg', label: 'Regulator breathing correctly' },
      { id: 'air_buddy', label: "Buddy's air supply verified" },
    ],
  },
  {
    id: 'final_ok',
    letter: 'F',
    title: 'Final OK',
    description: 'Final confirmation before water entry',
    items: [
      { id: 'final_signals', label: 'Dive signals agreed with buddy' },
      { id: 'final_plan', label: 'Dive plan confirmed (depth, time, route)' },
      { id: 'final_emergency', label: 'Emergency procedures reviewed' },
    ],
  },
]

export const TOTAL_CHECKLIST_ITEMS = BWRAF_CHECKLIST.reduce(
  (sum, section) => sum + section.items.length,
  0,
)
