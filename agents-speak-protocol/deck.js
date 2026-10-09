/* All reveals follow the speaker's click. No timed slides or network requests. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
Reveal.initialize({
  width: 1280,
  height: 720,
  margin: 0.025,
  center: false,
  hash: true,
  controls: true,
  controlsTutorial: false,
  progress: true,
  slideNumber: false,
  transition: reduceMotion ? 'none' : 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'none',
  pdfSeparateFragments: false,
  plugins: [RevealNotes]
}).then(() => {
  const chapter = document.getElementById('chapter-label');
  const footer = document.querySelector('.deck-footer');
  function update() {
    const slide = Reveal.getCurrentSlide();
    chapter.textContent = slide.dataset.chapter || 'Appendix';
    footer.classList.toggle('on-paper', slide.classList.contains('paper'));
  }
  Reveal.on('slidechanged', update);
  update();
});
