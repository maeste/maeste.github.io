# Agents Speak Protocol — versione Agentic Engineering Days Zurich

Documento di design per la versione ridotta del talk, calata dalla versione DevFest Milano 2026 (traccia 31:30 su slot 35'+Q&A, 23 slide, deck in `agents-speak-protocol/`). Approccio deciso insieme: **A — stesso show, taglio asimmetrico**. La coreografia di DevFest resta; si taglia dove costa meno, il cuore MCP+A2A+architettura resta intatto.

- **Evento:** Agentic Engineering Days Zurich 2026 (AEDZH26), Marriott Zurich, sala Millennium, **20 novembre 2026, 11:00–11:30**. Formato dichiarato «Talk · 25 min». [Pagina sessione](https://www.agenticdays.com/session/1292080-agents-speak-protocol-why-standards-are-the-real)
- **Budget:** ~22' di contenuto + 2–3' di Q&A. Obiettivo traccia: contenuto **18:15**, totale con Q&A ~20:45, margine ~4' (stessa disciplina di DevFest: 31:30 su 35).
- **Relatori:** Alessio Soldano e Stefano Maestri, stesso ordine di ingresso e stessa cerniera di DevFest. Ripartizione: Alessio 9:00 (50%), Stefano 9:15 (50%).
- **Lingua:** slide in inglese, **copione e note in inglese** (a Zurigo il talk si parla in inglese; la stessa traccia in inglese scorre più lenta — il margine tiene conto di questo).
- **Pubblico:** «builders working with agentic AI» — livello pratico, sovrapposto all'intermediate/advanced di DevFest. Nessuna recalibrazione di contenuto.
- **Scadenza:** il talk è lunedì 20 novembre; il documento è del 16. Le giornate utili per la prova sono il weekend: una sola prova cronometrata completa.
- **Abstract accettato:** promette la mappa completa (MCP, A2A, A2UI, AG-UI/MCPUI, ACP), i paralleli storici (TCP/IP, SOAP, CORBA vs REST, WebSockets vs polling) e la regola «i vincitori sono i protocolli più semplici che riducono più incertezza». Ogni nome promesso resta in scena, anche x402 citato a voce e sulla slide dei bets.

## La tesi (invariata)

> Replace what is on the other side. Keep your application — **Agent**. That is when a protocol becomes infrastructure.

Stessa regola di lettura: «The simplest protocol that reduces the most uncertainty wins», presentata come lente dei relatori, non legge storica. Nessun cambiamento di contenuto concettuale rispetto al brainstorming originale (`agents-speak-protocol-brainstorming.md`): cambia solo il ritmo.

## Traccia

| # | Slide (id) | Voce | Tempo | Δ vs DevFest |
| --- | --- | --- | --- | --- |
| 1 | title | Alessio | 0:00–0:20 | kicker: Agentic Engineering Days / 20 November 2026 |
| 2 | speakers | Entrambi | 0:20–1:00 | una battuta a testa, niente CV |
| 3 | history | Alessio | 1:00–2:30 | stessi 3 click, traccia più veloce |
| 4 | history-rule | Alessio | 2:30–3:15 | statement detta lentamente, 1 click |
| 5 | replace | Alessio | 3:15–4:00 | tesi, 1 click |
| 6 | map | Alessio | 4:00–5:15 | + linea verbale su Open Responses (POSIX for model APIs) |
| 7 | wiring | Alessio | 5:15–6:00 | assorbe la network effect (JDBC/USB-C) |
| 8 | mcp | Alessio | 6:00–7:30 | invariato (1:30) |
| 9 | control | Alessio | 7:30–8:15 | 2 click → 1 (Tools/Resources/Prompts compaiono insieme) |
| 10 | **handoff** | A→S | 8:15–9:00 | **INVARIATA** — la cerniera |
| 11 | a2a | Stefano | 9:00–10:15 | 2 click (Agent Card, internals) |
| 12 | task | Stefano | 10:15–11:30 | 3 click → 2 (working+input fusi, poi artifact) |
| 13 | **together** | Stefano | 11:30–13:30 | la slide da fotografare, quasi intatta |
| 14 | **rest-of-map** (nuova) | Stefano | 13:30–15:30 | fusione di UI+knowledge+ops, 3 colonne senza click |
| 15 | acp | Stefano | 15:30–16:15 | invariato (0:45), callback verbale di Alessio sul pattern LSP |
| 16 | bets | Stefano | 16:15–17:15 | + riga «on the radar: x402 (payments)» |
| 17 | **closing** | Entrambi | 17:15–18:15 | **INVARIATA** — correzione application→Agent |
| — | questions | Entrambi | 18:15–~20:45 | Q&A 2–3'; la sala passa al talk successivo alle 11:30 |

**Checkpoint di prova: 5:00 mappa · 9:00 handoff · 13:30 architettura · 15:30 ACP · contenuto ≤ 19:00.**

Se si è in anticipo, i punti dove respirare: tour della mappa (slide 6), pausa sul together (13). Se si è in ritardo, vedi «Tagli in corsa».

## Destino delle 23 slide

- **Invariate o quasi (7):** title (solo kicker/byline), speakers, handoff, together, bets (+riga radar), closing, questions (QR alla nuova pagina AED).
- **Strette (10):** history, history-rule, replace, map, wiring, mcp, control, a2a, task, acp.
- **Eliminate come slide (6):**
  - Open Responses (slide 7 DevFest) → una frase verbale durante il tour della mappa. Non è nominata nell'abstract: primo taglio sicuro.
  - Network effect (11) → dentro wiring, come chiusura del punto JDBC.
  - UI (16) + knowledge (17) + operations (18) → fuse nella nuova slide 14, tre colonne testuali sul tema del deck, nessun click: AG-UI/A2UI/MCP Apps · AGENTS.md/Skills/Plugins · OTel GenAI. L'abstract nomina tutti e tre i confini: la slide li tiene in scena in 2'.
  - x402 (20) → niente slide; riga radar su bets + battuta a voce («the next boundary is money»). Era già marcata «prima da saltare» nelle note DevFest.

Risultato: **18 slide da 23**. Nessun diagramma nuovo: la slide 14 è testuale.

## Coprivenze dell'abstract

| Promessa dell'abstract | Dove si mantiene |
| --- | --- |
| MCP agent-to-tool | slide 7–9 |
| A2A peer-to-peer, architetture con MCP e A2A insieme | slide 10–13 |
| A2UI e AG-UI/MCPUI | slide 14 |
| ACP client-side orchestration | slide 15 |
| Paralleli storici TCP/IP, SOAP, CORBA vs REST | slide 3 (+ WebSockets vs polling citato a voce nella colonna eventi della 14) |
| «Winners are the simplest protocols that reduce the most uncertainty» | slide 4 |
| Tower of Babel / entropy | apertura e slide 3 |
| x402/pagamenti (implicito in «stack») | riga radar su slide 16 |

## Note in inglese: guardrail da preservare

Le note DevFest sono in italiano e sono lo strumento dei tempi; la versione AED le riscrive in inglese mantenendo tutti i guard «don't say»:

- Mai «MCP is the TCP/IP of agents» come equivalenza tecnica; no «sync MCP / async A2A»; no «tool deterministico vs agente intelligente».
- State non è il discriminante MCP/A2A; un server MCP può avere stato, un agente A2A può rispondere subito; un agente può stare dietro un tool MCP.
- REST è stile architetturale, non un contratto equivalente a WSDL; le primitive MCP sono modalità di controllo, non livelli di permesso; dire «typically».
- Agent Card descrive una controparte, non stabilisce fiducia; una diagnosi consegnata correttamente può essere sbagliata.
- OTel: la trace non appare da sola, serve strumentare e propagare; pinnare la versione delle convenzioni GenAI.
- ACP: sostituibile nell'integrazione non significa stessa qualità o memoria trasferita; disambiguare Agent Client Protocol.
- x402 ridotto a battuta: conservare comunque il guard («402 era riservato, non inutilizzato»; nessun consiglio finanziario).

**Tagli in corsa se lunghi** (in quest'ordine): terzo beat della slide 14 (colonna observability), secondo click del task, riga radar x402. **Mai tagliare in corsa:** handoff (10), together (13), closing (17).

## Artefatti e checklist d'implementazione

1. **`agents-speak-protocol-aed.md`** alla root — fonte di verità: contenuti, ordine, note in inglese, tempi nuovi, direttive `{{diagram:...}}`.
2. **Cartella `agents-speak-protocol-aed/`** — copiare `build.py`, `deck.js`, `theme.css`, `reveal/` e dalla cartella DevFest solo gli SVG necessari: `cover`, `replace`, `map`, `wiring`, `mcp`, `a2a`, `task`, `together`, `acp` (non servono `models`, `network`, `ui`, `trace`, `payment*`). Slide 14 nuova a 3 colonne testuali. QR alla nuova pagina del talk.
3. **`speaking/agents-speak-protocol-aed.html`** — pagina coming-soon (il talk non è ancora stato tenuto) con abstract AED, link all'evento, sezione feedback.
4. **Cablaggio feedback (per CLAUDE.md):** seed `assets/feedback/agents-speak-protocol-aed.json` (copia vuota), aggiungere `'agents-speak-protocol-aed'` a `TALK_SLUGS` in `scripts/publish-feedback.mjs`, CTA nel deck alla pagina, voci nelle timeline di `index.html` e `speaking/index.html`.
5. **Verifica:** `python3 agents-speak-protocol-aed/build.py`, controllo con server locale dei frammenti e dei tempi, `?print-pdf`.

Deploy su GitHub Pages solo a esplicita richiesta (push su `main`).

## Prova

Una sola prova cronometrata completa in inglese nel weekend con Alessio. Le slide invariate (handoff, together, closing) sono già memoria muscolare di DevFest: la prova verifica i checkpoint (5:00/9:00/13:30/15:30) e i punti di taglio in corsa. Clicker, speaker view e fullscreen come da deck DevFest (`S`, `Esc`, `F`, `?print-pdf`; server locale per la finestra note).

## Questioni aperte

Nessuna bloccante. Da decidere in implementazione: se la colonna observability della slide 14 cita «WebSockets vs polling» a voce (consigliato: sì, una frase, per il parallelo dell'abstract).
