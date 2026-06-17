# Talk Feedback

Attendees submit structured feedback (rating + takeaway + recommend) via an
in-page form. Submissions land in **Supabase**, and a **GitHub Action**
publishes the approved entries to static JSON every 30 min. The talk page
renders that JSON — the site stays fully static, the only runtime call is the
write to Supabase.

```
form ──POST──► Supabase (publishable key: INSERT via RLS)
                    │
   GitHub Action (cron 30 min / manual) reads approved rows
                    │   (same publishable key — RLS allows SELECT approved=true)
              assets/feedback/<slug>.json  ──► committed to main
                    │
              talk page renders it (pure static, fast)
```

## One-time setup

1. **Create a Supabase project** at https://supabase.com (free tier is plenty).

2. **Create the table**: open the SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql).

3. **Grab the project URL + publishable key** from *Project Settings &rarr; API*:
   - `Project URL` (looks like `https://abcd.supabase.co`)
   - `publishable` (`anon`) key &mdash; safe to expose in client JS

4. **Fill in the client config** in [`assets/js/feedback.js`](./assets/js/feedback.js):
   set `SUPABASE_URL` and `ANON_KEY` to the values from step 3.

5. **Give the Action access** &mdash; set both as repo **variables** (not secrets; the
   publishable key is safe to expose and already ships in the client JS):
   ```bash
   gh variable set SUPABASE_URL -b "https://abcd.supabase.co"
   gh variable set SUPABASE_PUBLISHABLE_KEY -b "sb_publishable_…"
   ```
   RLS lets the Action read only approved rows with this key &mdash; no service-role
   secret is needed anywhere.

6. **Publish once** to verify the loop:
   *Actions &rarr; Publish feedback &rarr; Run workflow*, then submit a test
   entry from the talk page and run it again.

## Security model

- The public **publishable (anon) key** is used everywhere &mdash; client and Action.
  RLS (see `schema.sql`) lets it `INSERT` anything and `SELECT` only rows where
  `approved = true`. It can never read pending/spam rows, nor update or delete.
  That makes it safe to expose in client JS (and store as a repo *variable*, not a secret).
- There is **no service-role key** in use &mdash; nothing secret is required.
- Inputs are constrained server-side (`rating` 1&ndash;5, `takeaway` 1&ndash;500 chars).
- Output is HTML-escaped on render (see `assets/js/feedback.js`).

## Moderation (auto-publish is on by default)

Every submission is published automatically. To manage individual entries, run
SQL in the Supabase dashboard:

```sql
update public.feedback set approved = false where id = 123; -- hide one
delete from public.feedback where id = 123;                 -- remove spam
```

Hidden/deleted rows disappear from the site on the next Action run.

## Adding feedback to another talk

1. Append the slug to `TALK_SLUGS` in [`scripts/publish-feedback.mjs`](./scripts/publish-feedback.mjs).
2. Seed `assets/feedback/<slug>.json` (copy `coderful2026.json`).
3. On the talk page, add the same markup as `speaking/coderful2026.html`
   (`[data-feedback-list]` + `[data-feedback-form]`, both with `data-talk="<slug>"`)
   and include `<script src="/assets/js/feedback.js" defer></script>`.

## Notes

- **Latency**: a submission appears on the page within ~30 min (next cron run),
  or instantly via the optimistic "pending publish" card shown to the submitter.
  Use the manual *Run workflow* button to publish immediately.
- **Spam**: the form has a honeypot field. For heavier protection, enable
  Supabase rate limiting or add a CAPTCHA later.
- **Cost**: the repo is public, so GitHub Actions minutes are unlimited.
