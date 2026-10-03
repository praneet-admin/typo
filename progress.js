// Progress store backed by localStorage.
const Progress = (() => {
  const KEY = 'typo-progress-v1';
  const LEVELS = [
    { name: 'Typing Seedling', xp: 500, icon: '🌱' },
    { name: 'Typing Sprout', xp: 1500, icon: '🌿' },
    { name: 'Typing Sapling', xp: 3500, icon: '🌳' },
    { name: 'Typing Tree', xp: 7000, icon: '🌲' },
    { name: 'Typing Forest', xp: Infinity, icon: '🏞️' },
  ];
  const today = () => new Date().toISOString().slice(0, 10);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
  let data = Object.assign({ lessons: {}, xp: 0, seconds: 0, days: {}, theme: 'dark' }, load());

  function record(lessonId, result) {
    const prev = data.lessons[lessonId];
    const stars = result.acc >= 98 ? 3 : result.acc >= 92 ? 2 : 1;
    const entry = { wpm: result.wpm, acc: result.acc, stars, at: Date.now(), attempts: (prev?.attempts || 0) + 1 };
    if (prev && prev.wpm > entry.wpm) entry.bestWpm = prev.bestWpm || prev.wpm; else entry.bestWpm = entry.wpm;
    data.lessons[lessonId] = entry;
    const xp = Math.round(result.chars * 2 * (result.acc / 100)) + stars * 25;
    data.xp += xp;
    data.seconds += result.seconds;
    data.days[today()] = (data.days[today()] || 0) + result.seconds;
    save(data);
    return { xp, stars };
  }
  function level() {
    let i = 0, base = 0;
    while (data.xp >= LEVELS[i].xp) { base = LEVELS[i].xp; i++; }
    const L = LEVELS[i];
    return { index: i + 1, total: LEVELS.length, name: L.name, icon: L.icon, into: data.xp - base, need: L.xp === Infinity ? 1 : L.xp - base };
  }
  function averages() {
    const done = Object.values(data.lessons);
    if (!done.length) return null;
    return { wpm: Math.round(done.reduce((a, l) => a + l.wpm, 0) / done.length), acc: Math.round(done.reduce((a, l) => a + l.acc, 0) / done.length), count: done.length };
  }
  function streak() {
    let n = 0; const d = new Date();
    for (;;) { const k = d.toISOString().slice(0, 10); if (data.days[k]) { n++; d.setDate(d.getDate() - 1); } else break; }
    return n;
  }
  return {
    get data() { return data; },
    record, level, averages, streak,
    lesson: id => data.lessons[id],
    todaySeconds: () => data.days[today()] || 0,
    reset() { data = { lessons: {}, xp: 0, seconds: 0, days: {}, theme: data.theme }; save(data); },
    setTheme(t) { data.theme = t; save(data); },
  };
})();

function applyTheme() {
  document.documentElement.dataset.theme = Progress.data.theme;
  const b = document.getElementById('theme-toggle');
  if (b) b.textContent = Progress.data.theme === 'dark' ? '☀️' : '🌙';
}
function wireTheme() {
  applyTheme();
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    Progress.setTheme(Progress.data.theme === 'dark' ? 'light' : 'dark'); applyTheme();
  });
}
const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
