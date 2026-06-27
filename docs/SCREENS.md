# DiveLink — Screen Inventory & Navigation

Framework: Expo Router (file-based routing). All authenticated screens sit inside a root layout that checks session state.

> **Auth note:** There is no sign-up screen in this app. Accounts are created on the dive-link web platform. The auth stack covers sign-in only. Role and certification level are read from the dive-link API — there are no local pickers for these values.

---

## Navigation Structure

```
Root Stack
├── (auth)/                      # Unauthenticated stack
│   ├── index                    # Welcome / splash
│   ├── login                    # Sign in via dive-link API
│   └── onboarding/              # First-sign-in only
│       ├── certifications        # Read-only display of CMAS certs from dive-link
│       ├── notifications         # Permission request explainer
│       └── carousel              # Feature walkthrough (4 slides)
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
    │   │   ├── index            # Profile hub (certifications from dive-link + in-app stats)
    │   │   ├── edit             # Edit app-only fields: avatar, home club
    │   │   ├── badges           # Badge gallery
    │   │   ├── stats            # Statistics dashboard
    │   │   ├── leaderboard      # Leaderboard (opt-in)
    │   │   └── settings         # App settings
    │   │
    │   └── instructor/          # Gated: visible only if authStore.identity.is_instructor === true
    │       ├── index            # Instructor dashboard (group list)
    │       ├── groups/
    │       │   ├── new          # Create group
    │       │   └── [id]/
    │       │       ├── index    # Group detail (student list)
    │       │       ├── assign   # Assign module to group
    │       │       └── notify   # Send push to group
    │       └── students/
    │           └── [id]/
    │               ├── index              # Student detail (progress breakdown)
    │               ├── assign             # Assign module to student
    │               ├── notify             # Send push to student
    │               └── practice-signoff   # Practice milestone sign-off screen
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
- "Sign In" primary button → `/login`
- "Create a dive-link account" link → opens dive-link website in browser (accounts are created there, not in this app)

---

### `(auth)/login` — Sign In
**Purpose:** Authenticate against the dive-link API.
**Elements:**
- Email + password fields
- "Sign In" primary button → calls `POST /api/v1/auth/login` on dive-link
- Error inline below fields on failure
- "Don't have an account?" → external link to dive-link website
- Success: navigate to `/onboarding/certifications` (first sign-in) or `/(app)/(tabs)/home` (returning)

---

### `(auth)/onboarding/certifications` — CMAS Certifications Display
**Purpose:** Show the user their real CMAS certifications retrieved from dive-link so they understand what content will be unlocked for them.
**Elements:**
- Heading: "Your CMAS Certifications"
- List of active certifications: discipline, level name, star rating badge, issue date
- If no active certifications: "No certifications found — you'll see content for all levels. Once an instructor issues you a certification on dive-link, advanced content will unlock here."
- "Continue" → `/onboarding/notifications`
- This screen is read-only; no editing occurs here

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
2. Quizzes, XP, and streak — with a note that XP levels are a fun in-app system, separate from CMAS certifications
3. Dive log and checklist
4. Badges and achievements
**Elements:**
- Pagination dots, swipe or next button
- "Get Started" on slide 4 → `/(app)/(tabs)/home`

---

### `(tabs)/home` — Home Screen
**Purpose:** Daily engagement hub.
**Sections (top to bottom):**
1. **Header bar:** Display name (from dive-link), streak flame + count, XP level chip
2. **Today's Briefing card:** Do (green) / Don't (red) pair — tap either → card detail
3. **"Quiz Yourself" CTA button:** → quick quiz session on today's cards
4. **XP Progress bar:** Current in-app level icon, XP fraction, next level name
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
- Cert tier filter toggle (derived from dive-link certifications)
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
- "New Dive" FAB → checklist flow
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
- "Edit" and "Delete" actions (top-right menu)
- "Share Dive" button → generates a summary image card

---

### `(tabs)/profile/index` — Profile Hub
**Purpose:** Personal progress overview combining dive-link identity and in-app stats.
**Elements:**
- Avatar + display name (from dive-link)
- **CMAS Certifications** section: list of active certifications (from dive-link, read-only) with a "Manage on dive-link" link
- In-app level badge + XP progress bar (from Supabase)
- Streak count + "days" label
- Total dives stat chip
- Quick links: Badges, Stats, Dive Log
- Settings icon → `/profile/settings`

---

### `(tabs)/profile/edit` — Edit App Profile
**Purpose:** Edit fields owned by this app only.
**Elements:**
- Avatar picker (Supabase Storage)
- Home dive club text field (Supabase)
- Read-only section (labeled "From dive-link"): display name, email, role — with "Edit on dive-link" external link
- Note: certification level is not editable here

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
- **Account:** Delete account (with confirmation flow)
- **Log Out** (at bottom) — clears Expo SecureStore token and navigates to `/login`
- App version number

---

### `(tabs)/instructor/index` — Instructor Dashboard
**Purpose:** Overview of all student learning groups.
**Access:** Only shown if `authStore.identity.is_instructor === true` (verified via dive-link API on session start).
**Elements:**
- "New Group" CTA
- Group cards: name, student count, avg mastery %, last activity
- Tap group → group detail

---

### `(tabs)/instructor/groups/[id]/index` — Group Detail
**Purpose:** Manage a student learning group.
**Tabs:** Students | Assignments | Notifications
**Students tab:**
- Invite student button (by email)
- Student rows: name, last active, mastery %, sessions this week
- Tap student → student detail

---

### `(tabs)/instructor/students/[id]/index` — Student Detail
**Purpose:** Per-student progress breakdown.
**Elements:**
- Student name
- Overall mastery % ring
- Mastery by category (list with % bars)
- Recent quiz sessions (last 5)
- Assigned modules + completion status
- "Assign Module" and "Send Reminder" action buttons
- "Practice Sign-Off" button → practice-signoff screen

---

### `(tabs)/instructor/students/[id]/practice-signoff` — Practice Sign-Off
**Purpose:** Record that a student has practised a specific skill.
**Elements:**
- Heading: "Practice Milestone Record"
- Subheading: "These are informal practice records. CMAS certifications are issued via dive-link."
- Scrollable list of skill slugs grouped by category (e.g., "Mask clearing", "Emergency ascent reviewed")
- Tap a skill row → confirm dialog: "Record that [student name] practised [skill]?"
- On confirm: inserts row in `practice_signoffs` (Supabase)
- Already signed-off skills shown with a checkmark and timestamp

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
**Purpose:** Celebrate reaching a new in-app level.
**Elements:**
- Confetti animation (Reanimated)
- New in-app level icon + name
- "You're now an Advanced Diver!" headline (labeled as in-app level)
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
| Instructor | chalkboard-teacher | `is_instructor === true` (from dive-link) only |

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
