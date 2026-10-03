// Typo the octopus — inline SVG mascot used across pages. Eight arms, fast typing.
const Mascot = (() => {
  const svg = (cls = '') => `<svg class="mascot ${cls}" viewBox="0 0 120 120" aria-hidden="true">
  <g class="m-arms" fill="#8E1EA2" stroke="#3e0a49" stroke-width="3.5" stroke-linejoin="round">
    <path class="arm a1" d="M28 72 C12 80 4 96 14 106 C22 112 30 102 24 94 C20 88 24 80 32 78Z"/>
    <path class="arm a2" d="M40 84 C32 96 30 110 42 114 C50 116 52 106 46 100 C42 96 44 90 48 86Z"/>
    <path class="arm a3" d="M92 72 C108 80 116 96 106 106 C98 112 90 102 96 94 C100 88 96 80 88 78Z"/>
    <path class="arm a4" d="M80 84 C88 96 90 110 78 114 C70 116 68 106 74 100 C78 96 76 90 72 86Z"/>
  </g>
  <ellipse cx="60" cy="52" rx="38" ry="35" fill="#C654C3" stroke="#3e0a49" stroke-width="4"/>
  <ellipse cx="48" cy="30" rx="14" ry="8" fill="#ED96D7" opacity=".7"/>
  <g class="m-eyes">
    <circle cx="46" cy="52" r="10" fill="#fff" stroke="#3e0a49" stroke-width="3"/>
    <circle cx="74" cy="52" r="10" fill="#fff" stroke="#3e0a49" stroke-width="3"/>
    <circle class="pupil" cx="48" cy="54" r="4.5" fill="#3e0a49"/>
    <circle class="pupil" cx="76" cy="54" r="4.5" fill="#3e0a49"/>
    <circle cx="50" cy="51" r="1.6" fill="#fff"/><circle cx="78" cy="51" r="1.6" fill="#fff"/>
  </g>
  <ellipse cx="34" cy="64" rx="6" ry="3.5" fill="#FFC0DE"/><ellipse cx="86" cy="64" rx="6" ry="3.5" fill="#FFC0DE"/>
  <path class="m-mouth" d="M51 68 Q60 77 69 68" fill="none" stroke="#3e0a49" stroke-width="3.5" stroke-linecap="round"/>
  <g class="m-key">
    <rect x="42" y="86" width="36" height="26" rx="7" fill="#FFC0DE" stroke="#3e0a49" stroke-width="3.5"/>
    <text x="60" y="105" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="900" font-size="17" fill="#8E1EA2">T</text>
  </g>
</svg>`;
  const favicon = () => {
    const link = document.createElement('link'); link.rel = 'icon';
    link.href = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#8E1EA2"/><ellipse cx="60" cy="58" rx="36" ry="33" fill="#C654C3" stroke="#3e0a49" stroke-width="5"/><circle cx="47" cy="58" r="10" fill="#fff"/><circle cx="73" cy="58" r="10" fill="#fff"/><circle cx="49" cy="60" r="5" fill="#3e0a49"/><circle cx="75" cy="60" r="5" fill="#3e0a49"/><path d="M50 74 Q60 84 70 74" fill="none" stroke="#3e0a49" stroke-width="4" stroke-linecap="round"/></svg>`);
    document.head.appendChild(link);
  };
  // react: quick pop on each keystroke, wobble on error, party on success
  const react = (el, kind) => { if (!el) return; el.classList.remove('is-tap', 'is-oops', 'is-party'); void el.offsetWidth; el.classList.add('is-' + kind); };
  return { svg, favicon, react };
})();
Mascot.favicon();
