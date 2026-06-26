# DiveLink — Knowledge Base Content Plan

This document defines the taxonomy, sample content, and seeding strategy for the Dos & Don'ts knowledge base and quiz question bank.

---

## Category Taxonomy

Each card belongs to exactly one category. Categories are ordered by when they're most relevant during a dive day.

| Category Slug | Display Name | Primary Cert Levels |
|---|---|---|
| `pre-dive` | Pre-Dive Planning | All |
| `equipment-check` | Equipment Check | All |
| `buddy-system` | Buddy System | All |
| `descent` | Descent & Equalization | All |
| `underwater` | Underwater Behavior | All |
| `buoyancy` | Buoyancy Control | All |
| `ascent` | Ascent & Safety Stops | All |
| `emergency` | Emergency Procedures | All |
| `navigation` | Underwater Navigation | Advanced+ |
| `night-diving` | Night Diving | Advanced+ |
| `deep-diving` | Deep Diving | Advanced+ |
| `wreck-diving` | Wreck Diving | Advanced+ |
| `nitrox` | Nitrox & Gas Management | Advanced+ |
| `rescue` | Rescue & First Aid | Rescue+ |
| `divemaster` | Dive Leadership | Divemaster+ |

---

## Card Structure (TypeScript)

```ts
type KnowledgeCard = {
  id: string                // slug, e.g. 'pre-dive-001'
  type: 'do' | 'dont'
  category: string          // category slug
  min_cert_level: CertLevel
  title: string             // ≤ 60 chars — shown in lists and notifications
  body: string              // 1–2 sentences — the rule
  explanation: string       // 2–4 sentences — the WHY
  tags: string[]
}
```

---

## Sample Cards — Pre-Dive Planning

### PRE-001 — DO
- **Title:** Plan your dive, dive your plan
- **Body:** Before entering the water, agree with your buddy on depth limits, bottom time, turn pressure, and a meeting point if you get separated.
- **Explanation:** Spontaneous changes underwater are a leading cause of dive accidents. A shared plan means both divers make the same decisions without needing to communicate in an environment where communication is difficult.
- **Tags:** planning, buddy, safety

### PRE-002 — DON'T
- **Title:** Don't dive beyond your training
- **Body:** Never attempt a dive type, depth, or environment you have not been trained for, regardless of peer pressure or perceived conditions.
- **Explanation:** Training builds the muscle memory and problem-solving skills to handle emergencies specific to that dive type. Entering unfamiliar territory without preparation dramatically increases the risk of panic and error.
- **Tags:** planning, limits, training

### PRE-003 — DO
- **Title:** Check weather and site conditions before you dive
- **Body:** Review current forecasts, tidal charts, and local dive reports before committing to a dive plan.
- **Explanation:** Conditions that look mild on the surface can create strong currents, reduced visibility, or surge at depth. Many dive sites have unique tidal windows where diving is safe and enjoyable.
- **Tags:** planning, conditions, currents

### PRE-004 — DON'T
- **Title:** Don't dive if you're unwell
- **Body:** Avoid diving with a cold, congestion, ear infection, or any condition affecting equalization.
- **Explanation:** An inability to equalize leads to middle ear or sinus barotrauma, which is painful and can cause permanent hearing damage. Your body also needs full capacity to respond to any emergency.
- **Tags:** health, equalization, fitness-to-dive

---

## Sample Cards — Equipment Check

### EQP-001 — DO
- **Title:** Complete the BWRAF buddy check before every dive
- **Body:** Check Buoyancy, Weights, Releases, Air, and Final OK with your buddy before entering the water — every single dive.
- **Explanation:** The BWRAF check takes under two minutes and catches the most common pre-dive equipment errors: missed weight, closed tank valve, tangled releases. It's not a formality — it's the last line of defence before you hit the water.
- **Tags:** equipment, BWRAF, buddy-check

### EQP-002 — DON'T
- **Title:** Don't skip checking your SPG before entry
- **Body:** Always verify your starting tank pressure on the surface before descending.
- **Explanation:** Tanks occasionally arrive from the fill station under-pressured. Discovering a half-empty cylinder at depth wastes a dive at best and creates an out-of-air emergency at worst.
- **Tags:** equipment, air, SPG, tank

### EQP-003 — DO
- **Title:** Rinse and inspect your regulator after every dive
- **Body:** Rinse with fresh water, purge gently, and visually inspect the mouthpiece and hoses after each dive day.
- **Explanation:** Salt, sand, and debris corrode regulator internals and degrade hose integrity over time. Regular rinsing significantly extends service life and prevents free-flows or failures.
- **Tags:** equipment, regulator, maintenance

### EQP-004 — DON'T
- **Title:** Don't press the purge button with the regulator out of water
- **Body:** Never trigger the purge button when the regulator first stage is not submerged.
- **Explanation:** Water can be forced into the second stage during dry-purging if the dust cap is off or missing. Regulator purging should only be done with the first stage underwater to allow safe pressure equalisation.
- **Tags:** equipment, regulator, maintenance

---

## Sample Cards — Ascent & Safety Stops

### ASC-001 — DO
- **Title:** Ascend no faster than 9 m/min (30 ft/min)
- **Body:** Control your ascent rate to stay at or below 9 metres per minute at all depths.
- **Explanation:** Ascending too quickly does not give dissolved nitrogen time to off-gas through your lungs. This can cause decompression sickness (DCS), ranging from joint pain to paralysis. Modern dive computers track ascent rate and will alarm if you're too fast.
- **Tags:** ascent, DCS, nitrogen, safety

### ASC-002 — DO
- **Title:** Always perform a 3-minute safety stop at 5 m (15 ft)
- **Body:** End every dive with a 3-minute stop at 5 metres, even if your dive computer does not require a mandatory decompression stop.
- **Explanation:** A safety stop provides additional nitrogen off-gassing margin as an insurance policy. At 5 m, you are still in a position to deal with minor issues, and it adds negligible time to your dive.
- **Tags:** ascent, safety-stop, DCS, nitrogen

### ASC-003 — DON'T
- **Title:** Don't hold your breath during ascent
- **Body:** Never hold your breath at any point during your ascent — breathe slowly and continuously.
- **Explanation:** As pressure decreases during ascent, air in your lungs expands. Holding your breath traps this expanding air and can cause a pulmonary over-inflation injury (arterial gas embolism), which is immediately life-threatening. This is the most important rule in diving.
- **Tags:** ascent, lung-expansion, AGE, golden-rule

### ASC-004 — DON'T
- **Title:** Don't make repetitive dives without a surface interval
- **Body:** Allow adequate surface interval between dives based on your dive computer or tables before descending again.
- **Explanation:** Residual nitrogen from a previous dive reduces your no-decompression limit on the next dive. Ignoring surface intervals dramatically increases the cumulative DCS risk across a dive day.
- **Tags:** ascent, repetitive-dives, surface-interval, nitrogen

---

## Sample Cards — Emergency Procedures

### EMG-001 — DO
- **Title:** Know your buddy's weight release before every dive
- **Body:** During the BWRAF check, physically locate and identify how to release your buddy's weight system, not just your own.
- **Explanation:** In an unconscious diver scenario, you may need to ditch your buddy's weights to achieve positive buoyancy and bring them to the surface. Discovering an unfamiliar buckle type at depth wastes critical seconds.
- **Tags:** emergency, weights, buddy, rescue

### EMG-002 — DO
- **Title:** Signal distress at the surface immediately
- **Body:** If you are in distress at the surface, inflate your BCD, wave one arm, and shout or use a whistle/SMB to signal for help.
- **Explanation:** Surface rescuers and boat crew cannot distinguish a diver in distress from one casually floating. An early, clear signal allows the boat to reach you before exhaustion sets in.
- **Tags:** emergency, surface, signal, rescue

### EMG-003 — DON'T
- **Title:** Don't bolt for the surface in a panic
- **Body:** If you feel panicked underwater, stop, breathe, think, then act — never make an uncontrolled emergency ascent.
- **Explanation:** Panic-driven ascents cause the two most serious dive injuries: arterial gas embolism from lung over-expansion and severe DCS from rapid nitrogen off-gassing. A controlled ascent, even from significant depth, is almost always survivable; a panicked bolt to the surface often is not.
- **Tags:** emergency, panic, ascent, golden-rule

---

## Sample Quiz Questions

### Q-001 (links to ASC-003)
- **Question:** What is the maximum recommended ascent rate for recreational divers?
- **Options:** [A] 18 m/min, [B] 9 m/min, [C] 30 m/min, [D] 5 m/min
- **Correct:** B
- **Explanation:** PADI, SSI, and NAUI all recommend a maximum of 9 m/min (30 ft/min) for recreational divers. At this rate, dissolved nitrogen has sufficient time to safely off-gas through the lungs.
- **Difficulty:** easy
- **Cert level:** open_water

### Q-002 (links to ASC-002)
- **Question:** At what depth should you perform a safety stop, and for how long?
- **Options:** [A] 10 m for 5 minutes, [B] 3 m for 2 minutes, [C] 5 m for 3 minutes, [D] 6 m for 5 minutes
- **Correct:** C
- **Explanation:** The standard safety stop is 3 minutes at 5 metres. This provides additional off-gassing time as an insurance policy against decompression sickness, even on no-decompression dives.
- **Difficulty:** easy
- **Cert level:** open_water

### Q-003 (links to EMG-001)
- **Question:** Why should you locate your buddy's weight release during the pre-dive check?
- **Options:** [A] To adjust your own buoyancy, [B] So you can release their weights if they lose consciousness, [C] To ensure they have the correct amount of weight, [D] In case you need to share weights mid-dive]
- **Correct:** B
- **Explanation:** In an emergency where your buddy loses consciousness, you may need to ditch their weights to bring them to positive buoyancy and get them to the surface. Finding an unfamiliar release under stress wastes critical time.
- **Difficulty:** medium
- **Cert level:** open_water

### Q-004
- **Question:** What does the "A" in BWRAF stand for?
- **Options:** [A] Anchor, [B] Ascent, [C] Air, [D] Anchor point]
- **Correct:** C
- **Explanation:** BWRAF = Buoyancy, Weights, Releases, Air, Final OK. The Air check covers verifying that the tank is open, the SPG reads full, and you can breathe from the regulator normally.
- **Difficulty:** easy
- **Cert level:** open_water

### Q-005
- **Question:** What happens to air in your lungs as you ascend?
- **Options:** [A] It stays the same volume, [B] It compresses, [C] It expands, [D] It dissolves into your blood]
- **Correct:** C
- **Explanation:** According to Boyle's Law, as pressure decreases during ascent, gas volume increases. Air in your lungs expands as you rise. This is why continuous breathing (and never breath-holding) during ascent is the most fundamental rule in diving.
- **Difficulty:** easy
- **Cert level:** open_water

---

## Content Seeding Strategy

### Minimum Viable Content (Phase 1)
- 50 knowledge cards across all core categories
- 80 quiz questions covering those cards
- 10 achievement definitions

### Full Content Target (Phase 3)
- 200+ knowledge cards across all categories including advanced
- 300+ quiz questions, all difficulties
- Content reviewed by at least one certified dive instructor

### Seeding Process
1. Cards authored in `data/knowledge-cards.ts` (TypeScript source)
2. `supabase/seed.ts` reads and upserts via service role client
3. `npm run seed` command in development; runs automatically in staging CI
4. Content updates deploy via Supabase migration (no app update required)

### Content Guidelines (for contributors)
- **Title:** Action-oriented, ≤ 60 chars, starts with a verb for DO ("Check your SPG"), "Don't" prefix for DONT ("Don't bolt for the surface")
- **Body:** 1–2 sentences, plain language, no jargon without explanation
- **Explanation:** Always answers "why", includes specific consequence, 2–4 sentences
- **Tags:** 3–5 tags from the approved tag list (see Appendix A)

---

## Appendix A — Approved Tag List

```
planning, buddy, safety, equipment, regulator, BCD, wetsuit, mask,
fins, weights, air, SPG, tank, BWRAF, descent, equalization, ears,
sinuses, buoyancy, trim, neutral-buoyancy, ascent, safety-stop,
DCS, decompression, nitrogen, surface-interval, emergency, rescue,
panic, golden-rule, AGE, lung-expansion, navigation, compass,
night-diving, torch, signals, deep-diving, narcosis, nitrox, oxygen,
MOD, partial-pressure, wreck, penetration, currents, conditions,
tides, visibility, health, fitness-to-dive, fitness
```
