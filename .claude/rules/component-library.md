---
description: Uporaba obstoječe knjižnice gradnikov in Storybooka
---

# Uporaba obstoječe knjižnice gradnikov

## Pred implementacijo
- Preveri projektno knjižnico in njen Storybook
  (objavljeno: https://tovarnaidej.github.io/ ali lokalni `npm run storybook`).
- Najprej poišči ustrezen gradnik, varianto, velikost in stanje.
- Če gradnik že obstaja, ga uporabi. Ne ustvarjaj vzporedne kopije.
- Uporabi izvorno komponento oziroma projektni paket.
  Ne uvažaj prevedenih JS datotek z objavljenega Storybooka.

## Figma vs Storybook
- Figma določa zahtevani videz in postavitev.
- Storybook dokumentira obstoječo implementacijo gradnikov.
- Če se razlikujeta, navedi konkretno razliko in njen obseg.
- Ne spreminjaj skupne komponente tako, da bi pokvaril druge uporabe.
- Projektno posebnost izvedi kot jasno določeno varianto ali razširitev.
- Razmike med komponentami določi v postavitvi nadrejene komponente.
  Notranjih razmikov gradnika ne spreminjaj z naključnimi preglasitvami.

## Spremembe gradnikov
- Pri spremembi dopolni Storybook primere.
- Vsaka kontrola v panelu Controls mora spremeniti predogled, tudi po izrisu:
  - zgodba-pregled (fiksen nabor primerkov, ne bere argumentov) ima `controls: { disable: true }`;
  - kontrolo, ki v zgodbi nima učinka (druga postavitev, zaprt meni, polje z vrednostjo), skrij z
    `if` ali `control: false`; pri `argTypes` zgodbe ponovi celotno definicijo iz meta (sicer dobi
    ime ključa namesto slovenske oznake);
  - vrednost, ki jo komponenta prebere le ob izrisu (`defaultValue`), poveži s `key`;
  - ID-ji in povezave so izbira med veljavnimi vrednostmi, ne prosto besedilo (`#` ne gre v URL:
    `mapping`).
  - Preverjanje: `node tools/flutter-reference/webcontrols.mjs` (STALE + NO EFFECT).
- Enako velja za tabelo kontrol na strani **Dokumentacija** (sem pripelje klik na gradnik v stranski
  vrstici). Storybookova privzeta stran tabelo veže na prvo zgodbo datoteke; to je pregled, ki
  argumentov ne bere, zato je bila tabela mrtva na vseh straneh. Lastna stran (`DocsPage` v
  `.storybook/preview.jsx`) postavi:
  - zgoraj prvo zgodbo s kontrolami (en gradnik: Privzeto, Primarni …);
  - takoj pod njo tabelo, vezano nanjo;
  - pod tabelo ostale zgodbe (Vse različice, Pregled …), vsako enkrat.

  Nova zgodba-pregled je lahko prva v datoteki, če ima `controls: { disable: true }`.
  Zgodba, ki v pogledu zgodbe zapolni okno, ima razred `story-fill`, ne `min-height: 100vh`, sicer
  je tabela na strani Dokumentacija cel zaslon pod gradnikom. Gradnik, širši od stolpca (1000 px),
  dobi pravilo v `.storybook/docs-page.css`: Header je narisan v 1440 px in pomanjšan na stolpec.
  Pravila CSS so samo za Storybook (`.sb-story`), oznake zgodbe pa ostanejo enake kot v pogledu
  zgodbe.
  Preverjanje: `DOCS=1 node tools/flutter-reference/webcontrols.mjs` (`MOBILE=1` za mobilne).
  Po spremembi `.storybook/preview.*` znova zaženi `npm run storybook`: dev strežnik ob tej spremembi
  zgodbe ponovno indeksira in jih lahko razčleni kot MDX ("Could not parse expression with acorn").
- Preveri vse prizadete variante in interaktivna stanja.
- CSS predstavitvenih tabel/dokumentacije ne prenašaj v produkcijo.
- Po vključitvi preveri gradnik tudi na dejanski strani.
