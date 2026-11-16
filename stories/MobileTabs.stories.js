import React from 'react';

import { Tabs } from './Tabs';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Zavihki' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        // design_data/Tabs.png: fixed 3 + 4 in both styles, then scrollable.
        ...[
          ['underline', 'fixed', 3],
          ['filled', 'fixed', 3],
          ['underline', 'fixed', 4],
          ['filled', 'fixed', 4],
          ['underline', 'scrollable', 8],
          ['filled', 'scrollable', 8],
        ].map(([style, configuration, tabCount]) =>
          React.createElement(Tabs, {
            key: `${style}-${configuration}-${tabCount}`,
            style,
            configuration,
            tabCount,
          }),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Zavihki',
  component: Tabs,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6740') },
    platformCode: { component: 'tabs' },
  },
  tags: ['autodocs'],
  args: {
    style: 'underline',
    configuration: 'fixed',
    tabCount: 3,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { underline: 'Podčrtano', filled: 'Zapolnjeno' },
      },
      options: ['underline', 'filled'],
    },
    configuration: {
      name: 'Konfiguracija',
      control: {
        type: 'select',
        labels: { fixed: 'Fiksno', scrollable: 'Pomakljivo' },
      },
      options: ['fixed', 'scrollable'],
    },
    tabCount: {
      name: 'Zavihki',
      control: {
        type: 'select',
        labels: { 3: 'Tri', 4: 'Štiri', 5: 'Pet', 8: 'Osem' },
      },
      options: [3, 4, 5, 8],
    },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };

export const FilledScrollable = {
  name: 'Zapolnjeno pomakljivo',
  args: { style: 'filled', configuration: 'scrollable', tabCount: 8 },
};
