# Agents Speak Protocol — alternativa narrativa

Versione per DevFest Milano, 10 ottobre 2026. Pubblico intermediate/advanced, già familiare con agenti e tool calling. Slide in inglese, intervento e note in italiano. Traccia da **31 minuti e 30 secondi**, con margine nello slot ufficiale di 35 minuti + Q&A.

Deck: [agents-speak-protocol-alternative/index.html](agents-speak-protocol-alternative/index.html). Originale: [agents-speak-protocol/index.html](agents-speak-protocol/index.html).

**Uso:** spazio/freccia destra avanzano anche i frammenti; `S` apre le note; `Esc` mostra la panoramica; `F` fullscreen; `?` aiuto. Dalla Q&A, destra apre l'appendice e giù scorre le slide di backup. Le animazioni sono comandate dal relatore, senza avanzamento automatico. `?print-pdf` rende visibili tutti i frammenti per l'esportazione. Per la speaker view usare un server locale (`python3 -m http.server 8000` dalla root): la proiezione funziona anche offline da file, ma le restrizioni del browser possono bloccare la finestra note su `file://`.

**Rigenerazione:** `python3 agents-speak-protocol-alternative/build.py` (richiede il pacchetto Python `markdown`). Questo Markdown guida contenuti, ordine, note e tempi; le direttive `{{diagram:...}}` includono SVG originali dalla cartella del deck. Sono schemi concettuali, non catture di sistemi reali. L'incidente pagamenti è un esempio illustrativo, senza metriche o payload inventati. Il QR rimanda alla pagina del talk. Reveal.js è locale e distribuito con la sua licenza MIT.

La tesi e la scaletta riprendono la conversazione Alessio/ChatGPT fornita da Stefano. I giudizi di adozione sono scelte dei relatori, non certificazioni di maturità. Fonti primarie verificate il 6 ottobre 2026; analogie storiche intese come letture architetturali, non successioni universali. Nessun protocollo garantisce da solo sostituibilità semantica, qualità del risultato o compatibilità delle estensioni.

| Minuti | Voce | Blocco |
| --- | --- | --- |
| 0–2 | Entrambi | Apertura e prospettive |
| 2–15 | Alessio | Storia, tesi, mappa, modello e MCP |
| 15–24 | Stefano | Handoff, A2A, architettura con MCP, UI |
| 24–28 | Alessio | Knowledge, operations, ACP |
| 28–29:30 | Stefano | x402, epilogo tagliabile |
| 29:30–31:30 | Entrambi | Scelte e chiusura |
| Dopo 31:30 | Entrambi | Q&A |

**Prova:** segnare i checkpoint 8:00 (mappa), 15:00 (handoff), 22:00 (architettura), 28:00 (ACP). Se siete lunghi, saltare x402, ridurre il tour rapido e conservare MCP+A2A e la chiusura. Le note sono una traccia parlata; non riempire ogni intervallo leggendo testo. La Q&A non è un contenitore per contenuti essenziali rimasti fuori.

## Slide 1 — Agents Speak Protocol
<!-- id: title; class: cover; chapter: Opening; time: 0:00–0:30; speaker: Entrambi; hide-title: true -->

<div class="cover-type"><p class="kicker">DevFest Milano / 10 October 2026</p><h1>Agents<br>Speak<br><span>Protocol</span></h1><p class="subtitle">Why standards are the<br>real infrastructure of AI</p></div>

{{diagram:cover}}

<p class="byline">Stefano Maestri <span>&amp;</span> Alessio Soldano</p>

> **Speaker notes:** Entrambi · 0:00–0:30. Lasciare la slide mentre la sala si sistema. Alessio apre: «Negli ultimi due anni abbiamo discusso moltissimo di modelli, framework e reasoning. Ma quando portiamo un agente fuori da una demo, la domanda cambia: con cosa riesce a parlare?» Non anticipare il catalogo di sigle. Provare clicker, fullscreen e speaker view prima della sessione.

## Slide 2 — We have worked on both sides of the boundary
<!-- id: speakers; chapter: Opening; time: 0:30–2:00; speaker: Entrambi -->

<div class="speaker-grid"><article><p class="kicker">The previous wave</p><h3>Alessio<br>Soldano</h3><p>Apache CXF / WS-*<br>RESTEasy / REST</p><span class="stamp model">Shared contracts</span></article><article><p class="kicker">The current wave</p><h3>Stefano<br>Maestri</h3><p>A2A Technical Steering Committee<br>Linux Foundation</p><span class="stamp agent">Independent agents</span></article></div>

<p class="landing">Our agents need to talk to <strong>other people's systems</strong></p>

> **Speaker notes:** Entrambi · 0:30–2:00. Niente CV. Alessio: «Ho lavorato prima sugli stack SOAP e Web Services, con Apache CXF, poi nel mondo REST con RESTEasy. Quando vedo ogni framework inventarsi un proprio modo di comunicare, provo un certo déjà-vu». Stefano: «Io oggi ritrovo quel problema tra agenti indipendenti; lavoro anche nel TSC di A2A». Alessio riprende: «Guardiamo cosa succede quando un ecosistema comincia a maturare». Credenziali riprese dal deck originale, da rivedere personalmente in prova.

## Slide 3 — Different decade, familiar integration problem
<!-- id: history; chapter: History; time: 2:00–4:00; speaker: Alessio -->

<div class="history-grid"><article><span class="era">Networks</span><h3>Connect<br>different systems</h3><p>TCP/IP</p></article><article class="fragment" data-fragment-index="0"><span class="era">Services</span><h3>Agree on<br>an interface</h3><p>RPC / SOAP / REST</p></article><article class="fragment" data-fragment-index="1"><span class="era">Editors</span><h3>Reuse<br>integrations</h3><p>LSP</p></article><article class="fragment" data-fragment-index="2"><span class="era">Agents</span><h3>Meet the<br>same problems</h3><p>Models / tools / peers</p></article></div>

<p class="landing fragment" data-fragment-index="2">Move repeated decisions into a <strong>shared contract</strong></p>

> **Speaker notes:** Alessio · 2:00–4:00. Tre click: servizi, editor, agenti. Raccontare il pattern, senza proclamare un vincitore per ogni epoca. «La maturità arriva quando non dobbiamo accordarci ogni volta su come comunicare». Su SOAP, se naturale: «Chi ha configurato WS-Security sa quante decisioni possono vivere fuori dall'applicazione». TCP/IP, REST e LSP affrontano problemi diversi; non costruire una successione lineare né dire che la semplicità spiega da sola la storia. In ogni esempio chiedere quale accordo diventa riutilizzabile.

Sources: [Internet architectural principles](https://www.rfc-editor.org/rfc/rfc1958.html), [REST architectural style](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), [LSP](https://microsoft.github.io/language-server-protocol/)

## Slide 4 — History's rule
<!-- id: history-rule; class: statement paper; chapter: History; time: 4:00–5:00; speaker: Alessio; hide-title: true -->

<p class="kicker">A lens for this talk</p>
<p class="big-statement">The simplest protocol<br>that reduces the most<br><strong>uncertainty</strong> wins</p>
<p class="statement-caption fragment">How many decisions disappear from the application?</p>

> **Speaker notes:** Alessio · 4:00–5:00. Dire lentamente la frase della conversazione. Un click fa comparire la domanda. «Quello che fa sparire più decisioni dall'applicazione: formati, lifecycle, discovery, errori». Presentarla come regola di lettura dei relatori, non legge storica. Adozione, distribuzione, incentivi e compatibilità contano quanto la semplicità. Non aprire una lezione OSI contro TCP/IP.

## Slide 5 — What can we replace without rewriting the agent?
<!-- id: replace; chapter: The thesis; time: 5:00–6:00; speaker: Alessio -->

{{diagram:replace}}

<p class="landing">Keep the contract. <strong>Change the implementation</strong></p>

> **Speaker notes:** Alessio · 5:00–6:00. Il diagramma parte con implementation A. Un click la sostituisce con B, lasciando ferme applicazione e interfaccia. «Un protocollo diventa infrastruttura quando posso sostituire ciò che sta dall'altra parte del confine senza riscrivere ciò che sta da questa parte». È la tesi del talk. Il contratto rende riutilizzabile l'integrazione; non garantisce identici comportamenti, qualità o feature. Questa domanda deve tornare su modello, tool e agente remoto.

## Slide 6 — Standards emerge at different boundaries
<!-- id: map; chapter: The map; time: 6:00–8:00; speaker: Alessio -->

{{diagram:map}}

<p class="landing">What do you want to make <strong>replaceable</strong>?</p>

> **Speaker notes:** Alessio · 6:00–8:00. Mappa ancora. I tre contratti principali sono già visibili: modello, capability, controparte autonoma. Un click aggiunge gli altri cinque confini. «Non sta emergendo un unico standard per gli agenti: vediamo accordi in corrispondenza di confini diversi». Percorrere il resto in 30 secondi, senza spiegare le sigle. Dire che file, convenzioni, API e protocolli non sono tutti la stessa categoria né allo stesso stadio di adozione. I tre box principali costruiscono il ragionamento, il resto completa il panorama. Torneremo alla stessa domanda, non a otto capitoli della stessa durata.

## Slide 7 — One model contract, several providers
<!-- id: models; class: model-slide; chapter: Model boundary; time: 8:00–9:30; speaker: Alessio -->

{{diagram:models}}

<div class="three-labels"><span>Typed items</span><span>Semantic streaming</span><span>Tool invocation</span></div>
<p class="analogy">Open Responses <span>≈ POSIX for model APIs</span></p>

> **Speaker notes:** Alessio · 8:00–9:30. Massimo 90 secondi. «Chat Completions ha funzionato da lingua comune de facto. Il lavoro agentico ha bisogno anche di tool call e output intermedi. Open Responses propone uno schema multi-provider basato su Responses». Il diagramma è l'obiettivo architetturale, non una prova che ogni provider supporti tutto. «Come POSIX: un accordo sul confine consente di cambiare implementazione». Controllare il sottoinsieme comune e le estensioni prima di dichiarare portabilità.

Sources: [Open Responses specification](https://www.openresponses.org/specification), [Responses streaming](https://developers.openai.com/api/docs/guides/streaming-responses)

## Slide 8 — Every new tool multiplies the wiring
<!-- id: wiring; chapter: Tools boundary; time: 9:30–11:00; speaker: Alessio -->

{{diagram:wiring}}

<p class="landing">A shared interface changes the <strong>shape of integration</strong></p>

> **Speaker notes:** Alessio · 9:30–11:00. A sinistra tre applicazioni e quattro servizi, dodici linee. A destra, al click, tre più quattro connessioni al contratto. «Come JDBC: N applicazioni e M database. Ogni coppia può avere un'integrazione propria, oppure ci accordiamo su un'interfaccia». La formula conta superfici d'integrazione in uno scenario ideale, non ore di sviluppo. Gli adapter e la semantica dei tool rimangono. Il valore iniziale di MCP è questo, prima di parlare di JSON-RPC.

Sources: [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

## Slide 9 — MCP gives capabilities a common interface
<!-- id: mcp; class: tool-slide; chapter: Tools boundary; time: 11:00–12:30; speaker: Alessio -->

{{diagram:mcp}}

<p class="landing">Expose the capability once. <strong>Reuse the integration</strong></p>
<p class="micro">JSON-RPC 2.0 / stdio or Streamable HTTP</p>

> **Speaker notes:** Alessio · 11:00–12:30. «L'host possiede esperienza utente, modello e policy. Un client MCP collega l'host al server che espone capability». Il click aggiunge l'API di dominio dietro al server: il backend mantiene il proprio contratto interno. Per l'esempio: un assistente che investiga un incidente consulta log e deploy. Il protocollo rende comune accesso e discovery, non rende una query corretta né concede automaticamente autorizzazioni. Non impantanarsi nel trasporto.

Sources: [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture)

## Slide 10 — Three primitives, three control patterns
<!-- id: control; class: tool-slide; chapter: Tools boundary; time: 12:30–14:00; speaker: Alessio -->

<div class="primitive-grid"><article><span class="stamp tool">Tools</span><h3>Act</h3><p>Model typically selects</p><div class="example">Read service errors</div></article><article class="fragment" data-fragment-index="0"><span class="stamp tool">Resources</span><h3>Know</h3><p>Application supplies context</p><div class="example">Service topology</div></article><article class="fragment" data-fragment-index="1"><span class="stamp tool">Prompts</span><h3>Start</h3><p>User selects a template</p><div class="example">Investigate an incident</div></article></div>

<p class="landing">The host retains <strong>policy and consent</strong></p>

> **Speaker notes:** Alessio · 12:30–14:00. Due click, una primitiva alla volta. Nel nostro incidente il tool recupera errori, la resource porta topologia, il prompt propone una procedura iniziale. Sono esempi concettuali. «Mi piace che le primitive abbiano modalità di controllo diverse». Dire “tipicamente”, non “soltanto”: il modello può scegliere un tool, l'applicazione decide cosa esporre e cosa eseguire. Il controllo dell'utente non scompare dietro al protocollo. Queste modalità sono un modello di interazione, non una legge assoluta né tre livelli di permesso.

Sources: [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)

## Slide 11 — Each endpoint adds more possible connections
<!-- id: network-effect; class: tool-slide; chapter: Tools boundary; time: 14:00–15:00; speaker: Alessio -->

{{diagram:network}}

<p class="landing">Ecosystem creates the <strong>network effect</strong></p>

> **Speaker notes:** Alessio · 14:00–15:00. Un click aggiunge un server al medesimo contratto: le applicazioni riusano il punto di integrazione. «La ragione per cui uno standard aperto prende valore è che ogni endpoint compatibile aumenta le connessioni possibili». È la nostra lettura dell'effetto di rete. Non promettere che ogni host gestisca tutte le estensioni. USB-C è la metafora rapida, JDBC quella per questo pubblico. Arrivare entro 15 minuti: il prossimo passaggio è la prima delega, oltre la capability.

## Slide 12 — “Investigate the payment failure and send me a diagnosis”
<!-- id: handoff; class: statement handoff; chapter: From access to delegation; time: 15:00–16:00; speaker: Alessio → Stefano; hide-title: true -->

<p class="kicker">Same incident. A different request</p>
<p class="request small-request">“Read the latest<br>payment errors”</p>
<p class="request fragment">“Investigate the payment failure<br>and send me a <strong>diagnosis</strong>”</p>
<p class="statement-caption fragment">Who owns the work on the other side?</p>

> **Speaker notes:** Alessio → Stefano · 15:00–16:00. Due click: prima il risultato delegato, poi la domanda. Alessio: «Abbiamo standardizzato come accedere a una capability. Ora voglio dire all'agente di Stefano: occupati tu di questo risultato. Potrebbe scegliere i suoi tool, chiedermi qualcosa, aspettare una persona». Stefano entra: «E questo è il confine di A2A». Non dire “ora parla Stefano”. Pausa breve sulla differenza di responsabilità. È lo stesso incidente, cambia il contratto richiesto.

## Slide 13 — A2A addresses an independent counterpart
<!-- id: a2a; class: agent-slide; chapter: Agents boundary; time: 16:00–17:30; speaker: Stefano -->

{{diagram:a2a}}

<div class="three-labels"><span>Agent Card</span><span>Messages / Tasks</span><span>Artifacts</span></div>
<p class="landing">Agree on the work. <strong>Keep internals private</strong></p>

> **Speaker notes:** Stefano · 16:00–17:30. «Qui il team pagamenti è una controparte con responsabilità propria». Il primo click mostra l'Agent Card: descrive capability, endpoint e requisiti di autenticazione, non dimostra affidabilità. Il secondo rivela internals dentro il perimetro remoto, deliberatamente fuori dal contratto. Riassumere messaggi, task quando serve un lavoro tracciabile, artifact come risultati. Un remote agent può rispondere immediatamente; non obbligare ogni interazione a una lunga procedura. Opaque execution riguarda ciò che la controparte deve esporre, non vieta accordi applicativi aggiuntivi.

Sources: [A2A core concepts](https://a2a-protocol.org/latest/topics/key-concepts/)

## Slide 14 — A task can outlive a single response
<!-- id: task; class: agent-slide; chapter: Agents boundary; time: 17:30–19:30; speaker: Stefano -->

{{diagram:task}}

<p class="landing">Track work, exchange input, receive <strong>artifacts</strong></p>
<p class="micro">Illustrative path / input-required is a pause, not completion</p>

> **Speaker notes:** Stefano · 17:30–19:30. Tre click: working, richiesta di input, ripresa e risultato. Nel nostro esempio il team remoto chiede un correlation ID. Il chiamante lo fornisce, il lavoro riprende e arriva una diagnosi con evidenze. Sono stati reali della spec, con un percorso illustrativo non esaustivo. Non inferire retry automatici, exactly-once, workflow engine o ripresa automatica di un task terminale. Per questa rappresentazione usiamo un task; A2A consente anche risposte dirette come messaggi. Streaming e notifiche asincrone sono modalità possibili secondo il supporto negoziato, non la distinzione fondamentale da MCP.

Sources: [Life of an A2A Task](https://a2a-protocol.org/latest/topics/life-of-a-task/)

## Slide 15 — Capability access + outcome delegation
<!-- id: together; chapter: The architecture; time: 19:30–22:00; speaker: Stefano -->

{{diagram:together}}

<div class="duo-caption"><p><span class="stamp tool">MCP</span> Invoke a capability</p><p><span class="stamp agent">A2A</span> Delegate an outcome</p></div>

> **Speaker notes:** Stefano · 19:30–22:00. È la slide da fotografare. Tre click costruiscono l'architettura: nostro accesso MCP a log/deploy, delega A2A al team pagamenti, tool MCP della controparte dentro il suo perimetro. «La domanda utile è: sto invocando una capability o delegando un outcome a una controparte autonoma?» Lo stato non è il discriminante: un server MCP può avere stato e un agente A2A può rispondere subito. Si può esporre un agente dietro un tool MCP se quello è il contratto desiderato. Alessio può aggiungere una sola frase senza prendere il palco: «Come JDBC e HTTP nello stesso backend: due confini diversi». Specificare che obiettivo, evidenze e limiti di tempo sono accordi del dominio. Il protocollo non certifica la diagnosi. Checkpoint: 22 minuti.

Sources: [A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/)

## Slide 16 — Let the user follow and guide the work
<!-- id: ui; chapter: Users boundary; time: 22:00–24:00; speaker: Stefano -->

{{diagram:ui}}

<div class="ui-labels"><p><strong>AG-UI</strong><br>Events &amp; shared state</p><p><strong>A2UI</strong><br>Declarative components</p><p><strong>MCP Apps</strong><br>Tool UI inside a host</p></div>

> **Speaker notes:** Stefano · 22:00–24:00. Dire subito: «MCP e A2A erano il cuore. Sul resto acceleriamo per vedere il pattern». Un click aggiunge il pannello UI. AG-UI dà un vocabolario per eventi e stato tra backend e frontend. A2UI descrive componenti che un client renderizza dal catalogo supportato. MCP Apps permette a un tool di fornire una UI interattiva in un host compatibile, con isolamento. Sono contratti distinti, non un'unica pipeline obbligatoria né equivalenti a WebSocket o HTML. Il pannello illustrato è una decisione umana sulla prossima azione dell'incidente. «Anche l'esperienza utente ha un confine». Chiusura del blocco Stefano: «E alcuni accordi utili sono molto più piccoli di un protocollo di rete». Alessio entra sulla prossima slide.

Sources: [AG-UI overview](https://docs.ag-ui.com/introduction), [A2UI](https://a2ui.org/), [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview)

## Slide 17 — A shared meaning can fit in a file
<!-- id: knowledge; chapter: Knowledge boundary; time: 24:00–26:00; speaker: Alessio -->

<div class="file-grid"><article><div class="file-icon">.md</div><h3>AGENTS.md</h3><p>Project instructions</p><span class="micro">Convention</span></article><article class="fragment" data-fragment-index="0"><div class="file-icon">/</div><h3>Agent Skills</h3><p>SKILL.md + resources</p><span class="micro">Load detail when needed</span></article><article class="fragment" data-fragment-index="1"><div class="file-icon">{ }</div><h3>Agent Plugins</h3><p>Manifest + reusable parts</p><span class="micro">Package / check client support</span></article></div>

<p class="landing">Interoperability starts when implementations <strong>agree on meaning</strong></p>

> **Speaker notes:** Alessio · 24:00–26:00. Due click, senza scendere nel manifest. «AGENTS.md è essenzialmente un file. Una skill è una directory con SKILL.md e risorse. La semplicità tecnica non ne diminuisce il valore: più implementazioni attribuiscono lo stesso significato allo stesso oggetto». Skill: nome e descrizione per discovery, istruzioni e risorse quando servono. Plugin: un pacchetto di elementi riutilizzabili, ma supporto dei client ed estensioni da verificare. Nell'incidente una skill può descrivere il runbook: è istruzione, non capability remota e non esecuzione garantita. L'analogia con man pages riguarda caricamento su richiesta, non equivalenza tecnica. Le istruzioni non sono autenticazione o permesso.

Sources: [AGENTS.md](https://agents.md/), [Agent Skills specification](https://agentskills.io/specification), [Agent Plugins](https://agent-plugins.org/)

## Slide 18 — Follow one request across boundaries
<!-- id: operations; chapter: Operations boundary; time: 26:00–27:00; speaker: Alessio -->

{{diagram:trace}}

<p class="landing">OpenTelemetry GenAI <strong>semantic conventions</strong></p>
<p class="micro">Propagate context / instrument each service / pin the convention version</p>

> **Speaker notes:** Alessio · 26:00–27:00. Sessanta secondi. Una richiesta dell'incidente attraversa modello, tool e delega remota. Serve correlare questi passaggi. Lo schema è un trace concettuale, non una cattura né durate misurate. «Se usate OTel, riconoscete il problema: stiamo concordando anche il vocabolario per osservare questi sistemi». Una trace non appare automaticamente perché entrambi i lati parlano MCP o A2A: occorre strumentare e propagare il contesto dove il confine lo consente. Pinnare e verificare la versione delle convenzioni GenAI.

Sources: [OpenTelemetry GenAI conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

## Slide 19 — Change the coding agent, keep the editor
<!-- id: acp; chapter: IDE boundary; time: 27:00–28:00; speaker: Alessio -->

{{diagram:acp}}

<p class="analogy">Agent Client Protocol <span>≈ the LSP pattern</span></p>
<p class="micro">Sessions / progress / permissions / cancellation</p>

> **Speaker notes:** Alessio · 27:00–28:00. Un click cambia il coding agent mantenendo editor e contratto. «ACP applica il pattern LSP al rapporto tra editor e coding agent». Specificare Agent Client Protocol, perché ACP è una sigla ambigua. Le sessioni e i permessi hanno semantiche diverse da un servizio linguistico; l'agente può modificare il progetto. Sostituibile nell'integrazione non significa stessa qualità o trasferimento automatico della memoria. Transizione a Stefano: «Resta un confine che fino a poco fa avremmo lasciato fuori dalla mappa: il denaro».

Sources: [Agent Client Protocol introduction](https://agentclientprotocol.com/get-started/introduction)

## Slide 20 — The next boundary: money
<!-- id: payments; class: payment-slide; chapter: Epilogue; time: 28:00–29:30; speaker: Stefano -->

<div class="payment-heading"><span class="http-code">402</span><div><h3>Payment Required</h3><p>A long-reserved HTTP status<br>gets a machine-readable payment contract</p></div></div>

{{diagram:payment}}

<p class="micro">x402 / request, terms, authorize, verify &amp; settle, deliver</p>

> **Speaker notes:** Stefano · 28:00–29:30. Epilogo opzionale: primo pezzo da saltare se siete lunghi. Due click: requisiti di pagamento e retry autorizzato con verifica/settlement. «HTTP aveva un posto riservato per Payment Required. x402 concorda come comunicare i termini e autorizzare un pagamento per una risorsa». Nel flusso exact comunemente illustrato il client firma un payload di autorizzazione; il server, eventualmente tramite facilitator, verifica e fa settlement prima di consegnare. Non rappresentare un trasferimento già completato prima del retry come unico modello. Non dire che 402 non sia mai stato usato, che spariscano vincoli del fornitore o che non esistano fee della rete. Qui interessa il nuovo confine, non un consiglio finanziario o un pitch crypto.

Sources: [x402 HTTP 402](https://docs.x402.org/core-concepts/http-402), [x402 client/server](https://docs.x402.org/core-concepts/client-server)

## Slide 21 — Adopt where replacement matters
<!-- id: bets; chapter: The bets; time: 29:30–30:30; speaker: Alessio -->

<div class="bets-grid"><article><span class="kicker tool-text">Start from a need</span><h3>MCP</h3><p>Reusable tool integrations</p><h3>A2A</h3><p>Independent agent delegation</p></article><article class="fragment" data-fragment-index="0"><span class="kicker model-text">Evaluate the contract</span><h3>Compatibility</h3><p>Common subset<br>Extensions<br>Independent implementations</p></article><article class="fragment" data-fragment-index="1"><span class="kicker agent-text">Keep the rest on your radar</span><h3>One boundary<br>at a time</h3><p>Introduce a standard when<br>the integration pain is real</p></article></div>

> **Speaker notes:** Alessio · 29:30–30:30. Due click. «Domani implementiamo tutto? Uno standard ha un costo. MCP quando riusate integrazioni di tool; A2A quando delegate a una controparte indipendente. Per il resto valutate il bisogno, il supporto reale, le estensioni». Non leggere un elenco di versioni: questa slide esprime i criteri di scelta dei relatori. AGENTS.md e skill possono essere utili già adesso, senza adottare tutto lo stack. «Gli standard arrivano un confine alla volta». Passare a Stefano per chiudere, senza aprire un quarto giro di presentazioni.

## Slide 22 — That is when a protocol becomes infrastructure
<!-- id: closing; class: statement paper; chapter: Closing; time: 30:30–31:30; speaker: Entrambi; hide-title: true -->

<p class="kicker">We have seen this before</p>
<p class="big-statement closing-text">Replace what is<br>on the other side.<br><strong>Keep your application</strong></p>
<p class="statement-caption fragment">That is when a protocol becomes infrastructure</p>

> **Speaker notes:** Entrambi · 30:30–31:30. Alessio: «La storia non ci dice quali sigle vinceranno. Ci aiuta a riconoscere il contratto abbastanza semplice da eliminare un'intera categoria di decisioni dalle applicazioni». Stefano, al click: «Quando posso sostituire ciò che sta dall'altra parte del confine senza riscrivere ciò che sta da questa parte, quel protocollo è diventato infrastruttura». Pausa. Nessun nuovo contenuto dopo questa frase. Ringraziare e avanzare alla Q&A. Target prova: 31:30, margine 3:30 per pause e handoff.

## Slide 23 — Grazie! Questions?
<!-- id: questions; chapter: Discussion; time: Q&A; speaker: Entrambi -->

<div class="qa-layout"><div><p class="qa-prompt">Which boundary<br>hurts in <strong>your system</strong>?</p><p>Stefano Maestri<br><span class="muted">maeste.it</span></p><p>Alessio Soldano<br><span class="muted">aladinodigitale.it</span></p><p class="small"><a href="sources.html">Sources &amp; further reading</a></p></div><figure class="qr-card"><img src="assets/talk-qr.svg" alt="QR to maeste.it/speaking/agents-speak-protocol.html"><figcaption>Slides &amp; feedback<br><a href="../speaking/agents-speak-protocol.html">maeste.it/speaking/<br>agents-speak-protocol.html</a></figcaption></figure></div>

> **Speaker notes:** Entrambi · Q&A. Lasciare proiettata questa slide: il QR usa la pagina già esistente del talk e lo stesso feedback. Per i backup: destra entra nell'appendice, giù passa tra le slide; tornare poi alla Q&A. Domande attese: MCP/A2A, stato, security, AG-UI/A2UI, perché ACP breve, x402, sostituibilità effettiva. Non usare le domande per recuperare un catalogo di protocolli. Se non sappiamo una risposta di versione, verificare la spec invece di improvvisare.

# Appendix

## A1 — Choose the interaction contract
<!-- id: comparison; chapter: Appendix; speaker: Entrambi -->

| Question | MCP | A2A |
| --- | --- | --- |
| What does the caller need? | Access to a capability | Work from an independent counterpart |
| Main building blocks | Tools, resources, prompts | Agent Card, messages, tasks, artifacts |
| Does state decide the choice? | No: implementations can keep state | No: direct responses are possible |
| Can an agent sit behind it? | Yes, exposed as a capability | Yes, addressed as a remote agent |
| What must still be designed? | Domain semantics, policy, errors | Outcome, evidence, limits, trust |

<p class="landing">Choose by the <strong>contract needed by the caller</strong></p>

> **Speaker notes:** Non dire che le possibilità non si sovrappongano mai. Si può incapsulare un agente in un tool. Chiedere quale parte dell'interazione deve diventare interoperabile: accesso a capability oppure delega con lifecycle, messaggi e risultato. Lo stato e la durata non sono test sufficienti. È la precisazione alla regola pratica della slide 15.

Sources: [A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/)

## A2 — A shared protocol still needs a trust model
<!-- id: trust; chapter: Appendix; speaker: Entrambi -->

<div class="primitive-grid"><article><span class="kicker">Identity</span><h3>Who is calling?</h3><p>Authentication<br>Delegated identity</p></article><article><span class="kicker">Authority</span><h3>What is allowed?</h3><p>Least privilege<br>Host policy / consent</p></article><article><span class="kicker">Evidence</span><h3>What can we trust?</h3><p>Validate inputs and outputs<br>Assess the result</p></article></div>

<p class="landing">Discovery describes a peer. <strong>It does not establish trust</strong></p>

> **Speaker notes:** Risposta alla domanda security: connettività e discovery non creano da sole fiducia. L'autenticazione non equivale ad autorizzare ogni tool o outcome. I contenuti esterni possono essere non affidabili. Concordare policy, limitare privilegi e validare l'adeguatezza del risultato. Un artifact conforme può contenere una diagnosi sbagliata. Evitare una checklist che divorerebbe il talk principale: usare solo se chiesto.

Sources: [A2A enterprise features](https://a2a-protocol.org/latest/topics/enterprise-ready/), [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)

## A3 — Three UI contracts, different responsibilities
<!-- id: ui-comparison; chapter: Appendix; speaker: Entrambi -->

| Contract | What it standardizes | What the client owns |
| --- | --- | --- |
| AG-UI | Agent/frontend event and state exchange | Application experience and event handling |
| A2UI | Declarative component and data descriptions | Supported catalog and rendering |
| MCP Apps | Interactive UI supplied by MCP tools | UI hosting, isolation and permissions |

<p class="landing">Compose what you need. <strong>No mandatory full stack</strong></p>

> **Speaker notes:** A2UI può viaggiare su diversi canali, anche insieme ad AG-UI. MCP Apps è un'estensione lato tool/host; non è la stessa cosa di una descrizione dichiarativa A2UI. Il fatto che tutti possano mostrare UI non significa che siano intercambiabili. La slide 16 li colloca nello stesso confine umano, ma mantiene ruoli diversi.

Sources: [AG-UI](https://docs.ag-ui.com/introduction), [A2UI](https://a2ui.org/), [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview)

## A4 — x402: authorization before settlement
<!-- id: payment-detail; chapter: Appendix; speaker: Stefano -->

{{diagram:payment-detail}}

<p class="micro">V2 headers: PAYMENT-REQUIRED / PAYMENT-SIGNATURE / PAYMENT-RESPONSE</p>

> **Speaker notes:** Flusso illustrativo exact, non tutte le modalità x402. Prima il server comunica i termini, poi il client autorizza con un payload firmato e ripete la richiesta. Il server verifica e fa settlement, anche tramite un facilitator, e restituisce la risorsa se il pagamento riesce. Non confondere firma con settlement già avvenuto. Wallet, asset, network, policy di spesa e fee della rete restano scelte concrete. Il protocollo non garantisce assenza universale di account, KYC o requisiti di business.

Sources: [x402 HTTP headers](https://docs.x402.org/core-concepts/http-402), [x402 client/server](https://docs.x402.org/core-concepts/client-server)

## A5 — Test replacement, not just protocol support
<!-- id: replacement-test; chapter: Appendix; speaker: Entrambi -->

1. Connect two independent implementations
2. Exercise the common capability subset
3. Check errors, permissions and lifecycle
4. Identify private extensions and semantics
5. Replace one side and measure what changes

<p class="landing">Compatibility is something you <strong>demonstrate</strong></p>

> **Speaker notes:** Risposta alla domanda “rischiamo un nuovo SOAP?”: la complessità può tornare nelle estensioni e negli accordi privati. Il test utile è sostituire una parte, misurare cosa riusiamo e quali adapter restano. Il protocollo comune riduce una classe di integrazioni, non ogni costo. È un criterio proposto dai relatori per applicare la tesi della slide 5.
