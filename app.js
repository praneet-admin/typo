// TYPO lessons page (Gengo-style).
wireTheme();
const $ = s => document.querySelector(s);
let activeCourse = localStorage.getItem('typo-course') || 'keys-1';
const DAILY = 3;

// Mascots
Mascot.logo($('#logo')); Mascot.logo($('#hero-mascot')); Mascot.logo($('#welcome-mascot'));

// Header menu
const menu = $('#menu'), menuBtn = $('#menu-btn');
menuBtn.onclick = () => { const open = menu.hidden; menu.hidden = !open; menuBtn.setAttribute('aria-expanded', open); };
document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) menu.hidden = true; });
$('#theme-toggle').addEventListener('click', () => { $('#theme-toggle').textContent = Progress.data.theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'; });
$('#theme-toggle').textContent = Progress.data.theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';

// Typewriter subtitle
const LINES = ['Look at the screen, not your hands.', 'Slow and steady, then fast and steady.', 'Ten minutes a day builds real speed.', 'Home row first, then the whole board.'];
(function typewriter() {
  const el = $('#typewriter'); let li = 0, ci = 0, del = false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = LINES[0]; return; }
  (function tick() {
    const line = LINES[li];
    el.textContent = line.slice(0, ci);
    let wait = del ? 28 : 55;
    if (!del && ci === line.length) { del = true; wait = 1800; }
    else if (del && ci === 0) { del = false; li = (li + 1) % LINES.length; wait = 350; }
    else ci += del ? -1 : 1;
    setTimeout(tick, wait);
  })();
})();

// Hero keyboard that types a phrase by itself
(function heroKeys() {
  const wrap = $('#hero-keys');
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  wrap.innerHTML = `<div class="hk-out" id="hk-out"></div>` + rows.map(r => `<div class="hk-row">${[...r].map(k => `<span class="hk" data-k="${k}">${k.toUpperCase()}</span>`).join('')}</div>`).join('') + `<div class="hk-row"><span class="hk space" data-k=" "></span></div>`;
  const out = $('#hk-out');
  const phrases = ['typo makes typing fun', 'slow and steady wins wpm', 'home row then speed', 'practise with gengo too'];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { out.textContent = phrases[0]; return; }
  let pi = 0, ci = 0;
  const caret = document.createElement('span'); caret.className = 'cur';
  (function tick() {
    const p = phrases[pi];
    if (ci < p.length) {
      const ch = p[ci]; const key = wrap.querySelector(`.hk[data-k="${ch}"]`);
      if (key) { key.classList.add('is-down'); setTimeout(() => key.classList.remove('is-down'), 140); }
      const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch === ' ' ? ' ' : ch;
      out.insertBefore(s, caret.parentNode ? caret : null); if (!caret.parentNode) out.appendChild(caret);
      ci++; setTimeout(tick, 110 + Math.random() * 90);
    } else { setTimeout(() => { out.innerHTML = ''; out.appendChild(caret); ci = 0; pi = (pi + 1) % phrases.length; tick(); }, 1600); }
  })();
})();

function starsHtml(n) { return `<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`; }
function nextLesson() { return CURRICULUM.allLessons.find(l => !Progress.lesson(l.id)) || CURRICULUM.allLessons[0]; }

function renderChips() {
  const el = $('#chips'); el.innerHTML = '';
  CURRICULUM.sections.flatMap(s => s.courses).forEach(c => {
    const total = c.units.reduce((a, u) => a + u.lessons.length, 0);
    const done = c.units.reduce((a, u) => a + u.lessons.filter(l => Progress.lesson(l.id)).length, 0);
    const b = document.createElement('button'); b.className = 'chip' + (c.id === activeCourse ? ' active' : '');
    b.innerHTML = `${c.name} <small>${done}/${total}</small>`;
    b.onclick = () => { activeCourse = c.id; localStorage.setItem('typo-course', c.id); renderChips(); renderCourse(); };
    el.appendChild(b);
  });
}
function renderCourse() {
  const course = CURRICULUM.course(activeCourse);
  const wrap = $('#units'); wrap.innerHTML = '';
  let n = 0, done = 0, total = 0; const nxt = nextLesson();
  course.units.forEach(unit => {
    const t = document.createElement('div'); t.className = 'unit-title'; t.textContent = unit.title; wrap.appendChild(t);
    unit.lessons.forEach(l => {
      n++; total++;
      const p = Progress.lesson(l.id); if (p) done++;
      const row = document.createElement('div'); row.className = 'lesson-row' + (p ? ' done' : '') + (l === nxt ? ' next' : ''); row.style.setProperty('--n', n);
      const meta = p ? `<div class="lesson-meta"><span>${p.bestWpm || p.wpm} wpm</span><span>${p.acc}%</span>${starsHtml(p.stars)}</div>` : (l.timed ? `<div class="lesson-meta"><span>⏱ ${fmtTime(l.timed)}</span></div>` : '');
      row.innerHTML = `<div class="lesson-main"><div class="lesson-num">${p ? '✓' : n}</div><div class="lesson-name">${l.name}${l === nxt && !p ? '<small>Up next</small>' : ''}</div>${meta}<a class="btn btn-start${p ? ' done' : ''}" href="lesson.html?id=${l.id}">${p ? '↺ Redo' : '▶ Start'}</a></div><div class="screen-dots">${l.screens.map(() => '<i></i>').join('')}</div>`;
      wrap.appendChild(row);
    });
  });
  const pct = total ? Math.round(done / total * 100) : 0;
  $('#course-fill').style.width = pct + '%'; $('#course-pct').textContent = pct + '% complete';
}
function renderProfile() {
  const lv = Progress.level(), av = Progress.averages(), xp = Progress.data.xp;
  $('#xp-n').textContent = xp; $('#level-pill').textContent = 'Lv ' + lv.index; $('#level-name').textContent = lv.name.replace('Typing ', '');
  $('#xp-fill').style.width = Math.min(100, lv.into / lv.need * 100) + '%';
  $('#xp-text').textContent = lv.need === 1 ? `${xp} xp — max level` : `${lv.into} / ${lv.need} xp to next level`;
  $('#stat-wpm').textContent = av ? av.wpm : '--'; $('#stat-acc').textContent = av ? av.acc + '%' : '--';
  $('#stat-time').textContent = Progress.data.seconds ? fmtTime(Progress.data.seconds) : '--';
  $('#goal-ring').style.strokeDashoffset = 213.6 * (1 - Math.min(1, (av ? av.wpm : 0) / 60));
  const streak = Progress.streak(); $('#streak-n').textContent = streak; $('#pill-streak').classList.toggle('is-lit', streak > 0);
  // today = lessons completed today
  const today = new Date().toISOString().slice(0, 10);
  const doneToday = Object.values(Progress.data.lessons).filter(l => new Date(l.at).toISOString().slice(0, 10) === today).length;
  const g = Math.min(DAILY, doneToday);
  $('#goal-n').textContent = `${g}/${DAILY}`; $('#today-pill').textContent = `${g}/${DAILY}`; $('#goal-dot').style.setProperty('--p', (g / DAILY * 100) + '%');
  $('#steps').querySelectorAll('i').forEach((s, i) => s.classList.toggle('done', i < g));
  $('#steps').querySelectorAll('em').forEach((e, i) => e.style.setProperty('--fill', i < g - 1 ? 1 : i === g - 1 && g > 0 ? 1 : 0));
  $('#today-text').textContent = g >= DAILY ? "Goal hit! Anything more is bonus XP." : `${DAILY - g} more lesson${DAILY - g === 1 ? '' : 's'} to hit today's goal.`;
  const nxt = nextLesson(); const started = Object.keys(Progress.data.lessons).length > 0;
  $('#hero-title').textContent = started ? `Up next: ${nxt.name}` : 'Start with the home row';
  $('#hero-text').textContent = started ? `${nxt.courseName} · ${nxt.unitTitle}` : 'Your index fingers go on F and J. Everything grows from there.';
  $('#hero-cta').href = `lesson.html?id=${nxt.id}`; $('#hero-cta').textContent = started ? 'Continue ▶' : 'Start typing ▶';
}

$('#reset-progress').onclick = () => { menu.hidden = true; if (confirm('Reset all TYPO progress on this device?')) { Progress.reset(); renderProfile(); renderChips(); renderCourse(); Effects.toast('Progress reset', '🧹'); } };
$('#cert-btn').onclick = () => {
  const course = CURRICULUM.course(activeCourse);
  const total = course.units.reduce((a, u) => a + u.lessons.length, 0);
  const done = course.units.reduce((a, u) => a + u.lessons.filter(l => Progress.lesson(l.id)).length, 0);
  if (done < total) return Effects.toast(`Finish all ${total} lessons in ${course.name} first (${done}/${total})`, '🎓');
  const w = window.open('', '_blank');
  w.document.write(`<title>TYPO Certificate</title><body style="font-family:Nunito,sans-serif;text-align:center;padding:4rem;border:14px double #8E1EA2;margin:2rem"><h1 style="color:#8E1EA2;font-size:3rem">Certificate of Completion</h1><p style="font-size:1.3rem">This certifies that the learner has completed</p><h2 style="color:#C654C3">${course.name}</h2><p>on ${new Date().toLocaleDateString()} · Average ${Progress.averages().wpm} WPM at ${Progress.averages().acc}% accuracy</p><p style="margin-top:3rem;letter-spacing:.3em;color:#8E1EA2"><b>TYPO</b></p><script>print()<\/script></body>`);
};
$('#nav-progress').onclick = () => {
  menu.hidden = true;
  const rows = CURRICULUM.allLessons.filter(l => Progress.lesson(l.id)).map(l => { const p = Progress.lesson(l.id); return `<div class="progress-row"><span>${l.name}</span><span>${p.bestWpm || p.wpm} wpm · ${p.acc}% ${starsHtml(p.stars)}</span></div>`; });
  $('#progress-body').innerHTML = rows.length ? rows.join('') : '<p>No lessons completed yet. Start with <b>J, F, and Space</b>!</p>';
  $('#progress-modal').hidden = false;
};
$('#close-progress').onclick = () => $('#progress-modal').hidden = true;
$('#welcome-skip').onclick = () => { $('#welcome').hidden = true; localStorage.setItem('typo-welcomed', '1'); };

renderChips(); renderCourse(); renderProfile();
if (new URLSearchParams(location.search).get('done')) {
  Effects.toast('Progress saved. Nice work!', '🏆'); setTimeout(() => { Effects.bump($('#pill-xp')); Effects.bump($('#pill-goal')); }, 400);
  history.replaceState(null, '', 'index.html');
} else if (!localStorage.getItem('typo-welcomed') && !Object.keys(Progress.data.lessons).length) {
  setTimeout(() => { $('#welcome').hidden = false; }, 600);
}
