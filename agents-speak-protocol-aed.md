# Agents Speak Protocol

Versione per Agentic Engineering Days Zurich, 20 novembre 2026, sala Millennium, 11:00–11:30 («Talk · 25 min»). Pubblico practitioner, già familiare con agenti e tool calling. Slide in inglese, **copione e note in inglese**: a Zurigo il talk si parla in inglese. Traccia da **18 minuti e 15 secondi**, con 2–3 minuti di Q&A dentro lo slot da 25.

Deck: [agents-speak-protocol-aed/index.html](agents-speak-protocol-aed/index.html).

**Uso:** spazio/freccia destra avanzano anche i frammenti; `S` apre le note; `Esc` mostra la panoramica; `F` fullscreen; `?` aiuto. Le animazioni sono comandate dal relatore, senza avanzamento automatico. `?print-pdf` rende visibili tutti i frammenti per l'esportazione. Per la speaker view usare un server locale (`python3 -m http.server 8000` dalla root): la proiezione funziona anche offline da file, ma le restrizioni del browser possono bloccare la finestra note su `file://`. La variante sperimentale **`deck-3d.html`** sostituisce i nove diagrammi SVG con scene three.js (stessi click, stesse note, stessi tempi); `deck-3d.html?flat=1` rimanda a `index.html` alla stessa slide — l'uscita di sicurezza in aula.

**Rigenerazione:** `python3 agents-speak-protocol-aed/build.py` (richiede il pacchetto Python `markdown`); con `--3d` genera anche `deck-3d.html`, che sostituisce i diagrammi con le scene di `three/scenes.js` (three.js r128 UMD venduto, nessun CDN). Questo Markdown guida contenuti, ordine, note e tempi; le direttive `{{diagram:...}}` includono SVG originali dalla cartella del deck. L'incidente pagamenti è un esempio illustrativo, senza metriche o payload inventati. Il QR rimanda alla pagina del talk AED (`maeste.it/speaking/agents-speak-protocol-aed.html`). Reveal.js è locale e distribuito con la sua licenza MIT.

**Struttura:** stessa coreografia della versione DevFest Milano (traccia 31:30, 23 slide: deck e sorgente in `agents-speak-protocol/`), tagliata e accelerata secondo il documento di design [`agents-speak-protocol-aed-brainstorming.md`](agents-speak-protocol-aed-brainstorming.md). Le slide invariate (handoff, together, closing) conservano battute e click di DevFest. Nessuna appendice: per il materiale di backup vale la versione estesa online. I giudizi di adozione sono scelte dei relatori, non certificazioni di maturità. Fonti primarie verificate il 6 ottobre 2026; analogie storiche intese come letture architetturali, non successioni universali.

| Minuti | Voce | Blocco |
| --- | --- | --- |
| 0–1:00 | Alessio | Apertura e speaker grid |
| 1:00–4:00 | Alessio | Storia, regola, tesi |
| 4:00–5:15 | Alessio | Mappa dei confini |
| 5:15–8:15 | Alessio | MCP e capability access |
| 8:15–9:00 | Alessio → Stefano | Handoff: dall'accesso alla delega |
| 9:00–13:30 | Stefano | A2A e architettura |
| 13:30–15:30 | Stefano | Gli altri confini (UI, knowledge, ops) |
| 15:30–16:15 | Stefano | ACP |
| 16:15–17:15 | Stefano | Scelte pratiche |
| 17:15–18:15 | Entrambi | Chiusura |
| Dopo 18:15 | Entrambi | Q&A (2–3') |

**Ripartizione:** Alessio 9:00 (50%), Stefano 9:15 (50%). **Prova:** checkpoint 5:00 (mappa), 9:00 (handoff), 13:30 (architettura), 15:30 (ACP), contenuto ≤ 19:00. Se lunghi, tagliare in quest'ordine: colonna observability della slide 14, secondo click del task, riga radar x402. Non tagliare mai handoff, together, closing. Se in anticipo, respirare sulla mappa (slide 6) e sul together (13). Le note sono una traccia parlata; non riempire ogni intervallo leggendo testo. La Q&A non è un contenitore per contenuti essenziali rimasti fuori.

## Slide 1 — Agents Speak Protocol
<!-- id: title; class: cover; chapter: Opening; time: 0:00–0:20; speaker: Alessio; hide-title: true -->

<div class="cover-type"><p class="kicker">Agentic Engineering Days Zurich / 20 November 2026</p><h1>Agents<br>Speak<br><span>Protocol</span></h1><p class="subtitle">Why standards are the<br>real infrastructure of AI</p></div>

{{diagram:cover}}

<p class="byline">Stefano Maestri <span>&amp;</span> Alessio Soldano</p>

> **Speaker notes:** Alessio · 0:00–0:20. Leave this slide up while the room settles. Alessio opens: «For two years we have debated models, frameworks and reasoning. The moment we take an agent out of the demo, the question changes: what can it actually talk to?» Do not preview the acronym catalog. Test clicker, fullscreen and speaker view before the session.

## Slide 2 — We have worked on both sides of the boundary
<!-- id: speakers; chapter: Opening; time: 0:20–1:00; speaker: Entrambi -->

<div class="speaker-grid"><article><p class="kicker">The previous wave</p><h3>Alessio<br>Soldano</h3><p>Apache CXF / WS-*<br>RESTEasy / REST</p><span class="stamp model">Shared contracts</span></article><article><p class="kicker">The current wave</p><h3>Stefano<br>Maestri</h3><p>A2A Technical Steering Committee<br>Linux Foundation</p><span class="stamp agent">Independent agents</span></article></div>

<p class="landing">Our agents need to talk to <strong>other people's systems</strong></p>

> **Speaker notes:** Both · 0:20–1:00. One sentence each, no CVs. Alessio (to 0:40): «I worked on the previous wave of shared contracts: SOAP and Web Services stacks with Apache CXF, then REST with RESTEasy. Every framework inventing its own way to communicate gives me déjà-vu.» Stefano (to 1:00): «I now meet that same problem between independent agents; I also serve on the A2A Technical Steering Committee. Alessio takes us back a few years, to see what happens when an ecosystem starts to mature.» Alessio continues on the next slide.

## Slide 3 — Different decade, familiar integration problem
<!-- id: history; chapter: History; time: 1:00–2:30; speaker: Alessio -->

<div class="history-grid"><article><span class="era">Networks</span><h3>Connect<br>different systems</h3><p>TCP/IP</p></article><article class="fragment" data-fragment-index="0"><span class="era">Services</span><h3>Agree on<br>an interface</h3><p>WSDL + SOAP<br>REST APIs</p></article><article class="fragment" data-fragment-index="1"><span class="era">Editors</span><h3>Reuse<br>integrations</h3><p>LSP</p></article><article class="fragment" data-fragment-index="2"><span class="era">Agents</span><h3>Meet the<br>same problems</h3><p>Models / tools / peers</p></article></div>

<p class="landing fragment" data-fragment-index="2">Move repeated decisions into a <strong>shared contract</strong></p>

> **Speaker notes:** Alessio · 1:00–2:30. Three clicks: services, editors, agents — different boundaries, not a succession where one replaces the other. TCP/IP makes network communication interoperable; it does not define the operations of a service. In Web Services, WSDL described interface operations, messages and bindings, and SOAP structured the exchanged messages. REST-designed APIs: REST is an architectural style, not a WSDL-equivalent contract — HTTP methods, representations and API documentation still need concrete agreements between client and server. Do not introduce WS-Security here: the point is contract reuse, not WS-* stack complexity. LSP standardized editor–language-server interaction (methods, messages, capability negotiation): an editor reuses integrations across languages, within supported capabilities. Close by asking which agreement stops every pair from being rewritten; do not claim REST or LSP solve TCP/IP's problem.

Sources: [Internet architectural principles](https://www.rfc-editor.org/rfc/rfc1958.html), [REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), [LSP](https://microsoft.github.io/language-server-protocol/)

## Slide 4 — History's rule
<!-- id: history-rule; class: statement paper; chapter: History; time: 2:30–3:15; speaker: Alessio; hide-title: true -->

<p class="kicker">A lens for this talk</p>
<p class="big-statement">The simplest protocol<br>that reduces the most<br><strong>uncertainty</strong> wins</p>
<p class="statement-caption fragment">How many decisions disappear from the application?</p>

> **Speaker notes:** Alessio · 2:30–3:15. Say the sentence slowly. One click reveals the question: «How many decisions disappear from the application — formats, lifecycle, discovery, errors?» Present it as the speakers' reading rule, not a historical law: adoption, distribution, incentives and compatibility count as much as simplicity. Do not open an OSI-versus-TCP/IP lesson.

## Slide 5 — What can we replace without rewriting the agent?
<!-- id: replace; chapter: The thesis; time: 3:15–4:00; speaker: Alessio -->

{{diagram:replace}}

<p class="landing">Keep the contract. <strong>Change the implementation</strong></p>

> **Speaker notes:** Alessio · 3:15–4:00. The diagram starts with implementation A. One click replaces it with B, while application and interface stay fixed. «A protocol becomes infrastructure when I can replace what sits on the other side of the boundary without rewriting what sits on this side.» That is the thesis of the talk. The contract makes the integration reusable; it does not guarantee identical behavior, quality or features. This question must return for the model, the tools and the remote agent.

## Slide 6 — Standards emerge at different boundaries
<!-- id: map; chapter: The map; time: 4:00–5:15; speaker: Alessio -->

{{diagram:map}}

<p class="landing">What do you want to make <strong>replaceable</strong>?</p>

> **Speaker notes:** Alessio · 4:00–5:15. Hold the map. The three main contracts are already visible: model, capability, autonomous counterpart. One click adds the other boundaries. «Not a single agent standard is emerging: agreements appear at different boundaries.» Walk the rest in about thirty seconds, without explaining each acronym. Name the model boundary here: «the same story, closer to the model — Open Responses is the emerging attempt at a POSIX for model APIs». File conventions, APIs and protocols are not all the same category, nor at the same stage of adoption. We will return to the same question, not to eight equal chapters. Checkpoint: 5:00.

## Slide 7 — Every new tool multiplies the wiring
<!-- id: wiring; chapter: Tools boundary; time: 5:15–6:00; speaker: Alessio -->

{{diagram:wiring}}

<p class="landing">A shared interface changes the <strong>shape of integration</strong></p>

> **Speaker notes:** Alessio · 5:15–6:00. On the left, three applications and four services: twelve lines. On the click, three-plus-four connections through the contract. «Like JDBC: N applications, M databases. Either every pair gets its own integration, or we agree on an interface.» The formula counts integration surfaces in an ideal scenario, not development hours: adapters and tool semantics remain. And every compatible endpoint adds possible connections — that network effect is why an open standard gains value. USB-C for the intuition, JDBC for this audience. The initial value of MCP is exactly this, before any talk of JSON-RPC.

Sources: [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

## Slide 8 — MCP gives capabilities a common interface
<!-- id: mcp; class: tool-slide; chapter: Tools boundary; time: 6:00–7:30; speaker: Alessio -->

{{diagram:mcp}}

<p class="landing">Expose the capability once. <strong>Reuse the integration</strong></p>
<p class="micro">JSON-RPC 2.0 / stdio or Streamable HTTP</p>

> **Speaker notes:** Alessio · 6:00–7:30. «The host owns user experience, model and policy. An MCP client connects the host to the server that exposes capabilities.» The click adds the domain API behind the server: the backend keeps its own internal contract. For the example: an incident assistant consults logs and deploys. The protocol makes access and discovery common; it does not make a query correct, nor grant authorizations automatically. Do not sink into transports.

Sources: [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

## Slide 9 — Three primitives, three control patterns
<!-- id: control; class: tool-slide; chapter: Tools boundary; time: 7:30–8:15; speaker: Alessio -->

<div class="primitive-grid"><article><span class="stamp tool">Tools</span><h3>Act</h3><p>Model typically selects</p><div class="example">Read service errors</div></article><article><span class="stamp tool">Resources</span><h3>Know</h3><p>Application supplies context</p><div class="example">Service topology</div></article><article><span class="stamp tool">Prompts</span><h3>Start</h3><p>User selects a template</p><div class="example">Investigate an incident</div></article></div>

<p class="landing fragment">The host retains <strong>policy and consent</strong></p>

> **Speaker notes:** Alessio · 7:30–8:15. All three primitives are visible: in our incident the tool reads errors, the resource carries topology, the prompt proposes the opening procedure. Conceptual examples. «I like that the primitives have different control modes.» Say “typically”, not “only”: the model may select a tool, the application decides what to expose and what to execute. User control does not disappear behind the protocol. These modes are an interaction model, not a law nor three levels of permission. The click lands the closing line.

Sources: [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)

## Slide 10 — “Investigate the payment failure and send me a diagnosis”
<!-- id: handoff; class: statement handoff; chapter: From access to delegation; time: 8:15–9:00; speaker: Alessio → Stefano; hide-title: true -->

<p class="kicker">Same incident. A different request</p>
<p class="request small-request">“Read the latest<br>payment errors”</p>
<p class="request fragment">“Investigate the payment failure<br>and send me a <strong>diagnosis</strong>”</p>
<p class="statement-caption fragment">Who owns the work on the other side?</p>

> **Speaker notes:** Alessio → Stefano · 8:15–9:00. Two clicks: the delegated outcome first, then the question. Alessio (to 8:30): «We have standardized how to access a capability. What if I instead ask Stefano's agent for a diagnosis?» Stefano takes the click and the reasoning: «Then the counterpart owns the result: it can choose its own tools, ask for more input, wait for a person. That is the boundary A2A addresses.» Do not say “now Stefano speaks”. Brief pause on the difference of responsibility. Same incident, different required contract.

## Slide 11 — A2A addresses an independent counterpart
<!-- id: a2a; class: agent-slide; chapter: Agents boundary; time: 9:00–10:15; speaker: Stefano -->

{{diagram:a2a}}

<div class="three-labels"><span>Agent Card</span><span>Messages / Tasks</span><span>Artifacts</span></div>
<p class="landing">Agree on the work. <strong>Keep internals private</strong></p>

> **Speaker notes:** Stefano · 9:00–10:15. «Here the payments team is a counterpart with its own responsibility.» First click shows the Agent Card: it describes capabilities, endpoint and authentication requirements — it does not demonstrate reliability. The second click reveals internals inside the remote perimeter, deliberately outside the contract. Summarize messages, tasks for trackable work, artifacts as results. A remote agent can answer immediately; do not force every interaction into a long procedure. Opaque execution concerns what the counterpart must expose; it does not forbid additional application-level agreements.

Sources: [A2A core concepts](https://a2a-protocol.org/latest/topics/key-concepts/)

## Slide 12 — A task can outlive a single response
<!-- id: task; class: agent-slide; chapter: Agents boundary; time: 10:15–11:30; speaker: Stefano -->

{{diagram:task}}

<p class="landing">Track work, exchange input, receive <strong>artifacts</strong></p>
<p class="micro">Illustrative path / input-required is a pause, not completion</p>

> **Speaker notes:** Stefano · 10:15–11:30. Two clicks: working and the input request appear together — the remote team asks for a correlation ID; then the work resumes and a diagnosis arrives with evidence. Real states of the spec, on an illustrative, non-exhaustive path. Do not infer automatic retries, exactly-once, a workflow engine, or resumption of a terminal task. We use a task for this representation; A2A also allows direct answers as messages. Streaming and async notifications are possible modes per negotiated support, not the fundamental distinction from MCP.

Sources: [Life of an A2A Task](https://a2a-protocol.org/latest/topics/life-of-a-task/)

## Slide 13 — Capability access + outcome delegation
<!-- id: together; chapter: The architecture; time: 11:30–13:30; speaker: Stefano -->

{{diagram:together}}

<div class="duo-caption"><p><span class="stamp tool">MCP</span> Invoke a capability</p><p><span class="stamp agent">A2A</span> Delegate an outcome</p></div>

> **Speaker notes:** Stefano · 11:30–13:30. This is the slide to photograph. Three clicks build the architecture: our MCP access to logs and deploys, the A2A delegation to the payments team, and the counterpart's MCP tools inside its own perimeter. «The useful question: am I invoking a capability, or delegating an outcome to an autonomous counterpart?» State is not the discriminator: an MCP server can keep state and an A2A agent can answer immediately. An agent can sit behind a MCP tool when that is the desired contract. Alessio can add one line without taking the stage: «Like JDBC and HTTP in the same backend: two different boundaries.» Goals, evidence and time limits are domain agreements; the protocol does not certify the diagnosis. Checkpoint: 13:30.

Sources: [A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/)

## Slide 14 — The rest of the map
<!-- id: rest-map; chapter: Other boundaries; time: 13:30–15:30; speaker: Stefano -->

<div class="bets-grid"><article><span class="kicker tool-text">The user boundary</span><h3>Show the work</h3><p><strong>AG-UI</strong> — events &amp; shared state</p><p><strong>A2UI</strong> — declarative components</p><p><strong>MCP Apps</strong> — tool UI inside a host</p></article><article><span class="kicker model-text">The knowledge boundary</span><h3>Agree on meaning</h3><p><strong>AGENTS.md</strong> — project instructions</p><p><strong>Agent Skills</strong> — SKILL.md + resources</p><p><strong>Agent Plugins</strong> — packaged reuse</p></article><article><span class="kicker agent-text">The operations boundary</span><h3>Follow the work</h3><p><strong>OpenTelemetry GenAI</strong> — one trace across model, tools and delegation</p><p class="micro">Instrument and propagate at each boundary / pin the convention version</p></article></div>

<p class="landing">Smaller agreements, <strong>the same pattern</strong></p>
<p class="micro">Opening a channel is not the agreement — WebSockets vs polling, all over again</p>

> **Speaker notes:** Stefano · 13:30–15:30. MCP and A2A were the heart; now the same pattern at the remaining boundaries, all visible, one spoken beat per column. AG-UI gives a vocabulary for events and shared state between backend and frontend; A2UI describes declarative components rendered by the client from a supported catalog; MCP Apps lets a tool provide interactive UI inside a compatible host, isolated. Distinct contracts: no mandatory pipeline, not equivalents of WebSocket or HTML. AGENTS.md is essentially a file; a skill is a directory with SKILL.md and resources — technically simple, valuable when implementations agree on the same meaning; instructions are not authentication or permission. If you use OpenTelemetry, the trace does not appear by itself: instrument and propagate context at each boundary, and pin the GenAI convention version. «Opening a channel is not the agreement: WebSockets versus polling, all over again.» The user boundary matters too: make it explicit when the system waits for a human decision; a button does not confer a permission. Live-cut candidate: the operations column.

Sources: [AG-UI overview](https://docs.ag-ui.com/introduction), [A2UI](https://a2ui.org/), [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview), [AGENTS.md](https://agents.md/), [Agent Skills specification](https://agentskills.io/specification), [Agent Plugins](https://agent-plugins.org/), [OpenTelemetry GenAI conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

## Slide 15 — Change the coding agent, keep the editor
<!-- id: acp; chapter: IDE boundary; time: 15:30–16:15; speaker: Stefano -->

{{diagram:acp}}

<p class="analogy">Agent Client Protocol <span>≈ the LSP pattern</span></p>
<p class="micro">Sessions / progress / permissions / cancellation</p>

> **Speaker notes:** Stefano · 15:30–16:15. One click changes the coding agent while editor and contract stay. «ACP applies the LSP pattern to the relationship between editor and coding agent — Alessio showed earlier why this analogy is useful.» Say Agent Client Protocol: the acronym is ambiguous. Sessions and permissions have different semantics from a language service; the agent can modify the project. Replaceable in the integration does not mean same quality or transferred memory. Checkpoint: 15:30.

Sources: [Agent Client Protocol introduction](https://agentclientprotocol.com/get-started/introduction)

## Slide 16 — Adopt where replacement matters
<!-- id: bets; chapter: The bets; time: 16:15–17:15; speaker: Stefano -->

<div class="bets-grid"><article><span class="kicker tool-text">Start from a need</span><h3>MCP</h3><p>Reusable tool integrations</p><h3>A2A</h3><p>Independent agent delegation</p></article><article class="fragment" data-fragment-index="0"><span class="kicker model-text">Evaluate the contract</span><h3>Compatibility</h3><p>Common subset<br>Extensions<br>Independent implementations</p></article><article class="fragment" data-fragment-index="1"><span class="kicker agent-text">Keep the rest on your radar</span><h3>One boundary<br>at a time</h3><p>Introduce a standard when<br>the integration pain is real</p></article></div>

<p class="micro">On the radar: <strong>x402</strong> — the reserved HTTP 402 status gets a machine-readable payment contract</p>

> **Speaker notes:** Stefano · 16:15–17:15. Two clicks. «Adopt everything tomorrow? A standard has a cost. MCP when you reuse tool integrations; A2A when you delegate to an independent counterpart. For the rest, weigh the need, the real support, the extensions.» Do not read a version list: this slide expresses the speakers' choice criteria. AGENTS.md and skills are useful today, without adopting a whole stack. «Standards arrive one boundary at a time.» The radar line is half a spoken sentence, or skipped entirely if long: x402 — the money boundary — worth watching; no financial advice, no crypto pitch. Then Alessio recalls the history and they close together.

## Slide 17 — That is when a protocol becomes infrastructure
<!-- id: closing; class: statement paper; chapter: Closing; time: 17:15–18:15; speaker: Entrambi; hide-title: true -->

<p class="kicker">We have seen this before</p>
<p class="big-statement closing-text">Replace what is<br>on the other side.<br><strong>Keep your <span class="correction"><span class="correction-word">application</span><span class="correction-strike fragment" data-fragment-index="0"></span><span class="correction-fix fragment" data-fragment-index="0">Agent</span></span></strong></p>
<p class="statement-caption fragment" data-fragment-index="0">That is when a protocol becomes infrastructure</p>

> **Speaker notes:** Both · 17:15–18:15. Alessio (15 seconds): «History does not tell us which acronyms will win. It helps us recognize the contract that removes repeated decisions from our applications.» Stefano, on the click: «When you can replace what sits on the other side of the boundary without rewriting what sits on this side, that protocol has become infrastructure.» Pause. No new content after this line. Thank the audience and move to Q&A. Target: content ends by 18:15, Q&A 2–3 minutes, slot ends at 11:30.

## Slide 18 — Grazie! Questions?
<!-- id: questions; chapter: Discussion; time: Q&A; speaker: Entrambi -->

<div class="qa-layout"><div><p class="qa-prompt">Which boundary<br>hurts in <strong>your system</strong>?</p><p>Stefano Maestri<br><span class="muted">maeste.it</span></p><p>Alessio Soldano<br><span class="muted">aladinodigitale.it</span></p><p class="small"><a href="sources.html">Sources &amp; further reading</a> · <a href="https://maeste.it/agents-speak-protocol/" target="_blank" rel="noopener">Extended deck (35')</a></p></div><figure class="qr-card"><img src="assets/talk-qr.svg" alt="QR to maeste.it/speaking/agents-speak-protocol-aed.html"><figcaption>Slides &amp; feedback<br><a href="../speaking/agents-speak-protocol-aed.html">maeste.it/speaking/<br>agents-speak-protocol-aed.html</a></figcaption></figure></div>

> **Speaker notes:** Both · Q&A. Leave this slide projected: the QR points to the AED talk page with slides and feedback; questions also arrive through the conference Q&amp;A tool. There is no appendix in this deck: for backup material, use the extended 35-minute DevFest deck at maeste.it/agents-speak-protocol/ and answer verbally from its appendix topics (MCP/A2A comparison, trust model, UI contracts, x402 detail, replacement test) instead of hunting for slides we do not have. Expected questions: MCP versus A2A, state, security, AG-UI/A2UI, why ACP got one minute, x402, actual replaceability. Do not use questions to recover a protocol catalog. If we are unsure about a version detail, check the spec instead of improvising.
