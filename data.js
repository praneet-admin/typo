// Curriculum data for TYPO. Each lesson has multiple "screens" of text.
// gen(keys, n) builds drill text from a set of keys so beginner lessons stay on the taught keys.
function gen(keys, words, seed) {
  let s = seed || 7;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const chars = keys.replace(/ /g, '');
  const out = [];
  for (let i = 0; i < words; i++) {
    const len = 2 + Math.floor(rnd() * 4);
    let w = '';
    for (let j = 0; j < len; j++) w += chars[Math.floor(rnd() * chars.length)];
    out.push(w);
  }
  return out.join(' ');
}

const CURRICULUM = {
  sections: [
    {
      title: 'Learn to Type',
      courses: [
        {
          id: 'keys-1', name: 'Learn the Keys 1', sub: 'Home row & first reaches',
          units: [
            { title: 'Starting Out', lessons: [
              { id: 'k1-1', name: 'J, F, and Space', keys: 'jf', intro: 'Place your index fingers on <b>F</b> and <b>J</b>. Feel the little bumps? Those are your home base.', screens: ['jjj fff jjj fff jfj fjf', gen('jf', 10, 1), gen('jf', 14, 2)] },
              { id: 'k1-2', name: 'U, R, and K Keys', keys: 'jfurk', intro: 'Reach up with your index fingers for <b>R</b> and <b>U</b>. Your right middle finger rests on <b>K</b>.', screens: ['uuu rrr kkk ujr fkr', gen('jfurk', 12, 3), gen('jfurk', 16, 4)] },
              { id: 'k1-3', name: 'D, E, and I Keys', keys: 'jfurkdei', intro: 'Middle fingers reach up to <b>E</b> and <b>I</b>. Left middle finger lives on <b>D</b>.', screens: ['ddd eee iii ded kik', gen('jfurkdei', 12, 5), gen('jfurkdei', 16, 6)] },
              { id: 'k1-4', name: 'C, G, and N Keys', keys: 'jfurkdeicgn', intro: '<b>C</b> is a reach down for the left middle finger; <b>G</b> and <b>N</b> are index-finger stretches.', screens: ['ccc ggg nnn dcd fgf jnj', gen('jfurkdeicgn', 12, 7), gen('jfurkdeicgn', 16, 8)] },
              { id: 'k1-5', name: 'Beginner Review 1', keys: 'jfurkdeicgn', intro: 'Mix everything you have learned so far. Keep your eyes on the screen, not the keys.', screens: [gen('jfurkdeicgn', 14, 9), gen('jfurkdeicgn', 14, 10), 'fine ride king edge crude junk juice green fried cringe'] },
              { id: 'k1-6', name: 'Personalized Practice', keys: 'jfurkdeicgn', timed: 120, intro: 'A two-minute drill on the keys you have missed most. Accuracy first, speed second.', screens: ['ninjin fired ducking urged kidding redden junked cinder reigned'] },
            ]},
            { title: 'Reaching Out', lessons: [
              { id: 'k1-7', name: 'T, S, and L Keys', keys: 'jfurkdeicgntsl', intro: 'Left index reaches to <b>T</b>. Ring fingers rest on <b>S</b> and <b>L</b>.', screens: ['ttt sss lll ftf sls', gen('jfurkdeicgntsl', 12, 11), 'little settle silk tilts ensue listed stilt'] },
              { id: 'k1-8', name: 'O, B, and A Keys', keys: 'jfurkdeicgntslobа'.replace('а','a'), intro: 'Right ring finger reaches up to <b>O</b>; <b>B</b> is the long reach for the left index. Left pinky rests on <b>A</b>.', screens: ['ooo bbb aaa lol fbf asa', gen('aobtslfjdk', 12, 12), 'about boast table robot sober balsa taboo'] },
              { id: 'k1-9', name: 'H, M, and W Keys', keys: 'jfurkdeicgntsloabhmw', intro: 'Right index moves left for <b>H</b>, down for <b>M</b>. Left ring finger reaches up for <b>W</b>.', screens: ['hhh mmm www jhj jmj sws', 'whom harm mesh whim home maw wham', 'the moth wham home with him warm mesh'] },
              { id: 'k1-10', name: 'Y, P, and V Keys', keys: 'jfurkdeicgntsloabhmwypv', intro: 'Right index reaches up for <b>Y</b>, right pinky for <b>P</b>, left index down for <b>V</b>.', screens: ['yyy ppp vvv jyj ;p; fvf'.replace(/;/g,'p'), 'very happy puppy yelp pave vivid yawn', 'pay the piper every day you have a vivid pup'] },
              { id: 'k1-11', name: 'Q, X, and Z Keys', keys: 'jfurkdeicgntsloabhmwypvqxz', intro: 'The outer keys: pinky up for <b>Q</b>, ring down for <b>X</b>, pinky down for <b>Z</b>.', screens: ['qqq xxx zzz aqa sxs aza', 'quiz zax quartz zippy excel xylem', 'quick zebras jump over lazy foxes'] },
              { id: 'k1-12', name: 'Beginner Review 2', keys: 'abcdefghijklmnopqrstuvwxyz', intro: 'Every letter is now in play. Steady rhythm beats bursts of speed.', screens: ['the quick brown fox jumps over the lazy dog', 'pack my box with five dozen liquor jugs', 'how vexingly quick daft zebras jump'] },
            ]},
          ]
        },
        {
          id: 'keys-2', name: 'Learn the Keys 2', sub: 'Capitals, punctuation & numbers',
          units: [
            { title: 'Shifting Gears', lessons: [
              { id: 'k2-1', name: 'Capital Letters', keys: 'shift', intro: 'Hold <b>Shift</b> with the <i>opposite</i> hand from the letter you are capitalizing.', screens: ['Ask Dan Fly Jump Kite Love', 'Sam and Rita went to Paris in May', 'Tom Hanks Met Emma Stone In Toronto'] },
              { id: 'k2-2', name: 'Period & Comma', keys: '.,', intro: 'Right ring finger drops to <b>,</b> and right middle finger to <b>.</b>', screens: ['k,k l.l k,k l.l', 'Yes, we can. No, we will not.', 'Red, green, and blue. Stop. Go.'] },
              { id: 'k2-3', name: 'Apostrophe & Question', keys: "'?", intro: 'Right pinky reaches for <b>\'</b>; <b>?</b> is Shift plus slash.', screens: ["it's don't can't won't", "Who's there? Isn't it late?", "What's your name? I'm Sam."] },
              { id: 'k2-4', name: 'Numbers 1-5', keys: '12345', intro: 'Left hand numbers. Reach up from the home row and snap back.', screens: ['111 222 333 444 555', '12 34 51 23 45 15', 'call 312 or 455 then 123'] },
              { id: 'k2-5', name: 'Numbers 6-0', keys: '67890', intro: 'Right hand numbers. <b>6</b> is the far stretch for your right index.', screens: ['666 777 888 999 000', '67 89 06 78 90 60', 'rooms 608 and 790 open at 6'] },
              { id: 'k2-6', name: 'Intermediate Review', keys: 'all', intro: 'Letters, capitals, punctuation and numbers all together.', screens: ["In 2024, Maya's team won 3 games.", "Isn't 7 o'clock too late? Not for Jo.", 'Order 15 pens, 8 pads, and 2 boxes.'] },
            ]},
          ]
        },
      ]
    },
    {
      title: 'Applied Typing',
      courses: [
        {
          id: 'words', name: 'Common Words', sub: 'The 200 most frequent words',
          units: [ { title: 'Fluency', lessons: [
            { id: 'w-1', name: 'Top 50 Words', keys: 'all', intro: 'Type the most common English words until they flow without thought.', screens: ['the of and to in is you that it he was for on are as with his they', 'at be this have from or one had by word but not what all were we when', 'your can said there use an each which she do how their if will up other'] },
            { id: 'w-2', name: 'Short Sentences', keys: 'all', intro: 'Short, natural sentences. Aim for an even rhythm.', screens: ['We went home after the show.', 'She read the book in one day.', 'They will be here at noon.'] },
            { id: 'w-3', name: 'Paragraph Practice', keys: 'all', intro: 'A full paragraph. Breathe, relax your shoulders, and keep going.', screens: ['Touch typing is the skill of typing without looking at the keyboard. Each finger owns a small set of keys, and over time your hands learn where every key lives. Speed comes naturally once accuracy is solid.'] },
          ]}]
        },
        {
          id: 'code', name: 'Coding Practice', sub: 'Brackets, symbols & snippets',
          units: [ { title: 'Symbols', lessons: [
            { id: 'c-1', name: 'Brackets & Braces', keys: '[]{}()', intro: 'Brackets live under your right pinky. Braces are the same keys with Shift.', screens: ['[] {} () [] {} ()', '(a) [b] {c} ({[]})', 'if (x) { y[0] = (z); }'] },
            { id: 'c-2', name: 'Operators', keys: '=+-*/<>', intro: 'The top row symbols that make up most code.', screens: ['= + - * / < >', 'a = b + c * d / e;', 'x <= y && y >= z || x != z'] },
            { id: 'c-3', name: 'JavaScript Snippets', keys: 'all', intro: 'Real code. Case and punctuation matter.', screens: ['const sum = (a, b) => a + b;', 'for (let i = 0; i < n; i++) total += i;', 'document.querySelector("#app").textContent = "Hi";'] },
          ]}]
        },
      ]
    },
    {
      title: 'Tests',
      courses: [
        {
          id: 'tests', name: 'Timed Tests', sub: '1, 3 and 5 minute tests',
          units: [ { title: 'Measure Yourself', lessons: [
            { id: 'test-1', name: '1 Minute Test', keys: 'all', timed: 60, test: true, intro: 'One minute. Type as much as you can, as accurately as you can.', screens: ['The sun had barely risen when the small town began to stir. Shopkeepers rolled up their shutters, the baker set out warm loaves, and a stray dog trotted down the empty street looking for breakfast. By eight the square was full of voices, and the day had properly begun. Nobody noticed the quiet stranger sitting on the bench by the fountain, reading a letter for the third time.'] },
            { id: 'test-3', name: '3 Minute Test', keys: 'all', timed: 180, test: true, intro: 'Three minutes. Pace yourself and stay accurate.', screens: ['Learning to type well is one of the few skills that pays off every single day. Emails, essays, messages, and code all move faster when your fingers know the way. The trick is not raw speed but trust: trusting that your hands will land on the right keys without your eyes checking. Build that trust with short daily sessions rather than long occasional ones. Ten focused minutes a day beats an hour on Sunday. Over a month the gains are obvious, and over a year they are remarkable. Keep your wrists relaxed, sit up straight, and let the rhythm carry you forward one word at a time.'] },
            { id: 'test-5', name: '5 Minute Test', keys: 'all', timed: 300, test: true, intro: 'Five minutes. The real measure of endurance and accuracy.', screens: ['There is a particular kind of quiet that settles over a library late in the afternoon. The light softens, the chairs creak less often, and the only steady sound is the faint tap of keys from someone finishing an essay they should have started last week. Libraries have always been places of borrowed time: borrowed books, borrowed silence, borrowed focus. People come in scattered and leave a little more gathered. The librarian knows the regulars by their habits rather than their names. The man who always takes the corner table and reads history. The student who prints too many pages and apologizes every time. The child who whispers loudly because whispering is a skill that takes years to master. Every one of them is practicing something, whether they know it or not. Practice is simply attention repeated until it becomes ease. The same is true of typing, of writing, of reading, and of almost everything that matters.'] },
          ]}]
        },
      ]
    },
  ],
};

CURRICULUM.allLessons = [];
CURRICULUM.sections.forEach(sec => sec.courses.forEach(course => course.units.forEach(unit => unit.lessons.forEach(l => {
  l.courseId = course.id; l.courseName = course.name; l.unitTitle = unit.title;
  CURRICULUM.allLessons.push(l);
}))));
CURRICULUM.byId = Object.fromEntries(CURRICULUM.allLessons.map(l => [l.id, l]));
CURRICULUM.course = id => CURRICULUM.sections.flatMap(s => s.courses).find(c => c.id === id);
