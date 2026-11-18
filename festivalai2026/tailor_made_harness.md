# Your Agent Harness Should Be Tailor-Made

**What this is:** sorgente di verità del talk (slide EN, parlato IT), 15 minuti, conferenza
sviluppatori. Questa versione incorpora la rielaborazione del corso "Learn Harness Engineering"
(walkinglabs.github.io/learn-harness-engineering/en, lectures 01, 02, 04, 05, 07, 09, 13):
su richiesta, la fonte non è citata in slide o note, né i lavori che il corso riporta come
primari quando sono già citati direttamente (Anthropic e OpenAI engineering, paper arXiv).
I diagrammi delle pagine (mermaid) sono ricostruiti con la grafica del deck, nessuna immagine
esterna. Il deck proiettabile è `tailor_made_harness-deck/index.html`: frecce per navigare,
`S` vista speaker con note, `Esc` panoramica, `↓` entra nell'appendice.

**Come rigenerare il materiale:** i numeri arrivano da: esperimento same-model Anthropic
(bare vs planner/generator/evaluator), paper arXiv 2607.06906 e 2605.23950 (CY26W37), caso
a quattro stadi 20%→100% e caso FastAPI dalla lecture 01/02 del corso, esperimento
milione-di-righe OpenAI, studio "Lost in the Middle" (arXiv 2307.03172), architettura entry
file + topic docs dalla lecture 04, verifica a tre livelli dalla lecture 09, primitive e
tipi di loop dalla lecture 13. Regole reali del mio setup (CLAUDE.md) e batterie di giudizio
dalle skill di review restano invariate.

**Convenzione:** per ogni slide, titolo e bullet in EN (come nel deck), note parlato in IT.

---

## Slide 1 — Title

<div class="eyebrow">Festival AI Ticino 2° edizione</div>

# Your Agent Harness Should Be Tailor-Made

<p class="thesis">The problem isn't the model. <strong>It's the off-the-rack harness.</strong></p>

<p class="dimtext small">Stefano Maestri · maeste.it · Risorse Artificiali</p>

> **Speaker notes:**
>
> _⏱ 0:00 → 0:40 · 40s_
>
> Buongiorno a tutti. Sono Stefano Maestri. Da più di un anno costruisco agenti, e soprattutto quello che ci sta intorno. Ne parlo ogni settimana in Risorse Artificiali, podcast e newsletter.
>
> Una domanda veloce: alzi la mano chi ha visto un agente dire **"fatto, funziona"**… e poi non funzionava niente. *[pausa, guarda la sala]* Ecco.
>
> La tesi di oggi in una frase: quasi sempre **il problema non è il modello**. È il guscio che gli abbiamo messo intorno, l'**harness**. E di solito è un abito preso dallo scaffale: taglia unica, cucito su nessuno.

---

## Slide 2 — The demo works. Until it doesn't.

<div class="eyebrow">the problem · the failures</div>

<div class="grid2">
  <div class="dbox fail"><b>Loops forever</b>on a tricky task, burning tokens<div class="dlabel">same turn, same mistake, all night</div></div>
  <div class="dbox fail"><b>Edits the wrong files</b>in the wrong place<div class="dlabel">the conventions live in heads, not in the repo</div></div>
  <div class="dbox fail"><b>Invents tools</b>that don't exist<div class="dlabel">calls an API nobody wrote</div></div>
  <div class="dbox fail"><b>Drifts off mission</b>politely, mid-task<div class="dlabel">busy, plausible, no longer yours</div></div>
  <div class="dbox fail span2"><b>Declares victory too early:</b> "the code looks fine" becomes "the feature is complete"<div class="dlabel">the verification gap: the most common failure of all</div></div>
</div>

<p class="rule">You installed a framework, dropped in a system prompt, wired a few tools, and shipped. The demo was fine.</p>

> **Speaker notes:**
>
> _⏱ 0:40 → 1:55 · 75s_
>
> Lo scenario lo conoscete. Installi un framework, scrivi un system prompt, colleghi tre tool. La demo va benissimo. Poi lo lasci lavorare da solo.
>
> Si incastra in un **loop**: stessa strada, stesso errore, venti turni, token che bruciano tutta la notte. Modifica il **file sbagliato**, perché le convenzioni stanno nella testa del team o in un thread Slack di tre mesi fa: lui non le ha mai viste. **Chiama un'API** che nessuno ha mai scritto. Parte con una missione e, molto educatamente, a metà lavoro ne sta **inseguendo un'altra**.
>
> E il più frequente di tutti: **dichiara vittoria troppo presto**. "Il codice sembra a posto" diventa "la feature è completa". Unit test verdi, il flusso vero non l'ha mai eseguito nessuno.
>
> Un dettaglio che adoro: quando sentono che il contesto sta finendo, gli agenti **accelerano per chiudere**. Saltano la verifica, scelgono la via facile. Ansia da contesto.
>
> Però tenete a mente una cosa: **lo stesso identico modello, altrove, fa cose eccellenti.**

---

## Slide 3 — The problem isn't the model

<div class="eyebrow">the evidence · same horse, different fates</div>

<div class="cols">
<div class="col">

**Same model, same prompt.** Only the harness changes.

| bare harness | tailored (3 roles) |
|---|---|
| 20 min · $9 | 6 h · $200 |
| app opens, **input dead** | **core gameplay works** |

*(documented case, Anthropic engineering, 2026)*

</div>
<div class="col">

**The papers agree** *(arXiv 2607.06906 · 2605.23950)*

| | |
|---|---|
| same six models, orchestration only | cost **−41%** · time **−44%** · tokens **−38%** |
| harness vs model variance, long horizon | **×7** |

</div>
</div>

<p class="rule">Swap the model, little changes. <strong>Reshape the scaffolding, everything changes.</strong></p>

> **Speaker notes:**
>
> _⏱ 1:55 → 3:10 · 75s_
>
> E non è un'opinione mia. Il caso più pulito che conosco l'ha documentato Anthropic. Stesso modello, stesso prompt: "costruisci un editor di giochi retrò".
>
> Harness nudo: **venti minuti, nove dollari**. L'app si apre… ma non risponde agli input.
>
> Harness su misura, con tre ruoli: uno pianifica, uno genera, uno **verifica cliccando davvero** sull'app. **Sei ore, duecento dollari**, e il gameplay funziona.
>
> Non vi sto dicendo "spendete di più". Vi sto dicendo che la variabile che ha cambiato il risultato **non è il modello**.
>
> I paper dicono la stessa cosa con la statistica. Sei modelli fissi, cambia solo l'orchestrazione: costi **meno 41%**, tempi meno 44, token meno 38. E sui task lunghi la varianza dovuta all'harness è **sette volte** quella dovuta al modello. *[pausa]*
>
> Confrontare due modelli senza dire in che harness girano è come confrontare due piloti senza dire che macchina guidavano.

---

## Slide 4 — James Bond doesn't buy off the rack

<div class="eyebrow">the metaphor · q branch</div>

<div class="diagram center">
  <div class="dbox hero">Q</div>
  <div class="darrow">──▶</div>
  <div class="dstack">
    <div class="dbox ok"><b>Hidden compartment</b><span class="dlabel">for the mission: what "done" means, what never to touch</span></div>
    <div class="dbox ok"><b>Right fit</b><span class="dlabel">for the wearer: how you work, your rules, your taste</span></div>
    <div class="dbox ok"><b>Built to move</b><span class="dlabel">for the terrain: builds, tests, repo layout, CI</span></div>
  </div>
</div>

<p class="rule">Developer, project, mission: <strong>three bodies, zero shared measurements.</strong></p>

> **Speaker notes:**
>
> _⏱ 3:10 → 3:55 · 45s_
>
> James Bond non compra l'abito già fatto. C'è **Q**, che glielo costruisce addosso, per quella missione, con lo scomparto nascosto esattamente dove serve.
>
> Noi abbiamo tre corpi da misurare. **La missione**: cosa vuol dire "fatto", cosa non si tocca mai. **Chi lo indossa**, cioè voi: come lavorate, le vostre regole, il vostro gusto. E **il terreno**, il progetto: build, test, struttura del repo, CI.
>
> Tre misure che nessun framework può conoscere in fabbrica. Ma prima di cucire bisogna sapere di cosa è fatto l'abito.

---

## Slide 5 — What a harness actually is

<div class="eyebrow">anatomy · five subsystems, one loop</div>

<div class="diagram center tight">
  <div class="dstack">
    <div class="dbox ctrl"><b>Project rules</b><span class="dlabel">briefing · red lines</span></div>
    <div class="dbox ctrl"><b>State</b><span class="dlabel">progress · memory on disk</span></div>
  </div>
  <div class="darrow">──▶</div>
  <div class="dbox hero">agent</div>
  <div class="darrow">──▶</div>
  <div class="dstack">
    <div class="dbox exec"><b>Tools</b><span class="dlabel">shell · files · tests</span></div>
    <div class="dbox exec"><b>Runtime</b><span class="dlabel">deps · services · versions</span></div>
  </div>
  <div class="darrow">──▶</div>
  <div class="dbox ctrl"><b>Checks</b><span class="dlabel">test · lint · build</span></div>
</div>
<p class="dlabel">checks feed back into the agent, every turn: the loop closes</p>

<div class="cols small">
<div class="col">

- **Instructions**: system prompt (the briefing), guardrails (the red lines)
- **Tools**: boundaries, least privilege
- **Environment**: reproducible, self-describing

</div>
<div class="col">

- **State**: context and memory that survive the session
- **Feedback**: stop conditions, evals, budget, loop control

</div>
</div>

<p class="rule">A prompt file is not a harness. <strong>The loop is.</strong></p>

> **Speaker notes:**
>
> _⏱ 3:55 → 5:10 · 75s · checkpoint: se sei oltre 4:30, accorcia la 6 e la 10_
>
> Quindi, cos'è un harness? **Cinque sottosistemi e un giro.**
>
> *[indica a sinistra]* Le **istruzioni**: il briefing e le linee rosse. Lo **stato**: la memoria che sopravvive alla sessione, su disco. Queste entrano nell'agente. *[al centro]* L'agente lavora con i **tool** (shell, file, test) dentro un **ambiente**: dipendenze, servizi, versioni. *[a destra]* E poi i **controlli**: test, lint, build.
>
> La parte importante è la freccia che non vedete: i risultati dei controlli **tornano all'agente come input**, a ogni giro. Il cerchio si chiude. Ecco perché si chiama harness.
>
> Un file di prompt non è un harness: è un pezzo di un sottosistema. **L'harness è il loop.** E se ne manca uno dei cinque, il loop si apre. Indovinate dove? Esattamente nei fallimenti di prima.

---

## Slide 6 — Where generic defaults fail

<div class="eyebrow">the map · each failure has an owner among the five</div>

<div class="tablewrap">

| The failure | The missing piece |
|---|---|
| Loops forever | **stop conditions** + **budget** |
| Edits the wrong files | **instructions** that know the real inventory |
| Invents tools | **tool boundaries** + project constraints |
| Drifts off mission | definition of done + **loop control** |
| Declares victory too early | **externalized verification** (worker ≠ checker) |

</div>

<p class="rule">Autonomy is exactly where <strong>nobody's defaults stop working.</strong></p>

> **Speaker notes:**
>
> _⏱ 5:10 → 5:55 · 45s · tagliabile_
>
> Ogni fallimento ha un responsabile preciso. *[scorri la tabella, una riga a testa, veloce]* Loop infinito: mancano **stop condition e budget**. File sbagliato: istruzioni che non conoscono il progetto vero. Tool inventato: **perimetri** mai disegnati. Drift: nessuno ha scritto cosa vuol dire "fatto". Vittoria prematura: nessuno, **fuori dall'agente**, verifica.
>
> Perché nelle demo i default reggono? Perché lì ci siete voi, che correggete a ogni turno. Cedono esattamente dove comincia l'**autonomia**: l'agente da solo, per ore, con soldi veri.
>
> Vediamo tre sartorie concrete.
>
> _Se sei in ritardo: dici solo le ultime tre frasi._

---

## Slide 7 — Tailoring #1: encode the project's constraints

<div class="eyebrow">tailoring one of three · the instructions subsystem</div>

<div class="cols">
<div class="col">

**Off the rack: the giant file**

```text
AGENTS.md, 600 lines
├─ top      → recalled
├─ line 300 → the security rule,
│             diluted, ignored
└─ bottom   → recalled
```

Every failure adds a rule. The file only
grows: context budget eaten, priorities
blur, contradictions pile up.

</div>
<div class="col">

**Tailored: an entry file that routes**

```text
AGENTS.md, 50–200 lines
├─ overview + quick start
├─ hard constraints (≤15, real)
│   - Python: never relative imports.
│   - git: one plain command per call.
│   - never two builds in one tree.
└─ links → docs/api · docs/db · docs/testing
             (read only when the task needs them)
```

</div>
</div>

<p class="rule">Every rule on the right is a scar. <strong>Off-the-rack doesn't know your scars. And an encyclopedia is not a map.</strong></p>

> **Speaker notes:**
>
> _⏱ 5:55 → 7:25 · 90s_
>
> **Prima sartoria: le istruzioni.**
>
> Il default è nessuna istruzione scritta. E la reazione naturale, quando si comincia, è il **file unico**: AGENTS.md, CLAUDE.md, dove buttare tutto. L'agente sbaglia? Aggiungi una regola. Il file cresce, seicento righe, e arrivano i guai: mangia contesto, le priorità si confondono, le regole si contraddicono.
>
> E c'è un effetto misurato, si chiama **"lost in the middle"**: i modelli usano molto meglio quello che sta all'inizio e alla fine di un testo lungo che quello che sta in mezzo. La vostra regola di sicurezza a riga trecento? Diluita. Ignorata.
>
> La sartoria: il file d'ingresso è un **router, non un'enciclopedia**. Da cinquanta a duecento righe. Panoramica, come si avvia, e al massimo una **quindicina di vincoli veri**. Il resto in documenti per tema, che l'agente apre solo quando il task li richiede.
>
> *[indica la colonna destra]* Queste regole sono le mie, prese pari pari dal mio setup. Ognuna è una **cicatrice**. "Mai due build nello stesso albero": dietro ci sono due agenti che compilavano nella stessa cartella e test che fallivano a caso, per un pomeriggio intero. Ed è proprio questo che un abito da scaffale non può sapere: le vostre cicatrici.
>
> E si manutengono come codice: quelle vecchie si buttano.

---

## Slide 8 — Tailoring #2: define "done"

<div class="eyebrow">tailoring two of three · the feedback subsystem</div>

<div class="diagram center tight">
  <div class="dbox fail"><b>"agent says done"</b><span class="dlabel">a feeling, not a fact</span></div>
  <div class="darrow">──▶</div>
  <div class="dstack">
    <div class="dbox"><b>Layer 1 · static</b><span class="dlabel">lint · typecheck</span></div>
    <div class="darrow">▼</div>
    <div class="dbox"><b>Layer 2 · runtime</b><span class="dlabel">tests · the app actually starts</span></div>
    <div class="darrow">▼</div>
    <div class="dbox"><b>Layer 3 · end-to-end</b><span class="dlabel">the full user flow, really executed</span></div>
    <div class="darrow">▼</div>
    <div class="dbox ok"><b>done</b><span class="dlabel">only after all three</span></div>
  </div>
</div>

<div class="cols small">
<div class="col">

- Done is a **stop condition**, stated before the work starts: criteria, perf budget, perimeter
- The judgment is **externalized**: the one who writes the code doesn't grade their own homework

</div>
<div class="col">

- Error messages carry **repair instructions**: what failed, where, how to fix
- **No refactoring until core functionality is verified**

</div>
</div>

<p class="rule">If the judgment stays inside the agent, <strong>"done" is a mood, not a fact.</strong></p>

> **Speaker notes:**
>
> _⏱ 7:25 → 8:55 · 90s_
>
> **Seconda sartoria: definire "fatto".** Qui attacchiamo il fallimento più comune.
>
> Le reti neurali sono sistematicamente **sovraconfidenti**. Un modello che giudica il proprio lavoro è, per costruzione, generoso con se stesso. Non lo correggete chiedendogli di essere più obiettivo. Lo correggete **separando chi fa da chi controlla**.
>
> Due mosse. Prima: "fatto" si scrive **prima di cominciare**, come stop condition che una macchina può verificare: criteri, budget di prestazioni, perimetro da non toccare. Per esempio: "l'endpoint ordini risponde sotto i 200 millisecondi sul dataset di test, e lo schema del database non si tocca".
>
> Seconda: il giudizio si porta fuori dall'agente, su **tre livelli**. *[scendi col dito sul diagramma]* Statico: lint e typecheck, il minimo sindacale. Runtime: i test passano e **l'app parte davvero**. End-to-end: il **flusso utente completo**, eseguito davvero. Si sale di livello solo se quello prima è verde.
>
> Due dettagli che valgono oro. I messaggi di errore devono contenere **istruzioni di riparazione**: cosa è fallito, dove, come si sistema. Così l'agente si corregge da solo, senza di voi. E **niente refactoring** finché il funzionale non è verificato.
>
> Se il giudizio resta dentro l'agente, "fatto" è uno stato d'animo, non un fatto.

---

## Slide 9 — Tailoring #3: guard the loop

<div class="eyebrow">tailoring three of three · loop control</div>

<p class="small">The simplest loop is one command: a <b>goal</b>, a <b>verification method</b>, a <b>stopping condition</b>. Four kinds, chosen by one test: <b>does this thing have an end?</b></p>

<div class="diagram center tight">
  <div class="dbox ctrl"><b>Trigger</b><span class="dlabel">schedule · event · previous task done</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox"><b>Discover</b><span class="dlabel">progress file · issue tracker</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox"><b>Dispatch</b><span class="dlabel">spawn an isolated worker</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox"><b>Verify</b><span class="dlabel">tests · an independent judge</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox"><b>Persist</b><span class="dlabel">progress · commit · PR</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox ok"><b>Your inbox</b><span class="dlabel">work remains: it loops. done or blocked: you decide</span></div>
</div>

<p class="rule">The loop must not be guarded only by the thing <strong>inside the loop.</strong></p>

> **Speaker notes:**
>
> _⏱ 8:55 → 10:25 · 90s_
>
> **Terza sartoria: il loop.**
>
> Oggi il loop più semplice è un comando solo: un **obiettivo**, un **metodo di verifica**, una **condizione di stop**. Tipo: "fai passare tutta la suite di integrazione; verifica con `make test`; fermati dopo trenta giri o se devi toccare le migration". Lo lanciate e chiudete il portatile.
>
> La domanda decisiva è: a chi affidate il giudizio su "fatto"? Non all'agente che ha fatto il lavoro. A un **giudice indipendente**: un altro modello, uno script, una suite di test.
>
> Prima di costruirne uno, una domanda sola: **questa cosa ha una fine?** Se sì, è un loop a obiettivo: una maratona, con un traguardo. Se no, è sorveglianza: una sveglia che suona a intervalli. L'errore classico è mettere un lavoro con un traguardo dentro un loop a tempo: ogni giro riparte da zero.
>
> *[segui il diagramma da sinistra]* Ecco un loop a regime. Un **trigger**: un orario, un evento, il task precedente chiuso. Scopre il lavoro, dal file dei progressi o dall'issue tracker. Lo affida a un **worker isolato**. Un **giudice indipendente** verifica. Lo stato si salva: commit, PR. E a voi arriva solo quello che richiede una decisione.
>
> La regola che mi porto dietro da un anno: **il loop non può essere sorvegliato solo da chi sta dentro il loop.**

---

## Slide 10 — The loop's toolkit: six primitives

<div class="eyebrow">what to reach for · the parts a real loop is made of</div>

<div class="diagram center tight">
  <div class="dbox ctrl"><b>Automations</b><span class="dlabel">the heartbeat: scheduled and event triggers</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox exec"><b>Worktrees</b><span class="dlabel">parallel isolation, no collisions</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox ctrl"><b>Skills</b><span class="dlabel">project knowledge, written once</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox exec"><b>Connectors</b><span class="dlabel">issue tracker · db · staging · chat</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox"><b>Sub-agents</b><span class="dlabel">maker / checker split</span></div>
  <div class="darrow">──▶</div>
  <div class="dbox ok"><b>External state</b><span class="dlabel">the spine: memory on disk, not in the window</span></div>
</div>
<p class="dlabel">the state feeds back into every heartbeat: everything reads and writes it</p>

<p class="rule">The agent forgets. <strong>The repository doesn't.</strong></p>

> **Speaker notes:**
>
> _⏱ 10:25 → 11:25 · 60s · tagliabile a 30s_
>
> Con cosa si costruisce? Sei pezzi.
>
> Le **automazioni** sono il battito: senza, il loop non si sveglia mai. I **worktree**: ogni agente nel suo checkout, niente collisioni, ma il limite vero diventa la vostra capacità di fare review. Le **skill**: la conoscenza del progetto scritta una volta e riletta a ogni giro. I **connettori**, via MCP: issue, database, staging, chat. È la differenza tra "ecco la fix" e una pull request aperta, col ticket collegato e il canale già avvisato. I **sub-agent**: chi fa e chi controlla. E lo **stato esterno**, la spina dorsale: memoria su disco, non nella finestra di contesto.
>
> L'agente dimentica. **Il repository no.**
>
> _Versione corta: automazioni, sub-agent, stato esterno, poi la frase finale._

---

## Slide 11 — The numbers agree

<div class="eyebrow">the receipts · same models, tailored scaffolding</div>

<div class="grid2">
  <div class="dbox num"><b>20% → ~100%</b>same model, four harness additions over four iterations<div class="dlabel">rules, verification commands, progress state</div></div>
  <div class="dbox num"><b>−41% / −44% / −38%</b>cost / time / tokens, six fixed models<div class="dlabel">only the orchestration changed</div></div>
  <div class="dbox num"><b>×7</b>harness variance vs model variance<div class="dlabel">long-horizon tasks</div></div>
  <div class="dbox num"><b>~1M lines</b>three engineers who wrote no code themselves<div class="dlabel">~1,500 PRs in five months, agent-generated</div></div>
</div>

<p class="rule">None of these numbers were moved by a bigger model.</p>

> **Speaker notes:**
>
> _⏱ 11:25 → 12:15 · 50s_
>
> Torniamo ai numeri. Il mio preferito è il primo. Stesso modello, stesso progetto, quattro iterazioni in cui si aggiunge **solo harness**: le regole del progetto, i comandi di verifica, lo stato dei progressi. Il tasso di successo passa **dal venti a quasi il cento per cento**. Il modello non è mai cambiato.
>
> Poi i due paper che abbiamo visto. E l'esperimento di OpenAI: circa **un milione di righe**, millecinquecento pull request in cinque mesi, tre ingegneri che il codice non lo scrivevano: scrivevano obiettivi e verifiche. E quando qualcosa falliva, la domanda non era "il modello non ce la fa", era **"che pezzo di harness manca?"**
>
> *[pausa]* Nessuno di questi numeri l'ha spostato un modello più grande.

---

## Slide 12 — The reframe: harness as runtime

<div class="eyebrow">closing idea · software, not configuration</div>

- The harness is the <b>runtime</b>. Agents are the <b>software</b> that runs on it.
- <b>The repo is the spec:</b> everything the agent needs lives in the repository, structured, verifiable.
- <b>Harness rots like code.</b> Audit it. Pay down harness debt like technical debt.

<p class="rule">Whoever owns the harness <strong>owns the agent.</strong></p>

> **Speaker notes:**
>
> _⏱ 12:15 → 13:05 · 50s_
>
> Allora cambiamo prospettiva. Finché trattate l'harness come **configurazione**, vi aspettate che i default bastino. Ma l'harness è il **runtime**, e gli agenti sono il software che ci gira sopra.
>
> **Il repository è la specifica**: quello che l'agente non vede, per lui non esiste. Quindi tutto vive lì, strutturato e verificabile.
>
> E siccome è software, **marcisce come il software**: regole vecchie, vincoli scaduti, rumore. Fate audit, e pagate il debito di harness come pagate il debito tecnico.
>
> Chi possiede l'harness possiede l'agente. *[pausa]* E vorrei che a possederlo foste voi.

---

## Slide 13 — Takeaways

<div class="eyebrow">takeaways · three moves, monday morning</div>

1. **When things fail, fix the harness first.** A good instructions file can beat a more expensive model.
2. **Tailor it:** a router, not an encyclopedia; "done" verified in three layers by someone other than the writer; loops with their own stopping judgment.
3. **Start where it hurts:** one rule per scar, one spec per task, one loop with an independent judge.

<p class="rule">A good prompt helps for one turn. <strong>A good harness helps permanently.</strong></p>

> **Speaker notes:**
>
> _⏱ 13:05 → 14:05 · 60s_
>
> Tre cose da portare a casa.
>
> **Uno**: quando qualcosa fallisce, sospettate prima l'harness. Cambiare modello è quasi sempre l'opzione più cara, e un buon file di istruzioni può battere un modello più costoso.
>
> **Due**: cucitelo su misura. Un router, non un'enciclopedia. "Fatto" verificato su tre livelli, da qualcuno che non ha scritto il codice. Loop con il loro giudice.
>
> **Tre**: partite da dove fa male. Una regola per ogni cicatrice, una specifica per ogni task, un loop con un giudice indipendente.
>
> Un compito per lunedì: prendete l'ultima volta che un agente vi ha detto "fatto" e non era vero. **Scrivete la definizione di "fatto" che mancava.** È il primo punto di cucitura.
>
> Un buon prompt vi aiuta per un turno. **Un buon harness vi aiuta per sempre.**

---

## Slide 14 — Thank you

<div class="eyebrow">thank you</div>

# Tailor the harness. Keep the agent.

<p class="dimtext">Stefano Maestri · maeste.it</p>
<p class="dimtext small">Risorse Artificiali: podcast &amp; newsletter · slides: maeste.it/speaking</p>

> **Speaker notes:**
>
> _⏱ 14:05 → 14:25 · 20s_
>
> **Cucite l'harness, tenetevi l'agente.** Grazie.
>
> Mi trovate su maeste.it, e ogni settimana su Risorse Artificiali. Le slide sono online, con un'appendice: i paper, l'audit in cinque punti, i tipi di loop. Se c'è tempo, prendo volentieri le domande.
>
> _Appendice: freccia giù. Ogni slide ha la risposta pronta._

---

# Appendix

## Slide A1 — The Harness Effect, in detail

<div class="eyebrow">appendix · arxiv 2607.06906</div>

- Design: **six frontier models**, same task suite; **orchestration is the only** independent variable
- Result: cost per task **−41%**, time **−44%**, tokens **−38%**
- Implication: benchmark scores without harness disclosure **do not transfer** to your stack

> **Speaker notes:**
>
> _Appendice · se chiedono del primo paper_
>
> Sei modelli frontier, stessa suite di task. L'**unica variabile è l'orchestrazione**. Risultato: per lo stesso lavoro, costi, tempi e token scendono di circa il quaranta per cento.
>
> La conseguenza pratica: un benchmark che non dichiara l'harness **non vale per il vostro stack**.

## Slide A2 — Binding Constraint Thesis, in detail

<div class="eyebrow">appendix · arxiv 2605.23950</div>

- Claim: on long-horizon tasks, **harness-induced variance exceeds model-induced variance** (×7 in their experiment)
- "Stop comparing LLM agents **without disclosing the harness**"
- Model choice is a one-bit decision. **Harness design is the whole rest of the search space.**

> **Speaker notes:**
>
> _Appendice · se chiedono del secondo paper_
>
> Sui task lunghi la varianza dovuta all'harness supera quella dovuta al modello: **sette volte**, nel loro esperimento. Il titolo dice già tutto: smettete di confrontare agenti senza dichiarare l'harness.
>
> La frase da dire: scegliere il modello è una decisione da un bit. **Progettare l'harness è tutto il resto.**

## Slide A3 — The five-subsystem audit

<div class="eyebrow">appendix · where is my harness broken?</div>

<div class="tablewrap">

| Subsystem | Ask yourself | Score 1–5 |
|---|---|---|
| Instructions | do the rules exist in the repo, or only in heads? | |
| Tools | least privilege granted, or everything/nothing? | |
| Environment | self-describing? locked versions? reproducible? | |
| State | does memory survive the session? | |
| Feedback | can the agent verify itself with commands? | |

</div>

- Fix the **lowest score first**: usually feedback (highest ROI)
- Then ablate: remove one subsystem at a time, measure the drop; as models improve, some components stop being critical, <b>new critical ones emerge</b>

> **Speaker notes:**
>
> _Appendice · "da dove comincio?"_
>
> Cinque domande, un voto da uno a cinque ciascuna. Sistemate prima **il voto più basso**: quasi sempre è il feedback, cioè i comandi di verifica, ed è anche quello che rende di più.
>
> Poi fate ablazione: togliete un pezzo alla volta e misurate quanto perdete. Coi modelli nuovi alcuni pezzi smettono di servire e ne diventano critici altri. **La lista cambia, non sparisce.**

## Slide A4 — Loop types, in detail

<div class="eyebrow">appendix · four families, one test</div>

<div class="tablewrap">

| Type | Trigger | Stop condition | Best for |
|---|---|---|---|
| turn-based | you type each prompt | agent thinks done, or you interrupt | small, exploratory |
| goal | you give a goal | **independent judge** confirms, or max turns | complex tasks with a finish line |
| time-based | interval (every N minutes) | manual stop, or exits | polling, recurring checks |
| event-driven | PR opened, CI failed, new issue | handled, or retry limit | reactive workflows, CI/CD |

</div>

- <b>/goal</b> vs the clock: a marathon (one long run toward a finish line) vs an alarm clock (short independent bursts, no cumulative progress)
- The recurring mistake: putting a <b>goal-shaped job</b> inside a <b>time-based loop</b>, and restarting from scratch every interval

> **Speaker notes:**
>
> _Appendice · tipi di loop_
>
> Quattro famiglie: **a turni, a obiettivo, a tempo, a eventi**. Il test è sempre lo stesso: ha una fine?
>
> L'errore costoso è un lavoro a obiettivo dentro un loop a tempo: ogni giro riparte da zero, perché il loop a tempo non ricorda dove era arrivato. E nel loop a obiettivo il **giudice indipendente** non è negoziabile.

## Slide A5 — The four silent costs of loops

<div class="eyebrow">appendix · what grows while you sleep</div>

- **Verification debt:** green checks that stopped meaning "works"
- **Comprehension rot:** code nobody on the team can explain anymore
- **Cognitive surrender:** "the agent says it's fine" becomes the review
- **Token blowout:** the bill grows faster than the value

<p class="rule">Loops accelerate <strong>output and risk at the same time.</strong></p>

> **Speaker notes:**
>
> _Appendice · se chiedono dei rischi_
>
> Quattro costi che crescono mentre dormite. **Debito di verifica**: check verdi che non vogliono più dire "funziona". **Comprensione che marcisce**: codice che nessuno in team sa più spiegare. **Resa cognitiva**: "l'agente dice che va bene" diventa la review. E la **bolletta dei token**, che corre più veloce del valore.
>
> I loop accelerano output e rischio insieme. Le tre sartorie sono il freno.

## Slide A6 — Judgment as data: the battery file

<div class="eyebrow">appendix · evals in production</div>

```
# a battery, checked into the repo like code
- pr_risk_high:        yes/no + calibrated probability
- docs_stale:          choice: current | drifted | missing
- review_priority:     score 0-10 against the rubric
- unsure:              "I don't know" is a legal answer (0.5)
```

- Policy **in code** transforms the answers; divergence becomes a **doubt** for a human
- Every judgment stays **human-owned, versioned, negotiable**

> **Speaker notes:**
>
> _Appendice · eval in produzione_
>
> Un esempio dalla mia skill di review. Una **batteria** è un file di domande tipizzate, versionato nel repo e revisionato come codice. Le risposte hanno tipo e **probabilità calibrata**, e "non lo so" è una risposta valida.
>
> Una policy scritta in codice trasforma le risposte in dubbi per un umano. Il giudizio resta **umano, versionato, negoziabile**.

## Slide A7 — Q&A: the questions to expect

<div class="eyebrow">appendix · answers ready</div>

- **"Isn't this just prompt engineering?"** Prompt: one turn, in your head. Harness: five subsystems, in the repo. The 20%→100% case came from system pieces, not better wording.
- **"Won't the next model make this obsolete?"** The papers and the same-model case moved the metrics with fixed models. Ablation findings: as models improve some components stop being critical, new ones emerge. The harness evolves with the model; it doesn't vanish.
- **"I've read studies saying instruction files don't help."** Honest answer: evidence is mixed. One study found no general task-success gain and +20% inference cost; a paired study found −28.6% runtime on small tasks. Keep requirements minimal, and test the instructions on the tasks they must support.
- **"Where do I start?"** Audit the five subsystems, fix the lowest (usually feedback: verification commands). Then write "done" for the next task, with three layers.
- **"Security?"** Tool boundaries and budget are blast-radius control: least privilege, minimal spend, loud failure.

> **Speaker notes:**
>
> _Appendice · risposte pronte_
>
> **"È solo prompt engineering?"** No: il prompt vale per un turno e vive nella vostra testa. L'harness sono cinque sottosistemi e vive nel repo. Il caso dal venti al cento per cento viene da pezzi di sistema, non da parole migliori.
>
> **"Il prossimo modello lo renderà inutile?"** I numeri si sono mossi a modello fermo. E l'ablazione dice che alcuni pezzi smettono di servire ma ne nascono altri: l'harness evolve col modello, non sparisce.
>
> **"Ho letto che i file di istruzioni non servono."** Risposta onesta: le prove sono miste. Uno studio non trova miglioramenti generali e un venti per cento di costo in più; uno studio appaiato trova quasi il trenta per cento di runtime in meno su task piccoli. Quindi: istruzioni minime, e testatele sui task che devono supportare.
>
> **"Da dove comincio?"** Audit dei cinque sottosistemi, sistemate il più basso, di solito i comandi di verifica. Poi scrivete "fatto" per il prossimo task, con i tre livelli.
>
> **"Sicurezza?"** Perimetri dei tool e budget servono a contenere i danni: privilegio minimo, spesa minima, errori rumorosi.

## Slide A8 — References

<div class="eyebrow">appendix · sources</div>

- *The Harness Effect* (arXiv 2607.06906) · *Stop Comparing LLM Agents Without Disclosing the Harness* (arXiv 2605.23950) · *StreamVibe* (arXiv 2610.34662) · *Lost in the Middle* (arXiv 2307.03172)
- Anthropic engineering: harness design for long-running application development; effective harnesses for long-running agents
- OpenAI: harness engineering, leveraging Codex in an agent-first world
- My newsletter CY26W37 ("the war is over the harness") and CY26W45 ("agents as software, the harness as runtime"): maeste.it / risorseartificiali.com

> **Speaker notes:**
>
> _Appendice · fonti_
>
> Tutte fonti pubbliche, e i numeri in slide vengono da qui. Il contesto completo è nelle due edizioni della newsletter citate.

---

## Bilancio tempi

Parlato scritto per ~1.750 parole (~125 parole/min) = ~14 min, margine ~1 min.

| Slide | Topic | Durata | Fine |
|---|---|---|---|
| 1 | Title | 0:40 | 0:40 |
| 2 | The failures | 1:15 | 1:55 |
| 3 | Not the model: same horse | 1:15 | 3:10 |
| 4 | Bond/Q metaphor | 0:45 | 3:55 |
| 5 | Anatomy: five subsystems, the loop | 1:15 | 5:10 |
| 6 | Where defaults fail | 0:45 | 5:55 |
| 7 | Tailoring 1: the router | 1:30 | 7:25 |
| 8 | Tailoring 2: three-layer done | 1:30 | 8:55 |
| 9 | Tailoring 3: the loop | 1:30 | 10:25 |
| 10 | Six primitives | 1:00 | 11:25 |
| 11 | The numbers | 0:50 | 12:15 |
| 12 | Harness as runtime | 0:50 | 13:05 |
| 13 | Takeaways | 1:00 | 14:05 |
| 14 | Close | 0:20 | 14:25 |

Checkpoint: all'inizio della slide 5 devi essere a ~4:00. Se sei oltre 4:30, slide 6 ridotta alle
ultime tre frasi e slide 10 alla versione corta (entrambe indicate nelle note).
