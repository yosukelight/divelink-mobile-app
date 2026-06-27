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
│  (access token + refresh token)         │
├─────────────────────────────────────────┤
│         Notifications                   │
│  Expo Notifications (local + push)      │
├──────────────────┬──────────────────────┤
│  dive-link API   │  Supabase            │
│  (REST / JWT)    │  (PostgreSQL 15)     │
│                  │                      │
│  • Auth          │  • Dive logs         │
│  • User identity │  • Quiz progress     │
│  • Certifications│  • Gamification      │
│  • Instructor    │  • Knowledge content │
│    credentials   │  • Push tokens       │
│  • Public data   │  • App preferences   │
│    (events,      │                      │
│     cert verify) │                      │
└──────────────────┴──────────────────────┘
```

**Two-backend design:**
- **dive-link REST API** is the identity and credentialing source of truth. The mobile app authenticates against it, reads user profiles and certifications from it, and uses it for public features (event calendar, certificate verification, world records). The app never writes certification data to dive-link — that happens through the dive-link web app.
- **Supabase** holds everything intrinsic to this app: dive logs, gamification state, quiz progress, knowledge content. It does not duplicate any data that dive-link owns.

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
│   │   ├── login.tsx               # Calls dive-link /auth/login
│   │   └── onboarding/
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
│   │       │   ├── edit.tsx        # Edits app-specific fields only; identity edits go to dive-link
│   │       │   ├── badges.tsx
│   │       │   ├── stats.tsx
│   │       │   ├── leaderboard.tsx
│   │       │   └── settings.tsx
│   │       └── instructor/         # Gated: visible only if authStore.identity.is_instructor
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
│   │                   └── practice-signoff.tsx
│   │
│   └── modal/
│       ├── achievement-unlock.tsx
│       ├── level-up.tsx
│       └── photo-viewer.tsx
│
├── components/
│   ├── gamification/
│   │   ├── XpBar.tsx
│   │   ├── XpPop.tsx
│   │   ├── StreakBadge.tsx
│   │   ├── LevelChip.tsx
│   │   └── AchievementCard.tsx
│   ├── quiz/
│   │   ├── QuestionCard.tsx
│   │   ├── FlashCard.tsx
│   │   ├── AnswerTile.tsx
│   │   ├── QuizProgress.tsx
│   │   └── ResultRow.tsx
│   ├── knowledge/
│   │   ├── KnowledgeCard.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── MasteryRing.tsx
│   │   └── TypeBadge.tsx
│   ├── dive-log/
│   │   ├── DiveCard.tsx
│   │   ├── DiveForm.tsx
│   │   ├── PhotoPicker.tsx
│   │   ├── SiteAutocomplete.tsx
│   │   └── DiveStats.tsx
│   ├── checklist/
│   │   ├── ChecklistSection.tsx
│   │   └── ChecklistProgress.tsx
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
│       ├── Skeleton.tsx
│       ├── EmptyState.tsx
│       ├── OfflineBanner.tsx
│       └── Avatar.tsx
│
├── stores/
│   ├── authStore.ts                # dive-link session + user identity + certifications
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
│   └── useSupabaseQuery.ts         # typed Supabase query wrapper
│
├── lib/
│   ├── diveLinkApi.ts              # dive-link REST API client (auth, identity, certifications)
│   ├── supabase.ts                 # Supabase client (dive logs, quiz, gamification)
│   ├── sm2.ts                      # SM-2 spaced repetition algorithm
│   ├── xp.ts                       # XP award + level calculation helpers
│   ├── notifications.ts            # Expo Notifications wrappers
│   ├── units.ts                    # Metric ↔ Imperial conversion helpers
│   └── validators.ts               # Zod schemas for all forms
│
├── data/
│   ├── knowledge-cards.ts          # Seeded card definitions
│   ├── quiz-questions.ts           # Seeded question bank
│   ├── achievements.ts             # Achievement definitions + trigger configs
│   ├── bwraf.ts                    # Checklist section + sub-item definitions
│   └── cert-levels.ts              # Mapping from CMAS CertificationLevel to app cert tier (0–3)
│
├── types/
│   ├── database.ts                 # Auto-generated from Supabase CLI
│   ├── divelink.ts                 # Types for dive-link API responses
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
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── app.json
├── eas.json
├── tailwind.config.js
└── tsconfig.json
```

---

## State Management

Using **Zustand** with a clear separation of concerns. No single mega-store.

### `authStore`
```ts
type AuthStore = {
  // dive-link identity (fetched from dive-link API on sign-in)
  identity: DiverIdentity | null    // display_name, email, cmas_membership_number, roles, certifications
  accessToken: string | null        // dive-link JWT; stored in memory only
  isLoading: boolean

  // app-specific profile (fetched from Supabase)
  appProfile: AppProfile | null     // xp, level, streak, preferences

  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshToken: () => Promise<void>
  refreshAppProfile: () => Promise<void>
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
  → SecureStore.getItemAsync('divelink_refresh_token')
  → If token exists: POST /api/v1/auth/refresh (refresh token in body for native)
      → Store new access token in authStore (memory)
      → Store new refresh token in SecureStore
      → GET /api/v1/divers/me → populate authStore.identity
      → Fetch Supabase profile by id (= dive-link UUID) → populate authStore.appProfile
      → Navigate to (app)
  → If no token / refresh fails: navigate to (auth)
```

### Sign-in flow
```
User submits email + password
  → POST /api/v1/auth/login to dive-link
  → Store access token in authStore (memory)
  → Store refresh token in SecureStore
  → GET /api/v1/divers/me → authStore.identity
  → Upsert Supabase profile row (id = dive-link UUID) → authStore.appProfile
  → Navigate to (app) or onboarding if first sign-in
```

### Daily quiz flow
```
User taps "Start Daily Quiz"
  → Derive cert_tier from authStore.identity.highest_active_certification
  → Call RPC due_quiz_questions(userId, certTier, 5)
  → quizStore.startSession(questions)
  → Navigate to quiz/session
  → On each answer: quizStore.submitAnswer()
  → On session end:
      → Insert quiz_session row (Supabase)
      → Insert quiz_answers rows (Supabase)
      → Update user_card_progress (SM-2) (Supabase)
      → gamificationStore.awardXp(50 + bonus, 'quiz')
      → gamificationStore.checkAchievements('quiz')
      → Update streak in profiles (Supabase)
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
      → Insert dive_log row (Supabase)
      → Increment profiles.total_dives (Supabase)
      → gamificationStore.awardXp(75, 'dive_log')
      → gamificationStore.checkAchievements('dive_count')
  → Navigate to log/[id]
```

### Achievement check flow
```
gamificationStore.checkAchievements(triggerType)
  → Filter achievements by trigger_type
  → For each: evaluate trigger against current appProfile + event data
  → If conditions met and not already in user_achievements:
      → Insert user_achievements row (Supabase)
      → Award badge XP
      → Add to pendingAchievements queue
  → UI polls pendingAchievements → shows modal one at a time
```

---

## dive-link API Client

`lib/diveLinkApi.ts` encapsulates all communication with the dive-link backend.

```ts
// lib/diveLinkApi.ts
const BASE = process.env.EXPO_PUBLIC_DIVELINK_API_URL

export const diveLinkApi = {
  auth: {
    login: (email: string, password: string) =>
      fetch(`${BASE}/api/v1/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) }),

    refresh: (refreshToken: string) =>
      fetch(`${BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),  // native: token in body, not cookie
      }),

    logout: (refreshToken: string) =>
      fetch(`${BASE}/api/v1/auth/logout`, { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  },

  divers: {
    me: (accessToken: string) =>
      fetch(`${BASE}/api/v1/divers/me`, { headers: { Authorization: `Bearer ${accessToken}` } }),

    certifications: (diverId: string, accessToken: string) =>
      fetch(`${BASE}/api/v1/divers/${diverId}/certifications`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
  },

  public: {
    verifyCertificate: (token: string) =>
      fetch(`${BASE}/api/v1/public/verify/${token}`),

    events: (params?: URLSearchParams) =>
      fetch(`${BASE}/api/v1/public/events?${params ?? ''}`),
  },
}
```

---

## Offline Strategy

Uses a **local-first with sync** approach:

1. **Quiz questions and knowledge cards** are cached to MMKV on first load. Refreshed on each app foreground event when online.
2. **Dive logs** written locally first. Pending entries tracked in `logStore.pendingEntries`. Sync triggered on `NetInfo` `isConnected` change.
3. **Quiz sessions** completed offline queue their DB writes locally. On reconnect, sessions are flushed before profile XP is updated.
4. **Streak** — offline day still counts if a quiz session was completed locally. Synced to Supabase when back online.
5. **Conflict resolution** — last-write-wins for dive logs. Quiz sessions are always additive (no conflict possible).
6. **dive-link API calls** (identity, certifications) require connectivity. Cached identity and cert tier are used offline; no writes to dive-link are possible offline.

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

Push token stored in `profiles.expo_push_token` (Supabase). Updated on each app open.

---

## Environment Variables

```env
EXPO_PUBLIC_DIVELINK_API_URL=     # dive-link backend base URL
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Sensitive keys (service role key) used only in Edge Functions and the seeding script — never in the mobile client.

---

## Testing Strategy

| Layer | Tool | Coverage target |
|---|---|---|
| Business logic (SM-2, XP, units) | Jest | 90%+ |
| dive-link API client | Jest + msw | all endpoints used |
| Store actions | Jest + msw | key flows |
| UI components | React Native Testing Library | happy paths |
| E2E critical paths | Detox | Auth, quiz, dive log |

Critical paths for E2E:
1. Sign in via dive-link → see CMAS certifications on profile → complete first quiz → see XP on Home
2. Start dive (checklist) → log dive → see in dive list
3. Instructor: add student group → assign module → student sees assignment

---

## Build & Release

- **Development:** `expo start` with Expo Go or dev build
- **Staging:** EAS Build (internal distribution)
- **Production:** EAS Build → EAS Submit → App Store + Play Store
- **OTA updates:** Expo Updates for JS-only changes (knowledge card content, quiz questions, achievement definitions)
- **CI:** GitHub Actions — lint, type-check, unit tests on each PR; EAS build on merge to `main`
