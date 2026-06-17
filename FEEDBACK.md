# Talk Feedback

Attendees submit structured feedback (rating + takeaway + recommend) via an
in-page form. Submissions land in **Supabase**, and a **GitHub Action**
publishes the approved entries to static JSON every 30 min. The talk page
renders that JSON — the site stays fully static, the only runtime call is the
write to Supabase.

```
form ──POST──► Supabase (anon key, insert-only via RLS)
                    │
   GitHub Action (cron 30 min / manual) reads approved rows
                    │
              assets/feedback/<slug>.json  ──► committed to main
                    │
              talk page renders it (pure static, fast)
```

## One-time setup

1. **Create a Supabase project** at https://supabase.com (free tier is plenty).

2. **Create the table**: open the SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql).

3. **Grab the keys** from *Project Settings &rarr; API*:
   - `Project URL` (looks like `https://abcd.supabase.co`)
   - `anon` public key
   - `service_role` secret key (**keep private**)

4. **Fill in the client config** in [`assets/js/feedback.js`](./assets/js/feedback.js):
   set `SUPABASE_URL` and `ANON_KEY` (the anon key is safe to expose).

5. **Give the Action access** (run once from the repo root):
   ```bash
   gh variable set SUPABASE_URL -b "https://abcd.supabase.co"
   gh secret  set SUPABASE_SERVICE_ROLE_KEY   # paste the service_role key
   ```
   The service role key bypasses RLS so the Action can read approved rows.

6. **Publish once** to verify the loop:
   *Actions &rarr; Publish feedback &rarr; Run workflow*, then submit a test
   entry from the talk page and run it again.

## Security model

- The public **anon key** can only `INSERT` (RLS policy in `schema.sql`); it
  cannot read, update, or delete. That is by design and safe to ship in client JS.
- The **service role key** (repo secret only) is used by the Action to read.
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
