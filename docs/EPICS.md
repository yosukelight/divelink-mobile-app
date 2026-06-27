# DiveLink — Epics

Each epic maps to a product capability. Stories are tracked in USER_STORIES.md.

> **Architecture note:** This app uses two backends. User identity, certifications, and instructor credentials come from the **dive-link REST API** (the authoritative CMAS platform). App-specific data (dive logs, quiz progress, gamification state) lives in **Supabase**. Epics that touch identity or credentials delegate to dive-link; epics that are native to this app own their data in Supabase.

---

## EP-01 · Authentication & Onboarding

Get a user from zero to a personalized, ready-to-use account.

**Scope**
- Sign in via dive-link REST API (`POST /api/v1/auth/login`); access token stored in memory, refresh token stored in Expo SecureStore (native equivalent of HttpOnly cookie)
- No separate sign-up flow in this app — accounts are created on dive-link (or the dive-link web app); this app authenticates existing dive-link accounts
- On session start: fetch user identity and certifications from dive-link; derive `is_instructor` flag from active instructor-grade certifications
- Notification permission request
- Onboarding carousel (what the app does, how streaks work, how XP levels differ from CMAS certifications)

**What is NOT in scope:** creating a parallel Supabase Auth account or storing a local `role` / `cert_level` — these are read from the dive-link API every session.

**Exit criteria:** A user with an existing dive-link account can sign in, and the app displays their real CMAS certifications alongside their gamification state on the Home screen.

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
- Filter by CMAS cert tier (0–3, derived from the user's highest active certification fetched from dive-link)
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
- Content gated by CMAS cert tier (fetched from dive-link, not a locally-stored enum)

**Exit criteria:** A diver can complete a daily quiz, see which answers were wrong with explanations, and the system schedules those cards sooner next time.

---

## EP-05 · XP, Levels & Streaks

The core gamification loop that keeps divers coming back daily.

**Scope**
- XP awarded for all learning and logging actions
- Level system with named tiers (in-app motivational construct, independent of CMAS certification levels)
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

**Note:** Dive logging is explicitly out of scope for dive-link (which is a certification and federation management system, not a dive logging app). Dive logs are owned entirely by this app's Supabase database.

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
- Cert-tier breakdown of quiz mastery

**Exit criteria:** The stats screen renders accurate aggregates that update after each new dive log or quiz session.

---

## EP-10 · User Profile

Personal identity and progress hub.

**Scope**
- Avatar (stored in Supabase Storage; URL cached locally)
- Display name and CMAS certifications fetched from dive-link API (read-only in this app — edits happen on dive-link)
- Current in-app level + XP bar to next level (from Supabase)
- Current streak (from Supabase)
- Badge gallery (EP-06)
- Link to dive log and stats
- Settings: notification time, privacy (leaderboard opt-in), units (metric/imperial)

**Data source split:**
- Identity and certifications → dive-link API (read-only)
- XP, level, streak, badges, preferences → Supabase (owned by this app)

**Exit criteria:** A diver's profile shows their real CMAS certifications alongside their in-app level, XP, streak, and badges; settings are persisted in Supabase.

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

## EP-12 · Instructor Learning Dashboard

Tools for instructors to manage student learning progress within this app. This is a **learning management** feature, not a credentialing feature — formal CMAS certification issuance is handled exclusively by dive-link.

**Scope**
- Access gated on the user having at least one active instructor-grade CMAS certification, verified via dive-link API on session start
- Create and name informal student learning groups (app-level grouping, not a CMAS instructor–diver federation relationship)
- Add students by email or invite link
- View per-student: quiz completion %, knowledge mastery %, last active date
- Assign knowledge base categories (quiz sets) with optional due dates
- Send targeted push notification to a student or whole group
- Track informal practice milestone sign-offs (e.g., "mask clearing practiced") — these are recorded in this app's Supabase database and carry no CMAS authority. They are not certifications and should not be presented as such.
- Export student quiz progress (CSV)

**What is NOT in scope:** Issuing, approving, or revoking CMAS certifications — those actions belong to dive-link.

**Exit criteria:** An instructor (verified via dive-link) can add students, assign a learning module, track their quiz scores, and send a push reminder. Students see their assigned modules and practice sign-offs on their profile.

---

## EP-13 · Offline Mode

Core features work without an internet connection.

**Scope**
- Quiz questions and knowledge cards cached locally with MMKV
- Dive log drafts saved locally and synced on reconnect
- Offline badge: visual indicator when in offline mode
- Sync conflict resolution (last-write-wins for logs)
- dive-link API calls (identity, certifications) require connectivity; cached values used when offline

**Exit criteria:** A diver can complete a quiz and log a dive while offline; data syncs automatically when connectivity resumes.

---

## EP-14 · Content Management (Internal)

Admin tooling to maintain the knowledge base and quiz bank.

**Scope**
- Supabase dashboard seeding scripts
- JSON schema for knowledge cards and quiz questions
- Cert-tier tagging (0–3) and category taxonomy
- Versioned content releases (so OTA app updates aren't required for new cards)

**Exit criteria:** New knowledge cards and quiz questions can be added to the Supabase database without a new app release.

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
| EP-12 Instructor Learning Dashboard | Phase 4 |
| EP-13 Offline Mode | Phase 5 |
| EP-14 Content Management | Phase 5 |
