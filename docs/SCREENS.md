# DiveLink — Screen Inventory & Navigation

Framework: Expo Router (file-based routing). All authenticated screens sit inside a root layout that checks session state.

---

## Navigation Structure

```
Root Stack
├── (auth)/                      # Unauthenticated stack
│   ├── index                    # Welcome / splash
│   ├── login                    # Log in form
│   ├── signup                   # Sign up form
│   ├── forgot-password          # Password reset
│   └── onboarding/
│       ├── role                 # Diver vs Instructor picker
│       ├── cert-level           # Certification level picker
│       ├── notifications        # Permission request explainer
│       └── carousel             # Feature walkthrough (4 slides)
│
└── (app)/                       # Authenticated root
    ├── _layout                  # Tab bar: Home | Learn | Log | Profile | Instructor*
    │
    ├── (tabs)/
    │   ├── home/
    │   │   └── index            # Home screen
    │   │
    │   ├── learn/
    │   │   ├── index            # Learn hub (tabs: Quiz | Knowledge | Assigned*)
    │   │   ├── quiz/
    │   │   │   ├── session      # Active quiz screen
    │   │   │   └── results      # Quiz results + XP
    │   │   ├── flashcards/
    │   │   │   └── session      # Flashcard swipe session
    │   │   ├── knowledge/
    │   │   │   ├── index        # Knowledge base browser (category grid)
    │   │   │   ├── [category]   # Cards within a category
    │   │   │   └── card/[id]    # Card detail view
    │   │   └── briefings        # Past daily briefings list
    │   │
    │   ├── log/
    │   │   ├── index            # Dive log list
    │   │   ├── new/
    │   │   │   ├── checklist    # BWRAF pre-dive checklist
    │   │   │   └── form         # Dive log entry form
    │   │   └── [id]/
    │   │       ├── index        # Dive detail view
    │   │       └── edit         # Edit dive entry
    │   │
    │   ├── profile/
    │   │   ├── index            # Profile hub
    │   │   ├── edit             # Edit profile
    │   │   ├── badges           # Badge gallery
    │   │   ├── stats            # Statistics dashboard
    │   │   ├── leaderboard      # Leaderboard (opt-in)
    │   │   └── settings         # App settings
    │   │
    │   └── instructor/          # Role-gated: instructor only
    │       ├── index            # Instructor dashboard (group list)
    │       ├── groups/
    │       │   ├── new          # Create group
    │       │   └── [id]/
    │       │       ├── index    # Group detail (student list)
    │       │       ├── assign   # Assign module to group
    │       │       └── notify   # Send push to group
    │       └── students/
    │           └── [id]/
    │               ├── index    # Student detail (progress breakdown)
    │               ├── assign   # Assign module to student
    │               ├── notify   # Send push to student
    │               └── signoff  # Skill sign-off screen
    │
    └── modal/
        ├── achievement-unlock   # Full-screen badge unlock modal
        ├── level-up             # Level-up celebration modal
        └── photo-viewer         # Full-screen dive photo viewer
```

---

## Screen Specifications

### `(auth)/index` — Welcome / Splash
**Purpose:** Entry point for unauthenticated users.
**Elements:**
- DiveLink logo + tagline
- "Get Started" → `/signup`
- "I already have an account" → `/login`

---

### `(auth)/login` — Log In
**Purpose:** Authenticate returning user.
**Elements:**
- Email + password fields
- "Forgot password?" link → `/forgot-password`
- "Log In" primary button
- "Don't have an account? Sign up" → `/signup`
- Error inline below field on failure

---

### `(auth)/signup` — Sign Up
**Purpose:** Create a new account.
**Elements:**
- Display name, email, password, confirm password
- Terms & privacy acknowledgment checkbox
- "Create Account" → triggers account creation → `/onboarding/role`

---

### `(auth)/onboarding/role` — Role Picker
**Purpose:** Set user role for feature gating.
**Elements:**
- Two large cards: "I'm a Diver" / "I'm an Instructor"
- Brief description under each
- "Continue" → `/onboarding/cert-level`

---

### `(auth)/onboarding/cert-level` — Cert Level Picker
**Purpose:** Calibrate content and quiz difficulty.
**Elements:**
- Vertical list of cert levels with descriptions
- "Just exploring (no cert)" option at top
- "Continue" → `/onboarding/notifications`

---

### `(auth)/onboarding/notifications` — Notification Permission
**Purpose:** Explain and request notification permission in context.
**Elements:**
- Illustration of notification
- Two bullet points: daily briefing, streak alerts
- "Enable Notifications" → system permission dialog → `/onboarding/carousel`
- "Maybe later" skips to `/onboarding/carousel`

---

### `(auth)/onboarding/carousel` — Feature Walkthrough
**Purpose:** Showcase key app features.
**Slides:**
1. Daily briefing + notification illustration
2. Quizzes, XP, and streak
3. Dive log and checklist
4. Badges and achievements
**Elements:**
- Pagination dots, swipe or next button
- "Get Started" on slide 4 → `/(app)/(tabs)/home`

---

### `(tabs)/home` — Home Screen
**Purpose:** Daily engagement hub.
**Sections (top to bottom):**
1. **Header bar:** Display name, streak flame + count, XP level chip
2. **Today's Briefing card:** Do (green) / Don't (red) pair — tap either → card detail
3. **"Quiz Yourself" CTA button:** → quick quiz session on today's cards
4. **XP Progress bar:** Current level icon, XP fraction, next level name
5. **Recent Activity feed:** Last 3 quiz sessions + last dive log entry
6. **Active Assignments** (if any): Cards from instructor with due dates

---

### `(tabs)/learn/index` — Learn Hub
**Purpose:** Entry point for all learning activities.
**Top tabs:** Quiz | Flashcards | Knowledge Base | Favourites | Assigned (if student)
**Default (Quiz tab):**
- "Start Daily Quiz" primary CTA (5 questions)
- "Practice Weak Cards" secondary CTA (cards with mastery < 50%)
- Progress ring: overall mastery %
- Streak information

---

### `(tabs)/learn/quiz/session` — Active Quiz
**Purpose:** Multi-choice question screen.
**Elements:**
- Progress indicator (Question 2 of 5)
- Question text (large, readable)
- 4 option tiles — tap to select
- "Submit" button → reveals correct/incorrect with color coding
- Explanation text revealed after answer
- "Next" → next question

---

### `(tabs)/learn/quiz/results` — Quiz Results
**Purpose:** Post-quiz summary with XP reward.
**Elements:**
- Score display (e.g., "4 out of 5")
- XP earned animation (+50 XP ×1.2)
- Streak updated indicator (if applicable)
- Expandable list of all questions with answers
- "Practice Wrong Cards" button (if any wrong)
- "Done" → Home

---

### `(tabs)/learn/flashcards/session` — Flashcard Session
**Purpose:** Spaced repetition via self-rated recall.
**Elements:**
- Card front: question / statement
- Tap to flip → reveals answer + explanation
- Three rating buttons: "Forgot" (red) / "Hard" (yellow) / "Got it" (green)
- Progress: Card 3 of 10
- Exit button with confirmation

---

### `(tabs)/learn/knowledge/index` — Knowledge Base
**Purpose:** Browse and search all knowledge cards.
**Elements:**
- Search bar (top)
- Category chips (scrollable horizontal filter)
- Cert level filter toggle
- Grid of category cards showing card count and mastery %
- "Show all cards" flat list alternative

---

### `(tabs)/learn/knowledge/[category]` — Category Card List
**Purpose:** Cards within a specific category.
**Elements:**
- Category header + card count
- Filter: All / Do / Don't / Mastered / Unmastered
- Card rows: type badge (Do/Don't), title, mastery %, favourite icon
- Tap card → card detail

---

### `(tabs)/learn/knowledge/card/[id]` — Card Detail
**Purpose:** Full knowledge card content.
**Elements:**
- Type badge (DO / DON'T) with color
- Category chip
- Title (large)
- Body text
- "Why?" section with full explanation
- Mastery % ring (bottom)
- Favourite toggle (top-right)
- "Quiz Me on This" button → single-card quiz session

---

### `(tabs)/log/index` — Dive Log List
**Purpose:** Chronological list of all logged dives.
**Elements:**
- "New Dive" FAB (floating action button) → checklist flow
- Search / filter bar (date range, site, buddy)
- Dive cards: site name, date, depth, duration, buddy
- Total dive count in header
- Pull-to-refresh

---

### `(tabs)/log/new/checklist` — BWRAF Checklist
**Purpose:** Enforce pre-dive safety check before logging.
**Elements:**
- 5 sections (Buoyancy, Weights, Releases, Air, Final OK)
- Each section: title + 2–3 checkbox sub-items + brief tooltip
- Progress indicator (3/5 sections complete)
- "Set dive reminder" link (date+time picker)
- "Complete & Start Dive Log" CTA (enabled only when all checked)
- XP preview: "+20 XP for completing your buddy check"

---

### `(tabs)/log/new/form` — New Dive Log Form
**Purpose:** Capture dive details.
**Sections:**
1. **Location:** Site name (autocomplete), dive date
2. **Depth & Time:** Max depth (m/ft), duration (min)
3. **Buddy:** Name (optional)
4. **Equipment:** Start/end pressure (bar/PSI), tank size (optional)
5. **Conditions:** Water temp, visibility, night dive toggle
6. **Notes & Photos:** Free-text notes, photo picker (up to 5)
**Actions:** "Save Dive" (primary), "Save Draft" (secondary)

---

### `(tabs)/log/[id]/index` — Dive Detail
**Purpose:** Full view of a single dive entry.
**Elements:**
- Photo gallery (swipeable if multiple)
- All fields in a clean info list
- Map pin if site has coordinates (future)
- "Edit" and "Delete" actions (top-right menu)
- "Share Dive" button → generates a summary image card

---

### `(tabs)/profile/index` — Profile Hub
**Purpose:** Personal progress overview.
**Elements:**
- Avatar + display name + cert level chip
- Level badge (e.g., "Advanced Diver") + XP progress bar
- Streak count + "days" label
- Total dives stat chip
- Quick links: Badges, Stats, Dive Log
- Settings icon → `/profile/settings`

---

### `(tabs)/profile/badges` — Badge Gallery
**Purpose:** All achievements, earned and locked.
**Elements:**
- Section headers: "Earned" / "In Progress" / "Locked"
- 3-column grid of badge icons
- Earned: full color; In Progress: color + progress bar; Locked: grayscale
- Tap any badge → bottom sheet with name, description, XP, unlock condition, progress

---

### `(tabs)/profile/stats` — Statistics Dashboard
**Purpose:** Visual dive and learning history.
**Sections:**
1. Aggregate stats strip: total dives, total time, deepest, top site
2. Dive frequency bar chart (12 months)
3. Depth distribution histogram
4. Streak/activity heatmap calendar
5. XP growth line chart
6. Knowledge mastery by category (horizontal bar chart)

---

### `(tabs)/profile/settings` — Settings
**Elements:**
- **Notifications:** Daily reminder time picker, streak alert toggle
- **Units:** Metric / Imperial toggle
- **Leaderboard:** Opt-in toggle
- **Account:** Change password, delete account (with confirmation flow)
- **Log Out** (red, at bottom)
- App version number

---

### `(tabs)/instructor/index` — Instructor Dashboard
**Purpose:** Overview of all student groups.
**Elements:**
- "New Group" CTA
- Group cards: name, student count, avg mastery %, last activity
- Tap group → group detail

---

### `(tabs)/instructor/groups/[id]/index` — Group Detail
**Purpose:** Manage a student group.
**Tabs:** Students | Assignments | Notifications
**Students tab:**
- Invite student button (by email)
- Student rows: name, last active, mastery %, sessions this week
- Tap student → student detail

---

### `(tabs)/instructor/students/[id]/index` — Student Detail
**Purpose:** Per-student progress breakdown.
**Elements:**
- Student name + cert level
- Overall mastery % ring
- Mastery by category (list with % bars)
- Recent quiz sessions (last 5)
- Assigned modules + completion status
- "Assign Module" and "Send Reminder" action buttons
- "Sign Off Skill" button → signoff screen

---

### `modal/achievement-unlock` — Achievement Unlock Modal
**Purpose:** Celebrate a badge unlock.
**Elements:**
- Dimmed background overlay
- Badge icon (animated scale-in + glow)
- Badge title
- "You earned X XP!" line
- Description
- "Awesome!" dismiss button
- Haptic: medium impact on appear

---

### `modal/level-up` — Level Up Modal
**Purpose:** Celebrate reaching a new level.
**Elements:**
- Confetti animation (Reanimated)
- New level icon + name
- "You're now an Advanced Diver!" headline
- XP total
- "Keep Diving" dismiss button

---

## Tab Bar Icons

| Tab | Icon | Visibility |
|---|---|---|
| Home | house | Always |
| Learn | book-open | Always |
| Log | anchor | Always |
| Profile | user-circle | Always |
| Instructor | chalkboard-teacher | Instructor role only |

---

## Deep Link Map

| URL | Screen |
|---|---|
| `divelink://quiz` | Learn > Quiz session |
| `divelink://checklist` | Log > BWRAF Checklist |
| `divelink://home` | Home |
| `divelink://briefing` | Today's Briefing (Home scrolled) |
| `divelink://card/:id` | Knowledge Card Detail |
| `divelink://module/:category` | Category Card List |
| `divelink://log/new` | New Dive > Checklist |
