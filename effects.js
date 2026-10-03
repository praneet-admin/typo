// Gengo-style ambient and feedback effects.
const Effects = (() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#8E1EA2', '#C654C3', '#ED96D7', '#FFC0DE', '#2fe3a5'];
  function floaters() {
    if (reduced() || document.querySelector('.floaters')) return;
    const layer = document.createElement('div'); layer.className = 'floaters'; layer.setAttribute('aria-hidden', 'true');
    const glyphs = 'asdfjkl;TYPOqwerty'.split('');
    for (let i = 0; i < 18; i++) {
      const f = document.createElement('span');
      const kind = i % 4 === 0 ? 'ring' : i % 4 === 1 ? 'dot' : i % 4 === 2 ? 'key' : 'glyph';
      f.className = 'floater is-' + kind;
      if (kind === 'glyph' || kind === 'key') f.textContent = glyphs[i % glyphs.length];
      f.style.setProperty('--x', (Math.random() * 100).toFixed(1) + 'vw');
      f.style.setProperty('--size', (18 + Math.random() * 34).toFixed(0) + 'px');
      f.style.setProperty('--d', (18 + Math.random() * 16).toFixed(1) + 's');
      f.style.setProperty('--delay', (-Math.random() * 30).toFixed(1) + 's');
      f.style.setProperty('--drift', ((Math.random() - .5) * 30).toFixed(0) + 'vw');
      f.style.setProperty('--spin', (Math.random() * 360 - 180).toFixed(0) + 'deg');
      f.style.color = COLORS[i % COLORS.length];
      layer.appendChild(f);
    }
    document.body.prepend(layer);
  }
  function confetti(n = 36) {
    if (reduced()) return;
    let layer = document.querySelector('.confetti');
    if (!layer) { layer = document.createElement('div'); layer.className = 'confetti'; document.body.appendChild(layer); }
    layer.textContent = '';
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.style.setProperty('--x', (Math.random() * 100).toFixed(1) + 'vw');
      p.style.setProperty('--d', (.9 + Math.random() * .9).toFixed(2) + 's');
      p.style.setProperty('--r', Math.round(Math.random() * 720) + 'deg');
      p.style.setProperty('--s', (6 + Math.random() * 8).toFixed(0) + 'px');
      p.style.background = COLORS[i % COLORS.length];
      layer.appendChild(p);
    }
    setTimeout(() => { layer.textContent = ''; }, 2200);
  }
  function toast(msg, icon = '✨') {
    let layer = document.querySelector('.toast-layer');
    if (!layer) { layer = document.createElement('div'); layer.className = 'toast-layer'; document.body.appendChild(layer); }
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    layer.appendChild(t);
    setTimeout(() => { t.classList.add('is-leaving'); setTimeout(() => t.remove(), 240); }, 2200);
  }
  function xpFloat(text, x, y) {
    if (reduced()) return;
    const el = document.createElement('div'); el.className = 'xp-float'; el.textContent = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
  }
  function bump(el) { if (!el) return; el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump'); }
  return { floaters, confetti, toast, xpFloat, bump };
})();
document.addEventListener('DOMContentLoaded', Effects.floaters);
