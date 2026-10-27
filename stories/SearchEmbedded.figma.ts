// url=https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/?node-id=3604-8439
// source=stories/Search.jsx
// component=Search
import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('Size', {
  Large: 'large',
  Compact: 'compact',
})

const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'hover',
  Focus: 'focus',
  Filled: 'filled',
  Error: 'error',
  Disabled: 'disabled',
})

const queryProp = instance.getString('Query')
const queryLayer = instance.findText('Query')
const queryText = queryLayer ? queryLayer.textContent : queryProp
const actionLayer = instance.findText('Action label')
const actionLabel = actionLayer ? actionLayer.textContent : 'Iskanje'

const isFilled = state === 'filled'

export default {
  example: isFilled
    ? figma.code`<Search
  variant="embedded"
  size="${size}"
  state="${state}"
  value="${queryText}"
  actionLabel="${actionLabel}"
/>`
    : figma.code`<Search
  variant="embedded"
  size="${size}"
  state="${state}"
  placeholder="${queryText}"
  actionLabel="${actionLabel}"
/>`,
  imports: ["import { Search } from './Search'"],
  id: 'search-embedded',
  metadata: {
    nestable: false,
  },
}
