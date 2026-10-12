import { addons } from 'storybook/manager-api';

import brandTheme from './brand-theme';

addons.setConfig({
  theme: brandTheme,
  showPanel: true,
  panelPosition: 'bottom',
  sidebar: {
    showRoots: true,
  },
});
