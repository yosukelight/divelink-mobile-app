# DiveLink — User Stories

Format: `As a [role], I want to [action] so that [outcome].`
Acceptance criteria use Given/When/Then.

---

## EP-01 · Authentication & Onboarding

### US-01-01 Sign Up
As a new user, I want to create an account with email and password so that my data is saved and synced across devices.

**Acceptance Criteria**
- Given I am on the sign-up screen
- When I enter a valid email, password (min 8 chars), and display name and tap "Create Account"
- Then my account is created in Supabase Auth, a user record is inserted, and I am navigated to the role-selection step
- And if the email already exists, I see an error message "Account already exists. Try logging in."

---

### US-01-02 Log In
As a returning user, I want to log in with my email and password so that I can access my existing profile and dive history.

**Acceptance Criteria**
- Given valid credentials, when I tap "Log In," I am taken to the Home screen
- Given invalid credentials, I see "Incorrect email or password" and the form is not cleared
- Session persists across app restarts (token stored in secure storage)

---

### US-01-03 Role Selection
As a new user, I want to choose between "Diver" and "Instructor" during onboarding so that I see the features relevant to my role.

**Acceptance Criteria**
- Role selection is presented as a two-option card screen immediately after account creation
- Selecting Instructor adds an additional "how to find your students" explainer step
- Role is saved to the user record and gates the Instructor tab

---

### US-01-04 Certification Level Selection
As a new diver, I want to declare my certification level so that I receive quizzes and content appropriate to my experience.

**Acceptance Criteria**
- Options: Open Water, Advanced Open Water, Rescue Diver, Divemaster, Instructor, None (just exploring)
- Selection is shown during onboarding and editable later in Profile > Settings
- Quiz questions are filtered to cert level ≤ user's level

---

### US-01-05 Notification Permission
As a new user, I want to be asked for notification permission in context so that I understand why the app needs it before accepting.

**Acceptance Criteria**
- Permission request is preceded by a screen explaining "We'll send you a daily dive tip and streak reminders"
- If denied, the app still works; the user can enable later in Settings
- If approved, the default daily reminder is scheduled for 8:00 AM local time

---

### US-01-06 Onboarding Carousel
As a new user, I want a brief visual walkthrough of the app's key features so that I understand how to get value from day one.

**Acceptance Criteria**
- 4–5 slides: Daily Briefing → Quizzes & XP → Dive Log → Badges
- Skippable at any point
- "Get Started" on the last slide navigates to Home

---

## EP-02 · Daily Learning Briefing

### US-02-01 Daily Push Notification
As a diver, I want a push notification each morning with a Do and a Don't so that I build safety knowledge passively.

**Acceptance Criteria**
- Notification fires at user-configured time (default 8:00 AM local)
- Body shows the Do rule title and Don't rule title
- Tapping it opens the app to Today's Briefing screen
- A different pair of cards is shown each day, cycling through categories

---

### US-02-02 In-App Briefing Card
As a diver, I want to see today's Do and Don't on the Home screen so that I can review them without opening a notification.

**Acceptance Criteria**
- Home screen shows a "Today's Briefing" card with Do (green) and Don't (red) entries
- Tapping either card opens the full Knowledge Card detail view
- The card shows "Quiz Yourself" CTA that starts a quiz on today's cards

---

### US-02-03 Briefing History
As a diver, I want to see previous days' briefings so that I can review any I missed.

**Acceptance Criteria**
- A "Past Briefings" link on Home shows a list of previous Do/Don't pairs with date labels
- Tapping an entry opens the card detail

---

## EP-03 · Knowledge Base

### US-03-01 Browse by Category
As a diver, I want to browse the knowledge base by category so that I can study a specific area (e.g., Emergency Procedures).

**Acceptance Criteria**
- Categories listed as scrollable chips or a category grid
- Tapping a category shows all cards in that category
- Cards are sorted: unmastered first, then by difficulty

---

### US-03-02 Filter by Cert Level
As a diver, I want to filter knowledge cards by certification level so that I'm not overwhelmed by content outside my training.

**Acceptance Criteria**
- Default filter = user's cert level and below
- User can expand to see higher-level content with a "Show advanced" toggle
- Cards outside user's cert level are visually dimmed with a lock icon

---

### US-03-03 Search Knowledge Base
As a diver, I want to search for a specific rule or keyword so that I can find information quickly.

**Acceptance Criteria**
- Search bar on the Learn tab filters cards in real time (debounced 300ms)
- Matches against title, body, and tags
- "No results" state shown with a suggestion to clear filters

---

### US-03-04 Card Detail View
As a diver, I want to see the full explanation of a rule so that I understand the "why" behind it.

**Acceptance Criteria**
- Detail screen shows: type (Do/Don't), category, title, body text, full explanation
- Shows my mastery % for that card (based on quiz history)
- "Favourite" toggle bookmarks it
- "Quiz Me" button starts a single-card quiz

---

### US-03-05 Favourite Cards
As a diver, I want to bookmark knowledge cards I want to revisit so that I can build my own study list.

**Acceptance Criteria**
- Favourite toggle on card detail and card list row
- A "Favourites" tab/section in the Learn screen lists bookmarked cards
- Favourites are persisted in Supabase

---

## EP-04 · Quiz & Spaced Repetition

### US-04-01 Daily Quiz Session
As a diver, I want to complete a short daily quiz so that I can earn XP and maintain my streak.

**Acceptance Criteria**
- Daily quiz contains 5 questions selected by SM-2 scheduler (due cards first, then new cards)
- Questions are multi-choice (4 options)
- Immediate feedback after each answer: correct/incorrect + explanation
- XP awarded at end of session: 50 base + streak multiplier

---

### US-04-02 Flashcard Mode
As a diver, I want to flip through flashcards and self-rate my recall so that the app knows when to resurface each card.

**Acceptance Criteria**
- Card shows question on front; tap to flip reveals answer
- Three rating buttons: "Forgot" / "Hard" / "Got It"
- SM-2 algorithm updates next_review and ease_factor accordingly
- Session ends after 10 cards; shows summary

---

### US-04-03 Quiz Results Screen
As a diver, I want to see a summary after each quiz so that I know where I struggled.

**Acceptance Criteria**
- Shows score (e.g., 4/5 correct), XP earned, streak updated
- Lists each question with correct/my answer highlighted
- Tapping a question shows the card detail with full explanation
- "Done" returns to Home; "Practice again" restarts a session with only the wrong cards

---

### US-04-04 Mastery Tracking
As a diver, I want to see how well I know each card so that I can focus on weak areas.

**Acceptance Criteria**
- Mastery % per card = (times_correct / times_seen) × 100, minimum 3 attempts
- Mastery shown on card list rows and card detail
- "Mastered" badge (≥ 80% over ≥ 5 attempts) shown with a checkmark
- Overall mastery % shown on Profile and Learn screens

---

## EP-05 · XP, Levels & Streaks

### US-05-01 Earn XP
As a diver, I want to earn XP for completing quizzes and logging dives so that I feel rewarded for safe behavior.

**Acceptance Criteria**
- XP events fire on: quiz completion (+50), perfect quiz (+25 bonus), dive logged (+75), checklist completed (+20), achievement unlocked (variable), module completed (+100)
- An animated "+XP" pop appears at the point of reward
- XP total updates in real time on the profile XP bar

---

### US-05-02 Level Progression
As a diver, I want to see my level and progress toward the next tier so that I have a clear long-term goal.

**Acceptance Criteria**
- Home screen and Profile show current level name, level icon, and XP progress bar (current / needed for next level)
- Reaching a new level triggers a level-up animation and push notification
- Level name reflects diving tiers: Snorkeler → Open Water → Advanced → Rescue → Divemaster → Instructor

---

### US-05-03 Daily Streak
As a diver, I want my streak to increment each day I complete a quiz so that I'm motivated to open the app every day.

**Acceptance Criteria**
- Streak increments when: at least one quiz session completed that calendar day (user's local time)
- Streak resets to 0 if a day is skipped
- Streak count shown prominently on Home screen with a flame icon
- 7-day milestones show a "streak milestone" animation

---

### US-05-04 Streak Danger Alert
As a diver, I want a reminder at 8 PM if I haven't done my daily quiz so that I don't accidentally break my streak.

**Acceptance Criteria**
- Push notification fires at 8 PM local if no quiz session recorded that day
- Notification copy: "Your [N]-day streak ends at midnight — do a 2-minute quiz now!"
- Tapping opens directly to the Quiz tab
- Does not fire if the streak is 0 (no streak to protect)

---

### US-05-05 Streak Multiplier
As a diver with a long streak, I want my XP earnings to be boosted so that sustained daily use is meaningfully rewarded.

**Acceptance Criteria**
- Multiplier formula: 1.0× base; +0.1× per completed 7-day block; cap at 2.0×
- Multiplier shown next to XP award pop animation (e.g., "+50 XP ×1.3")
- Multiplier resets to 1.0× when streak is broken

---

## EP-06 · Achievement Badges

### US-06-01 Badge Unlock Animation
As a diver, I want a satisfying full-screen animation when I unlock a badge so that achievements feel earned and exciting.

**Acceptance Criteria**
- Modal appears over current screen: badge icon animates in, title and XP reward shown
- Haptic feedback on unlock
- Dismiss with tap or "Awesome!" button
- XP is credited on dismiss

---

### US-06-02 Badge Gallery
As a diver, I want to see all badges (earned and locked) in my profile so that I know what to work toward next.

**Acceptance Criteria**
- Grid layout: earned badges in color, locked in grayscale
- Tapping any badge shows description and unlock condition
- For countable badges (e.g., "10 Dives"), progress shown (e.g., 6/10)

---

### US-06-03 Achievement Triggers
As a diver, I want achievements to be checked automatically as I use the app so that I never miss an unlock.

**Acceptance Criteria**
- Trigger checks run on: dive log save, quiz completion, daily login, streak update
- Each achievement is checked idempotently (cannot unlock twice)
- All triggers defined in `data/achievements.ts` — no hard-coded checks scattered across screens

---

## EP-07 · Pre-Dive Checklist

### US-07-01 BWRAF Checklist
As a diver, I want to complete the BWRAF checklist before logging a dive so that I reinforce the habit of buddy checks.

**Acceptance Criteria**
- Checklist has 5 sections: Buoyancy, Weights, Releases, Air, Final OK
- Each section has 2–3 sub-items with a checkbox
- All items must be checked before the "Complete Checklist" button is enabled
- Completion timestamp is stored with the dive log entry

---

### US-07-02 Checklist Gate
As a diver, I want the dive log form to require checklist completion so that I can't skip the safety step.

**Acceptance Criteria**
- "New Dive Log" CTA on the Log tab always launches the checklist first
- The dive log form is presented only after checklist completion
- The checklist can be re-opened from the dive log form (edit mode)

---

### US-07-03 Pre-Dive Reminder Scheduling
As a diver, I want to schedule a reminder before a planned dive so that I don't forget to do my buddy check.

**Acceptance Criteria**
- On the Checklist start screen, optional "Remind me" date+time picker
- Notification fires at selected time: "Time for your buddy check! Tap to open BWRAF"
- Scheduled reminder cancels if the dive is logged before that time

---

## EP-08 · Dive Log

### US-08-01 Log a New Dive
As a diver, I want to create a dive log entry so that I have a permanent record of every dive.

**Acceptance Criteria**
- Required fields: site name, date, max depth, duration
- Optional fields: buddy, start/end pressure, water temp, visibility, night dive toggle, notes
- Depth/pressure units respect profile setting (metric vs imperial)
- XP awarded on save

---

### US-08-02 View Dive History
As a diver, I want to see a list of all my logged dives so that I can review my history.

**Acceptance Criteria**
- List ordered newest first
- Each row: site name, date, depth, duration, buddy (if set)
- Pull-to-refresh
- Filter by: date range, site name, buddy name

---

### US-08-03 Dive Detail View
As a diver, I want to see all details of a specific dive so that I can review what I recorded.

**Acceptance Criteria**
- Shows all fields including photos (gallery if multiple)
- Edit and Delete actions available
- Delete requires confirmation dialog

---

### US-08-04 Photo Upload
As a diver, I want to attach photos to my dive log so that I can remember what I saw underwater.

**Acceptance Criteria**
- Up to 5 photos per dive entry
- Select from camera roll or take a new photo
- Photos uploaded to Supabase Storage
- Thumbnails shown on dive detail; tap to full-screen

---

### US-08-05 Dive Site Autocomplete
As a diver, I want the site name field to suggest known dive sites as I type so that my logs are consistent and discoverable.

**Acceptance Criteria**
- Debounced search against a `dive_sites` table in Supabase
- Shows up to 5 suggestions; select fills the field
- If no match, user can type a free-form name and it becomes a new site entry

---

## EP-09 · Statistics Dashboard

### US-09-01 Aggregate Stats
As a diver, I want to see my total dives, time, deepest dive, and most-visited site so that I can appreciate my progress at a glance.

**Acceptance Criteria**
- Stats computed server-side via Supabase view or RPC to avoid mobile re-computation
- Update after every new or edited dive log entry

---

### US-09-02 Dive Frequency Chart
As a diver, I want to see a bar chart of dives per month so that I can see how my activity trends over time.

**Acceptance Criteria**
- Bar chart with last 12 months on x-axis
- Tapping a bar shows the list of dives that month

---

### US-09-03 Streak Calendar
As a diver, I want a heatmap calendar of my daily quiz activity so that I can see my consistency visually.

**Acceptance Criteria**
- GitHub-style contribution grid
- Darker color = more XP earned that day
- Scroll horizontally to past months

---

## EP-10 · User Profile

### US-10-01 View Profile
As a diver, I want to see my profile with level, XP, streak, and badges so that I have a clear picture of where I stand.

**Acceptance Criteria**
- Shows: avatar, display name, cert level, level name + icon, XP bar, streak count, total dives
- Links to: Dive Log, Stats, Badge Gallery
- Settings gear in top-right corner

---

### US-10-02 Edit Profile
As a diver, I want to update my display name, avatar, cert level, and home club so that my profile stays current.

**Acceptance Criteria**
- Editable inline or via an Edit Profile screen
- Avatar uploadable from camera roll or camera
- Changes saved to Supabase immediately

---

### US-10-03 Settings
As a diver, I want to configure my notification time, units, and privacy preferences so that the app works the way I want.

**Acceptance Criteria**
- Notification time: time picker, updates scheduled notification
- Units: Metric (m, °C, bar) / Imperial (ft, °F, PSI) — applied globally
- Leaderboard: opt-in toggle (default off)
- Log out button with confirmation

---

## EP-11 · Leaderboard

### US-11-01 View Leaderboard
As a diver, I want to see how my XP compares to others so that I feel motivated by friendly competition.

**Acceptance Criteria**
- Three tabs: Global, My Club, Buddies
- My own rank always visible (pinned at bottom if off-screen)
- Refreshes on pull-to-refresh
- Only shows opted-in users

---

## EP-12 · Instructor Dashboard

### US-12-01 Create a Student Group
As an instructor, I want to create a named group and invite students so that I can manage cohorts easily.

**Acceptance Criteria**
- Create group with name (e.g., "Open Water July 2026")
- Invite students by email; they receive an in-app notification and must accept
- Group appears in instructor dashboard with student count

---

### US-12-02 View Student Progress
As an instructor, I want to see each student's quiz completion and mastery so that I can identify who needs help.

**Acceptance Criteria**
- Per-student row: name, last active date, overall mastery %, quiz sessions this week
- Tap a student to see their full breakdown by category
- Sort by: mastery %, last active, name

---

### US-12-03 Assign a Learning Module
As an instructor, I want to assign specific knowledge categories or quiz sets to my students so that they prepare for upcoming dives.

**Acceptance Criteria**
- Instructor selects one or more categories from the knowledge base
- Assigns to a student or whole group, optionally with a due date
- Students see the assignment on their Learn tab with a countdown if due date set
- Instructor can see completion status per assignment

---

### US-12-04 Send Push Notification to Students
As an instructor, I want to send a targeted push reminder to my students so that I can prompt them to review before a dive.

**Acceptance Criteria**
- Compose free-text message (max 140 chars) with a CTA type (open Quiz / open Checklist / open a specific module)
- Send to: individual student or entire group
- Rate-limited: max 1 manual push per student per day
- Sent notifications visible in instructor's notification history

---

### US-12-05 Skill Sign-Off
As an instructor, I want to mark a student's skill as complete so that the student has an in-app record of instructor endorsement.

**Acceptance Criteria**
- Predefined skill list per cert level (drawn from knowledge base categories)
- Instructor taps to sign off; shows their name and date
- Student sees the endorsement on their profile
- Cannot be revoked once granted (creates permanent audit record)

---

## EP-13 · Offline Mode

### US-13-01 Quiz Offline
As a diver with no internet, I want to complete my daily quiz so that I don't break my streak in a remote location.

**Acceptance Criteria**
- Quiz question bank pre-cached in MMKV on first load (or last successful sync)
- XP and streak update locally; synced to Supabase on next connection
- Offline indicator shown in top bar when no connectivity

---

### US-13-02 Log a Dive Offline
As a diver with no internet, I want to save a dive log draft so that I don't lose my data at a remote dive site.

**Acceptance Criteria**
- Dive log form works fully offline
- Entry saved locally with `sync_status: 'pending'`
- On reconnect, pending entries are uploaded automatically
- If sync fails, user is notified with a retry option
