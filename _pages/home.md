---
layout: single
title: ""
permalink: /
author_profile: true
---

<style>
  .lang-tabs { display: flex; gap: 1rem; margin-bottom: 1rem; }
  .lang-tabs button {
    padding: 0.5rem 1rem;
    border: none;
    background: #007acc;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }
  .lang-tabs button.active { background: #005b99; }
  .lang-section { display: none; }
  .lang-section.active { display: block; }
</style>

<div class="lang-tabs">
  <button onclick="showLang('it')" class="active">🇮🇹 Italiano</button>
  <button onclick="showLang('en')">🇬🇧 English</button>
</div>

<div id="it" class="lang-section active" markdown="1">

## AI Engineer & Technical Manager con focus su Sistemi Multi-Agente e AI per Middleware Enterprise

---

**Bio**
Con oltre 25 anni di esperienza nello sviluppo software enterprise e nell’AI engineering, esploro ogni settimana come l’intelligenza artificiale stia cambiando il modo in cui costruiamo, impariamo e viviamo la tecnologia.<br/>
Nutro una vecchia passione per l'OpenSource e una più recente per l'AI Engineering.

✨ Scrivo due newsletter (in italiano ed inglese).<br/>
🎧 Co-conduco un podcast (solo in italiano) su AI, agenti e futuro.<br/>
💻 Mantainer di due repository GitHub per il progetto [A2A](https://github.com/a2a-protocol).<br/>
Scoprili qui sotto ⬇️

---

**Le Newsletter**

🧠 CodiceArtificiale: Trend AI per sviluppatori
La versione italiana della newsletter: ogni settimana, una selezione ragionata delle novità AI per ingegneri, CTO e sviluppatori.<br/>
👉 [Leggi su Substack](https://codiceartificiale.substack.com/)

🧠 ArtificialCode: Weekly AI Trends for Engineers. The english version of the newsletter<br/>
👉 [Leggi su Substack](https://artificialcode.substack.com/)

---

**Podcast – Risorse Artificiali**

Un podcast settimanale (solo in italiano) sull’AI e il suo impatto su società, coding, lavoro e tecnologia.<br/>
Leggi tutti i dettagli su [risorseartficiali.com](https://risorseartificiali.com) <br/>
👉 [Ascolta su Spotify](https://open.spotify.com/show/16dTKEEtKkIzhr1JJNMmSF?si=900902f2dca8442e)<br/>
👉 [Guarda su YouTube](https://www.youtube.com/channel/UCYQgzIby7QHkXBonTWk-2Fg)<br/>
👉 [Segui su LinkedIn](https://www.linkedin.com/company/risorseartificiali)<br/>


**Il progetto A2A**

Sono maintainer di [A2A Java SDK](https://github.com/a2aproject/a2a-java) e [A2A TCK](https://github.com/a2aproject/a2a-tck). Sono anche attivamente coinvolto nella definisione della specifica [A2A](https://github.com/a2aproject/A2A)

</div>

<div id="en" class="lang-section" markdown="1">

## AI Engineer & Technical Manager focusing on Multi-Agent Systems, and AI for Enterprise Middleware

---

**About me**
With over 25 years of experience in enterprise software development and AI engineering, I explore how artificial intelligence is transforming the way we build, learn, and live with technology.<br/>
I have an old passion for Open Source and more recent one for AI Engineering.

✍️ I write two newsletters (Italian and English).<br/>
🎧 I co-host a podcast (Italian only) about AI, agents, and the future.<br/>
💻 Mantainer of two GitHub repositories for project [A2A](https://github.com/a2a-protocol).<br/>

Check them out below ⬇️

---

**Newsletters**

🧠 ArtificialCode: Weekly AI Trends for Engineers
A curated selection of AI trends for engineers, CTOs, and developers.<br/>
👉 [Read on Substack](https://artificialcode.substack.com/)

🧠 CodiceArtificiale
Italian-language version of the nesletter.<br/>
👉 [Read on Substack](https://codiceartificiale.substack.com/)

---

**Podcast – Risorse Artificiali**

A weekly podcast (Italian only) about AI and its impact on society, coding, work, and technology.<br/>
👉 [Listen on Spotify](https://open.spotify.com/show/16dTKEEtKkIzhr1JJNMmSF?si=900902f2dca8442e)<br/>
👉 [Watch on YouTube](https://www.youtube.com/channel/UCYQgzIby7QHkXBonTWk-2Fg)<br/>
👉 [Follow on LinkedIn](https://www.linkedin.com/company/risorseartificiali)

**The A2A project**

I'm the maintainer of [A2A Java SDK](https://github.com/a2aproject/a2a-java) and [A2A TCK](https://github.com/a2aproject/a2a-tck). I'm actively involved in [A2A](https://github.com/a2aproject/A2A) spec definition.

</div>

<script>
function showLang(lang) {
  document.querySelectorAll('.lang-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.lang-tabs button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(lang).classList.add('active');
  event.target.classList.add('active');
}
</script>
