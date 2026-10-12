import { addons } from 'storybook/manager-api';

import brandTheme from './brand-theme';

addons.setConfig({
  theme: brandTheme,
  sidebar: {
    showRoots: true,
  },
});
