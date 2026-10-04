// Lesson player.
wireTheme();
const $ = s => document.querySelector(s);
const id = new URLSearchParams(location.search).get('id') || 'k1-1';
const lesson = CURRICULUM.byId[id] || CURRICULUM.allLessons[0];
const idx = CURRICULUM.allLessons.indexOf(lesson);
const next = CURRICULUM.allLessons[idx + 1];

$('#unit-label').textContent = lesson.name.toUpperCase();
$('#unit-eyebrow').textContent = `${lesson.courseName} · ${lesson.unitTitle}`;
$('#lesson-label').innerHTML = lesson.name + '<span class="title-bar"></span>';
Mascot.logo($('#logo')); Mascot.logo($('#text-mascot')); Mascot.logo($('#result-mascot'));
const mascots = () => [$('#logo .mascot'), $('#text-mascot .mascot')];
$('#intro').innerHTML = lesson.intro || '';
document.title = `TYPO — ${lesson.name}`;

// ---- keyboard ----
const ROWS = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=',{k:'Backspace',l:'⌫',c:'wider'}],
  [{k:'Tab',l:'Tab',c:'wide'},'q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  [{k:'CapsLock',l:'Caps',c:'wider'},'a','s','d','f','g','h','j','k','l',';',"'",{k:'Enter',l:'Enter',c:'wider'}],
  [{k:'ShiftLeft',l:'Shift',c:'wider'},'z','x','c','v','b','n','m',',','.','/',{k:'ShiftRight',l:'Shift',c:'wider'}],
  [{k:' ',l:'',c:'space'}],
];
const SHIFTED = { '~':'`','!':'1','@':'2','#':'3','$':'4','%':'5','^':'6','&':'7','*':'8','(':'9',')':'0','_':'-','+':'=','{':'[','}':']','|':'\\',':':';','"':"'",'<':',','>':'.','?':'/' };
const FINGER = {};
'`1qaz'.split('').forEach(c => FINGER[c] = 'lp'); '2wsx'.split('').forEach(c => FINGER[c] = 'lr'); '3edc'.split('').forEach(c => FINGER[c] = 'lm');
'4rfv5tgb'.split('').forEach(c => FINGER[c] = 'li'); '6yhn7ujm'.split('').forEach(c => FINGER[c] = 'ri'); '8ik,'.split('').forEach(c => FINGER[c] = 'rm');
'9ol.'.split('').forEach(c => FINGER[c] = 'rr'); "0p;/-=[]\\'".split('').forEach(c => FINGER[c] = 'rp');
const keyEls = {};
(function buildKeyboard() {
  const kb = $('#keyboard');
  ROWS.forEach(r => {
    const row = document.createElement('div'); row.className = 'kb-row';
    r.forEach(k => {
      const o = typeof k === 'string' ? { k, l: k.toUpperCase(), c: '' } : k;
      const el = document.createElement('div'); el.className = 'key ' + o.c; el.textContent = o.l;
      if ('fj'.includes(o.k)) el.classList.add('home');
      keyEls[o.k] = el; row.appendChild(el);
    });
    kb.appendChild(row);
  });
})();
function highlightNext(ch) {
  Object.values(keyEls).forEach(e => e.classList.remove('next'));
  document.querySelectorAll('.hand span').forEach(e => e.classList.remove('on'));
  if (ch == null) return;
  let base = ch.toLowerCase(), shift = false;
  if (SHIFTED[ch]) { base = SHIFTED[ch]; shift = true; }
  else if (ch !== ch.toLowerCase()) shift = true;
  keyEls[base]?.classList.add('next');
  const f = FINGER[base] || (base === ' ' ? null : null);
  if (f) {
    document.querySelector(`.hand span[data-f="${f}"]`)?.classList.add('on');
    if (shift) { const other = f[0] === 'l' ? 'ShiftRight' : 'ShiftLeft'; keyEls[other].classList.add('next'); document.querySelector(`.hand span[data-f="${f[0] === 'l' ? 'rp' : 'lp'}"]`)?.classList.add('on'); }
  } else if (base === ' ') { document.querySelector('.hand span[data-f="ri"]')?.classList.add('on'); }
}
function flashKey(key, wrong) {
  const el = keyEls[key] || keyEls[SHIFTED[key]] || keyEls[key?.toLowerCase()];
  if (!el) return;
  el.classList.add(wrong ? 'wrong' : 'pressed');
  setTimeout(() => el.classList.remove('pressed', 'wrong'), 120);
}

// ---- sound ----
let audioCtx;
function click(wrong) {
  if (!$('#sound-toggle').checked) return;
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = wrong ? 'sawtooth' : 'sine'; o.frequency.value = wrong ? 160 : 620;
  g.gain.setValueAtTime(.08, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + .08);
  o.connect(g).connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + .09);
}

// ---- state ----
let screen = 0, pos = 0, text = '', spans = [], startAt = null, timer = null;
let totals = { typed: 0, errors: 0, seconds: 0 };
let screenErrors = 0, finished = false;

function loadScreen() {
  text = lesson.screens[screen]; pos = 0; screenErrors = 0;
  const line = $('#text-line'); line.innerHTML = '';
  spans = [...text].map(ch => { const s = document.createElement('span'); s.textContent = ch; if (ch === ' ') s.classList.add('space'); line.appendChild(s); return s; });
  spans[0].classList.add('cur'); highlightNext(text[0]);
  $('#screen-fill').style.width = (screen / lesson.screens.length * 100) + '%';
  $('#screen-label').textContent = `Screen ${screen + 1} of ${lesson.screens.length}`;
  spans[0].scrollIntoView({ block: 'nearest' });
}
function elapsed() { return startAt ? (Date.now() - startAt) / 1000 : 0; }
function updateStats() {
  const secs = totals.seconds + elapsed();
  const typed = totals.typed + pos;
  const wpm = secs > 0 ? Math.round((typed / 5) / (secs / 60)) : 0;
  const errs = totals.errors + screenErrors;
  const acc = typed + errs ? Math.max(0, Math.round((typed) / (typed + errs) * 100)) : 100;
  if ($('#live-wpm').textContent !== String(wpm)) Effects.bump($('#live-wpm'));
  $('#live-wpm').textContent = wpm; $('#live-acc').textContent = acc + '%'; $('#live-err').textContent = errs + (errs === 1 ? ' error' : ' errors'); $('#live-err').classList.toggle('has', errs > 0);
  $('#live-time').textContent = lesson.timed ? fmtTime(Math.max(0, lesson.timed - secs)) : fmtTime(secs);
  if (lesson.timed && secs >= lesson.timed) finish();
  return { wpm, acc, errs, typed, secs };
}
function startTimer() { if (startAt) return; startAt = Date.now(); timer = setInterval(updateStats, 250); }
function stopTimer() { if (startAt) { totals.seconds += elapsed(); startAt = null; } clearInterval(timer); }

function onKey(e) {
  if (finished || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Shift' || e.key === 'CapsLock' || e.key === 'Tab') return;
  $('#focus-hint').hidden = true;
  if (e.key === 'Backspace') { e.preventDefault(); return; } // no going back — matches typing.com style
  if (e.key.length !== 1) return;
  e.preventDefault();
  startTimer();
  const expected = text[pos];
  if (e.key === expected) {
    spans[pos].classList.remove('cur', 'bad'); spans[pos].classList.add('ok'); flashKey(e.key, false); click(false);
    pos++;
    if (pos >= text.length) { nextScreen(); return; }
    spans[pos].classList.add('cur'); spans[pos].scrollIntoView({ block: 'nearest' }); highlightNext(text[pos]);
    const look = (pos / text.length) * 4 - 2; document.querySelectorAll('#text-mascot .pupil').forEach(p => p.style.transform = `translate(${look.toFixed(1)}px, 0)`);
  } else {
    screenErrors++; spans[pos].classList.add('bad'); flashKey(e.key, true); click(true);
    const tb = $('#text-box'); tb.classList.remove('is-shake'); void tb.offsetWidth; tb.classList.add('is-shake'); Mascot.react($('#text-mascot .mascot'), 'oops');
  }
  updateStats();
}
function nextScreen() {
  totals.typed += text.length; totals.errors += screenErrors;
  if (screen + 1 >= lesson.screens.length) { finish(); return; }
  screen++; Effects.toast(`Screen ${screen} done — ${lesson.screens.length - screen} to go`, '⚡');
  const r = $('#text-box').getBoundingClientRect(); Effects.xpFloat('+' + text.length * 2 + ' xp', r.right - 110, r.top + 10);
  loadScreen();
}
function finish() {
  if (finished) return; finished = true; stopTimer();
  const typed = totals.typed + (screen < lesson.screens.length && pos < text.length ? pos : 0);
  const errs = totals.errors + (pos < text.length ? screenErrors : 0);
  const secs = Math.max(1, totals.seconds);
  const wpm = Math.round((typed / 5) / (secs / 60));
  const acc = typed + errs ? Math.round(typed / (typed + errs) * 100) : 100;
  const r = Progress.record(lesson.id, { wpm, acc, chars: typed, seconds: Math.round(secs) });
  $('#result-stars').innerHTML = '★'.repeat(r.stars) + `<span class="off">${'★'.repeat(3 - r.stars)}</span>`;
  $('#result-title').textContent = lesson.test ? 'Test complete!' : r.stars === 3 ? 'Perfect! Typo is proud 🐢' : r.stars === 2 ? 'Lesson complete!' : 'Done. Let\'s tighten accuracy';
  $('#r-wpm').textContent = wpm; $('#r-acc').textContent = acc + '%'; $('#r-err').textContent = errs; $('#r-xp').textContent = '+' + r.xp;
  $('#result-note').textContent = acc < 92 ? 'Slow down a little: accuracy below 92% costs stars.' : wpm < 20 ? 'Great accuracy. Speed will follow with practice.' : 'Nice rhythm. Keep it up!';
  const nb = $('#r-next');
  if (next) nb.href = `lesson.html?id=${next.id}`; else { nb.textContent = 'Back to lessons'; nb.href = 'index.html?done=1'; }
  $('#result-modal').hidden = false;
  if (r.stars >= 2) Effects.confetti(r.stars === 3 ? 48 : 28);
  setTimeout(() => Mascot.react($('#result-mascot .mascot'), 'party'), 0);
  setTimeout(() => $('#result-stars').classList.add('is-celebrating'), 150);
  $('#screen-fill').style.width = '100%';
}

$('#restart-btn').onclick = () => { stopTimer(); totals.seconds += 0; loadScreen(); updateStats(); $('#text-box').focus(); };
$('#r-retry').onclick = () => location.reload();
$('#kb-toggle').onchange = e => document.querySelector('.hands-row').classList.toggle('hidden-kb', !e.target.checked);
document.addEventListener('keydown', onKey);
$('#text-box').addEventListener('click', () => { $('#focus-hint').hidden = true; $('#text-box').focus(); });
window.addEventListener('blur', () => { if (!finished && startAt) stopTimer(); });
window.addEventListener('focus', () => { if (!finished && pos > 0) startTimer(); });

loadScreen();
