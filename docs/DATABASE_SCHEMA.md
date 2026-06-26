# DiveLink — Database Schema

Backend: Supabase (PostgreSQL 15). All tables use UUIDs and `created_at` / `updated_at` timestamps. Row-Level Security (RLS) is enabled on every user-data table.

---

## Enums

```sql
CREATE TYPE user_role AS ENUM ('diver', 'instructor');

CREATE TYPE cert_level AS ENUM (
  'none',
  'open_water',
  'advanced',
  'rescue',
  'divemaster',
  'instructor'
);

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
Extends Supabase Auth `auth.users`. One row per user.

```sql
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'diver',
  cert_level      cert_level NOT NULL DEFAULT 'none',
  home_club       TEXT,
  xp              INTEGER NOT NULL DEFAULT 0,
  level           INTEGER NOT NULL DEFAULT 0,
  streak_days     INTEGER NOT NULL DEFAULT 0,
  streak_last_active DATE,
  total_dives     INTEGER NOT NULL DEFAULT 0,
  unit_pref       unit_preference NOT NULL DEFAULT 'metric',
  leaderboard_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
  notif_time      TIME NOT NULL DEFAULT '08:00:00',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: users can read their own row; instructors can read rows of enrolled students
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Instructor reads student profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM student_enrollments
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
      SELECT 1 FROM student_enrollments
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

-- Public read, no RLS
ALTER TABLE dive_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON dive_sites FOR SELECT USING (TRUE);
```

---

## Knowledge & Learning Tables

### `knowledge_cards`
Seeded content — not user-created.

```sql
CREATE TABLE knowledge_cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            card_type NOT NULL,
  category        TEXT NOT NULL,
  min_cert_level  cert_level NOT NULL DEFAULT 'none',
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  explanation     TEXT NOT NULL,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
  min_cert_level  cert_level NOT NULL DEFAULT 'none',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT options_length CHECK (array_length(options, 1) = 4),
  CONSTRAINT valid_correct_index CHECK (correct_index BETWEEN 0 AND 3)
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
      SELECT 1 FROM student_enrollments
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

## Instructor Tables

### `student_enrollments`

```sql
CREATE TABLE student_enrollments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_name      TEXT,
  enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (instructor_id, student_id)
);

ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor manages enrollments" ON student_enrollments
  FOR ALL USING (auth.uid() = instructor_id);
CREATE POLICY "Student sees own enrollment" ON student_enrollments
  FOR SELECT USING (auth.uid() = student_id);
```

---

### `instructor_assignments`

```sql
CREATE TABLE instructor_assignments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,   -- NULL = whole group
  group_name      TEXT,
  category        TEXT NOT NULL,    -- knowledge base category name
  due_date        DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE instructor_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor manages assignments" ON instructor_assignments
  FOR ALL USING (auth.uid() = instructor_id);
CREATE POLICY "Student sees own assignments" ON instructor_assignments
  FOR SELECT USING (auth.uid() = student_id OR (
    group_name IS NOT NULL AND EXISTS (
      SELECT 1 FROM student_enrollments
      WHERE instructor_id = instructor_assignments.instructor_id
        AND student_id = auth.uid()
        AND group_name = instructor_assignments.group_name
    )
  ));
```

---

### `assignment_completions`

```sql
CREATE TABLE assignment_completions (
  assignment_id   UUID NOT NULL REFERENCES instructor_assignments(id) ON DELETE CASCADE,
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
      SELECT 1 FROM instructor_assignments ia
      WHERE ia.id = assignment_completions.assignment_id
        AND ia.instructor_id = auth.uid()
    )
  );
```

---

### `skill_signoffs`

```sql
CREATE TABLE skill_signoffs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_slug      TEXT NOT NULL,   -- e.g. 'mask_clearing', 'emergency_ascent'
  notes           TEXT,
  signed_off_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (instructor_id, student_id, skill_slug)
);

ALTER TABLE skill_signoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Instructor creates signoffs" ON skill_signoffs
  FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructor reads own signoffs" ON skill_signoffs
  FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "Student reads own signoffs" ON skill_signoffs
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

### RPC: `due_quiz_questions(p_user_id UUID, p_limit INT)`
Returns questions due for review, ordered by SM-2 priority, filtered by cert level.

```sql
CREATE OR REPLACE FUNCTION due_quiz_questions(p_user_id UUID, p_limit INT DEFAULT 5)
RETURNS SETOF quiz_questions
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT qq.*
  FROM quiz_questions qq
  LEFT JOIN user_card_progress ucp ON ucp.card_id = qq.card_id AND ucp.user_id = p_user_id
  JOIN profiles p ON p.id = p_user_id
  WHERE qq.is_active = TRUE
    AND qq.min_cert_level::TEXT <= p.cert_level::TEXT
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
CREATE INDEX idx_knowledge_cards_cert_level ON knowledge_cards (min_cert_level);

-- Full-text search on knowledge cards
CREATE INDEX idx_knowledge_cards_fts ON knowledge_cards
  USING gin(to_tsvector('english', title || ' ' || body || ' ' || array_to_string(tags, ' ')));

-- Leaderboard
CREATE INDEX idx_profiles_xp ON profiles (xp DESC) WHERE leaderboard_opt_in = TRUE;

-- Instructor tools
CREATE INDEX idx_enrollments_instructor ON student_enrollments (instructor_id);
CREATE INDEX idx_assignments_student ON instructor_assignments (student_id);
```

---

## Supabase Storage Buckets

| Bucket | Access | Purpose |
|---|---|---|
| `avatars` | Authenticated read; owner write | User profile photos |
| `dive-photos` | Authenticated read; owner write | Photos attached to dive logs |
