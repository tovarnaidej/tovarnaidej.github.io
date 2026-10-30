import { addons } from 'storybook/manager-api';

import './addons/platform-code/manager';
import brandTheme from './brand-theme';

addons.setConfig({
  theme: brandTheme,
  // Storybook 10: prefer nested layout; keep top-level for older merges.
  showPanel: true,
  panelPosition: 'bottom',
  selectedPanel: 'addon-controls',
  layout: {
    showPanel: true,
    showNav: true,
    showToolbar: true,
    showTabs: true,
    panelPosition: 'bottom',
    bottomPanelHeight: 300,
  },
  sidebar: {
    showRoots: true,
  },
});
