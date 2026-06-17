-- ============================================================
-- Feedback table for maeste.it talk feedback
-- Pilot: coderful2026. Run this in the Supabase SQL Editor.
-- ============================================================

create table if not exists public.feedback (
  id              bigint generated always as identity primary key,
  talk            text        not null,                       -- e.g. 'coderful2026'
  created_at      timestamptz not null default now(),
  author_handle   text,                                       -- optional, free text
  rating          smallint    not null check (rating between 1 and 5),
  takeaway        text        not null check (char_length(takeaway) between 1 and 500),
  approved        boolean     not null default true,          -- auto-publish
  metadata        jsonb       not null default '{}'::jsonb
);

create index if not exists feedback_talk_approved_idx
  on public.feedback (talk, created_at desc)
  where approved = true;

alter table public.feedback enable row level security;

-- SELECT: anonymous visitors (and the Action) may read ONLY approved rows.
-- Published feedback is public by definition (it's shown on the site), so this
-- leaks nothing; it only keeps un-approved / pending / spam rows hidden.
drop policy if exists "anon read approved feedback" on public.feedback;
create policy "anon read approved feedback"
  on public.feedback for select
  to anon
  using (approved = true);

-- INSERT: anonymous visitors may INSERT feedback (any values; server-side
-- CHECK constraints validate the payload). Auto-publish via the default above.
drop policy if exists "anon insert feedback" on public.feedback;
create policy "anon insert feedback"
  on public.feedback for insert
  to anon
  with check (true);

-- anon has NO update/delete policy on purpose: only you can moderate,
-- via the SQL below in the dashboard. The Action reads with the SAME anon
-- (publishable) key, so NO service-role secret is required anywhere.

-- To hide a single submission without deleting it:
--   update public.feedback set approved = false where id = <id>;
-- To delete spam:
--   delete from public.feedback where id = <id>;
--
-- Migration for projects created before this column was dropped:
--   alter table public.feedback drop column if exists would_recommend;
