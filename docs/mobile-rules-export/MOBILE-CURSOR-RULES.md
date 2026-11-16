# Mobile Cursor rules (Flutter / Android / iOS)

Kopiraj celotno vsebino spodaj v drug Cursor projekt (npr. User Rules,
Project Rules, ali en `AGENTS.md` / rule dokument). Ni `.mdc` datotek.

---

## 1. Implementacija dizajnov iz Figme

### Vir dizajna
- Figma je glavni vir za videz implementirane komponente.
- Pred implementacijo odpri navedeni frame/node: dimenzije, lastnosti, Auto Layout, variante in povezane komponente.
- Preglej kontekst zaslona: širino, zunanje razmike, ozadje, poravnavo, safe area / status bar / navigation bar.
- Če povezava ali podatki niso dostopni, to jasno povej. Ne predstavljaj ugibanih vrednosti kot izmerjenih.

### Obvezni izpis parametrov PRED kodo
Pred prvim Dart / Kotlin / SwiftUI zapisom iz Figme (MCP `get_design_context` + `get_screenshot` + po potrebi `use_figma` dump) zapiši kontrolni seznam točnih vrednosti. Šele nato implementiraj. Seznam mora vsebovati:
- Layout: width/height, padding, gap/spacing, radius, stroke (barva, debelina, align), align/justify, clip
- Tipografija vsakega text nodea: family, style/weight, size, lineHeight (AUTO ali px), letterSpacing, fill
- Barve fills/strokes (hex), sence (x/y/blur/spread/color)
- Ikone/asset: velikost, položaj
- Variante in stanja, ki so v scopeu

Nobene vrednosti v kodi, ki je ni na tem seznamu — razen eksplicitno dokumentirane prilagoditve platforme (npr. TextField clip, Material min touch 48dp, iOS Dynamic Type), kjer navedeš Figma vrednost, omejitev platforme in izračun — ne “približno kot ikona”.

### Natančnost
- Uporabi točne vrednosti za padding, margin, gap, širine, višine, max-width, robove, radije, sence in barve.
- Vrednosti ne zaokrožuj na najbližjo vrednost obstoječe spacing lestvice, razen če Figma že uporablja isti token.
- Uporabi točno družino pisave, rez, velikost, line-height in letter-spacing. Preveri, da je pisava dejansko v bundlu / pubspec / asset catalogu.
- Ohrani prelome besedila pri referenčni širini in enaki vsebini.
- Uporabi originalne slike, SVG/PDF in ikone iz dizajna. Ne nadomeščaj jih s podobnimi Material / SF Symbols / emoji.
- Ohrani razmerje stranic, izrez in položaj slike.
- Ne spreminjaj dizajna zaradi lastnih estetskih preferenc.

### Tipografija v poljih — naučeno (ne ponavljaj)
1. Ne ugibaj line-height / height po višini ikone. Uporabi Figma `lineHeight` (AUTO ali px) in hug višino text nodea.
2. Paziti na porezane descenderje (`g`/`p`) pri clipped containerjih in native TextField / EditText / UITextField.
3. Če platforma poreže tekst: loči vizualni face/label od input hit-targeta; clip na field, ne na text face.
4. Vertikalno: Figma `counterAxisAlignItems: CENTER` → center v Row/Column/HStack — ne slepo absolute `top` po Figma y, če pokvari hug višino Regular teksta.
5. Stroke visible false ≠ 1px transparent border. Neviden stroke ne sme insetati ikone/teksta. Focus/Error: stroke se zadebeli, padding ostane kot v Figmi (razen če Figma eksplicitno spremeni padding).
6. Preveri vsa stanja: default / pressed / focused / filled / error / disabled (na touch ni hover kot primarno stanje).

### Postavitev in odzivnost
- Auto Layout prevedi v Row/Column/Flex (Flutter), Row/Column (Compose), HStack/VStack/LazyVGrid (SwiftUI).
- Razlikuj fiksne mere, hug (prilagajanje vsebini) in fill (zapolnjevanje prostora).
- Absolute / Stack positioning le za elemente, ki ga dejansko zahtevajo.
- Upoštevaj vse dostavljene phone / tablet (in dark, če obstaja) dizajne.
- Če manjka odzivna različica, uporabi projektna pravila in navedi predpostavke. Pri bistveno različnih postavitvah vprašaj.
- Med referenčnimi širinami zagotovi tekoče prilagajanje brez prekrivanja, odrezanega besedila ali horizontalnega drsenja.

### Komponente in slogi
- Najprej preveri obstoječe komponente, tokene in theme konvencije.
- Ponovno uporabi ustrezno komponento in njene variante.
- Če obstoječa komponenta odstopa od Figme, dodaj ustrezno varianto. Ne spreminjaj vseh njenih pojavitev zaradi ene implementacije.
- Ponavljajoče se oblikovne vrednosti poveži v smiselne tokene / Theme / ColorScheme.
- Ne uvajaj nove UI knjižnice brez potrebe.
- Ne dodajaj globalnih theme popravkov za lokalni problem.

### Obnašanje in dostopnost
- Implementiraj prikazana stanja (pressed, focused, disabled, error, odprta), kjer so določena. Za manjkajoča uporabi projektne konvencije.
- Semantics / TalkBack / VoiceOver, min touch target, focus order.
- Če dizajn povzroča težavo z dostopnostjo, jo izpostavi in predlagaj najmanjši potreben popravek.

### Prioriteta pri konfliktu Figma ↔ knjižnica
1. Uporabi obstoječi gradnik, če vizualno ustreza Figmi.
2. Če se razlikujeta: navedi razliko; dodaj varianto/razširitev, ne pokvari drugih uporab.
3. Točne Figma vrednosti uporabi v novi/razširjeni variantni plasti ali v postavitvi nadrejene komponente — ne z naključnimi preglasitvami notranjih razmikov gradnika.
4. Razmike med komponentami določi v nadrejeni postavitvi.

### OBVEZNO: ADB testi + Figma primerjava
Brez tega UI naloga NI končana. Ne trdi 1:1 ali “izgleda OK” brez ADB dokaza.

Za vsako novo/spremenjeno UI komponento ali zaslon:

1. Zazeni aplikacijo na Android emulatorju ali napravi (ADB).
2. Navigiraj do točnega zaslona / stanja iz Figme (enaka vsebina, varianta, stanje).
3. Zajemi screenshot prek ADB, npr.:
   ```bash
   adb exec-out screencap -p > capture.png
   ```
   ali usmerjen zajem po potrebi projekta (`adb shell screencap`, instrumentation, Maestro, itd.).
4. Primerjaj ADB posnetek z Figma framom / `get_screenshot` pri enaki širini (ali enakem device frame), vsebini in stanju.
5. Pred zajemom počakaj na nalaganje pisav, slik in animacij.
6. Kjer so orodja na voljo, uporabi prekrivanje ali vizualni diff.
7. Popravi odstopanja in ponovno zajemi prek ADB; ponovi, dokler odstopanja niso odpravljena ali eksplicitno dokumentirana.
8. Preveri tudi druge dostavljene širine / orientation, če so v scopeu.

V zaključku odgovora mora biti:
- Uporabljena naprava/emulator + ukaz ADB (ali ekvivalent).
- Preverjene širine / stanja.
- Seznam preostalih odstopanj (ali “ni znanih odstopanj” po primerjavi).
- Ne trdi 1:1, če ADB ↔ Figma primerjava ni bila opravljena.

iOS dopolnilo: za iOS native / Flutter iOS poleg ADB (Android) uporabi tudi simulator screenshot (`xcrun simctl io booted screenshot …`) ali napravo — a Android ADB preverjanje ostane obvezno, kadar je Android v scopeu projekta. Če je projekt samo iOS, uporabi simulator/device screenshot z istimi koraki primerjave z Figmo.

Prepovedano:
- Zaključiti UI nalogo samo z opisom kode ali lokalnim previewom (Widgetbook / Preview / Compose Preview / Xcode Canvas) brez ADB/device zajema.
- Ugibati, da “izgleda enako”, brez datoteke posnetka in Figma reference.

---

## 2. Uporaba obstoječe knjižnice gradnikov

### Pred implementacijo
- Preveri projektno knjižnico in njen katalog komponent (Widgetbook, Showkase, SwiftUI Previews, custom gallery, …).
- Najprej poišči ustrezen gradnik, varianto, velikost in stanje.
- Če gradnik že obstaja, ga uporabi. Ne ustvarjaj vzporedne kopije.
- Uporabi izvorno komponento / paket / modul projekta. Ne kopiraj “prevedenih” ali snapshot artefaktov iz kataloga.

### Figma vs katalog
- Figma določa zahtevani videz in postavitev.
- Katalog dokumentira obstoječo implementacijo gradnikov.
- Če se razlikujeta, navedi konkretno razliko in njen obseg.
- Ne spreminjaj skupne komponente tako, da bi pokvaril druge uporabe.
- Projektno posebnost izvedi kot jasno določeno varianto ali razširitev.
- Razmike med komponentami določi v postavitvi nadrejene komponente. Notranjih razmikov gradnika ne spreminjaj z naključnimi preglasitvami.

### Spremembe gradnikov
- Pri spremembi dopolni katalog / preview primere.
- Preveri vse prizadete variante in interaktivna stanja.
- Predstavitvenih slogov kataloga ne prenašaj v produkcijski UI.
- Po vključitvi preveri gradnik tudi na dejanskem zaslonu prek ADB in primerjaj z Figmo (glej razdelek 1).

---

## 3. Flutter

- Sledi obstoječemu ogrodju, usmerjanju (GoRouter/auto_route), jeziku in načinu stiliranja (Theme, tokens).
- Figma komponente in variante preslikaj v smiselne Flutter widgete z jasnimi parametri.
- Preferiraj majhne private widget razrede namesto `_build…` metod.
- Loči prikaz komponente od pridobivanja podatkov, kjer to koristi ponovni uporabi in preverjanju videza.
- Za enako komponento ne ustvarjaj skoraj identičnih kopij.
- State uporabi za dejansko spreminjajoče se podatke; izračunljivih vrednosti ne podvajaj v state.
- Riverpod: preferiraj `@riverpod` / Notifier / AsyncNotifier; izogibaj se StateProvider / StateNotifier / ChangeNotifier, razen če projekt že tako dela.
- Ohrani predvidene interakcije ter loading, empty in error stanja, kjer so relevantna. Napake prikaži vidno (npr. SelectableText.rich), ne samo s SnackBar.
- Če projekt uporablja Widgetbook ali drugo galerijo, dodaj primere dostavljenih variant in stanj.
- `const` konstruktorji, kjer gre; trailing commas; line length po projektu.
- Po UI spremembi obvezno ADB screenshot + Figma primerjava (razdelek 1). Preview v IDE ni dovolj.

---

## 4. Android (Jetpack Compose)

- Sledi obstoječi arhitekturi, navigaciji, theme in modulom projekta.
- Figma komponente in variante preslikaj v smiselne Composable funkcije z jasnimi parametri.
- Loči UI od ViewModel / data layer, kjer to koristi reuse in preview.
- Za enako komponento ne ustvarjaj skoraj identičnih kopij.
- State: dejansko spremenljivi podatki; izračunljivega ne podvajaj.
- Ohrani loading, empty in error stanja, kjer so relevantna.
- Uporabi projektne tokene / MaterialTheme razširitve; ne hardcodaj barv, ki že obstajajo kot tokeni — razen ko Figma zahteva točno vrednost, ki je še ni v theme (potem dodaj token ali lokalno dokumentiraj).
- Min touch target in TalkBack semantics upoštevaj; če Figma lomi a11y, izpostavi najmanjši popravek.
- Compose Preview ni dovolj za zaključek. Obvezno: zaženi na emulatorju/napravi, zajemi prek ADB (`adb exec-out screencap -p > capture.png`), primerjaj z Figmo (razdelek 1).

---

## 5. iOS (SwiftUI)

- Sledi obstoječi arhitekturi, navigaciji, theme in targetom projekta.
- Figma komponente in variante preslikaj v smiselne SwiftUI Viewe z jasnimi properties / init parametri.
- Loči prikaz od podatkovnega sloja, kjer to koristi reuse in Previews.
- Za enako komponento ne ustvarjaj skoraj identičnih kopij.
- State (`@State` / `@Observable` / project pattern) samo za dejansko spremenljive podatke; izračunljivega ne podvajaj.
- Ohrani loading, empty in error stanja, kjer so relevantna.
- Uporabi projektne barve/fonte iz Asset Catalog / design tokens. Originalne ikone iz Figme — ne zamenjuj s “podobnimi” SF Symbols, razen če Figma eksplicitno uporablja SF Symbol.
- VoiceOver labels in Dynamic Type: če Figma lomi a11y, izpostavi najmanjši popravek.
- Xcode Canvas Preview ni dovolj za zaključek. Obvezno: screenshot na simulatorju/napravi in primerjava z Figmo (razdelek 1). Če je v projektu tudi Android, ADB preverjanje ostane obvezno za Android build.

---

## 6. Kaj od web pravil ne gre sem
- Silverstripe / CMS `.ss` / PHP — web CMS.
- Native HTML `<input>` + CSS `text-box-trim` recepti — Chromium/web.
- Storybook / `npm run storybook` — zamenjaj z mobilnim katalogom.
- Semantični HTML / tipkovnica kot primarni input — na mobile: touch + a11y API.
- Hover kot glavno stanje — na touch: pressed / focused.
