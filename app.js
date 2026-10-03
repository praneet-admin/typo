// Lessons catalog page.
wireTheme();
const $ = s => document.querySelector(s);
let activeCourse = localStorage.getItem('typo-course') || 'keys-1';

function renderSidebar() {
  const el = $('#sidebar'); el.innerHTML = ''; let sideN = 0;
  CURRICULUM.sections.forEach(sec => {
    const h = document.createElement('h4'); h.textContent = sec.title; el.appendChild(h);
    const g = document.createElement('div'); g.className = 'side-group';
    sec.courses.forEach(c => {
      const b = document.createElement('button'); b.className = 'side-item' + (c.id === activeCourse ? ' active' : ''); b.style.setProperty('--n', sideN++);
      b.innerHTML = `<div>${c.name}<small>${c.sub}</small></div><span class="chev">▶</span>`;
      b.onclick = () => { activeCourse = c.id; localStorage.setItem('typo-course', c.id); renderSidebar(); renderCourse(); };
      g.appendChild(b);
    });
    el.appendChild(g);
  });
}

function starsHtml(n) { return `<span class="stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(3 - n)}</span></span>`; }

function renderCourse() {
  const course = CURRICULUM.course(activeCourse);
  const wrap = $('#units'); wrap.innerHTML = '';
  let n = 0, done = 0, total = 0;
  course.units.forEach(unit => {
    const t = document.createElement('div'); t.className = 'unit-title'; t.textContent = unit.title; wrap.appendChild(t);
    unit.lessons.forEach(l => {
      n++; total++;
      const p = Progress.lesson(l.id); if (p) done++;
      const row = document.createElement('div'); row.className = 'lesson-row' + (p ? ' done' : ''); row.style.setProperty('--n', n);
      const meta = p ? `<div class="lesson-meta"><span>${p.bestWpm || p.wpm} wpm</span><span>${p.acc}%</span>${starsHtml(p.stars)}</div>` : (l.timed ? `<div class="lesson-meta"><span>⏱ ${fmtTime(l.timed)}</span></div>` : '');
      row.innerHTML = `<div class="lesson-main"><div class="lesson-num">${p ? '✓' : n}</div><div class="lesson-name">${l.name}</div>${meta}<a class="btn btn-start${p ? ' done' : ''}" href="lesson.html?id=${l.id}">▶ ${p ? 'Redo' : 'Start'}</a></div>
        <div class="screen-dots">${l.screens.map(() => '<i></i>').join('')}</div>`;
      wrap.appendChild(row);
    });
  });
  const pct = total ? Math.round(done / total * 100) : 0;
  $('#course-fill').style.width = pct + '%';
  $('#course-pct').textContent = pct + '% Complete';
}

function renderProfile() {
  const lv = Progress.level();
  $('#avatar').textContent = lv.icon;
  $('#level-name').textContent = `${lv.name} (${lv.index}/${lv.total})`;
  $('#xp-fill').style.width = Math.min(100, lv.into / lv.need * 100) + '%';
  $('#xp-text').textContent = lv.need === 1 ? `${Progress.data.xp} xp — max level` : `${lv.into} / ${lv.need} xp`;
  const av = Progress.averages();
  $('#stat-wpm').textContent = av ? av.wpm + ' wpm' : '--';
  $('#stat-acc').textContent = av ? av.acc + '%' : '--';
  $('#stat-time').textContent = Progress.data.seconds ? fmtTime(Progress.data.seconds) : '--';
  const today = Progress.todaySeconds(), goal = 900;
  $('#goal-time').textContent = fmtTime(Math.min(today, goal));
  $('#goal-ring').style.strokeDashoffset = 213.6 * (1 - Math.min(1, today / goal));
  $('#streak').textContent = `🔥 ${Progress.streak()} day streak`;
}

$('#reset-progress').onclick = () => { if (confirm('Reset all TYPO progress on this device?')) { Progress.reset(); renderProfile(); renderCourse(); } };
$('#cert-btn').onclick = () => {
  const course = CURRICULUM.course(activeCourse);
  const total = course.units.reduce((a, u) => a + u.lessons.length, 0);
  const done = course.units.reduce((a, u) => a + u.lessons.filter(l => Progress.lesson(l.id)).length, 0);
  if (done < total) return alert(`Finish all ${total} lessons in "${course.name}" to unlock the certificate (${done}/${total} done).`);
  const w = window.open('', '_blank');
  w.document.write(`<title>TYPO Certificate</title><body style="font-family:Nunito,sans-serif;text-align:center;padding:4rem;border:14px double #8E1EA2;margin:2rem"><h1 style="color:#8E1EA2;font-size:3rem">Certificate of Completion</h1><p style="font-size:1.3rem">This certifies that the learner has completed</p><h2 style="color:#C654C3">${course.name}</h2><p>on ${new Date().toLocaleDateString()} · Average ${Progress.averages().wpm} WPM at ${Progress.averages().acc}% accuracy</p><p style="margin-top:3rem;letter-spacing:.3em;color:#8E1EA2"><b>TYPO</b></p><script>print()<\/script></body>`);
};
$('#nav-progress').onclick = e => {
  e.preventDefault();
  const rows = CURRICULUM.allLessons.filter(l => Progress.lesson(l.id)).map(l => { const p = Progress.lesson(l.id); return `<div class="progress-row"><span>${l.name}</span><span>${p.bestWpm || p.wpm} wpm · ${p.acc}% ${starsHtml(p.stars)}</span></div>`; });
  $('#progress-body').innerHTML = rows.length ? rows.join('') : '<p>No lessons completed yet. Start with <b>J, F, and Space</b>!</p>';
  $('#progress-modal').hidden = false;
};
$('#close-progress').onclick = () => $('#progress-modal').hidden = true;

renderSidebar(); renderCourse(); renderProfile();
if (new URLSearchParams(location.search).get('done')) { Effects.toast('Progress saved. Nice work!', '🏆'); setTimeout(() => { Effects.bump($('#stat-wpm').parentElement.parentElement); Effects.bump($('#stat-acc').parentElement.parentElement); }, 400); history.replaceState(null, '', 'index.html'); }
