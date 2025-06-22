---
layout: single
title: "Stefano Maestri"
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

...

</div>

<div id="en" class="lang-section" markdown="1">

## AI Engineer & Technical Manager focusing on Multi-Agent Systems, and AI for Enterprise Middleware

...

</div>

<script>
function showLang(lang) {
  document.querySelectorAll('.lang-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.lang-tabs button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(lang).classList.add('active');
  event.target.classList.add('active');
}
</script>
