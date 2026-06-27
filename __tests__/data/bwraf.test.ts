import { BWRAF_CHECKLIST, TOTAL_CHECKLIST_ITEMS } from '../../data/bwraf'

describe('BWRAF_CHECKLIST structure', () => {
  it('has exactly 5 sections', () => {
    expect(BWRAF_CHECKLIST).toHaveLength(5)
  })

  it('sections appear in B-W-R-A-F order', () => {
    expect(BWRAF_CHECKLIST.map((s) => s.letter)).toEqual(['B', 'W', 'R', 'A', 'F'])
  })

  it('section IDs are unique', () => {
    const ids = BWRAF_CHECKLIST.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every section has a non-empty title and description', () => {
    for (const s of BWRAF_CHECKLIST) {
      expect(s.title.length).toBeGreaterThan(0)
      expect(s.description.length).toBeGreaterThan(0)
    }
  })

  it('every section has at least one item', () => {
    for (const s of BWRAF_CHECKLIST) {
      expect(s.items.length).toBeGreaterThan(0)
    }
  })

  it('all item IDs are unique across the whole checklist', () => {
    const itemIds = BWRAF_CHECKLIST.flatMap((s) => s.items.map((i) => i.id))
    expect(new Set(itemIds).size).toBe(itemIds.length)
  })

  it('every item has a non-empty label', () => {
    for (const section of BWRAF_CHECKLIST) {
      for (const item of section.items) {
        expect(item.label.length).toBeGreaterThan(0)
      }
    }
  })
})

describe('TOTAL_CHECKLIST_ITEMS', () => {
  it('equals the sum of all section item counts', () => {
    const total = BWRAF_CHECKLIST.reduce((sum, s) => sum + s.items.length, 0)
    expect(TOTAL_CHECKLIST_ITEMS).toBe(total)
  })

  it('is greater than 0', () => {
    expect(TOTAL_CHECKLIST_ITEMS).toBeGreaterThan(0)
  })
})
