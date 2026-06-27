# DiveLink Mobile — Screen Wireframes

ASCII wireframes for all major screens. Each frame simulates a 375 pt wide mobile viewport.

```
Legend
  [Button]   tappable button         [ ]  checkbox (unchecked)
  [___]      text input field         [x]  checkbox (checked)
  ▓▓▓        progress fill            ░░░  dimmed / empty track
  ●          active / selected         ○   inactive
  ⋮          overflow menu             ★   favourite (on)
  →          navigation / link         ↗   external link
  ✓          correct / signed-off      ✗   incorrect
```

---

## Navigation Overview

```
(auth) stack
  index  →  login  →  onboarding/certifications
                    →  onboarding/notifications
                    →  onboarding/carousel  →  (app)

(app) tab bar
  Home | Learn | Log | Profile | Instructor*
  (* only when authStore.identity.is_instructor === true)

Modals (overlay any tab)
  modal/achievement-unlock
  modal/level-up
  modal/photo-viewer
```

---

## 1. Auth Screens

### `(auth)/index` — Welcome / Splash

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│                                      │
│           ╔════════════╗             │
│           ║            ║             │
│           ║  ~><>  ~   ║             │
│           ║            ║             │
│           ╚════════════╝             │
│                                      │
│              DiveLink                │
│         Learn. Log. Dive.            │
│                                      │
│                                      │
│   ┌──────────────────────────────┐   │
│   │            Sign In           │   │
│   └──────────────────────────────┘   │
│                                      │
│       Create a dive-link account ↗   │
│                                      │
└──────────────────────────────────────┘
```

---

### `(auth)/login` — Sign In

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Back                              │
│                                      │
│  Sign In                             │
│  ────────────────────────────────    │
│                                      │
│  Email                               │
│  ┌──────────────────────────────┐   │
│  │  diver@example.com           │   │
│  └──────────────────────────────┘   │
│                                      │
│  Password                            │
│  ┌──────────────────────────────┐   │
│  │  ●●●●●●●●●●        [Show]   │   │
│  └──────────────────────────────┘   │
│                                      │
│  ! Invalid email or password         │  ← error state (hidden by default)
│                                      │
│  ┌──────────────────────────────┐   │
│  │            Sign In           │   │
│  └──────────────────────────────┘   │
│                                      │
│   Don't have an account? Register ↗  │
│                                      │
└──────────────────────────────────────┘
```

---

### `(auth)/onboarding/certifications` — CMAS Certifications Display

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Your CMAS Certifications            │
│  ────────────────────────────────    │
│  Here's what content unlocks for you │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  ★★   CMAS Open Water Diver  │   │
│  │       Issued: Jan 2023       │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  ★★★  CMAS Advanced Diver    │   │
│  │       Issued: Mar 2024       │   │
│  └──────────────────────────────┘   │
│                                      │
│  Advanced content is now unlocked.   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │          Continue →          │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

**Empty state (no active certifications):**
```
│  No certifications found yet.        │
│  You'll see content for all levels.  │
│  Once an instructor issues you a     │
│  certification on dive-link,         │
│  advanced content unlocks here.      │
```

---

### `(auth)/onboarding/notifications` — Notification Permission

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│        ╔══════════════════╗          │
│        ║  [notification]  ║          │
│        ║  DiveLink        ║          │
│        ║  Daily briefing  ║          │
│        ╚══════════════════╝          │
│                                      │
│  Stay Sharp Every Day                │
│  ────────────────────────────────    │
│                                      │
│  •  Daily briefing at your chosen    │
│     time — one Do, one Don't         │
│                                      │
│  •  Streak alerts so you never       │
│     lose your progress               │
│                                      │
│  ┌──────────────────────────────┐   │
│  │     Enable Notifications     │   │
│  └──────────────────────────────┘   │
│                                      │
│             Maybe later →            │
│                                      │
└──────────────────────────────────────┘
```

---

### `(auth)/onboarding/carousel` — Feature Walkthrough (Slide 2 of 4)

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ○ ● ○ ○                             │
│                                      │
│        ┌────────────────────┐        │
│        │  Quiz  XP   🔥     │        │
│        │  ▓▓▓▓▓▓▓░░░░░      │        │
│        │  Level 4 → 5       │        │
│        └────────────────────┘        │
│                                      │
│  Learn & Level Up                    │
│  ────────────────────────────────    │
│                                      │
│  Quiz yourself daily to earn XP      │
│  and track your in-app level.        │
│                                      │
│  XP levels are a fun in-app system   │
│  — separate from your CMAS certs.    │
│                                      │
│  ┌──────────────────────────────┐   │
│  │             Next →           │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

---

## 2. Home Screen

### `(tabs)/home` — Home

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Hi, Yosuke      🔥 12  [Lv.4 ▓▓░]  │
│                                      │
│  TODAY'S BRIEFING                    │
│  ┌──────────────────────────────┐   │
│  │  ✓ DO                        │   │
│  │    Signal your buddy before  │   │
│  │    surfacing                 │   │
│  ├──────────────────────────────┤   │
│  │  ✗ DON'T                     │   │
│  │    Skip your buddy check     │   │
│  │    when in a hurry           │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │        Quiz Yourself →       │   │
│  └──────────────────────────────┘   │
│                                      │
│  XP PROGRESS                         │
│  Lv.4  ▓▓▓▓▓▓▓▓░░░░  340/500  Lv.5  │
│                                      │
│  RECENT ACTIVITY                     │
│  Quiz · 4/5 · 2h ago     +50 XP      │
│  Dive · Blue Hole · Yesterday        │
│                                      │
├──────────────────────────────────────┤
│   ⌂    │  ◎    │  ⚓  │  👤  │  🎓  │
│  Home  │ Learn │  Log │ Prof │ Inst  │
└──────────────────────────────────────┘
```

---

## 3. Learn Screens

### `(tabs)/learn/index` — Learn Hub

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Learn                               │
│  ────────────────────────────────    │
│  [Quiz][Flashcards][Knowledge][Saved]│
│  ────────────────────────────────    │
│                                      │
│  OVERALL MASTERY                     │
│       ╔════════╗                     │
│       ║  63%   ║                     │
│       ╚════════╝                     │
│                                      │
│  🔥 12-day streak                    │
│                                      │
│  ┌──────────────────────────────┐   │
│  │    Start Daily Quiz (5 Qs)   │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │     Practice Weak Cards →    │   │
│  └──────────────────────────────┘   │
│                                      │
│  12 cards due today                  │
│                                      │
├──────────────────────────────────────┤
│   ⌂    │  ●    │  ⚓  │  👤  │  🎓  │
│  Home  │ Learn │  Log │ Prof │ Inst  │
└──────────────────────────────────────┘
```

---

### `(tabs)/learn/quiz/session` — Active Quiz

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ←            Question 2 of 5        │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  What does BWRAF stand for?  │   │
│  │                              │   │
│  │  Perform this check before   │   │
│  │  every dive with your buddy  │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  A)  Buoyancy, Weights,      │   │
│  │      Releases, Air, Final OK │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │  ← selected
│  │  B)  Breathing, Weights,     │   │
│  │      Releases, Air, Final OK │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  C)  Buoyancy, Wetsuit, ...  │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │           Submit →           │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

**After submit — correct answer revealed:**
```
│  ✓  Correct!                         │
│  ─────────────────────────────────   │
│  BWRAF = Buoyancy, Weights,          │
│  Releases, Air, Final OK.            │
│  It's a pre-dive safety check        │
│  performed with your buddy.          │
│                                      │
│  ┌──────────────────────────────┐   │
│  │             Next →           │   │
│  └──────────────────────────────┘   │
```

---

### `(tabs)/learn/quiz/results` — Quiz Results

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Quiz Complete!                      │
│  ────────────────────────────────    │
│                                      │
│            4 / 5                     │
│           ★★★★☆                      │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  +50 XP  ×1.2 streak bonus   │   │
│  │  = 60 XP earned              │   │
│  └──────────────────────────────┘   │
│                                      │
│  🔥 Streak: 12 days (kept!)          │
│                                      │
│  QUESTIONS                           │
│  ✓  What does BWRAF stand for?       │
│  ✓  Safe ascent rate is...           │
│  ✓  NDL stands for...                │
│  ✓  RDP uses which table?            │
│  ✗  Surface interval before flying   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │    Practice 1 Wrong Card →   │   │
│  └──────────────────────────────┘   │
│                                      │
│              Done →                  │
│                                      │
└──────────────────────────────────────┘
```

---

### `(tabs)/learn/flashcards/session` — Flashcard Session

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Flashcards              3 / 10   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │                              │   │
│  │   What is the maximum safe   │   │
│  │   ascent rate?               │   │
│  │                              │   │
│  │                              │   │
│  │         Tap to flip          │   │
│  │                              │   │
│  └──────────────────────────────┘   │
│                                      │
│  ← swipe to skip · tap to flip →    │
│                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │ Forgot │  │  Hard  │  │ Got it │ │
│  └────────┘  └────────┘  └────────┘ │
│                                      │
└──────────────────────────────────────┘
```

**Card flipped (answer side):**
```
│  ┌──────────────────────────────┐   │
│  │                              │   │
│  │   9 metres per minute        │   │
│  │   (18 m/min hard maximum)    │   │
│  │   ─────────────────────────  │   │
│  │   Fast ascents risk DCS.     │   │
│  │   Most computers warn at     │   │
│  │   9 m/min and alarm at 18.   │   │
│  └──────────────────────────────┘   │
```

---

### `(tabs)/learn/knowledge/index` — Knowledge Base

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Knowledge Base                      │
│  ┌──────────────────────────────┐   │
│  │  🔍  Search cards...         │   │
│  └──────────────────────────────┘   │
│                                      │
│  [All] [Safety] [Physiology]         │
│  [Equipment] [Environment] [★ Saved] │
│                                      │
│  Cert tier: ★★ (Advanced)  [Change]  │
│                                      │
│  ┌────────────────┐  ┌─────────────┐ │
│  │  Safety        │  │ Physiology  │ │
│  │  42 cards      │  │  28 cards   │ │
│  │  ▓▓▓▓▓░  68%  │  │ ▓▓░░░  41% │ │
│  └────────────────┘  └─────────────┘ │
│  ┌────────────────┐  ┌─────────────┐ │
│  │  Equipment     │  │ Environment │ │
│  │  35 cards      │  │  19 cards   │ │
│  │  ▓▓▓▓░  55%   │  │ ▓▓▓▓▓  80% │ │
│  └────────────────┘  └─────────────┘ │
│                                      │
├──────────────────────────────────────┤
│   ⌂    │  ●    │  ⚓  │  👤  │  🎓  │
└──────────────────────────────────────┘
```

---

### `(tabs)/learn/knowledge/[category]` — Category Card List

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Safety                 42 cards  │
│  ────────────────────────────────    │
│  [All] [DO] [DON'T] [Mastered]       │
│  [Not mastered]                      │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  [DO]  Signal before surface │   │
│  │        ▓▓▓▓▓▓▓▓░░  90%   ★  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ [DON'T]  Skip buddy check    │   │
│  │          ▓▓░░░░░░░░  40%  ☆  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  [DO]  Perform safety stop   │   │
│  │        ▓▓▓▓▓░░░░░  60%   ★  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │ [DON'T]  Hold breath on      │   │
│  │          ascent              │   │
│  │          ▓░░░░░░░░░  20%  ☆  │   │
│  └──────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│   ⌂    │  ●    │  ⚓  │  👤  │  🎓  │
└──────────────────────────────────────┘
```

---

### `(tabs)/learn/knowledge/card/[id]` — Card Detail

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Safety                         ★ │
│                                      │
│  ╔══╗  [Safety]  [Tier 1+]           │
│  ║DO║                                │
│  ╚══╝                                │
│                                      │
│  Always signal your buddy            │
│  before surfacing                    │
│  ────────────────────────────────    │
│                                      │
│  Never ascend alone or without       │
│  alerting your buddy. Maintain       │
│  visual or physical contact.         │
│                                      │
│  WHY?                                │
│  ────────────────────────────────    │
│  Separation during ascent is one of  │
│  the leading causes of DCS and       │
│  near-miss incidents. A shared       │
│  ascent allows immediate assistance  │
│  if something goes wrong.            │
│                                      │
│  Mastery:  ▓▓▓▓▓░░░░░   50%          │
│                                      │
│  ┌──────────────────────────────┐   │
│  │      Quiz Me on This →       │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

---

## 4. Log Screens

### `(tabs)/log/index` — Dive Log List

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Dive Log              48 dives      │
│  ┌──────────────────────────────┐   │
│  │  🔍  Search dives...         │   │
│  └──────────────────────────────┘   │
│  [All]  [This month]  [By site]      │
│                                      │
│  JUNE 2026                           │
│  ┌──────────────────────────────┐   │
│  │  Blue Hole, Dahab            │   │
│  │  Jun 24 · 32 m · 56 min      │   │
│  │  Buddy: Maria                │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Thistlegorm Wreck           │   │
│  │  Jun 20 · 28 m · 48 min      │   │
│  │  Buddy: Ahmed                │   │
│  └──────────────────────────────┘   │
│                                      │
│  MAY 2026                            │
│  ┌──────────────────────────────┐   │
│  │  Ras Mohamed Reef            │   │
│  │  May 15 · 22 m · 44 min      │   │
│  └──────────────────────────────┘   │
│                              ┌───┐   │
│                              │ + │   │
│                              └───┘   │
├──────────────────────────────────────┤
│   ⌂    │  ◎    │  ●  │  👤  │  🎓  │
│  Home  │ Learn │ Log │ Prof │ Inst  │
└──────────────────────────────────────┘
```

---

### `(tabs)/log/new/checklist` — BWRAF Checklist

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Pre-Dive Check        3/5  ▓▓▓░░ │
│  BWRAF Buddy Check                   │
│  ────────────────────────────────    │
│                                      │
│  [x]  B — Buoyancy                   │
│       [x]  BCD inflates & deflates   │
│       [x]  Weight correct for site   │
│                                      │
│  [x]  W — Weights                    │
│       [x]  Weight belt / pockets     │
│       [x]  Quick-release checked     │
│                                      │
│  [ ]  R — Releases       ← current  │
│       [ ]  All buckles accessible    │
│       [ ]  Buddy can release them    │
│                                      │
│  [ ]  A — Air                        │
│       [ ]  Tank valve fully open     │
│       [ ]  Air supply adequate       │
│                                      │
│  [ ]  F — Final OK                   │
│       [ ]  Masks cleared, fins on    │
│       [ ]  Signals agreed            │
│                                      │
│  +20 XP for completing buddy check   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Complete & Start Dive Log   │   │  ← disabled until all checked
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

---

### `(tabs)/log/new/form` — New Dive Form

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← New Dive                          │
│  ────────────────────────────────    │
│                                      │
│  LOCATION                            │
│  ┌──────────────────────────────┐   │
│  │  Site name...                │   │
│  └──────────────────────────────┘   │
│  Date:  [ 27 Jun 2026           ▼ ] │
│                                      │
│  DEPTH & TIME                        │
│  Max depth [____] m   Duration [__] min│
│                                      │
│  BUDDY                               │
│  ┌──────────────────────────────┐   │
│  │  Buddy name (optional)       │   │
│  └──────────────────────────────┘   │
│                                      │
│  EQUIPMENT                           │
│  Start [___] bar    End [___] bar    │
│                                      │
│  CONDITIONS                          │
│  Temp [__] °C    Visibility [__] m   │
│  [ ] Night dive                      │
│                                      │
│  NOTES & PHOTOS                      │
│  ┌──────────────────────────────┐   │
│  │  Notes...                    │   │
│  └──────────────────────────────┘   │
│  [+ Photo]  (up to 5)                │
│                                      │
│  ┌──────────────────────────────┐   │
│  │           Save Dive          │   │
│  └──────────────────────────────┘   │
│            [ Save Draft ]            │
└──────────────────────────────────────┘
```

---

### `(tabs)/log/[id]/index` — Dive Detail

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Dive Log                       ⋮ │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  [photo 1]  [photo 2]  [+1]  │   │
│  └──────────────────────────────┘   │
│                                      │
│  Blue Hole, Dahab                    │
│  24 June 2026                        │
│  ────────────────────────────────    │
│                                      │
│  Depth            32 m               │
│  Duration         56 min             │
│  Buddy            Maria S.           │
│  Start pressure   200 bar            │
│  End pressure     60 bar             │
│  Water temp       26 °C              │
│  Visibility       15 m               │
│  Night dive       No                 │
│                                      │
│  NOTES                               │
│  Spotted a school of barracuda       │
│  near the arch at 28 m.              │
│                                      │
│  ┌──────────────────────────────┐   │
│  │       Share This Dive →      │   │
│  └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

---

## 5. Profile Screens

### `(tabs)/profile/index` — Profile Hub

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Profile                          ⚙ │
│  ────────────────────────────────    │
│                                      │
│  [avatar]  Yosuke Tanaka             │
│            yosukelight@me.com        │
│                                      │
│  CMAS CERTIFICATIONS  (dive-link) ↗  │
│  ┌──────────────────────────────┐   │
│  │  ★★   CMAS Open Water Diver  │   │
│  │  ★★★  CMAS Advanced Diver    │   │
│  │        Manage on dive-link ↗  │   │
│  └──────────────────────────────┘   │
│                                      │
│  IN-APP PROGRESS                     │
│  Level 4 · Explorer                  │
│  ▓▓▓▓▓▓▓▓░░░░░  340 / 500 XP        │
│                                      │
│  🔥 12 days streak  ·  48 dives      │
│                                      │
│  [ Badges → ]  [ Stats → ]           │
│                                      │
├──────────────────────────────────────┤
│   ⌂    │  ◎    │  ⚓  │  ●  │  🎓  │
│  Home  │ Learn │ Log │ Prof │ Inst  │
└──────────────────────────────────────┘
```

---

### `(tabs)/profile/edit` — Edit App Profile

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Edit Profile                      │
│  ────────────────────────────────    │
│                                      │
│  AVATAR                              │
│        [avatar]   [Change Photo]     │
│                                      │
│  HOME DIVE CLUB                      │
│  ┌──────────────────────────────┐   │
│  │  Red Sea Divers, Dahab       │   │
│  └──────────────────────────────┘   │
│                                      │
│  ────────────────────────────────    │
│  FROM DIVE-LINK  (read-only)         │
│  ────────────────────────────────    │
│                                      │
│  Display name    Yosuke Tanaka       │
│  Email           yosukelight@me.com  │
│  Role            Diver               │
│                                      │
│  Edit on dive-link ↗                 │
│                                      │
│  ┌──────────────────────────────┐   │
│  │          Save Changes        │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

---

### `(tabs)/profile/badges` — Badge Gallery

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Badges                12 earned  │
│                                      │
│  EARNED                              │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │  [★]   │  │  [🔥]  │  │  [⚓]  │ │
│  │First Q.│  │7-Streak│  │10 Dives│ │
│  └────────┘  └────────┘  └────────┘ │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │  [📚]  │  │  [🌊]  │  │  [🏆]  │ │
│  │50 Cards│  │Night Q.│  │Top 10% │ │
│  └────────┘  └────────┘  └────────┘ │
│                                      │
│  IN PROGRESS                         │
│  ┌──────────────────────────────┐   │
│  │  [◑]  30-Day Streak          │   │
│  │        ▓▓▓▓▓▓░░░░░  12/30   │   │
│  └──────────────────────────────┘   │
│                                      │
│  LOCKED                              │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │ [░░░░] │  │ [░░░░] │  │ [░░░░] │ │
│  │  ???   │  │  ???   │  │  ???   │ │
│  └────────┘  └────────┘  └────────┘ │
│                                      │
└──────────────────────────────────────┘
```

---

### `(tabs)/profile/stats` — Statistics Dashboard

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Statistics                        │
│  ────────────────────────────────    │
│                                      │
│  48 dives │ 44h total │ 32m deepest  │
│  Top site: Blue Hole, Dahab          │
│                                      │
│  DIVES PER MONTH (2026)              │
│      │  ▓                            │
│    8 │  ▓  ▓                         │
│    4 │  ▓  ▓  ▓  ▓  ▓  ▓            │
│      └─────────────────────          │
│       J  F  M  A  M  J              │
│                                      │
│  KNOWLEDGE MASTERY BY CATEGORY       │
│  Safety       ▓▓▓▓▓▓▓░░░  68%       │
│  Physiology   ▓▓▓▓░░░░░░  41%       │
│  Equipment    ▓▓▓▓▓░░░░░  55%       │
│  Environment  ▓▓▓▓▓▓▓▓░░  80%       │
│                                      │
│  ACTIVITY (last 4 weeks)             │
│  ░▓░░▓▓░░▓░░░▓▓░░▓░░▓▓░░░▓░░        │
│  ░░▓░░▓░░░▓▓░░▓░░░▓░░░▓░░░░          │
│                                      │
└──────────────────────────────────────┘
```

---

### `(tabs)/profile/settings` — Settings

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Settings                          │
│  ────────────────────────────────    │
│                                      │
│  NOTIFICATIONS                       │
│  Daily reminder    08:00 AM  [Edit]  │
│  Streak alerts     [ ON  ● ]         │
│                                      │
│  UNITS                               │
│  (●) Metric    ( ) Imperial          │
│                                      │
│  LEADERBOARD                         │
│  Show my score  [ OFF  ○ ]           │
│                                      │
│  ACCOUNT                             │
│  Delete account...                   │
│                                      │
│  ────────────────────────────────    │
│                                      │
│  ┌──────────────────────────────┐   │
│  │            Log Out           │   │
│  └──────────────────────────────┘   │
│                                      │
│  DiveLink v1.0.0                     │
│                                      │
└──────────────────────────────────────┘
```

---

## 6. Instructor Screens

### `(tabs)/instructor/index` — Instructor Learning Dashboard

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  Learning Dashboard                  │
│  ────────────────────────────────    │
│                                      │
│  ┌──────────────────────────────┐   │
│  │          + New Group         │   │
│  └──────────────────────────────┘   │
│                                      │
│  MY GROUPS                           │
│  ┌──────────────────────────────┐   │
│  │  Advanced Open Water         │   │
│  │  6 students · Avg 58%        │   │
│  │  Last active: today          │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Rescue Prep                 │   │
│  │  4 students · Avg 71%        │   │
│  │  Last active: 3 days ago     │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Open Water Intro            │   │
│  │  8 students · Avg 34%        │   │
│  │  Last active: 1 week ago     │   │
│  └──────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│   ⌂    │  ◎    │  ⚓  │  👤  │  ●  │
│  Home  │ Learn │ Log │ Prof │ Inst  │
└──────────────────────────────────────┘
```

---

### `(tabs)/instructor/groups/[id]/index` — Group Detail

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Advanced Open Water            ⋮ │
│  6 students · Avg mastery 58%        │
│  ────────────────────────────────    │
│  [Students]  [Assignments]  [Notify] │
│  ────────────────────────────────    │
│                                      │
│  + Invite student (by email)         │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  Maria S.  · Active today    │   │
│  │  Mastery 74%  · 3 sessions/wk│   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Ahmed K.  · Active 2d ago   │   │
│  │  Mastery 51%  · 2 sessions/wk│   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Chen W.   · Active 5d ago   │   │
│  │  Mastery 43%  · 1 session/wk │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Sofia R.  · Active today    │   │
│  │  Mastery 69%  · 4 sessions/wk│   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

---

### `(tabs)/instructor/students/[id]/index` — Student Detail

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Maria S.                          │
│                                      │
│       ╔══════════╗                   │
│       ║   74%    ║  Overall mastery  │
│       ╚══════════╝                   │
│                                      │
│  MASTERY BY CATEGORY                 │
│  Safety       ▓▓▓▓▓▓▓▓░░  82%       │
│  Physiology   ▓▓▓▓▓▓░░░░  63%       │
│  Equipment    ▓▓▓▓▓▓▓░░░  74%       │
│  Environment  ▓▓▓▓▓▓▓▓▓░  90%       │
│                                      │
│  RECENT QUIZ SESSIONS                │
│  Jun 26   5/5   +60 XP               │
│  Jun 25   4/5   +50 XP               │
│  Jun 23   3/5   +30 XP               │
│                                      │
│  ASSIGNED MODULES                    │
│  Deep Diving Theory  ▓▓▓░░  60%      │
│                                      │
│  ┌───────────┐  ┌─────────────────┐  │
│  │  Assign   │  │  Send Reminder  │  │
│  └───────────┘  └─────────────────┘  │
│  ┌──────────────────────────────┐   │
│  │      Practice Sign-Off →     │   │
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

---

### `(tabs)/instructor/students/[id]/practice-signoff` — Practice Sign-Off

```
┌──────────────────────────────────────┐
│ 9:41 AM                  ●● WiFi ▓  │
├──────────────────────────────────────┤
│                                      │
│  ← Practice Milestone Record         │
│  ────────────────────────────────    │
│  These are informal practice records.│
│  CMAS certifications are issued      │
│  via dive-link.                      │
│  ────────────────────────────────    │
│                                      │
│  Student: Maria S.                   │
│                                      │
│  BUOYANCY SKILLS                     │
│  ┌──────────────────────────────┐   │
│  │  Neutral buoyancy hover   ✓  │   │
│  │  Jun 24 · You               │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Weight adjustment at depth  │   │  ← tap to sign off
│  └──────────────────────────────┘   │
│                                      │
│  EMERGENCY SKILLS                    │
│  ┌──────────────────────────────┐   │
│  │  Mask clearing practised  ✓  │   │
│  │  Jun 26 · You               │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Emergency ascent reviewed   │   │  ← tap to sign off
│  └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

**Tap-to-confirm dialog:**
```
  ┌────────────────────────────────┐
  │  Record that Maria S.          │
  │  practised                     │
  │  "Weight adjustment at depth"? │
  │                                │
  │  [Cancel]        [Confirm]     │
  └────────────────────────────────┘
```

---

## 7. Modals

### `modal/achievement-unlock` — Achievement Unlock

```
┌──────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░  ╔══════════════════════════╗ ░░ │
│ ░░░  ║                          ║ ░░ │
│ ░░░  ║   ACHIEVEMENT UNLOCKED   ║ ░░ │
│ ░░░  ║                          ║ ░░ │
│ ░░░  ║         [ 🔥 ]           ║ ░░ │
│ ░░░  ║                          ║ ░░ │
│ ░░░  ║      7-Day Streak        ║ ░░ │
│ ░░░  ║   You earned 100 XP!     ║ ░░ │
│ ░░░  ║                          ║ ░░ │
│ ░░░  ║  You've kept your        ║ ░░ │
│ ░░░  ║  streak for 7 days in    ║ ░░ │
│ ░░░  ║  a row. Keep it up!      ║ ░░ │
│ ░░░  ║                          ║ ░░ │
│ ░░░  ║  ┌──────────────────┐    ║ ░░ │
│ ░░░  ║  │    Awesome!      │    ║ ░░ │
│ ░░░  ║  └──────────────────┘    ║ ░░ │
│ ░░░  ╚══════════════════════════╝ ░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└──────────────────────────────────────┘
```

---

### `modal/level-up` — In-App Level Up

```
┌──────────────────────────────────────┐
│        ✦      ✦   ✦      ✦    ✦     │  ← confetti
│   ✦       ✦             ✦           │
│       ✦         ✦   ✦               │
│  ╔════════════════════════════════╗  │
│  ║                                ║  │
│  ║     IN-APP LEVEL UP!           ║  │
│  ║                                ║  │
│  ║   Level 5 · Explorer           ║  │
│  ║          ↓                     ║  │
│  ║   Level 6 · Advanced Diver     ║  │
│  ║                                ║  │
│  ║  You're now an                 ║  │
│  ║  Advanced Diver! (in-app)      ║  │
│  ║                                ║  │
│  ║  Total XP: 500                 ║  │
│  ║                                ║  │
│  ║  ┌────────────────────────┐    ║  │
│  ║  │     Keep Diving →      │    ║  │
│  ║  └────────────────────────┘    ║  │
│  ║                                ║  │
│  ╚════════════════════════════════╝  │
└──────────────────────────────────────┘
```

---

## Tab Bar States

**Standard user (diver):**
```
┌──────┬────────┬──────┬──────────┐
│  ⌂   │   ◎   │  ⚓  │    👤   │
│ Home │ Learn  │  Log │ Profile  │
└──────┴────────┴──────┴──────────┘
```

**Instructor (`is_instructor === true` from dive-link):**
```
┌──────┬───────┬──────┬──────┬──────┐
│  ⌂  │  ◎   │  ⚓  │  👤  │  🎓 │
│Home │ Learn │  Log │ Prof │ Inst │
└──────┴───────┴──────┴──────┴──────┘
```

> The Instructor tab appears only when `authStore.identity.is_instructor === true`,
> which is derived from the user having at least one active instructor-grade CMAS
> certification in dive-link. It is never determined by a local role value.
