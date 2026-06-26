# DiveLink — Technical Architecture

---

## Stack Overview

```
┌─────────────────────────────────────────┐
│             Mobile Client               │
│  React Native + Expo (iOS & Android)    │
│  TypeScript · Expo Router · NativeWind  │
│  Zustand · React Hook Form · Zod        │
│  React Native Reanimated · Victory      │
├─────────────────────────────────────────┤
│         Local Persistence               │
│  MMKV (fast KV) · Expo SecureStore     │
├─────────────────────────────────────────┤
│         Notifications                   │
│  Expo Notifications (local + push)      │
├─────────────────────────────────────────┤
│             Backend (Supabase)          │
│  PostgreSQL 15 · PostgREST             │
│  Auth (JWT) · Realtime (WS)            │
│  Storage (S3-compatible)               │
│  Edge Functions (Deno)                 │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
divelink-mobile-app/
│
├── app/                            # Expo Router file-based pages
│   ├── _layout.tsx                 # Root layout: session guard + navigation
│   ├── (auth)/                     # Unauthenticated screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx               # Welcome / splash
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── onboarding/
│   │       ├── role.tsx
│   │       ├── cert-level.tsx
│   │       ├── notifications.tsx
│   │       └── carousel.tsx
│   │
│   ├── (app)/                      # Authenticated screens
│   │   ├── _layout.tsx             # Tab navigator
│   │   └── (tabs)/
│   │       ├── home/
│   │       │   └── index.tsx
│   │       ├── learn/
│   │       │   ├── index.tsx
│   │       │   ├── quiz/
│   │       │   │   ├── session.tsx
│   │       │   │   └── results.tsx
│   │       │   ├── flashcards/
│   │       │   │   └── session.tsx
│   │       │   ├── knowledge/
│   │       │   │   ├── index.tsx
│   │       │   │   ├── [category].tsx
│   │       │   │   └── card/[id].tsx
│   │       │   └── briefings.tsx
│   │       ├── log/
│   │       │   ├── index.tsx
│   │       │   ├── new/
│   │       │   │   ├── checklist.tsx
│   │       │   │   └── form.tsx
│   │       │   └── [id]/
│   │       │       ├── index.tsx
│   │       │       └── edit.tsx
│   │       ├── profile/
│   │       │   ├── index.tsx
│   │       │   ├── edit.tsx
│   │       │   ├── badges.tsx
│   │       │   ├── stats.tsx
│   │       │   ├── leaderboard.tsx
│   │       │   └── settings.tsx
│   │       └── instructor/
│   │           ├── index.tsx
│   │           ├── groups/
│   │           │   ├── new.tsx
│   │           │   └── [id]/
│   │           │       ├── index.tsx
│   │           │       ├── assign.tsx
│   │           │       └── notify.tsx
│   │           └── students/
│   │               └── [id]/
│   │                   ├── index.tsx
│   │                   ├── assign.tsx
│   │                   ├── notify.tsx
│   │                   └── signoff.tsx
│   │
│   └── modal/
│       ├── achievement-unlock.tsx
│       ├── level-up.tsx
│       └── photo-viewer.tsx
│
├── components/
│   ├── gamification/
│   │   ├── XpBar.tsx               # Animated XP progress bar
│   │   ├── XpPop.tsx               # Floating "+50 XP" pop animation
│   │   ├── StreakBadge.tsx         # Flame icon + count
│   │   ├── LevelChip.tsx           # Level name pill
│   │   └── AchievementCard.tsx     # Badge unlock modal content
│   ├── quiz/
│   │   ├── QuestionCard.tsx        # Multi-choice question display
│   │   ├── FlashCard.tsx           # Flip card with Reanimated
│   │   ├── AnswerTile.tsx          # Option button (correct/wrong states)
│   │   ├── QuizProgress.tsx        # Question N of M bar
│   │   └── ResultRow.tsx           # Per-question result in summary
│   ├── knowledge/
│   │   ├── KnowledgeCard.tsx       # Card row for list views
│   │   ├── CategoryGrid.tsx        # Category browser grid
│   │   ├── MasteryRing.tsx         # Circular mastery % indicator
│   │   └── TypeBadge.tsx           # DO / DON'T pill
│   ├── dive-log/
│   │   ├── DiveCard.tsx            # Dive list row
│   │   ├── DiveForm.tsx            # Full log entry form
│   │   ├── PhotoPicker.tsx         # Multi-photo picker + upload
│   │   ├── SiteAutocomplete.tsx    # Dive site search input
│   │   └── DiveStats.tsx           # Single dive stat chips
│   ├── checklist/
│   │   ├── ChecklistSection.tsx    # BWRAF section with sub-items
│   │   └── ChecklistProgress.tsx   # Step indicator
│   ├── instructor/
│   │   ├── StudentRow.tsx
│   │   ├── AssignmentCard.tsx
│   │   └── GroupCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── BottomSheet.tsx
│       ├── Skeleton.tsx            # Loading placeholder
│       ├── EmptyState.tsx
│       ├── OfflineBanner.tsx
│       └── Avatar.tsx
│
├── stores/
│   ├── authStore.ts                # session, user profile, role
│   ├── quizStore.ts                # active session, answers, SM-2 queue
│   ├── logStore.ts                 # dive log list, pending offline entries
│   ├── gamificationStore.ts        # XP, level, streak, pending achievements
│   └── settingsStore.ts            # units, notif time, leaderboard opt-in
│
├── hooks/
│   ├── useAuth.ts                  # session guard helper
│   ├── useOnlineStatus.ts          # NetInfo connectivity
│   ├── useAchievementChecker.ts    # run checks after key events
│   ├── useNotifications.ts         # schedule/cancel local notifications
│   └── useSupabaseQuery.ts         # typed query wrapper with error handling
│
├── lib/
│   ├── supabase.ts                 # Supabase client init
│   ├── sm2.ts                      # SM-2 spaced repetition algorithm
│   ├── xp.ts                       # XP award + level calculation helpers
│   ├── notifications.ts            # Expo Notifications wrappers
│   ├── units.ts                    # Metric ↔ Imperial conversion helpers
│   └── validators.ts               # Zod schemas for all forms
│
├── data/
│   ├── knowledge-cards.ts          # Seeded card definitions (TS source of truth)
│   ├── quiz-questions.ts           # Seeded question bank
│   ├── achievements.ts             # Achievement definitions + trigger configs
│   ├── bwraf.ts                    # Checklist section + sub-item definitions
│   └── cert-levels.ts              # Cert level metadata (label, order, icon)
│
├── types/
│   ├── database.ts                 # Auto-generated from Supabase CLI
│   ├── app.ts                      # App-level types (not DB-tied)
│   └── navigation.ts               # Route param types
│
├── supabase/
│   ├── migrations/                 # SQL migration files
│   ├── seed.ts                     # Data seeding script
│   └── functions/                  # Edge Functions (Deno)
│       ├── send-instructor-push/
│       └── daily-briefing-cron/
│
├── assets/
│   ├── icons/                      # SVG badge icons
│   ├── images/
│   └── fonts/
│
├── app.json                        # Expo config
├── eas.json                        # EAS Build / Submit config
├── tailwind.config.js              # NativeWind config
└── tsconfig.json
```

---

## State Management

Using **Zustand** with a clear separation of concerns. No single mega-store.

### `authStore`
```ts
type AuthStore = {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}
```

### `gamificationStore`
```ts
type GamificationStore = {
  pendingXp: number
  pendingAchievements: Achievement[]
  awardXp: (amount: number, source: XpSource) => void
  checkAchievements: (trigger: AchievementTriggerType) => void
  dismissAchievement: (id: string) => void
}
```

### `quizStore`
```ts
type QuizStore = {
  activeSession: QuizSession | null
  answers: QuizAnswer[]
  startSession: (questions: QuizQuestion[]) => void
  submitAnswer: (questionId: string, selectedIndex: number) => void
  endSession: () => Promise<QuizResults>
}
```

---

## Data Flow

### Auth flow
```
App start
  → Supabase.auth.getSession()
  → If session: fetch profile → authStore → navigate to (app)
  → If no session: navigate to (auth)
```

### Daily quiz flow
```
User taps "Start Daily Quiz"
  → call RPC due_quiz_questions(userId, 5)
  → quizStore.startSession(questions)
  → Navigate to quiz/session
  → On each answer: quizStore.submitAnswer()
  → On session end:
      → Insert quiz_session row
      → Insert quiz_answers rows
      → Update user_card_progress (SM-2)
      → gamificationStore.awardXp(50 + bonus, 'quiz')
      → gamificationStore.checkAchievements('quiz')
      → Update streak in profiles
  → Navigate to quiz/results
```

### Dive log save flow
```
User completes checklist
  → checklistStore marks complete + awards XP
  → Navigate to log/new/form
User submits form
  → Validate with Zod
  → If offline: save to MMKV pending queue
  → If online:
      → Upload photos to Supabase Storage
      → Insert dive_log row
      → Increment profiles.total_dives
      → gamificationStore.awardXp(75, 'dive_log')
      → gamificationStore.checkAchievements('dive_count')
  → Navigate to log/[id]
```

### Achievement check flow
```
gamificationStore.checkAchievements(triggerType)
  → Filter achievements by trigger_type
  → For each: evaluate trigger against current profile + event data
  → If conditions met and not already in user_achievements:
      → Insert user_achievements row
      → Award badge XP
      → Add to pendingAchievements queue
  → UI polls pendingAchievements → shows modal one at a time
```

---

## Offline Strategy

Uses a **local-first with sync** approach:

1. **Quiz questions and knowledge cards** are cached to MMKV on first load. Refreshed on each app foreground event when online.
2. **Dive logs** written locally first. Pending entries tracked in `logStore.pendingEntries`. Sync triggered on `NetInfo` `isConnected` change.
3. **Quiz sessions** completed offline queue their DB writes locally. On reconnect, sessions are flushed before profile XP is updated.
4. **Streak** — offline day still counts if a quiz session was completed locally. Synced to Supabase when back online.
5. **Conflict resolution** — last-write-wins for dive logs. Quiz sessions are always additive (no conflict possible).

```ts
// useOnlineStatus.ts
import NetInfo from '@react-native-community/netinfo'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    return NetInfo.addEventListener(state => {
      const online = !!state.isConnected && !!state.isInternetReachable
      setIsOnline(online)
      if (online) syncPendingEntries()
    })
  }, [])
  return isOnline
}
```

---

## Spaced Repetition (SM-2)

Implemented in `lib/sm2.ts`. Pure function — no side effects.

```ts
type SM2Input = {
  easeFactor: number    // default 2.5
  intervalDays: number  // default 0
  timesCorrect: number
  quality: 0 | 1 | 2   // 0=Forgot, 1=Hard, 2=Got it
}

type SM2Output = {
  easeFactor: number
  intervalDays: number
  nextReview: Date
}

export function sm2(input: SM2Input): SM2Output {
  // Standard SM-2 implementation
  // quality < 1 → reset interval to 1 day
  // quality >= 1 → apply ease factor
}
```

---

## Notification Architecture

Using **Expo Notifications** for both local scheduled notifications and remote push.

### Local notifications (scheduled on-device)
| Notification | When scheduled | Trigger |
|---|---|---|
| Daily briefing | On app open / settings change | Daily at user's `notif_time` |
| Streak danger | On app open, each day | Daily at 8 PM if no quiz done |
| Pre-dive reminder | User sets manually | One-shot at chosen time |
| Level up | On level-up event | Immediate |

### Push notifications (via Supabase Edge Function)
| Notification | Sender | Edge function |
|---|---|---|
| Instructor assignment | Instructor app action | `send-instructor-push` |
| Instructor message | Instructor compose screen | `send-instructor-push` |

Push token stored in `profiles.expo_push_token`. Updated on each app open via `Notifications.getExpoPushTokenAsync()`.

### `send-instructor-push` Edge Function
```ts
// supabase/functions/send-instructor-push/index.ts
// Validates rate limit (1 push/student/day)
// Calls Expo Push API
// Inserts row into instructor_notifications
```

---

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Sensitive keys (service role key) used only in Edge Functions and the seeding script — never in the mobile client.

---

## Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Business logic (SM-2, XP, units) | Jest | 90%+ |
| Store actions | Jest + msw | key flows |
| UI components | React Native Testing Library | happy paths |
| E2E critical paths | Detox | Auth, quiz, dive log |

Critical paths for E2E:
1. Sign up → onboarding → complete first quiz → see XP on Home
2. Start dive (checklist) → log dive → see in dive list
3. Instructor: add student → assign module → student sees assignment

---

## Build & Release

- **Development:** `expo start` with Expo Go or dev build
- **Staging:** EAS Build (internal distribution)
- **Production:** EAS Build → EAS Submit → App Store + Play Store
- **OTA updates:** Expo Updates for JS-only changes (knowledge card content, quiz questions, achievement definitions)
- **CI:** GitHub Actions — lint, type-check, unit tests on each PR; EAS build on merge to `main`
