# AICOnf 2026 — Talk Outline (beat-per-beat)

> **Status:** structural draft. Slides come later, once the template is provided.
> **This folder is authoring workspace** — not the public deck. Convert/clean
> before deploying (see `recording/README.md`).

## Meta

- **Event:** AI Conf 2026, Milano, June 24 2026
- **Format:** frontal talk, **40 min** (+ short Q&A)
- **Language:** English
- **Audience:** AI-conf — practitioner/enterprise, but **agent-development-savvy**
  (no need to explain what an agent/harness/loop is from scratch)
- **Tooling anchor:** the `agent-ready-skill` repo (6 skills: scan/fix/report/diff/init)
- **NEVER mention** the PyCon workshop, or frame this as "from my workshop".
  `quicknote` is fine (generic demo repo).

## Thesis (the spine)

> **Your repo is *part of* the harness — not the harness itself.**
> The full harness is `LLM + repo + external apparatus (sandbox, skills, MCP, evals)`.
> Measuring the repo measures only **the part you own**. But that part is the
> decisive one: it's where the **verifier** lives, and the verifier is what turns
> a harness into a **loop** that converges instead of one that vibes.

One-line: *"Readiness score = how complete your slice of the harness is. And
VALIDATE is the axis that decides whether your slice can host a verifier at all."*

## The leverage progression (borrowed from the two articles — cite both)

Autocomplete → Prompt → Context → **Harness** → **Loop**.

- **Harness** (Ibryam 2025–26): the environment one agent runs in — prompt, repo
  context, tools, **sandbox, permissions, tests, linters, type checks, CI, evals,
  review gates**. Purpose: make the work *observable, constrained, checkable*.
- **Loop** (now): the control system around the harness — trigger, goal, harness,
  **verifier**, state. *"A loop is not an automation. A loop has a decision in it."*
- **Your newsletter** framing: **harness = space** (limits, what's allowed);
  **loop = time + decision** (how many times, when to stop). The agent = a process
  in a second-level OS.

## How the 4 axes map onto the harness (the conceptual bridge)

| Axis | Weight | It is the harness's… |
|------|--------|----------------------|
| 📝 INSTRUCT | 28% | **instruction layer** (what the agent should do) |
| 🧭 NAVIGATE | 30% | **context + tools layer** (where things are, what it can reach) |
| ✅ VALIDATE | 30% | **verifier** — the decision that lets a loop converge |
| 🛡️ SECURE | 12% | **boundaries** — sandbox + permissions (the spatial limits) |

→ So a readiness scan is **an x-ray of your slice of the harness**, axis by axis.

---

## Beat-per-beat (38 min content + 2 min Q&A)

### 1 · The failure story — 3 min
- **Hook:** *"It worked on my machine"* → *"It worked in my prompt."*
- One concrete failure (agent shipped plausible, wrong work; no test caught it).
- Land the emotion: the failure isn't the model, it's the **environment** it ran in.
- **Money quote:** *"The agent didn't fail your repo. Your repo failed the agent."*

### 2 · Where the leverage moved — 6 min
- The 5-step progression (Autocomplete → Prompt → Context → Harness → Loop).
- Cite **both** articles here (newsletter + Ibryam).
- Key shift: *you stop writing code and start writing the system that produces code.*
- Define harness vs loop precisely (space vs time+decision).
- Setup line for the thesis: the repo is the slice of the harness **you own**.
- **Money quote (Ibryam):** *"The verifier is the difference between a loop and a vibe."*

### 3 · The repo is part of the harness — 4 min
- The reversal: you don't *buy* a harness — **most of it is already in your repo**,
  but usually broken.
- Introduce the 4 axes **as dimensions of the harness slice** (not "a maturity model").
- Show the table above (axis → harness layer).
- *"You can't fix what you can't measure"* → motivation for the scan.

### 4 · VALIDATE: the verifier — 8 min  (the thematic heart)
- The **Testing Paradox**, pushed further: tests aren't for finding bugs — they're
  the agent's **stop condition**.
- No verifier ⇒ no convergence ⇒ *just repeated prompting* ("vibes").
- **Loop-driven development** = TDD at a larger unit of intent (a task, a PR, a
  migration). The loop wraps a bigger thing, but the structure is the same:
  failing check → make it pass → refactor.
- What makes a *good* verifier vs a vibe-check: deterministic first (tests, build,
  types, lint, contract), probabilistic second (separate reviewer model). Maker ≠ checker.
- Anchor to what they know: **CI is already a proto-loop.** Evals, MLOps pipelines
  too. The talk just makes the loop *explicit and converging*.
- **Money quote:** *"Without a verifier, the loop cannot decide when it's done —
  so a human has to, every time. That's the bottleneck you're actually feeling."*

### 5 · SECURE: the boundaries — 8 min  (co-protagonist)
- *"A loop without boundaries is dangerous."* With autonomy comes blast radius.
- Harness = **the space the agent can move in**; SECURE measures how well you've
  drawn it. Three sub-areas:
  - **Sandbox & isolation** — committed devcontainer, **documented** execution
    policy. Credit is for *evidence in the repo*, not self-report.
  - **Secret & supply-chain hygiene** — `.gitignore` secrets, `.env.example`,
    committed lockfiles, Dependabot.
  - **Injection & permissions** — instructions only in trusted files; restrictive
    agent deny rules.
- **LINCE.sh** as the concrete answer to *"how do I make the sandbox part of the
  harness — repeatable, documented, delegable?"* A documented host-level sandbox
  earns the score precisely because it's reproducible. (One example, not an ad.)
- The under-investment point: SECURE is the axis **most skipped** and the one that
  blocks real delegation. You won't let a loop run unattended if you can't bound it.
- **Money quote:** *"You can't delegate what you can't confine."*

### 6 · Measure it: scan + fix (the magic moment) — 6 min
- The tool: the 6 skills, AGENTS.md-first, any agent.
- **Asciinema playback (≈90s)** on `quicknote`: `step-0-bare` (low VALIDATE/SECURE)
  → `/agent-ready fix` (agent proposes the gaps) → `step-5-complete` (overall ~84%).
- Read the result: the radar is the x-ray of *your slice of the harness*.
- The kicker: **the same agent that scans can generate the fixes** — contextualized
  to your project. The agent fixes what the agent needs.
- **Money quote:** *"Your repo has a number. Now you know which slice of the
  harness to build next."*

### 7 · Close: build the loop — 3 min
- Recap of the one shift: from writing code to writing the system that produces it.
- The repo is the slice you own; VALIDATE is your verifier; SECURE is your boundary.
- *"Build the loop. Stay the engineer."* (borrowed close, credited to Ibryam).
- CTA: scan your repo today (link to `agent-ready-skill`), read the two articles,
  pick ONE axis to move this week.

### Q&A — 2 min (buffer)

---

## Demo policy (locked)

- **Only** the asciinema playback in beat 6. No other live demo.
- Recording on `quicknote` first; optionally a second repo later if time permits.
- Real run, recorded calmly, then **compacted** (idle gaps removed) to ~90s.
  See `recording/README.md` + `recording/compact-cast.py`.

## Open decisions (parking lot)

- **Title** — 5 candidates below; pick after structure is settled.
- **Whether to show step-3/step-4 intermediate scans** (more granular, longer) or
  just step-0 → step-5 (punchier). Default: **step-0 → step-5 only**.
- Whether to embed asciinema-player in the deck (live) or export to an animated
  GIF (bulletproof). Decide with the template.

## Title candidates (parking)

1. *Your Repo Is Half the Harness: Measuring What Makes an Agent Loop Converge*
2. *The Verifier, the Loop, and the Repo*
3. *From Test-Driven to Loop-Driven: Why Your Repo Decides If Agents Can Help You*
4. *Build the Loop: Agent Readiness Beyond the Prompt*
5. *What an Agent Needs (and Why Most of It Is in Your Repo)*
