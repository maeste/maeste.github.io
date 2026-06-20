// Publishes approved feedback from Supabase into static JSON files.
// Run by .github/workflows/publish-feedback.yml (every 30 min + manual).
//
// Env:
//   SUPABASE_URL              (repo variable)
//   SUPABASE_PUBLISHABLE_KEY  (repo variable) -- anon/publishable key;
//                                               RLS allows SELECT of approved
//                                               rows only. No secret needed.
//
// To add a talk, append its slug to TALK_SLUGS. Each talk's data is written
// to assets/feedback/<slug>.json and committed by the workflow.
//
// The `updated` field is set to the newest entry's created_at (not "now"),
// so the file only changes when feedback actually changes -> no spurious
// commits on every cron run.

import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !PUBLISHABLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY env.');
  process.exit(1);
}

// Talks to publish. Add new slugs here as the feature rolls out.
const TALK_SLUGS = ['coderful2026', 'aiconf2026'];

const COLUMNS = 'id,author_handle,rating,takeaway,created_at';

async function fetchFeedback(talk) {
  const params = new URLSearchParams({
    talk: `eq.${talk}`,
    approved: 'eq.true',
    order: 'created_at.desc',
    select: COLUMNS,
  });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback?${params}`, {
    headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` },
  });
  if (!res.ok) {
    throw new Error(`GET feedback for "${talk}" failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

function buildPayload(talk, rows) {
  const entries = rows.map((r) => ({
    id: r.id,
    author: r.author_handle && r.author_handle.trim() ? r.author_handle.trim() : null,
    rating: r.rating,
    takeaway: r.takeaway ? r.takeaway : null,
    created_at: r.created_at,
  }));
  const average_rating = entries.length
    ? Number((entries.reduce((s, e) => s + e.rating, 0) / entries.length).toFixed(2))
    : null;
  return {
    talk,
    // newest entry's time, or null when empty -> stable across runs with no new data
    updated: entries.length ? rows[0].created_at : null,
    count: entries.length,
    average_rating,
    entries,
  };
}

mkdirSync('assets/feedback', { recursive: true });

let changed = 0;
for (const talk of TALK_SLUGS) {
  const rows = await fetchFeedback(talk);
  const payload = buildPayload(talk, rows);
  const path = `assets/feedback/${talk}.json`;
  const newlineJson = JSON.stringify(payload, null, 2) + '\n';

  // Skip writing if the content is unchanged (avoids touch-only commits).
  let prev = '';
  try {
    prev = readFileSync(path, 'utf8');
  } catch {}
  if (prev === newlineJson) {
    console.log(`No change for ${talk} (${payload.count} entries).`);
    continue;
  }

  writeFileSync(path, newlineJson);
  console.log(`Wrote ${path} (${payload.count} entries).`);
  changed++;
}

console.log(`Done. ${changed} file(s) updated.`);
