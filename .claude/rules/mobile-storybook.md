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
- V `components` iz tega projekta ne spreminjaj ničesar (samo branje).

## Struktura gradnika
- `stories/MobileX.stories.js` — naslov `Gradniki - mobile/<Ime>`, `Variants` ("Vse različice",
  1:1 postavitev Figma doc framea s helperji iz `stories/mobile-showcase.jsx`),
  `Default` ("Privzeto") + nekaj args storyjev. `parameters.design.url = figmaMobileUrl('3911:…')`.
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
- `npm run storybook` (6006), posnetek `iframe.html?id=gradniki-mobile-<x>--variants` primerjaj
  s PNG v `design_data` pri enaki širini; počakaj na pisave.
- Commit na gradnik: `Align Gradniki - mobile/<Ime> with components SOT` (ali `Add …` za nov gradnik).
- Ne commitaj `node_modules/`, `debug-storybook.log`, `.sb-cache/`, `storybook-static/`.
