# mslovenija_web — navodila za Claude Code

Storybook (React 19 + Vite, Storybook 10) knjižnice gradnikov mSlovenija,
objavljen na https://tovarnaidej.github.io/.

- `Gradniki/…` — spletni gradniki (WebButton, WebHeader, Search, Obvestilo …); vir je Figma.
- `Gradniki - mobile/…` — React dvojčki mobilnih gradnikov iz `d:\projekti_tovarna\components`
  (Flutter / Android / iOS), z zavihkom **Koda** za vse tri platforme. Vir resnice je mobilna knjižnica.

## Ukazi
- `npm run storybook` — lokalni Storybook na :6006
- `npm run build-storybook` — statični build v `storybook-static/`. Lokalno ga zaženi iz mape z veliko
  črko pogona: `cmd /c "cd /d D:\projekti_tovarna\mslovenija_web && npm run build-storybook"`. Pri
  `d:\` `builder-vite` (pathe) zapiše absolutne poti zgodb in nobena zgodba se ne naloži
  (`importFn`: "… is not a function"). Objava (GitHub Actions, Linux) tega ne pozna.

## Pravila
Pravila so v `.claude/rules/` (prej `.cursor/rules/`):
- `component-library.md`, `figma-implementation.md` — veljajo vedno
- `react.md` — `**/*.{js,jsx,ts,tsx}`
- `silverstripe.md` — `**/*.{ss,php}`
- `mobile-storybook.md` — `stories/**`, `.storybook/**` (mobilni gradniki, SOT, Koda)

Pri mobilnih gradnikih ima `mobile-storybook.md` prednost pred splošnim pravilom "Figma je vir resnice".

## Opombe
- Figma: uporabi Figma MCP (`get_design_context`, `get_screenshot`). Če ni povezan, to povej in ne ugibaj vrednosti.
- Zgodovina Cursor chatov in planov je v `.ai-history/cursor/` (ni v gitu).
- `tools/flutter-reference/` — izris Flutter kataloga in številčna primerjava z mobilnimi dvojčki (glej README).
- `docs/mobile-rules-export/` — kopija pravil za mobilne projekte (ni pravilo tega projekta).
- `node_modules/` je (zgodovinsko) v gitu — teh sprememb ne commitaj.
