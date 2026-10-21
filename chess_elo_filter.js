(() => {
  window.__elo?.();
  const s = prompt('Elo range + rated/unrated (omit = both)', '1000-1200 rated');
  if (!s) return;
  const [lo = 0, hi = 1e4] = (s.match(/\d+/g) || []).map(Number).sort((x, y) => x - y);
  const un = /unrated/i.test(s) ? true : /rated/i.test(s) ? false : null;
  const RE = /\((\d{3,4})\)/, hid = new Set();
  const plays = el => [...el.querySelectorAll('button,a,[role=button]')].filter(b => b.textContent.trim() === 'Play');
  const row = b => {
    for (let r = b.parentElement, i = 0; r && i < 6; r = r.parentElement, i++)
      if (RE.test(r.textContent)) return plays(r).length === 1 ? r : null;
  };
  const run = () => plays(document).forEach(b => {
    const r = row(b);
    if (!r) return;
    const t = r.textContent, elo = +t.match(RE)[1];
    const ok = elo >= lo && elo <= hi && (un === null || un === /unrated/i.test(t));
    r.style.setProperty('display', ok ? '' : 'none', 'important');
    ok ? hid.delete(r) : hid.add(r);
  });
  let f;
  const obs = new MutationObserver(() => { cancelAnimationFrame(f); f = requestAnimationFrame(run); });
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  window.__elo = () => { obs.disconnect(); hid.forEach(r => r.style.removeProperty('display')); };
  run();
})();
