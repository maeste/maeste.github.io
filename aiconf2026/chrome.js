// Injects the recurring AICOnf 2026 template chrome into every deck slide:
// a fuchsia "» AI CONF 2026" kicker (top-left) and a page counter (bottom-right).
// Modeled on the coderful chrome.js, stripped of conference-specific badges.
(function () {
  function build() {
    const sections = document.querySelectorAll('deck-stage > section');
    if (!sections.length) { return false; }
    const total = sections.length;
    sections.forEach((sec, i) => {
      if (sec.querySelector('.tpl-chrome')) { return; }
      const frag = document.createElement('div');
      frag.className = 'tpl-chrome';
      frag.setAttribute('aria-hidden', 'true');
      const num = String(i + 1).padStart(2, '0');
      const tot = String(total).padStart(2, '0');
      // Hide chrome on the two cover slides (they carry their own identity).
      const isCover = sec.classList.contains('cover');
      frag.innerHTML =
        (isCover ? '' :
          '<span class="tpl-kicker">&raquo;&nbsp;AI&nbsp;CONF&nbsp;2026</span>' +
          '<span class="tpl-foot">maeste.it</span>') +
        '<span class="tpl-page">' + num + '<span class="tpl-page-sep">/</span>' + tot + '</span>';
      sec.appendChild(frag);
    });
    return true;
  }
  function start() {
    if (build()) { return; }
    let tries = 0;
    const iv = setInterval(() => {
      if (build() || ++tries > 40) { clearInterval(iv); }
    }, 50);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
