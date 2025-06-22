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

## **Stefano Maestri**

<div class="lang-tabs">
  <button onclick="showLang('it')" class="active">🇮🇹 Italiano</button>
  <button onclick="showLang('en')">🇬🇧 English</button>
</div>

<div id="it" class="lang-section active">

AI Engineer & Technical Manager con focus su Sistemi Multi-Agente e AI per Middleware Enterprise

---

**Bio introduttiva**
Con oltre 25 anni di esperienza nello sviluppo software enterprise e nell’AI engineering, esploro ogni settimana come l’intelligenza artificiale stia cambiando il modo in cui costruiamo, impariamo e viviamo la tecnologia.

✨ Scrivo due newsletter (in italiano ed inglese).
🎧 Co-conduco un podcast (solo in italiano) su AI, agenti e futuro.
Scoprili qui sotto ⬇️

---

**Newsletter**

🧠 CodiceArtificiale: Trend AI per sviluppatori
La versione italiana della newsletter: ogni settimana, una selezione ragionata delle novità AI per ingegneri, CTO e sviluppatori.
👉 [Leggi su Substack](https://codiceartificiale.substack.com/)

🧠 ArtificialCode: Weekly AI Trends for Engineers
👉 [Leggi su Substack](https://artificialcode.substack.com/)

---

**Podcast – Risorse Artificiali**

Un podcast settimanale (solo in italiano) sull’AI e il suo impatto su società, coding, lavoro e tecnologia.
👉 [Ascolta su Spotify](https://open.spotify.com/show/16dTKEEtKkIzhr1JJNMmSF?si=900902f2dca8442e)
👉 [Guarda su YouTube](https://www.youtube.com/channel/UCYQgzIby7QHkXBonTWk-2Fg)
👉 [Segui su LinkedIn](https://www.linkedin.com/company/risorseartificiali)

---

**Contatti**
💼 [LinkedIn](https://linkedin.com/in/tuo-username)
🐙 [GitHub](https://github.com/maeste)
✖️ [X / Twitter](https://x.com/maeste)
📧 [Email](mailto:maestri.stefano@gmail.com)

</div>

<div id="en" class="lang-section">

AI Engineer & Technical Manager focusing on Multi-Agent Systems, and AI for Enterprise Middleware

---

**About me**
With over 25 years of experience in enterprise software development and AI engineering, I explore how artificial intelligence is transforming the way we build, learn, and live with technology.

✍️ I write two newsletters (Italian and English).
🎧 I co-host a podcast (Italian only) about AI, agents, and the future.
Check them out below ⬇️

---

**Newsletters**

🧠 ArtificialCode: Weekly AI Trends for Engineers
A curated selection of AI trends for engineers, CTOs, and developers.
👉 [Read on Substack](https://artificialcode.substack.com/)

🧠 CodiceArtificiale
Italian-language version for technical AI insights.
👉 [Read on Substack](https://codiceartificiale.substack.com/)

---

**Podcast – Risorse Artificiali**

A weekly podcast (Italian only) about AI and its impact on society, coding, work, and technology.
👉 [Listen on Spotify](https://open.spotify.com/show/16dTKEEtKkIzhr1JJNMmSF?si=900902f2dca8442e)
👉 [Watch on YouTube](https://www.youtube.com/channel/UCYQgzIby7QHkXBonTWk-2Fg)
👉 [Follow on LinkedIn](https://www.linkedin.com/company/risorseartificiali)

---

**Contact**
💼 [LinkedIn](https://linkedin.com/in/tuo-username)
🐙 [GitHub](https://github.com/maeste)
✖️ [X / Twitter](https://x.com/maeste)
📧 [Email](mailto:maestri.stefano@gmail.com)

</div>

<script>
function showLang(lang) {
  document.querySelectorAll('.lang-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.lang-tabs button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(lang).classList.add('active');
  event.target.classList.add('active');
}
</script>
