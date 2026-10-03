# TYPO — typing lessons

A small typing tutor inspired by the layout of typing.com's lessons page, styled with the
palette #8E1EA2 · #C654C3 · #ED96D7 · #FFC0DE, and linked to its sister vocabulary app
[Gengo](https://praneet-admin.github.io/gengo/).

- `index.html` — lesson catalog: profile bar (level, XP, averages, daily goal ring), course sidebar, unit list with per-lesson stars.
- `lesson.html?id=…` — lesson player: highlighted text, on-screen keyboard with next-key + finger hints, live WPM/accuracy, result modal with XP.
- Progress lives in `localStorage` under `typo-progress-v1`. Plain HTML/CSS/JS, no build step.

Run locally:

```bash
python3 -m http.server 8777
```
