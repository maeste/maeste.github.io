# Recording the asciinema "magic moment"

Goal: a ~90s terminal playback for beat 6 of the talk, showing
`quicknote` scanned before (low VALIDATE/SECURE) → fixed → after (overall ~84%).

## The approach (real run, then compact)

1. **Record the real interaction once, calmly** (3–5 min is fine — Claude Code
   takes its time). You'll narrate voice-over later, so silence during recording is OK.
2. **Compact the `.cast`** with `compact-cast.py` — it removes idle gaps longer
   than a threshold, keeping the rhythm of the actions. Result: ~90s playback.
3. (Optional) record voice-over separately and merge, **or** narrate live over the
   muted player during the talk. Live narration is more robust.

> This folder is **authoring workspace**, not the deployed deck. Don't ship these
> files to `maeste.it/aiconf2026/` as-is — clean/convert before deploy.

---

## SETUP — prepare a clean checkout (one-time)

`quicknote-demo` lives inside the PyCon workspace and has a branch per step.
We make a **fresh clone** on `step-0-bare` so nothing touches your working copy.
(A clone is more robust than `git worktree` — it doesn't need write access to
the source repo's `.git`.)

```bash
# clone the local quicknote-demo and switch to the bare 'before' state
git clone /home/maeste/project/pycon2026-workshop/quicknote-demo /home/maeste/project/quicknote-rec
cd /home/maeste/project/quicknote-rec
git checkout step-0-bare
# sanity: should be the bare 6-file CLI
ls            # README.md  pyproject.toml  quicknote/
```

If `quicknote-demo` is a private/local-only repo with no remote, the local
`git clone <path>` above still works (clones from the filesystem). If you'd
rather clone from GitHub instead, use its remote URL.```

Pre-flight (do once, so the recording is smooth):
- Claude Code installed and the **agent-ready skills** available
  (`/agent-ready` resolves). Confirm with `/agent-ready` in a throwaway run.
- Terminal: a clean profile, large font, dark background. Hide the prompt noise
  (a minimal `PS1='$ '` helps the cast read cleanly on a projector).
- Know the expected numbers so you can react: step-0 ≈ VALIDATE 28% / SECURE ~25%;
  step-5 ≈ overall 84%.

## RECORD — the beat sheet

Start recording:
```bash
asciinema rec /tmp/aiconf.cast --title "agent-ready: quicknote before/after" --idle-time-limit 2
```
(`--idle-time-limit 2` caps any single pause at 2s already — helps a lot.)

Then follow the beats below. Take your time; we compact later. Speak or stay silent,
both fine.

| # | Type | Action / command | Say (if narrating) |
|---|------|------------------|--------------------|
| 1 | cmd  | `clear` then `cd /home/maeste/project/quicknote-rec` | "A bare Python CLI." |
| 2 | cmd  | `ls -1` | "Six files. No tests. No CI. No instructions." |
| 3 | cmd  | `claude` (launch) | — |
| 4 | cmd  | `/agent-ready scan .` | "Let's x-ray our slice of the harness." |
| 5 | wait | (real scan output: radar, VALIDATE low, SECURE low) | "VALIDATE and SECURE — where it bleeds. No verifier, no safe boundary." |
| 6 | cmd  | `/agent-ready fix` | "The agent proposes the gaps — contextualized to this repo." |
| 7 | wait | (real fix proposal list) | — |
| 8 | cmd  | exit Claude (Ctrl+D / `/exit`) | "We apply the fixes." |
| 9 | cmd  | `git checkout step-5-complete` then `ls -1` | "Now it has AGENTS.md, CI, SECURITY.md, a sandbox policy, a lockfile…" |
| 10 | cmd | `claude` then `/agent-ready scan .` | "Same repo. Same tool. Different number." |
| 11 | wait | (real scan: overall ~84%, VALIDATE/SECURE green) | "Your slice of the harness, before and after." |
| 12 | cmd  | exit, `clear` | — |

End recording (Ctrl+D or `exit`). The cast is at `/tmp/aiconf.cast`.

**Optional granularity:** if you want the progression visible, insert after beat 8:
`git checkout step-3-validate` → scan → `git checkout step-4-secure` → scan → then
step-5. More educational, ~30s longer after compaction. Default is the punchy 2-scan cut.

## COMPACT — shrink the cast to ~90s

```bash
cd /home/maeste/project/maeste.github.io/aiconf2026/recording
python3 compact-cast.py /tmp/aiconf.cast /tmp/aiconf-compact.cast --max-gap 0.4
```
`--max-gap 0.4` collapses any idle stretch longer than 0.4s down to 0.4s.
Tune between 0.3 (snappy) and 0.6 (breathable). Verify the length:
```bash
python3 -c "import json;print(round(json.loads(open('/tmp/aiconf-compact.cast').readlines()[-1])[0],1),'s')"
```

## EMBED — into the deck (decide with the template)

Two robust options:
- **asciinema-player** (live, scrubs): drop the `.cast` in the deck folder, load
  `asciinema-player.min.{css,js}` from CDN, `<asciinema-player src="...cast"
  autoplay loop></asciinema-player>`. Set `speed="1.2"` if still a touch slow.
- **Animated GIF** (bulletproof, no JS): `agg /tmp/aiconf-compact.cast demo.gif
  --speed 1.2 --font-size 16` (install `agg` via `cargo install agg` or use
  `pip install asciinema-scenario` for an alternative). Embed as `<img>`.

Recommendation pending the template: **asciinema-player** if the template allows
JS/CDN (more "alive", scrubabble in Q&A); **GIF** if the deck must be fully static.

## CLEANUP — before deploying the deck

This `aiconf2026/` folder is authoring. Before the deck goes live at
`maeste.it/aiconf2026/`, either move `outline.md` + `recording/` out, or keep only
the deck files. (The `.cast`/`.gif` for the demo can live in the deck's `assets/`.)
