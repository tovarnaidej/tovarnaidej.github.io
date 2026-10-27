// url=https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/?node-id=3604-8512
// source=stories/Search.jsx
// component=Search
import figma from 'figma'

const instance = figma.selectedInstance

const resultsState = instance.getEnum('State', {
  Loading: 'loading',
  Results: 'results',
  Empty: 'empty',
  Error: 'error',
})

const queryProp = instance.getString('Query')
const queryLayer = instance.findText('Query')
const queryText = queryLayer ? queryLayer.textContent : queryProp

export default {
  example: figma.code`<Search
  variant="universal"
  value="${queryText}"
  resultsState="${resultsState}"
  actionLabel="Iskanje"
/>`,
  imports: ["import { Search } from './Search'"],
  id: 'search-results',
  metadata: {
    nestable: false,
  },
}
