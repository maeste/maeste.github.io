/*
 * Talk feedback — client side.
 *
 *   Write path: form -> Supabase REST (anon key; insert-only via RLS).
 *   Read path:  renders the static JSON published by the GitHub Action
 *               at /assets/feedback/<talk>.json (no runtime DB read).
 *
 * CONFIG: SUPABASE_URL + ANON_KEY (the publishable key) below.
 * The publishable key is safe to expose — RLS restricts anonymous reads to
 * approved rows only, and allows inserts (server-side validated).
 *
 * A talk page activates feedback by including this script and providing:
 *   <div data-feedback-list  data-talk="<slug>"></div>
 *   <form data-feedback-form data-talk="<slug>"> ... </form>
 */
(function () {
  'use strict';

  // ---- CONFIG: fill these in ----------------------------------------------
  const SUPABASE_URL = 'https://iiioplvkkyowpebdjpal.supabase.co';
  const ANON_KEY = 'sb_publishable_qepKAmUC-8zZFzbari4i5g_lTOIVeWf';
  // -------------------------------------------------------------------------

  const form = document.querySelector('[data-feedback-form]');
  const list = document.querySelector('[data-feedback-list]');
  if (!form || !list) return; // not a feedback page

  const talk = form.getAttribute('data-talk');
  const jsonUrl = `/assets/feedback/${talk}.json`;

  const state = { entries: [], pending: [] };

  // ---- helpers ----
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );
  const stars = (n) => '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);
  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  function card(e, pending) {
    const author = e.author ? `@${esc(e.author)}` : 'Anonymous attendee';
    const foot = [
      e.would_recommend ? '<span class="fb-rec">would recommend</span>' : '',
      pending ? '<span class="fb-pending">pending publish</span>' : '',
    ].join('');
    return (
      '<article class="fb-card">' +
        '<div class="fb-card-head">' +
          `<span class="fb-stars" title="${e.rating}/5">${stars(e.rating)}</span>` +
          `<span class="fb-author">${author}</span>` +
          `<span class="fb-date">${fmtDate(e.created_at)}</span>` +
        '</div>' +
        `<p class="fb-takeaway">${esc(e.takeaway)}</p>` +
        (foot ? `<div class="fb-card-foot">${foot}</div>` : '') +
      '</article>'
    );
  }

  function summary(count, avg) {
    if (!count) return '';
    const a = avg ? ` &middot; <span class="fb-stars">\u2605</span> ${avg}/5` : '';
    return `<p class="fb-summary">${count} response${count === 1 ? '' : 's'}${a}</p>`;
  }

  function paint() {
    const published = state.entries;
    if (!state.pending.length && !published.length) {
      list.innerHTML = '<p class="fb-empty">No feedback yet &mdash; be the first below.</p>';
      return;
    }
    const count = published.length;
    const avg = count
      ? (published.reduce((s, e) => s + e.rating, 0) / count).toFixed(2)
      : null;
    list.innerHTML =
      summary(count, Number(avg)) +
      state.pending.map((e) => card(e, true)).join('') +
      published.map((e) => card(e, false)).join('');
  }

  async function load() {
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
    const recEl = form.querySelector('input[name="recommend"]:checked');
    const would_recommend = recEl ? recEl.value === 'yes' : true;

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
          talk, rating, takeaway, would_recommend,
          author_handle: author || null,
        }),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);

      // Optimistic render (this session only); the Action publishes it for real.
      state.pending.unshift({
        rating, takeaway, would_recommend,
        author: author || null,
        created_at: new Date().toISOString(),
      });
      paint();
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
