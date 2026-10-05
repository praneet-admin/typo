// Typo the tortoise — flat SVG mascot in the TYPO palette. Slow and steady.
const Mascot = (() => {
  const svg = (cls = '') => `<svg class="mascot ${cls}" viewBox="0 0 120 120" aria-hidden="true">
  <defs><linearGradient id="tbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C654C3"/><stop offset="1" stop-color="#FFC0DE"/></linearGradient></defs>
  <circle cx="60" cy="60" r="58" fill="url(#tbg)"/>
  <circle cx="60" cy="60" r="58" fill="none" stroke="#8E1EA2" stroke-width="3"/>
  <g class="m-body">
    <!-- shell -->
    <path d="M14 82 C14 56 30 42 52 42 C72 42 84 56 84 80 Z" fill="#5f7d3e" stroke="#2f3f20" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M34 60 l10 -7 l11 3 l4 11 l-7 9 l-12 1 l-6 -9 z" fill="#7aa050" stroke="#2f3f20" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M22 76 l8 -6 l6 8 l-4 6 z M60 72 l9 -4 l6 7 l-6 7 l-7 -3 z M44 44 l8 -1 l4 6 l-9 3 z" fill="#7aa050" stroke="#2f3f20" stroke-width="2.5" stroke-linejoin="round"/>
    <rect x="12" y="80" width="74" height="10" rx="5" fill="#e8c98a" stroke="#2f3f20" stroke-width="3.5"/>
    <!-- legs -->
    <ellipse cx="30" cy="94" rx="9" ry="5.5" fill="#a8c66c" stroke="#2f3f20" stroke-width="3"/>
    <ellipse cx="66" cy="94" rx="9" ry="5.5" fill="#a8c66c" stroke="#2f3f20" stroke-width="3"/>
    <!-- neck + head -->
    <path d="M70 72 C76 66 80 60 84 54" fill="none" stroke="#a8c66c" stroke-width="16" stroke-linecap="round"/>
    <path d="M70 72 C76 66 80 60 84 54" fill="none" stroke="#2f3f20" stroke-width="22" stroke-linecap="round" opacity="0"/>
    <circle class="m-head" cx="88" cy="46" r="20" fill="#a8c66c" stroke="#2f3f20" stroke-width="3.5"/>
    <ellipse cx="82" cy="36" rx="7" ry="4" fill="#c6dd97" opacity=".8"/>
    <!-- glasses -->
    <g class="m-eyes">
      <circle cx="80" cy="46" r="7.5" fill="#fff" stroke="#3e0a49" stroke-width="3"/>
      <circle cx="98" cy="46" r="7.5" fill="#fff" stroke="#3e0a49" stroke-width="3"/>
      <path d="M87.5 46 h3" stroke="#3e0a49" stroke-width="3" stroke-linecap="round"/>
      <path d="M72.5 44 l-4 -2" stroke="#3e0a49" stroke-width="3" stroke-linecap="round"/>
      <circle class="pupil" cx="82" cy="47" r="3.2" fill="#2b1033"/>
      <circle class="pupil" cx="100" cy="47" r="3.2" fill="#2b1033"/>
      <circle cx="83.2" cy="45.6" r="1.1" fill="#fff"/><circle cx="101.2" cy="45.6" r="1.1" fill="#fff"/>
    </g>
    <ellipse cx="103" cy="56" rx="4" ry="2.4" fill="#ED96D7"/>
    <path class="m-mouth" d="M84 58 Q90 63 96 58" fill="none" stroke="#2f3f20" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;
  const favicon = () => {
    const link = document.createElement('link'); link.rel = 'icon';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="58" fill="#C654C3"/><circle cx="60" cy="62" r="34" fill="#a8c66c" stroke="#2f3f20" stroke-width="5"/><circle cx="46" cy="60" r="12" fill="#fff" stroke="#3e0a49" stroke-width="5"/><circle cx="76" cy="60" r="12" fill="#fff" stroke="#3e0a49" stroke-width="5"/><path d="M58 60h6" stroke="#3e0a49" stroke-width="5"/><circle cx="49" cy="62" r="5" fill="#2b1033"/><circle cx="79" cy="62" r="5" fill="#2b1033"/><path d="M50 80 Q60 90 70 80" fill="none" stroke="#2f3f20" stroke-width="5" stroke-linecap="round"/></svg>`);
    document.head.appendChild(link);
  };
  const react = (el, kind) => { if (!el) return; el.classList.remove('is-tap', 'is-oops', 'is-party'); void el.offsetWidth; el.classList.add('is-' + kind); };
  // Brand logo: the turtle cutout (logo.png) on a gradient disc; SVG fallback if the image is missing.
  const logo = (el, cls = '') => {
    if (!el) return;
    const img = new Image(); img.alt = 'Typo the tortoise'; img.className = 'brand-logo mascot ' + cls; img.decoding = 'async';
    img.onload = () => { el.innerHTML = ''; el.appendChild(img); el.classList.add('has-logo'); };
    img.onerror = () => { el.innerHTML = svg(cls); el.classList.remove('has-logo'); };
    img.src = 'logo.png?v=8';
    el.innerHTML = svg(cls);
  };
  // Buddy: Gengo-style speech bubble with moods (happy / cheer / sad / think)
  let holdTimer = null, idleTimer = null, idleLines = [];
  const say = (text, mood = 'happy', holdMs = 2600) => {
    const b = document.getElementById('buddy-bubble'), m = document.querySelector('#buddy .mascot');
    if (!b) return;
    b.textContent = text; b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
    if (m) { m.classList.remove('is-happy', 'is-cheer', 'is-sad', 'is-think'); void m.offsetWidth; m.classList.add('is-' + mood); }
    clearTimeout(holdTimer); clearTimeout(idleTimer);
    holdTimer = setTimeout(idle, holdMs + 4000);
  };
  const idle = () => { if (!idleLines.length) return; const t = idleLines[Math.floor(Math.random() * idleLines.length)]; const b = document.getElementById('buddy-bubble'); if (b && b.textContent !== t) { b.textContent = t; b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop'); } idleTimer = setTimeout(idle, 9000); };
  const setIdle = lines => { idleLines = lines; clearTimeout(idleTimer); idleTimer = setTimeout(idle, 9000); };
  return { svg, favicon, react, logo, say, setIdle };
})();
if (!document.querySelector('link[rel=icon]')) Mascot.favicon();
