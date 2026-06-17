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
  would_recommend boolean     not null default true,
  approved        boolean     not null default true,          -- auto-publish
  metadata        jsonb       not null default '{}'::jsonb
);

create index if not exists feedback_talk_approved_idx
  on public.feedback (talk, created_at desc)
  where approved = true;

alter table public.feedback enable row level security;

-- Anonymous visitors may INSERT feedback only.
-- Auto-publish is handled by the `approved = true` default above.
drop policy if exists "anon insert feedback" on public.feedback;
create policy "anon insert feedback"
  on public.feedback for insert
  to anon
  with check (true);

-- NOTE: anon has NO select policy on purpose.
-- Reads happen server-side in the GitHub Action using the service role key,
-- which bypasses RLS. This keeps the public anon key strictly insert-only.

-- To hide a single submission without deleting it:
--   update public.feedback set approved = false where id = <id>;
-- To delete spam:
--   delete from public.feedback where id = <id>;
