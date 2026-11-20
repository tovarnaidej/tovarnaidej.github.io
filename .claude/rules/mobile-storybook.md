---
description: Gradniki - mobile v Storybooku — vir resnice, struktura, Koda snippeti, vizualno preverjanje
paths:
  - "stories/**"
  - ".storybook/**"
---

# Gradniki - mobile (Storybook dvojčki native gradnikov)

## Vir resnice (SOT)
- **Mobilna knjižnica `d:\projekti_tovarna\components` je vir resnice** za videz,
  variante, stanja in API mobilnih gradnikov:
  - Flutter: `flutter/lib/src/components/<x>/` + `*_tokens.dart`, `flutter/lib/src/tokens/tokens.dart`
  - Android (Kotlin Views): `android/component-library/src/main/kotlin/si/gov/componentlibrary/components/<x>/` + `tokens/*.kt`
  - iOS SwiftUI: `ios/Sources/Components/SwiftUI/<X>/` + `ios/Sources/Tokens/*.swift`
- Vizualna referenca: `components/design_data/*.png` (posnetki Figma frameov) in
  `components/design_data/figma_json_export.txt` (CSS vrednosti po sekcijah gradnikov).
- Ko se native koda in Figma/PNG razlikujeta, **velja native koda**; razliko zabeleži.
- Med platformami je primarni vir **Flutter** (iz njega je izpeljan katalog). Kjer Flutter sam
  veje po platformi (`Platform.isIOS`), dobi dvojček `platform` prop in "Vse različice" `PlatformColumns`.
- Barve/tipografija: `stories/mobile-tokens.css` (zrcali `tokens.dart`) — uporabljaj `var(--si-…)`.
- Pisava: mobilni dvojčki uporabljajo družino `'SI Republika'` (`public/fonts/si/` = TTF-ji iz
  `components/flutter/fonts`, metrike kot v native). Spletni gradniki ostanejo na `'Republika'`.
- **Storybook je kopija Flutter kataloga** (`components/flutter/catalog_app`):
  - seznam in imena = `catalog_app/lib/main.dart` (`title: 'Gradniki - mobile/<name>'`); kar katalog
    nima (npr. samostojni Seznam, Vnos zneska), v Storybooku ni;
  - kontrole = konfigurator (`screens/*_configurator.dart`): `argTypes.name` = oznaka kontrole,
    enum oznake = `catalogEnumChipLabel` (`widgets/config_controls.dart`), privzete `args` = privzeto stanje;
    kontrole, ki jih katalog nima, skrij (`table: { disable: true }`), razen "Platforma";
  - besedila predogledov = dobesedno iz konfiguratorja (tudi angleški vzorci, npr. `Example Button`),
    nizi knjižnice iz `assets/localization/sl.json`, datumi v en_US (`SIDateFormat`).
- "Vse različice" sledijo postavitvi PNG v `components/design_data/`; kjer se SOT razlikuje od PNG,
  velja SOT (razliko zapiši v commit sporočilo).
- V `components` iz tega projekta ne spreminjaj ničesar (samo branje).

## Mere, poravnave, sence (obvezno preveri)
- **Referenca je izris dejanskega Flutter kataloga**, ne branje kode ali PNG "na oko":
  `tools/flutter-reference/` (README) z `flutter test` izriše zaslone `catalog_app` in zapiše za vsak
  tekst x / osnovnico / širino / pisavo. `compare.mjs` jih primerja z dvojčkom (toleranca 0,6 px),
  `imgdiff.py` in `inkbox.py` preverita ikone, robove in sence. Ob spremembi gradnika: izriši
  privzeto stanje + vsako kontrolo kataloga in primerjaj.
- **Štiri preverjanja na primer** (`bash fullpass.sh <map> <out>`): postavitev (`compare.mjs`),
  dejanski izris črk (`inkruns.py`), barve ploskev (`flatdiff.py`) ter ikone in oblike
  (`shapediff.py`). Gradnik je usklajen šele, ko vsak primer izpiše `ALL TEXT RUNS MATCH`, `INK OK`,
  `FLAT OK` in `SHAPE OK` - za Android in za iOS veje.
  Samo številke postavitve niso dovolj: ne pokažejo odrezanih spodnjih delov črk, zamika zaradi
  zaokroževanja na piko, polnila, ki se od podlage loči le malo, ikone na napačnem mestu,
  manjkajočega radija ali pretanke črte.
- Besedilo na obarvani ploskvi (značka, izbrani dan, avatar) preveri glede na ploskev
  (`blob.py`, `painted.py`): vsak zase sta lahko znotraj 0,5 px, skupaj pa 1 px narazen.
- Chromium škatle (ozadja, obrobe, slike) pripne na celo CSS piko, Flutter jih nariše tudi na
  polovici: ploskev, ki mora stati na 0,5 px, premakni s `transform` (Koledar: krog izbranega dne),
  črto debeline 1,8 px nariši kot 2 px s `scaleY(0.9)` (Prikaz korakov).
- `components/design_data/figma_json_export.txt` (`cssProps` po sekcijah) in PNG služijo za postavitev
  "Vse različice" in za gradnike/stanja, ki jih katalog ne pokaže. Kjer se razlikujejo od izrisa, velja izris.
- Pregled Figma izvoza: `python figaudit.py` + `node figaudit.mjs [sekcija]` (v `tools/flutter-reference/`) izpiše
  Figma vrednosti brez ujemanja v dvojčku. Vsako preveri v Flutter tokenih: kjer se knjižnica namenoma
  razlikuje od Figme, dvojčka ne spreminjaj.
- Kar se iz kode ne vidi, a izris pokaže (ne ugibaj, izmeri):
  - `Text` brez `height` / `letterSpacing` podeduje Material 3 `bodyMedium` iz kataloga
    (višina 1.43, razmik 0.25) — npr. Koledar, oznake Prikaza korakov;
  - besedilo v `Text` / Material je `leadingDistribution: even` (= CSS). `TextField` vrednost/namig,
    oznaka `InputDecorator` in `TextPainter` so **proporcionalni** → `translate: 0 var(--si-lead-regular|medium|bold)`;
  - obroba je v Flutterju največkrat narisana znotraj mere (CSS padding = token − 1px), `Stack` zrahlja
    omejitve (Harmonika: vrstica na vrhu glave), `ConstrainedBox(minHeight: tap target)` (48 / 44);
  - katalog ob menjavi kontrole spremeni tudi druge vrednosti (Prikaz korakov 6/10/3, Zavihki 3→8) —
    v storyju z `useArgs` iz `storybook/preview-api`.
- Metrike pisave: `public/fonts/si-republika.css` z `ascent-override`/`descent-override` pripne
  metrike na hhea (kot naprave). Brez tega Chromium za Medium uporabi OS/2 win metrike (besedilo ~0,1em nižje).
  Chromium zaokroži negativni half-leading navzdol (Bold 22/28, 13/17: +0,6 px `translate`).
- Native tipografske korekcije prenesi vedno: `StrutStyle(forceStrutHeight)` → premik osnovnice
  (`--si-strut-medium-on-bold` 0.1428em, `--si-strut-medium-on-regular` 0.0781em), cap-centriranje
  (`.si-cap-centred`; `text-box-trim` deluje le pri Medium — Regular/Bold imata napačen sCapHeight,
  zato `--bold`/`--regular` različici s `transform`), `Transform.translate` / `*OffsetY` tokeni.
- Sence: Flutter `blurRadius` R → CSS blur = 1.1547·R + 1 (sigma 0.577R+0.5 vs B/2). Izjema:
  `MaskFilter.blur(sigma)` → CSS blur = 2·sigma.
- Storyji: na gradnik samo **Vse različice** (vse variante iz design_data) in **Privzeto** (kontrole kot katalog,
  imena kontrol dobesedno; notranje props skrij). Privzeto ima širino predogleda kataloga
  (`mobileWidth` 361, polna širina 393 za Razdelilnik / Drsnik).
- iOS veje (`Platform.isIOS`): `IOS=1 bash tools/flutter-reference/setup.sh` naredi kopijo knjižnice in
  kataloga z vklopljenimi iOS vejami (`.flutter-ref/ios`); dvojček primerjaj s `platform:ios`.
- Kar izris pokaže, koda pa ne (vse je v dvojčkih, ne odstranjuj):
  - Zavihki: družina pisave struta se v knjižnici ne razreši, zato naprava vrstico postavi s sistemsko
    pisavo (Roboto) - oznake so 0,63 px nižje kot z Republiko (`tabs.css`);
  - Republika Medium nima znaka "…": naprava ga nariše z Roboto Medium. `si-republika.css` ima zanj
    `@font-face` z `unicode-range: U+2026` (izrez iz Roboto Medium, Apache 2.0);
  - `TextOverflow.ellipsis` + `TextAlign.center` obrezano vrstico centrira; CSS `text-overflow` jo pusti
    levo, zato Zavihki rez izračunajo sami (`Tabs.jsx`, polno besedilo v `data-text`);
  - obrobljeni Filter in obrobljeno Iskalno polje imata belo polnilo (ne prozornega);
  - Kartica: katalog kot sliko poda enobarvno ploskev #F5F5F5 - enako Privzeto; vzorčna slika iz Figme
    je le v "Vse različice" (`sampleMedia`).
- Zamik besedila za delček pike: `position: relative; top: …`, ne `translate` / `transform` (Chromium
  besedilo s transformacijo izriše do 0,5 px nižje). Vrstico, ki bi se začela na delčku pike, pripni na
  celo piko (Avatar: `--si-avatar-initials-top`); `text-box-trim` pri tem ni zanesljiv.
- Znana posebnost izrisa (ne popravljaj dvojčka): značka Filtra na iOS ima namenski zamik za CoreText
  (viden rezultat je enak Androidu), zato primer `filter__filters-badge` v iOS prehodu odstopa za 1 px.
- Kazalnik napredka: "Animacija" (`value: null`) je isti določni kazalnik, ki se polni 0 → 1
  (easeInOut, 1600 ms), počaka 350 ms in začne znova - ne vrtenje ali drseča črta.
- Kartica, kompaktna na Androidu (82): medij 80 je centriran, zato se nad in pod njim vidi 1 px
  barve kartice (pri obrobljeni ga prekrije obroba). To je lastnost knjižnice, ne napaka dvojčka.

## Struktura gradnika
- `stories/MobileX.stories.js` — naslov `Gradniki - mobile/<Ime>`, `Variants` ("Vse različice",
  1:1 postavitev Figma doc framea s helperji iz `stories/mobile-showcase.jsx`),
  `Default` ("Privzeto"). `parameters.design.url = figmaMobileUrl('3911:…')`.
- `stories/X.jsx` + `stories/x.css` — React dvojček; točne vrednosti iz SOT (ne zaokroževati).
  Pisava Republika (`public/fonts/republika.css`). Gradniki z iOS/Android razliko imajo `platform` prop.
- Asseti v `stories/assets/mobile/<widget>/`, kopirani iz `components/flutter/icons` ali
  `components/ios/Sources/Resources` (ne Figma MCP URL-ji, ne nadomestne ikone).
- Koda zavihek: `stories/code-snippets/<x>.js` (`makeSnippetBuilder` + `MOBILE_PLATFORMS` iz `_shared.js`),
  registracija v `.storybook/addons/platform-code/manager.jsx` (`snippetBuilders`, `platformsByComponent`),
  story vklopi z `parameters.platformCode.component = '<x>'`.
  - Platforme: Android (Kotlin Views `SIX(context).apply { … }`), iOS (SwiftUI), Flutter. Brez UIKit, brez React.
  - Samo vstavek brez importov; imena parametrov/enumov morajo ustrezati trenutnemu native API-ju.
  - Ob spremembi native API-ja posodobi tudi snippet.
  - Snippeti so v manager bundle — po spremembi **ponovno zaženi** `npm run storybook` (HMR jih ne osveži).
- Širina posameznih storyjev: meta `decorators: [withMobileWidth]` + `parameters.mobileWidth`;
  `Variants` nastavi `mobileWidth: 0`.

## Preverjanje
- `npm run storybook` (6006); `Privzeto` + kontrole primerjaj s Flutter izrisom (`tools/flutter-reference`),
  `iframe.html?id=gradniki-mobile-<x>--variants` s PNG v `design_data` pri enaki širini; počakaj na pisave.
- Commit na gradnik: `Align Gradniki - mobile/<Ime> with components SOT` (ali `Add …` za nov gradnik).
- Ne commitaj `node_modules/`, `debug-storybook.log`, `.sb-cache/`, `storybook-static/`, `.flutter-ref/`.
