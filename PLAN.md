# DiveLink Mobile App — Product Plan

## Vision

A mobile companion for scuba divers and dive instructors that reinforces safe diving practices through gamified learning. Rather than being a passive reference tool, DiveLink actively builds habits — sending contextual reminders, quizzing users on dos and don'ts, and rewarding consistent safe behavior.

**Core belief:** The best dive safety tool is one people actually use every day, not just in an emergency.

---

## Target Users

### Divers
- Recreational and technical divers at all certification levels
- Wanting to log dives, track progress, and stay sharp on safety knowledge
- Motivated by streaks, badges, and visible skill growth

### Instructors
- Dive instructors managing student cohorts
- Needing to assign learning modules, track student quiz progress, and send targeted reminders
- Wanting a structured way to verify student knowledge before dives

---

## Core Feature Areas

### 1. Gamified Learning Engine
The heart of the app. Every interaction earns XP, builds streaks, or unlocks achievements.

- **Daily Dive Briefing** — A push notification each morning with one Do and one Don't (e.g., "Do: Check your SPG before every dive. Don't: Skip your safety stop even in shallow water.")
- **Flashcard Quizzes** — Spaced-repetition cards on dive theory, hand signals, emergency procedures, equipment checks
- **Knowledge Checks** — Short multi-choice quizzes tied to certification levels (Open Water, Advanced, Rescue, Divemaster)
- **Streak System** — Daily login + 1 quiz = streak maintained. Streaks give XP multipliers
- **XP & Levels** — Earn XP for quizzes, dive logs, completing modules. Level up from "Surface Diver" → "Rescue Diver" → "Divemaster" → "Instructor" etc.
- **Achievement Badges** — Unlocked by actions: 10 dives logged, 30-day streak, perfect quiz week, buddy dive recorded, night dive logged, etc.
- **Leaderboard** — Optional; among dive club/buddy group or globally

### 2. Pre-Dive Checklist & Reminders
- Interactive pre-dive checklist (BWRAF — Buoyancy, Weights, Releases, Air, Final OK)
- Checklist must be completed to "start" a dive log entry
- Optionally scheduled reminder before planned dive time

### 3. Dive Log
- Log each dive: site, depth, duration, buddy, tank pressure, water temp, visibility, notes
- Photo attachment per dive
- Dive site auto-suggest/search
- Statistics dashboard: total dives, total time underwater, deepest dive, most visited sites

### 4. Instructor Dashboard
- Create and manage student groups
- Assign specific learning modules or quiz sets to students
- View per-student quiz completion and scores
- Send targeted push reminders (e.g., "Review your emergency ascent procedure before Saturday's dive")
- Issue in-app endorsements/sign-offs for completed skill milestones

### 5. Dos & Don'ts Knowledge Base
- Curated, categorized library of diving rules, safety procedures, and best practices
- Categories: Pre-dive, Underwater, Ascent & Stops, Emergency, Equipment, Night Diving, Deep Diving, etc.
- Each rule is a "card" that can be favorited, quizzed on, and tracked for mastery
- Cards tied to certification level (beginner → advanced)

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **React Native + Expo** | Cross-platform (iOS + Android), large ecosystem, OTA updates |
| Language | **TypeScript** | Type safety, better refactoring |
| Navigation | **Expo Router** (file-based) | Clean URL-style routing, deep link friendly |
| State | **Zustand** | Lightweight, simple, scales well |
| Data / Sync | **Supabase** | Postgres backend, real-time subscriptions, auth, row-level security |
| Notifications | **Expo Notifications** | Scheduled + push notifications |
| UI Library | **NativeWind** (Tailwind for RN) | Consistent styling, fast iteration |
| Animations | **React Native Reanimated** | Smooth gamification animations (XP pop, badge unlock) |
| Forms | **React Hook Form + Zod** | Validated forms for dive logs and quizzes |
| Storage | **MMKV** | Fast local storage for offline quiz progress |
| Charts | **Victory Native** | Dive stats visualization |

---

## App Architecture

```
divelink-mobile-app/
├── app/                        # Expo Router pages
│   ├── (auth)/                 # Login, signup, onboarding
│   ├── (tabs)/                 # Main tab navigation
│   │   ├── home/               # Daily briefing, streak, XP
│   │   ├── learn/              # Quizzes, flashcards, knowledge base
│   │   ├── log/                # Dive log list and new entry
│   │   ├── profile/            # User profile, badges, level
│   │   └── instructor/         # Instructor-only dashboard (role-gated)
│   └── _layout.tsx
├── components/
│   ├── gamification/           # XP bar, streak counter, badge modal
│   ├── quiz/                   # Flashcard, multi-choice, result screen
│   ├── dive-log/               # Log form, dive card, stats
│   ├── checklist/              # Pre-dive BWRAF checklist
│   └── ui/                     # Buttons, cards, modals, typography
├── stores/                     # Zustand stores (user, quiz, log, gamification)
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── notifications.ts        # Notification scheduling
│   └── spaced-repetition.ts   # SM-2 algorithm for flashcards
├── data/
│   ├── dos-and-donts.ts        # Seeded knowledge base content
│   ├── quizzes.ts              # Quiz question bank
│   └── achievements.ts        # Achievement definitions
└── types/                      # Shared TypeScript types
```

---

## Data Models

### User
```ts
type User = {
  id: string
  email: string
  display_name: string
  role: 'diver' | 'instructor'
  certification_level: 'open_water' | 'advanced' | 'rescue' | 'divemaster' | 'instructor'
  xp: number
  level: number
  streak_days: number
  streak_last_active: string  // ISO date
  total_dives: number
  created_at: string
}
```

### Dive Log Entry
```ts
type DiveLog = {
  id: string
  user_id: string
  site_name: string
  date: string
  max_depth_m: number
  duration_min: number
  buddy_name?: string
  start_pressure_bar: number
  end_pressure_bar: number
  water_temp_c?: number
  visibility_m?: number
  notes?: string
  photo_urls: string[]
  checklist_completed: boolean
  created_at: string
}
```

### Knowledge Card (Dos & Don'ts)
```ts
type KnowledgeCard = {
  id: string
  type: 'do' | 'dont'
  category: string
  certification_level: CertLevel
  title: string
  body: string
  explanation: string
  tags: string[]
}
```

### Quiz Question
```ts
type QuizQuestion = {
  id: string
  card_id?: string         // linked knowledge card
  question: string
  options: string[]        // 4 options
  correct_index: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  certification_level: CertLevel
}
```

### User Quiz Progress
```ts
type QuizProgress = {
  user_id: string
  question_id: string
  times_seen: number
  times_correct: number
  last_seen: string
  next_review: string      // SM-2 spaced repetition next date
  ease_factor: number
}
```

### Achievement
```ts
type Achievement = {
  id: string
  title: string
  description: string
  icon: string
  xp_reward: number
  trigger: AchievementTrigger   // e.g. { type: 'dive_count', threshold: 10 }
}

type UserAchievement = {
  user_id: string
  achievement_id: string
  unlocked_at: string
}
```

### Instructor–Student Link
```ts
type StudentEnrollment = {
  id: string
  instructor_id: string
  student_id: string
  group_name?: string
  enrolled_at: string
}

type InstructorAssignment = {
  id: string
  instructor_id: string
  student_id?: string      // null = whole group
  group_name?: string
  module_id: string
  due_date?: string
  created_at: string
}
```

---

## Gamification Design

### XP Economy
| Action | XP |
|---|---|
| Complete daily quiz (3+ questions) | 50 XP |
| Perfect quiz (100% correct) | +25 XP bonus |
| Log a dive | 75 XP |
| Complete pre-dive checklist | 20 XP |
| Maintain streak (daily multiplier) | ×1.1 per 7 days, max ×2 |
| Unlock achievement | Badge-specific (25–200 XP) |
| Complete a learning module | 100 XP |

### Levels
```
0       → Snorkeler      (0–499 XP)
500     → Open Water     (500–1499 XP)
1500    → Advanced       (1500–3499 XP)
3500    → Rescue Diver   (3500–6999 XP)
7000    → Divemaster     (7000–13999 XP)
14000   → Instructor     (14000+ XP)
```

### Key Achievements
| Badge | Trigger |
|---|---|
| First Descent | Log your first dive |
| Buddy System | Log 5 dives with a buddy |
| Surface Interval | Maintain a 7-day streak |
| Deep Thinker | Log a dive deeper than 30m |
| Night Diver | Log a night dive |
| Perfect Week | 7-day streak with perfect daily quiz |
| Safety First | Complete 10 pre-dive checklists |
| Knowledge Hoarder | Master 50 knowledge cards |
| Instructor's Pet | Complete all assigned modules |
| 100 Dives | Log 100 total dives |

---

## Notification Strategy

### Daily Learning Reminder
- Time: User-configurable (default 8:00 AM local)
- Content: One "Do" and one "Don't" from the knowledge base, rotating by category
- CTA: "Tap to quiz yourself" → opens today's flashcard

### Streak Danger Alert
- Fires at 8 PM if user hasn't completed their daily quiz
- "Your X-day streak is at risk! Do a quick quiz now."

### Pre-Dive Reminder
- User can schedule before a planned dive
- Triggers pre-dive checklist flow

### Instructor Nudge
- Instructors can send a custom push to their student group from the dashboard
- Rate-limited to 1 per student per day to avoid spam

---

## Phased Rollout

### Phase 1 — Foundation (Weeks 1–4)
- [ ] Project setup: Expo + TypeScript + NativeWind + Supabase
- [ ] Auth flow: sign up, log in, role selection (diver / instructor)
- [ ] User profile with cert level
- [ ] Dive log: create, view, list
- [ ] Basic daily notification with a Do/Don't card

### Phase 2 — Learning Core (Weeks 5–8)
- [ ] Knowledge base: dos & don'ts content seeded and browsable by category
- [ ] Flashcard quiz with spaced repetition (SM-2)
- [ ] Multi-choice quiz questions linked to knowledge cards
- [ ] XP system and level progression
- [ ] Streak tracking with danger alerts

### Phase 3 — Gamification Layer (Weeks 9–12)
- [ ] Achievement system with unlock animations
- [ ] Badge gallery on profile
- [ ] Pre-dive checklist tied to dive log entry
- [ ] Statistics dashboard (total dives, time, depth, streak)
- [ ] Leaderboard (opt-in, buddy group scope)

### Phase 4 — Instructor Tools (Weeks 13–16)
- [ ] Instructor dashboard: manage student groups
- [ ] Assign modules/quizzes to students
- [ ] Track student quiz completion and scores
- [ ] Send targeted push notifications to students
- [ ] In-app skill sign-offs / endorsements

### Phase 5 — Polish & Launch (Weeks 17–20)
- [ ] Onboarding flow for new users
- [ ] Offline mode (local quiz cache with MMKV)
- [ ] Dive site search / auto-suggest
- [ ] Dive photo uploads to Supabase Storage
- [ ] App Store + Play Store submission
- [ ] Beta testing with a local dive club

---

## Open Questions

1. **Content licensing** — Will the dos/don'ts content be original, licensed from a certifying body (PADI, SSI, NAUI), or community-contributed?
2. **Offline-first depth** — Should the full quiz bank work offline, or is connectivity assumed?
3. **Buddy system** — Should buddies be able to link dive logs to each other in the app?
4. **Instructor verification** — How do we verify that a user claiming "instructor" role is actually certified?
5. **Dive club / org model** — Is there a club/organization layer above instructor, or just instructor–student pairs?
6. **Monetization** — Freemium (free for divers, paid for instructor tools)? Or subscription for advanced features?
