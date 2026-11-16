# Mobile Cursor rules (kopiraj v drug projekt)

Kopiraj vse `.mdc` datoteke v ciljni projekt:

```
ciljni-projekt/.cursor/rules/
```

Priporočena vsebina:

| Datoteka | Namen |
|---|---|
| `figma-implementation.mdc` | Figma SoT + natančnost + **obvezni ADB testi** |
| `component-library.mdc` | Reuse gradnikov / kataloga |
| `flutter-components.mdc` | Flutter widgeti, state, Riverpod |
| `android-compose.mdc` | Jetpack Compose |
| `ios-swiftui.mdc` | SwiftUI |

`figma-implementation.mdc` ima `alwaysApply: true` — ADB + Figma primerjava je obvezna pri vsaki UI implementaciji.
