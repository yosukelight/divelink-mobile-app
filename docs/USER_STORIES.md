# DiveLink — User Stories

Format: `As a [role], I want to [action] so that [outcome].`
Acceptance criteria use Given/When/Then.

> **Scope note:** User accounts are created and managed on dive-link (the CMAS backend platform). This app authenticates against the dive-link API; it does not have its own sign-up flow. Role (Diver / Instructor) and CMAS certifications are read from the dive-link API — they are never stored as editable fields in this app.

---

## EP-01 · Authentication & Onboarding

### US-01-01 Sign In via dive-link
As a returning diver or instructor, I want to sign in with my dive-link email and password so that my CMAS certifications and profile are automatically available in the app.

**Acceptance Criteria**
- Given I am on the login screen
- When I enter valid dive-link credentials and tap "Log In"
- Then a request is sent to `POST /api/v1/auth/login` on the dive-link API
- And on success, the access token is held in memory and the refresh token is stored in Expo SecureStore
- And `GET /api/v1/divers/me` is called to populate identity and certifications in `authStore.identity`
- And the Supabase `profiles` row is upserted (created if first sign-in, updated push token otherwise)
- And I am navigated to the notification permission step (first sign-in) or Home (returning)
- Given invalid credentials, I see "Incorrect email or password" — the form is not cleared
- Given I have no dive-link account, I see a message directing me to create one on the dive-link website

---

### US-01-02 Stay Signed In Across Restarts
As a returning user, I want my session to persist across app restarts so that I don't have to sign in every time I open the app.

**Acceptance Criteria**
- On app start, the app reads the refresh token from Expo SecureStore
- If present, it calls `POST /api/v1/auth/refresh` (token in request body) to obtain a new access token
- On success: `GET /api/v1/divers/me` re-populates `authStore.identity`; app navigates to Home
- On failure (expired / revoked token): SecureStore entry is cleared; user is navigated to login
- Identity is never read from local storage — it is always re-fetched from dive-link on session restore

---

### US-01-03 Notification Permission
As a new user, I want to be asked for notification permission in context so that I understand why the app needs it before accepting.

**Acceptance Criteria**
- Shown only once, on first sign-in, after the dive-link identity is loaded
- Preceded by a screen explaining: "Daily dive tip" and "Streak reminders"
- If denied, the app still works; the user can enable later in Settings
- If approved, the default daily reminder is scheduled for 8:00 AM local time

---

### US-01-04 Onboarding Carousel
As a new user, I want a brief visual walkthrough so that I understand how to get value from day one.

**Acceptance Criteria**
- Shown only on first sign-in
- 4 slides: Daily Briefing → Quizzes & XP → Dive Log → Badges
- Slide 1 includes a note distinguishing in-app XP levels from CMAS certifications
- Skippable at any point
- "Get Started" on the last slide navigates to Home

---

### US-01-05 Display CMAS Certifications from dive-link
As a diver, I want to see my real CMAS certifications (fetched from dive-link) displayed in the app so that I know my content is calibrated to my actual qualifications.

**Acceptance Criteria**
- Certifications shown on the Profile screen: discipline, level name, star rating, status, issue date
- The app uses the highest active certification's star rating as `cert_tier` for quiz/content gating
- If no active certifications exist, content defaults to tier 0 ("All levels")
- Certifications are read-only in this app — a "Manage on dive-link" link is shown for edits

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
- Home screen shows a "Today's Briefing" card with Do (green) / Don't (red) entries
- Tapping either card opens the full Knowledge Card detail view
- The card shows a "Quiz Yourself" CTA that starts a quiz on today's cards

---

### US-02-03 Briefing History
As a diver, I want to see previous days' briefings so that I can review any I missed.

**Acceptance Criteria**
- A "Past Briefings" link on Home shows a list of previous Do/Don't pairs with date labels
- Tapping an entry opens the card detail

---

## EP-03 · Knowledge Base

### US-03-01 Browse by Category
As a diver, I want to browse the knowledge base by category so that I can study a specific area.

**Acceptance Criteria**
- Categories listed as scrollable chips or a category grid
- Tapping a category shows all cards in that category
- Cards sorted: unmastered first, then by difficulty

---

### US-03-02 Filter by Cert Tier
As a diver, I want to filter knowledge cards by certification tier so that I'm not overwhelmed by content outside my training.

**Acceptance Criteria**
- Default filter = user's cert_tier (0–3) derived from their highest active CMAS certification (fetched from dive-link)
- User can expand to see higher-tier content with a "Show advanced" toggle
- Cards above user's cert_tier are visually dimmed with a lock icon

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
- A "Favourites" section in the Learn screen lists bookmarked cards
- Favourites are persisted in Supabase

---

## EP-04 · Quiz & Spaced Repetition

### US-04-01 Daily Quiz Session
As a diver, I want to complete a short daily quiz so that I can earn XP and maintain my streak.

**Acceptance Criteria**
- Daily quiz contains 5 questions selected by SM-2 scheduler (due cards first, then new cards)
- Questions are filtered to the user's cert_tier (derived from dive-link certifications)
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
- "Done" returns to Home; "Practice again" restarts with only wrong cards

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
As a diver, I want to see my in-app level and progress toward the next tier so that I have a clear long-term goal.

**Acceptance Criteria**
- Home screen and Profile show current in-app level name, level icon, and XP progress bar
- Reaching a new level triggers a level-up animation and push notification
- Level names reflect diving tiers (Snorkeler → Open Water → Advanced → Rescue → Divemaster → Instructor) but are a motivational construct — they are labeled "in-app level" to distinguish them from the user's real CMAS certifications shown separately on the Profile screen

---

### US-05-03 Daily Streak
As a diver, I want my streak to increment each day I complete a quiz so that I'm motivated to open the app every day.

**Acceptance Criteria**
- Streak increments when at least one quiz session is completed that calendar day (user's local time)
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
- For countable badges, progress shown (e.g., 6/10)

---

### US-06-03 Achievement Triggers
As a diver, I want achievements to be checked automatically as I use the app so that I never miss an unlock.

**Acceptance Criteria**
- Trigger checks run on: dive log save, quiz completion, daily login, streak update
- Each achievement is checked idempotently (cannot unlock twice)
- All triggers defined in `data/achievements.ts`

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
- "New Dive Log" CTA always launches the checklist first
- The dive log form is presented only after checklist completion
- The checklist can be re-opened from the dive log form

---

### US-07-03 Pre-Dive Reminder Scheduling
As a diver, I want to schedule a reminder before a planned dive so that I don't forget to do my buddy check.

**Acceptance Criteria**
- Optional "Remind me" date+time picker on the Checklist start screen
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
As a diver, I want the site name field to suggest known dive sites as I type so that my logs are consistent.

**Acceptance Criteria**
- Debounced search against `dive_sites` table in Supabase
- Shows up to 5 suggestions; select fills the field
- If no match, user can type a free-form name

---

## EP-09 · Statistics Dashboard

### US-09-01 Aggregate Stats
As a diver, I want to see my total dives, time, deepest dive, and most-visited site at a glance.

**Acceptance Criteria**
- Stats computed server-side via Supabase RPC `get_user_stats()`
- Update after every new or edited dive log entry

---

### US-09-02 Dive Frequency Chart
As a diver, I want to see a bar chart of dives per month so that I can see how my activity trends.

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
As a diver, I want to see my profile with CMAS certifications, in-app level, XP, streak, and badges.

**Acceptance Criteria**
- Shows: avatar, display name (from dive-link), CMAS certifications list (from dive-link, read-only), in-app level name + icon, XP bar, streak count, total dives
- CMAS certifications section has a "Manage on dive-link" link
- Links to: Dive Log, Stats, Badge Gallery
- Settings gear in top-right corner

---

### US-10-02 Edit App Profile
As a diver, I want to update my avatar and app preferences so that the app works the way I want.

**Acceptance Criteria**
- Editable fields (stored in Supabase): avatar, home dive club
- Read-only display (from dive-link, with "Edit on dive-link" link): display name, email
- Avatar uploadable from camera roll or camera; stored in Supabase Storage
- Changes to Supabase fields saved immediately
- Cert level and role are NOT editable here — they are read from dive-link

---

### US-10-03 Settings
As a diver, I want to configure my notification time, units, and privacy preferences.

**Acceptance Criteria**
- Notification time: time picker, updates scheduled notification
- Units: Metric (m, °C, bar) / Imperial (ft, °F, PSI) — applied globally
- Leaderboard: opt-in toggle (default off)
- Log out button with confirmation (clears SecureStore token; clears authStore)

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

## EP-12 · Instructor Learning Dashboard

> **Scope note:** These stories cover in-app learning management only. Formal CMAS certification issuance and the official instructor–diver credentialing relationship are handled by dive-link, not by this app. Access to the Instructor tab is gated on `authStore.identity.is_instructor === true`, which is derived from the user's active instructor-grade CMAS certifications read from the dive-link API on each session start.

### US-12-01 Create a Student Learning Group
As an instructor, I want to create a named group and invite students so that I can manage their learning cohorts within this app.

**Acceptance Criteria**
- Create group with name (e.g., "Open Water July 2026")
- Invite students by email; they receive an in-app notification and must accept
- Group appears in instructor dashboard with student count
- This group has no effect on the student's CMAS records in dive-link

---

### US-12-02 View Student Learning Progress
As an instructor, I want to see each student's quiz completion and knowledge mastery so that I can identify who needs help before a dive.

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

### US-12-05 Practice Skill Sign-Off
As an instructor, I want to mark that a student has practised a specific skill in our sessions so that they have an informal in-app record of what we covered.

**Acceptance Criteria**
- Predefined skill list drawn from knowledge base categories (e.g., "mask clearing practised", "emergency ascent reviewed")
- Instructor taps to create a practice sign-off; it is stored in `practice_signoffs` in Supabase with the instructor's user ID and timestamp
- Student sees the sign-off on their profile under "Practice milestones" — displayed separately from their CMAS certifications
- The UI labels these explicitly as "Practice records — not CMAS certifications"
- Cannot be revoked once granted (immutable audit record in this app)
- These records carry no CMAS authority and are not transmitted to dive-link

---

## EP-13 · Offline Mode

### US-13-01 Quiz Offline
As a diver with no internet, I want to complete my daily quiz so that I don't break my streak in a remote location.

**Acceptance Criteria**
- Quiz question bank pre-cached in MMKV on first load (or last successful sync)
- XP and streak update locally; synced to Supabase on next connection
- Offline indicator shown in top bar when no connectivity
- dive-link identity (certifications, instructor status) is read from cache; no writes to dive-link are possible offline

---

### US-13-02 Log a Dive Offline
As a diver with no internet, I want to save a dive log draft so that I don't lose my data at a remote dive site.

**Acceptance Criteria**
- Dive log form works fully offline
- Entry saved locally with `sync_status: 'pending'`
- On reconnect, pending entries are uploaded automatically
- If sync fails, user is notified with a retry option
