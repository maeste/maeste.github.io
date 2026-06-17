/*
 * Talk feedback — client side.
 *
 *   Write path: form -> Supabase REST (publishable key; INSERT via RLS).
 *   Read path:  fetches approved rows LIVE from Supabase on load, so a new
 *               submission appears immediately for everyone. Falls back to the
 *               JSON snapshot at /assets/feedback/<talk>.json (refreshed by the
 *               GitHub Action) if Supabase is unreachable — keeps the page
 *               resilient and gives a static snapshot for SEO / no-JS.
 *
 *   Submissions auto-publish (approved defaults true), so there is no
 *   "pending" state: on submit we prepend the row the server returns.
 *
 * CONFIG: SUPABASE_URL + ANON_KEY (the publishable key) below. Safe to expose —
 * RLS allows SELECT of approved rows only and INSERTs (server-validated).
 *
 * Activate on a page with:
 *   <div data-feedback-list  data-talk="<slug>"></div>
 *   <form data-feedback-form data-talk="<slug>"> ... </form>
 */
(function () {
  'use strict';

  // ---- CONFIG -------------------------------------------------------------
  const SUPABASE_URL = 'https://iiioplvkkyowpebdjpal.supabase.co';
  const ANON_KEY = 'sb_publishable_qepKAmUC-8zZFzbari4i5g_lTOIVeWf';
  // -------------------------------------------------------------------------

  const form = document.querySelector('[data-feedback-form]');
  const list = document.querySelector('[data-feedback-list]');
  if (!form || !list) return; // not a feedback page

  const talk = form.getAttribute('data-talk');
  const jsonUrl = `/assets/feedback/${talk}.json`;
  const SELECT = 'id,author_handle,rating,takeaway,created_at';

  const state = { entries: [] };

  // ---- helpers ----
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  // Rated stars = solid filled ★ (yellow via .fb-on); the rest = outline ☆ (light blue via .fb-off).
  const stars = (n) =>
    `<span class="fb-on">${'\u2605'.repeat(n)}</span><span class="fb-off">${'\u2606'.repeat(5 - n)}</span>`;
  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Normalise a Supabase row to the shape used for rendering.
  function normalize(r) {
    return {
      id: r.id,
      author: r.author_handle && String(r.author_handle).trim() ? String(r.author_handle).trim() : null,
      rating: r.rating,
      takeaway: r.takeaway,
      created_at: r.created_at,
    };
  }

  function card(e) {
    const author = e.author ? `@${esc(e.author)}` : 'Anonymous attendee';
    return (
      '<article class="fb-card">' +
        '<div class="fb-card-head">' +
          `<span class="fb-stars" title="${e.rating}/5">${stars(e.rating)}</span>` +
          `<span class="fb-author">${author}</span>` +
          `<span class="fb-date">${fmtDate(e.created_at)}</span>` +
        '</div>' +
        `<p class="fb-takeaway">${esc(e.takeaway)}</p>` +
      '</article>'
    );
  }

  function summary(count, avg) {
    if (!count) return '';
    const a = avg ? ` &middot; <span class="fb-stars"><span class="fb-on">\u2605</span></span> ${avg}/5` : '';
    return `<p class="fb-summary">${count} response${count === 1 ? '' : 's'}${a}</p>`;
  }

  function paint() {
    if (!state.entries.length) {
      list.innerHTML = '<p class="fb-empty">No feedback yet &mdash; be the first below.</p>';
      return;
    }
    const count = state.entries.length;
    const avg = (state.entries.reduce((s, e) => s + e.rating, 0) / count).toFixed(2);
    list.innerHTML = summary(count, Number(avg)) + state.entries.map(card).join('');
  }

  // Newest first.
  function sortEntries() {
    state.entries.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }

  async function load() {
    // Primary: live read from Supabase (immediate for everyone).
    try {
      const params = new URLSearchParams({
        talk: `eq.${talk}`,
        approved: 'eq.true',
        order: 'created_at.desc',
        select: SELECT,
      });
      const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback?${params}`, {
        headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
      });
      if (res.ok) {
        const rows = await res.json();
        state.entries = Array.isArray(rows) ? rows.map(normalize) : [];
        paint();
        return;
      }
    } catch {
      /* fall through to JSON snapshot */
    }
    // Fallback: the JSON snapshot the Action commits (resilience if Supabase is down).
    try {
      const res = await fetch(jsonUrl, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        state.entries = Array.isArray(data.entries) ? data.entries : [];
      }
    } catch {
      /* leave empty state */
    }
    paint();
  }

  // ---- submission ----
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (form.website && form.website.value) return; // honeypot tripped

    const errEl = form.querySelector('.fb-error');
    const okEl = form.querySelector('.fb-success');
    errEl.textContent = '';
    if (okEl) okEl.hidden = true;

    const ratingEl = form.querySelector('input[name="rating"]:checked');
    const rating = ratingEl ? Number(ratingEl.value) : null;
    const takeaway = form.takeaway.value.trim();
    const author = form.author.value.trim();

    if (!rating) { errEl.textContent = 'Please select a rating.'; return; }
    if (!takeaway) { errEl.textContent = 'Please share a takeaway.'; return; }
    if (takeaway.length > 500) { errEl.textContent = 'Takeaway must be 500 characters or fewer.'; return; }

    const btn = form.querySelector('button[type="submit"]');
    const origLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending\u2026';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
        method: 'POST',
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          talk, rating, takeaway,
          author_handle: author || null,
        }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      // The server returns the created row (real id + created_at). Prepend it
      // immediately — no "pending" state, since approved defaults to true.
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0]) {
        state.entries.unshift(normalize(rows[0]));
        sortEntries();
        paint();
      }
      form.reset();
      if (okEl) okEl.hidden = false;
    } catch {
      errEl.textContent = 'Could not submit right now. Please try again later.';
    } finally {
      btn.disabled = false;
      btn.textContent = origLabel;
    }
  });

  load();
})();
