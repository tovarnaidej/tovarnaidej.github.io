// url=https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/?node-id=3604-8278
// source=stories/Search.jsx
// component=Search
import figma from 'figma'

const instance = figma.selectedInstance

const state = instance.getEnum('State', {
  Default: 'default',
  Hover: 'hover',
  Focus: 'focus',
  Filled: 'filled',
  Error: 'error',
  Disabled: 'disabled',
  Results: 'results',
})

const queryProp = instance.getString('Query')
const queryLayer = instance.findText('Query')
const queryText = queryLayer ? queryLayer.textContent : queryProp
const actionLayer = instance.findText('Iskanje')
const actionLabel = actionLayer ? actionLayer.textContent : 'Iskanje'

const isFilledLike = state === 'filled' || state === 'results'

export default {
  example: isFilledLike
    ? figma.code`<Search
  variant="universal"
  state="${state}"
  value="${queryText}"
  actionLabel="${actionLabel}"
/>`
    : figma.code`<Search
  variant="universal"
  state="${state}"
  placeholder="${queryText}"
  actionLabel="${actionLabel}"
/>`,
  imports: ["import { Search } from './Search'"],
  id: 'search-universal',
  metadata: {
    nestable: false,
  },
}
