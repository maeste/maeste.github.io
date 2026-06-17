// Injects the recurring Coderful template chrome into every deck slide:
// kicker (top-left), date badge (top-right), logo (bottom-left),
// "LET'S TALK CODE" + page number (bottom-right), and a subtle corner deco.
(function () {
  function build() {
    const sections = document.querySelectorAll('deck-stage > section');
    if (!sections.length) { return false; }
    const total = sections.length;
    sections.forEach((sec, i) => {
      if (sec.querySelector('.tpl-chrome')) { return; }
      const dark = sec.classList.contains('dark');
      const frag = document.createElement('div');
      frag.className = 'tpl-chrome';
      frag.setAttribute('aria-hidden', 'true');
      const dateImg = dark ? 'assets/date-cyan.png' : 'assets/date-magenta.png';
      const logoImg = dark ? 'assets/logo-coderful-white.png' : 'assets/logo-coderful.png';
      const num = String(i + 1).padStart(2, '0');
      const tot = String(total).padStart(2, '0');
      frag.innerHTML =
        '<span class="tpl-kicker">_AI&nbsp;EDITION</span>' +
        '<img class="tpl-date" src="' + dateImg + '" alt="">' +
        '<img class="tpl-deco" src="assets/deco-plus.png" alt="">' +
        '<img class="tpl-logo" src="' + logoImg + '" alt="Coderful">' +
        '<span class="tpl-foot">LET\u2019S&nbsp;TALK&nbsp;CODE</span>' +
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
