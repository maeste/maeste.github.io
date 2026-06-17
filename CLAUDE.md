# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for Stefano Maestri at **maeste.it**. Pure static HTML/CSS served via GitHub Pages — no build step, no static site generator, no JavaScript framework. A `.nojekyll` file disables Jekyll processing.

The repo also hosts several **self-contained talk deck subsites** (one top-level folder per talk), each served at `maeste.it/<folder>/` — see [Talk deck subsites](#talk-deck-subsites).

## Development

No build or install required. Open `index.html` in a browser or use any local HTTP server:
```bash
python3 -m http.server 8000
```
Main-site pages use root-relative paths (`/assets/css/style.css`, `/speaking/`), so a server is needed — opening files directly won't resolve links. The talk deck subsites, by contrast, use **relative** paths so they work from their subpath without rewriting.

Deploys automatically via GitHub Pages on push to `main`. Custom domain: `maeste.it` (configured in `CNAME`).

## Architecture

**Single shared stylesheet**: `assets/css/style.css` — dark developer theme (Inter + JetBrains Mono fonts, dark blue/slate palette). All pages link to this one file. No per-page styles.

**Two page types exist**:

1. **Full detail pages** (past talks with resources available) — use the `.talk-detail` layout with `.talk-header`, `.resource-section`, `.resource-list`, and `.video-embed` for YouTube iframes. Example: `speaking/devoxx.html`.

2. **Coming-soon pages** (future talks) — use the `.coming-soon` layout with a badge, description, placeholder links, and a note about resources being available after the event. Example: `speaking/pycon2026.html`.

**Bilingual content (IT/EN)**: Implemented client-side via `data-lang` attributes. Elements with `data-lang="en"` start hidden (`style="display:none;"`). The `setLang()` JS function toggles visibility. This function is duplicated in each HTML file that supports language switching (`index.html`, `speaking/index.html`). Individual talk detail pages do **not** have language toggling.

**Shared nav pattern**: Every page repeats the same `<nav>` block manually. The nav links to `/#content`, `/#projects`, and `/speaking/`. The active page gets a `class="nav-active"` on its link. The homepage nav includes the profile avatar; subpages omit it.

## Talk Deck Subsites

Top-level folders that each host a standalone slide deck / micro-site for a talk. They are **independent of the main site** — they do not use `assets/css/style.css`, the shared `<nav>`, or `setLang()`. Each ships its own HTML, inline styles (or its own framework), assets, and `LICENSE`.

Current subsites:

- `coderful2026/` — slide deck (custom `deck-stage.js` framework + React/JSX tweaks), served at `maeste.it/coderful2026/`.
- `pycon2026-so101/` — `index.html` redirects to `final/presentation/slides.html`; also keeps `v1/`/`v2/`/`v3/` draft versions and `multi_version.html`.
- `pycon2026-workshop/` — workshop hub (`index.html`) linking into `presentation/` (`slides.html`, `workshop.html`, `playground.html`).

**Conventions:**

- **Relative paths only** — `assets/foo.png`, `slides.html`, `../assets/...`. Never root-relative (`/assets/...`), or the deck breaks at `maeste.it/<folder>/`.
- The `speaking/<slug>.html` detail page links to the subsite externally (e.g. `https://maeste.it/coderful2026/`), and the deck's QR codes encode those same URLs.
- These were migrated from separate GitHub project repos (now archived) in June 2026; their git history lives in the archived repos, not here.
- When editing a deck, keep filenames with spaces URL-encoded in `src`/`href` (e.g. `assets/il%20robot%20zoppo.jpg`) — browsers decode them to the on-disk filename with literal spaces.

## Adding a New Talk

1. Create `speaking/<slug>.html` — copy an existing detail page (or coming-soon page for future talks) and update content.
2. Add the talk entry to both `index.html` (recent talks section) and `speaking/index.html` (full timeline). Follow the existing `.talk-item` markup pattern.
3. Place any PDFs in `assets/pdfs/`.
4. If the talk has its own slide deck, create a top-level folder named after the talk slug, copy an existing subsite (e.g. `coderful2026/`) as a starting point, and use **relative paths only** (see [Talk deck subsites](#talk-deck-subsites)). Then link to it from the detail page as `https://maeste.it/<folder>/`.

## Key Conventions

- All HTML entities are used for special chars (e.g., `&rarr;`, `&uuml;`, `&agrave;`) rather than raw UTF-8.
- External links use `target="_blank" rel="noopener"`.
- The email link on the homepage uses a two-step JS anti-spam pattern: a visible "email" link triggers display of a hidden `mailto:` link.
- Project cards on the homepage are `<a>` tags wrapping the whole card (except Lince which has internal links and uses a `<div>`).
