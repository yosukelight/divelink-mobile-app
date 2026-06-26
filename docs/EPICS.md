# DiveLink — Epics

Each epic maps to a product capability. Stories are tracked in USER_STORIES.md.

---

## EP-01 · Authentication & Onboarding

Get a user from zero to a personalized, ready-to-use account.

**Scope**
- Sign up / log in / forgot password
- Role selection: Diver vs Instructor
- Certification level selection
- Notification permission request
- Onboarding carousel (what the app does, how streaks work)

**Exit criteria:** A new user can register, pick their role and cert level, and land on the home screen with their first daily briefing visible.

---

## EP-02 · Daily Learning Briefing

Surface one Do and one Don't every day to build passive habit.

**Scope**
- Push notification at user-configured time
- In-app "Today's Briefing" card on Home screen
- Do/Don't sourced from knowledge base, rotated by category
- CTA linking to a quick quiz on that card
- Fallback content for offline users

**Exit criteria:** On any given day, a diver opens the app and sees a fresh Do/Don't briefing and can immediately quiz themselves on it.

---

## EP-03 · Knowledge Base (Dos & Don'ts)

A searchable, categorized library of diving rules and safety facts.

**Scope**
- Cards organized by category (Pre-dive, Ascent, Emergency, Equipment, etc.)
- Filter by cert level
- Search by keyword
- Card detail view with explanation
- Favorite / bookmark cards
- Mastery indicator per card (based on quiz history)

**Exit criteria:** A diver can browse, search, and bookmark rules; each card shows their mastery percentage.

---

## EP-04 · Quiz & Spaced Repetition

Active recall system that adapts to what each diver knows and doesn't know.

**Scope**
- Flashcard mode (reveal-and-rate)
- Multi-choice quiz mode
- SM-2 spaced repetition scheduling
- Daily quiz session (minimum 3 questions)
- Quiz results screen with explanations
- Per-question difficulty tracking
- Cert-level-gated questions

**Exit criteria:** A diver can complete a daily quiz, see which answers were wrong with explanations, and the system schedules those cards sooner next time.

---

## EP-05 · XP, Levels & Streaks

The core gamification loop that keeps divers coming back daily.

**Scope**
- XP awarded for all learning and logging actions
- Level system with named tiers
- Daily streak counter
- Streak multiplier on XP
- Streak danger alert at 8 PM if not yet active that day
- Level-up animation / notification
- XP history log

**Exit criteria:** Every qualifying action awards XP; streaks persist across sessions; losing a streak is clearly communicated.

---

## EP-06 · Achievement Badges

One-time milestone rewards that celebrate diver accomplishments.

**Scope**
- Achievement definitions with icon, title, XP reward, and trigger condition
- Badge unlock animation (full-screen modal)
- Badge gallery on profile screen
- Locked vs unlocked states visible
- Progress toward next unlock shown for countable badges

**Exit criteria:** Earning a badge triggers an animation; the profile badge gallery reflects all earned and locked badges.

---

## EP-07 · Pre-Dive Checklist

Enforce the BWRAF safety check before every logged dive.

**Scope**
- BWRAF interactive checklist (Buoyancy, Weights, Releases, Air, Final OK)
- Cannot submit dive log without completing checklist
- Optional: schedule a pre-dive reminder at a user-specified time
- XP award on completion
- Checklist history view

**Exit criteria:** A diver cannot create a dive log entry without completing the checklist; checklist completion is recorded and rewarded.

---

## EP-08 · Dive Log

Permanent record of every dive with rich metadata.

**Scope**
- Create / view / edit / delete dive entries
- Fields: site, date, max depth, duration, buddy, start/end pressure, water temp, visibility, notes, night dive flag
- Photo upload (up to 5 per dive)
- Dive site search / autocomplete
- Dive list with filters (date range, site, buddy)
- Share a dive summary (image card)

**Exit criteria:** A diver can log a complete dive entry with photos and retrieve it later; data persists across devices via Supabase.

---

## EP-09 · Statistics Dashboard

Visual summary of a diver's overall progress and history.

**Scope**
- Total dives, total time underwater, deepest dive, most-visited site
- Dive frequency chart (bar chart by month)
- Depth distribution histogram
- Streak calendar (GitHub-style heatmap)
- XP progression chart
- Cert-level breakdown of quiz mastery

**Exit criteria:** The stats screen renders accurate aggregates that update after each new dive log or quiz session.

---

## EP-10 · User Profile

Personal identity and progress hub.

**Scope**
- Avatar upload
- Display name, certification level, home dive club
- Current level + XP bar to next level
- Current streak
- Badge gallery (EP-06)
- Link to dive log and stats
- Settings: notification time, privacy (leaderboard opt-in), units (metric/imperial)

**Exit criteria:** A diver's profile shows accurate level, XP, streak, and badges; settings are persisted.

---

## EP-11 · Leaderboard

Optional social layer to create friendly competition.

**Scope**
- Opt-in only (privacy default: off)
- Scope: global, by dive club, or among mutual buddies
- Ranked by XP this week / all time
- Your own rank always shown even if off-screen
- Refresh on pull-to-refresh

**Exit criteria:** An opted-in diver can see their ranking; opting out removes them from all leaderboards immediately.

---

## EP-12 · Instructor Dashboard

Tools for instructors to manage students and enforce learning.

**Scope**
- Create and name student groups
- Add students by email or invite link
- View per-student: quiz completion %, knowledge mastery %, last active date
- Assign learning modules (quiz sets / knowledge categories) with optional due dates
- Send targeted push notification to a student or whole group
- Mark a skill as signed off (in-app endorsement)
- Export student progress (CSV)

**Exit criteria:** An instructor can add students, assign a module, track their quiz scores, and send a push reminder — all without leaving the app.

---

## EP-13 · Offline Mode

Core features work without an internet connection.

**Scope**
- Quiz questions cached locally with MMKV
- Knowledge base cached on first load
- Dive log drafts saved locally and synced on reconnect
- Offline badge: visual indicator when in offline mode
- Sync conflict resolution (last-write-wins for logs)

**Exit criteria:** A diver can complete a quiz and log a dive while offline; data syncs automatically when connectivity resumes.

---

## EP-14 · Content Management (Internal)

Admin tooling to maintain the knowledge base and quiz bank.

**Scope**
- Supabase dashboard seeding scripts
- JSON schema for knowledge cards and quiz questions
- Cert-level tagging and category taxonomy
- Versioned content releases (so OTA app updates aren't required for new cards)

**Exit criteria:** New knowledge cards and quiz questions can be added to the database without a new app release.

---

## Epic → Phase Mapping

| Epic | Phase |
|---|---|
| EP-01 Auth & Onboarding | Phase 1 |
| EP-02 Daily Briefing | Phase 1 |
| EP-07 Pre-Dive Checklist | Phase 1 |
| EP-08 Dive Log | Phase 1 |
| EP-03 Knowledge Base | Phase 2 |
| EP-04 Quiz & Spaced Repetition | Phase 2 |
| EP-05 XP, Levels & Streaks | Phase 2 |
| EP-09 Statistics Dashboard | Phase 2 |
| EP-06 Achievement Badges | Phase 3 |
| EP-10 User Profile | Phase 3 |
| EP-11 Leaderboard | Phase 3 |
| EP-12 Instructor Dashboard | Phase 4 |
| EP-13 Offline Mode | Phase 5 |
| EP-14 Content Management | Phase 5 |
