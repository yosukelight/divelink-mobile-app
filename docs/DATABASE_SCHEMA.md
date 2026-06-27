# DiveLink — Database Schema

Backend: Supabase (PostgreSQL 15). All tables use UUIDs and `created_at` / `updated_at` timestamps. Row-Level Security (RLS) is enabled on every user-data table.

## Scope boundary

This schema stores only data that is **native to this app** — dive logs, gamification state, quiz progress, and knowledge content. It does not replicate:

- User identity (name, email, CMAS membership number) → read from the dive-link REST API on session start
- CMAS certification records → read from the dive-link REST API; referenced here only as a foreign key value (`divelink_user_id`)
- Instructor/diver role → derived from the dive-link JWT payload (`roles` claim) on each session
- Formal instructor–diver certification relationships → managed by dive-link; out of scope here

The primary key in the `profiles` table (`id`) equals the dive-link user UUID from the JWT `sub` claim, creating an implicit foreign key into the dive-link identity system without duplicating identity data.

---

## Enums

```sql
-- cert_level and user_role enums are intentionally absent.
-- Role and certification data come from the dive-link API and are
-- not stored in this database to avoid duplication.

CREATE TYPE card_type AS ENUM ('do', 'dont');

CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');

CREATE TYPE unit_preference AS ENUM ('metric', 'imperial');

CREATE TYPE sync_status AS ENUM ('synced', 'pending', 'conflict');

CREATE TYPE achievement_trigger_type AS ENUM (
  'dive_count',
  'streak_days',
  'quiz_perfect_week',
  'buddy_dive_count',
  'night_dive',
  'depth_threshold',
  'checklist_count',
  'card_mastery_count',
  'module_completion'
);
```

---

## Core Tables

### `profiles`
App-specific state for each user. `id` equals the dive-link user UUID (from JWT `sub`). Identity
fields (display name, email, certification level, role) are NOT stored here — they are fetched
from the dive-link API on each authenticated session and held in the `authStore` in memory only.

```sql
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY,   -- dive-link user UUID; not an FK to auth.users
  xp                  INTEGER NOT NULL DEFAULT 0,
  level               INTEGER NOT NULL DEFAULT 0,
  streak_days         INTEGER NOT NULL DEFAULT 0,
  streak_last_active  DATE,
  total_dives         INTEGER NOT NULL DEFAULT 0,
  unit_pref           unit_preference NOT NULL DEFAULT 'metric',
  leaderboard_opt_in  BOOLEAN NOT NULL DEFAULT FALSE,
  notif_time          TIME NOT NULL DEFAULT '08:00:00',
  expo_push_token     TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: row is owned by the dive-link user whose UUID matches the JWT sub claim.
-- Supabase auth.uid() is configured to return the dive-link UUID via a custom JWT secret.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Instructor reads student profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_groups
      WHERE instructor_id = auth.uid() AND student_id = profiles.id
    )
  );
```

---

### `dive_logs`

```sql
CREATE TABLE dive_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  site_name           TEXT NOT NULL,
  dive_date           DATE NOT NULL,
  max_depth_m         NUMERIC(5,1) NOT NULL,
  duration_min        INTEGER NOT NULL,
  buddy_name          TEXT,
  start_pressure_bar  NUMERIC(5,1),
  end_pressure_bar    NUMERIC(5,1),
  water_temp_c        NUMERIC(4,1),
  visibility_m        NUMERIC(4,1),
  is_night_dive       BOOLEAN NOT NULL DEFAULT FALSE,
  notes               TEXT,
  photo_urls          TEXT[] NOT NULL DEFAULT '{}',
  checklist_completed BOOLEAN NOT NULL DEFAULT FALSE,
  sync_status         sync_status NOT NULL DEFAULT 'synced',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dive_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own dive logs" ON dive_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Instructor reads student logs" ON dive_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_groups
      WHERE instructor_id = auth.uid() AND student_id = dive_logs.user_id
    )
  );
```

---

### `dive_sites`
Shared lookup table, not user-scoped.

```sql
CREATE TABLE dive_sites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  country     TEXT,
  region      TEXT,
  lat         NUMERIC(9,6),
  lng         NUMERIC(9,6),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dive_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON dive_sites FOR SELECT USING (TRUE);
```

---

## Knowledge & Learning Tables

### `knowledge_cards`
Seeded content — not user-created.

`min_cert_tier` is a simplified numeric tier (0=any, 1=1-star, 2=2-star, 3=3-star) that maps to
CMAS star ratings. The mapping from a user's dive-link CertificationLevel to a tier number is
maintained in `data/cert-levels.ts` in the app.

```sql
CREATE TABLE knowledge_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            card_type NOT NULL,
  category        TEXT NOT NULL,
  min_cert_tier   SMALLINT NOT NULL DEFAULT 0,   -- 0=any, 1=1-star, 2=2-star, 3=3-star
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  explanation     TEXT NOT NULL,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_cert_tier CHECK (min_cert_tier BETWEEN 0 AND 3)
);

ALTER TABLE knowledge_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active cards" ON knowledge_cards
  FOR SELECT USING (is_active = TRUE);
```

---

### `quiz_questions`

```sql
CREATE TABLE quiz_questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id         UUID REFERENCES knowledge_cards(id) ON DELETE SET NULL,
  question        TEXT NOT NULL,
  options         TEXT[] NOT NULL,      -- exactly 4 elements
  correct_index   SMALLINT NOT NULL,    -- 0-3
  explanation     TEXT NOT NULL,
  difficulty      difficulty NOT NULL DEFAULT 'medium',
  min_cert_tier   SMALLINT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT options_length CHECK (array_length(options, 1) = 4),
  CONSTRAINT valid_correct_index CHECK (correct_index BETWEEN 0 AND 3),
  CONSTRAINT valid_cert_tier CHECK (min_cert_tier BETWEEN 0 AND 3)
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active questions" ON quiz_questions
  FOR SELECT USING (is_active = TRUE);
```

---

### `user_card_progress`
Spaced repetition state per user per card.

```sql
CREATE TABLE user_card_progress (
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id         UUID NOT NULL REFERENCES knowledge_cards(id) ON DELETE CASCADE,
  times_seen      INTEGER NOT NULL DEFAULT 0,
  times_correct   INTEGER NOT NULL DEFAULT 0,
  ease_factor     NUMERIC(4,2) NOT NULL DEFAULT 2.5,   -- SM-2
  interval_days   INTEGER NOT NULL DEFAULT 0,
  next_review     DATE NOT NULL DEFAULT CURRENT_DATE,
  last_seen       TIMESTAMPTZ,
  PRIMARY KEY (user_id, card_id)
);

ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own progress" ON user_card_progress
  FOR ALL USING (auth.uid() = user_id);
```

---

### `quiz_sessions`
One row per completed quiz session.

```sql
CREATE TABLE quiz_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  questions_total SMALLINT NOT NULL,
  questions_correct SMALLINT NOT NULL,
  xp_earned       INTEGER NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own sessions" ON quiz_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Instructor reads student sessions" ON quiz_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_groups
      WHERE instructor_id = auth.uid() AND student_id = quiz_sessions.user_id
    )
  );
```

---

### `quiz_answers`
Individual answer records per session.

```sql
CREATE TABLE quiz_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_index  SMALLINT NOT NULL,
  is_correct      BOOLEAN NOT NULL,
  answered_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own answers" ON quiz_answers
  FOR ALL USING (auth.uid() = user_id);
```

---

### `user_card_favourites`

```sql
CREATE TABLE user_card_favourites (
  user_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id   UUID NOT NULL REFERENCES knowledge_cards(id) ON DELETE CASCADE,
  saved_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, card_id)
);

ALTER TABLE user_card_favourites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own favourites" ON user_card_favourites
  FOR ALL USING (auth.uid() = user_id);
```

---

## Gamification Tables

### `achievements`
Static seed table — definition of every possible badge.

```sql
CREATE TABLE achievements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,   -- e.g. 'first_descent'
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  icon_name       TEXT NOT NULL,          -- maps to local asset
  xp_reward       INTEGER NOT NULL DEFAULT 50,
  trigger_type    achievement_trigger_type NOT NULL,
  trigger_value   INTEGER,               -- threshold for count-based triggers
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON achievements FOR SELECT USING (TRUE);
```

---

### `user_achievements`

```sql
CREATE TABLE user_achievements (
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id  UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own achievements" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);
```

---

### `xp_events`
Audit log of every XP transaction.

```sql
CREATE TABLE xp_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source      TEXT NOT NULL,       -- 'quiz', 'dive_log', 'checklist', 'achievement', 'module'
  source_id   UUID,                -- FK to the source record if applicable
  xp_delta    INTEGER NOT NULL,
  multiplier  NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own XP events" ON xp_events
  FOR ALL USING (auth.uid() = user_id);
```

---

## Instructor Learning Tables

These tables support the in-app learning management features (EP-12). They represent informal
practice groupings and are explicitly **not** a replacement for the formal instructor–diver
certification relationships managed by dive-link. Instructor access to these tables is gated
at the application layer by verifying an active instructor-grade CMAS certification via the
dive-link API on session start.

### `learning_groups`
(Previously `student_enrollments` — renamed to make the informal nature explicit.)

```sql
CREATE TABLE learning_groups (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_name      TEXT,
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (instructor_id, student_id)
);

ALTER TABLE learning_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor manages groups" ON learning_groups
  FOR ALL USING (auth.uid() = instructor_id);
CREATE POLICY "Student sees own enrollment" ON learning_groups
  FOR SELECT USING (auth.uid() = student_id);
```

---

### `learning_assignments`
(Previously `instructor_assignments`.)

```sql
CREATE TABLE learning_assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,   -- NULL = whole group
  group_name      TEXT,
  category        TEXT NOT NULL,    -- knowledge base category name
  due_date        DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE learning_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor manages assignments" ON learning_assignments
  FOR ALL USING (auth.uid() = instructor_id);
CREATE POLICY "Student sees own assignments" ON learning_assignments
  FOR SELECT USING (auth.uid() = student_id OR (
    group_name IS NOT NULL AND EXISTS (
      SELECT 1 FROM learning_groups
      WHERE instructor_id = learning_assignments.instructor_id
        AND student_id = auth.uid()
        AND group_name = learning_assignments.group_name
    )
  ));
```

---

### `assignment_completions`

```sql
CREATE TABLE assignment_completions (
  assignment_id   UUID NOT NULL REFERENCES learning_assignments(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  mastery_pct     NUMERIC(5,2),
  PRIMARY KEY (assignment_id, student_id)
);

ALTER TABLE assignment_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student manages own completions" ON assignment_completions
  FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Instructor reads student completions" ON assignment_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM learning_assignments la
      WHERE la.id = assignment_completions.assignment_id
        AND la.instructor_id = auth.uid()
    )
  );
```

---

### `practice_signoffs`
(Previously `skill_signoffs` — renamed and scoped to make it clear these are informal.)

Records an instructor's acknowledgment that a student has practised a specific skill in the
app context. These carry **no CMAS authority** and must not be presented to the student as a
CMAS certification or formal qualification. Formal CMAS certifications are issued exclusively
via dive-link by an authorized instructor through the federation approval workflow.

```sql
CREATE TABLE practice_signoffs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_slug      TEXT NOT NULL,   -- e.g. 'mask_clearing', 'emergency_ascent'
  notes           TEXT,
  signed_off_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (instructor_id, student_id, skill_slug)
);

ALTER TABLE practice_signoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor creates signoffs" ON practice_signoffs
  FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructor reads own signoffs" ON practice_signoffs
  FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "Student reads own signoffs" ON practice_signoffs
  FOR SELECT USING (auth.uid() = student_id);
```

---

### `instructor_notifications`
Log of push messages sent by instructors.

```sql
CREATE TABLE instructor_notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,  -- NULL = group
  group_name      TEXT,
  body            TEXT NOT NULL,
  cta_type        TEXT,   -- 'quiz' | 'checklist' | 'module:<category>'
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructor_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor manages notifications" ON instructor_notifications
  FOR ALL USING (auth.uid() = instructor_id);
```

---

## Views & RPCs

### View: `daily_briefing_cards`
Selects today's Do and Don't, rotating by day-of-year modulo category count.

```sql
CREATE OR REPLACE VIEW daily_briefing_cards AS
SELECT
  type,
  id,
  category,
  title,
  body,
  explanation
FROM knowledge_cards
WHERE is_active = TRUE
  AND (
    (type = 'do'   AND id = (SELECT id FROM knowledge_cards WHERE type = 'do'   AND is_active = TRUE ORDER BY id LIMIT 1 OFFSET (EXTRACT(DOY FROM CURRENT_DATE)::INT % (SELECT COUNT(*) FROM knowledge_cards WHERE type = 'do' AND is_active = TRUE))))
    OR
    (type = 'dont' AND id = (SELECT id FROM knowledge_cards WHERE type = 'dont' AND is_active = TRUE ORDER BY id LIMIT 1 OFFSET (EXTRACT(DOY FROM CURRENT_DATE)::INT % (SELECT COUNT(*) FROM knowledge_cards WHERE type = 'dont' AND is_active = TRUE))))
  );
```

### RPC: `get_user_stats(p_user_id UUID)`
Returns aggregate dive stats for the Stats Dashboard.

```sql
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_build_object(
    'total_dives',    COUNT(*),
    'total_min',      SUM(duration_min),
    'max_depth_m',    MAX(max_depth_m),
    'top_site',       (SELECT site_name FROM dive_logs WHERE user_id = p_user_id GROUP BY site_name ORDER BY COUNT(*) DESC LIMIT 1),
    'buddy_dives',    COUNT(*) FILTER (WHERE buddy_name IS NOT NULL),
    'night_dives',    COUNT(*) FILTER (WHERE is_night_dive)
  )
  FROM dive_logs
  WHERE user_id = p_user_id;
$$;
```

### RPC: `due_quiz_questions(p_user_id UUID, p_user_cert_tier INT, p_limit INT)`
Returns questions due for review, ordered by SM-2 priority, filtered by cert tier.
The cert tier is passed in from the app (sourced from the dive-link API) rather than
read from a local `cert_level` column.

```sql
CREATE OR REPLACE FUNCTION due_quiz_questions(
  p_user_id       UUID,
  p_user_cert_tier INT,
  p_limit         INT DEFAULT 5
)
RETURNS SETOF quiz_questions
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT qq.*
  FROM quiz_questions qq
  LEFT JOIN user_card_progress ucp ON ucp.card_id = qq.card_id AND ucp.user_id = p_user_id
  WHERE qq.is_active = TRUE
    AND qq.min_cert_tier <= p_user_cert_tier
    AND (ucp.next_review IS NULL OR ucp.next_review <= CURRENT_DATE)
  ORDER BY COALESCE(ucp.next_review, '2000-01-01') ASC, RANDOM()
  LIMIT p_limit;
$$;
```

---

## Indexes

```sql
-- Dive log queries
CREATE INDEX idx_dive_logs_user_date ON dive_logs (user_id, dive_date DESC);
CREATE INDEX idx_dive_logs_site ON dive_logs (site_name);

-- Quiz scheduling
CREATE INDEX idx_card_progress_next_review ON user_card_progress (user_id, next_review);

-- Knowledge base browsing
CREATE INDEX idx_knowledge_cards_category ON knowledge_cards (category, type);
CREATE INDEX idx_knowledge_cards_cert_tier ON knowledge_cards (min_cert_tier);

-- Full-text search on knowledge cards
CREATE INDEX idx_knowledge_cards_fts ON knowledge_cards
  USING gin(to_tsvector('english', title || ' ' || body || ' ' || array_to_string(tags, ' ')));

-- Leaderboard
CREATE INDEX idx_profiles_xp ON profiles (xp DESC) WHERE leaderboard_opt_in = TRUE;

-- Instructor tools
CREATE INDEX idx_learning_groups_instructor ON learning_groups (instructor_id);
CREATE INDEX idx_learning_assignments_student ON learning_assignments (student_id);
```

---

## Supabase Storage Buckets

| Bucket | Access | Purpose |
|---|---|---|
| `avatars` | Authenticated read; owner write | User profile photos (app-specific; dive-link has its own photo storage) |
| `dive-photos` | Authenticated read; owner write | Photos attached to dive logs |
