// url=https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/?node-id=7006-277
// source=stories/Obvestilo.jsx
// component=Obvestilo
import figma from 'figma'

const instance = figma.selectedInstance

const type = instance.getEnum('Type', {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
  Information: 'information',
})

const viewport = instance.getEnum('Viewport', {
  Desktop: 'desktop',
  Mobile: 'mobile',
})

const titleLayer = instance.findText('Title') || instance.findText('Naslov obvestila')
const messageLayer = instance.findText('Message') || instance.findText('Kratek opis obvestila z jasnim naslednjim korakom za uporabnika.')
const actionLayer = instance.findText('Action') || instance.findText('Poglej podrobnosti')

const title = titleLayer ? titleLayer.textContent : 'Naslov obvestila'
const message = messageLayer
  ? messageLayer.textContent
  : 'Kratek opis obvestila z jasnim naslednjim korakom za uporabnika.'
const actionLabel = actionLayer ? actionLayer.textContent : 'Poglej podrobnosti'

const showAction = instance.getBoolean('Show action', true)
const dismissible = instance.getBoolean('Dismissible', true)

export default {
  example: figma.code`<Obvestilo
  type="${type}"
  viewport="${viewport}"
  title="${title}"
  message="${message}"
  showAction={${showAction}}
  actionLabel="${actionLabel}"
  dismissible={${dismissible}}
/>`,
  imports: ["import { Obvestilo } from './Obvestilo'"],
  id: 'obvestilo-alert-web',
  metadata: {
    nestable: false,
  },
}
