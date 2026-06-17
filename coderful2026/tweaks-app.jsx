/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection, TweakColor, TweakToggle, TweakRadio */
const DECK_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FF3B63",
  "chrome": true,
  "paper": "cool"
}/*EDITMODE-END*/;

function DeckTweaks() {
  const [t, setTweak] = useTweaks(DECK_TWEAK_DEFAULTS);
  const root = document.documentElement;

  React.useEffect(() => {
    root.style.setProperty('--magenta', t.accent);
    root.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    document.body.classList.toggle('no-tpl-chrome', !t.chrome);
  }, [t.chrome]);

  React.useEffect(() => {
    const paper = t.paper === 'warm' ? '#FBF8F4' : t.paper === 'pure' ? '#FFFFFF' : '#FAF8FE';
    const paper2 = t.paper === 'warm' ? '#F4EFE8' : t.paper === 'pure' ? '#F3F3F6' : '#F4F2FA';
    root.style.setProperty('--paper', paper);
    root.style.setProperty('--paper-2', paper2);
  }, [t.paper]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand" />
      <TweakColor label="Accent" value={t.accent}
        options={['#FF3B63', '#A0228C', '#E0144C', '#FF6A3D']}
        onChange={(v) => setTweak('accent', v)} />
      <TweakRadio label="Paper" value={t.paper}
        options={['cool', 'pure', 'warm']}
        onChange={(v) => setTweak('paper', v)} />
      <TweakSection label="Layout" />
      <TweakToggle label="Template chrome" value={t.chrome}
        onChange={(v) => setTweak('chrome', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweak-root')).render(<DeckTweaks />);
