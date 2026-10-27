// url=https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/?node-id=3604-8338
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

const queryLayer = instance.findText('Query')
const queryText = queryLayer ? queryLayer.textContent : 'Kaj iščete?'

const isFilledLike = state === 'filled' || state === 'results'
const isDisabledEmpty = state === 'disabled' && !isFilledLike

export default {
  example: isFilledLike
    ? figma.code`<Search
  variant="compact"
  state="${state}"
  value="${queryText}"
  actionLabel="Iskanje"
/>`
    : figma.code`<Search
  variant="compact"
  state="${state}"
  placeholder="${isDisabledEmpty ? 'Iskanje trenutno ni na voljo' : queryText}"
  actionLabel="Iskanje"
/>`,
  imports: ["import { Search } from './Search'"],
  id: 'search-compact',
  metadata: {
    nestable: false,
  },
}
