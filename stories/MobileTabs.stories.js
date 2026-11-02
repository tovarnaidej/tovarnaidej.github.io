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
    { title: 'Tabs' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        React.createElement(Tabs, {
          style: 'underline',
          configuration: 'fixed',
          tabCount: 3,
        }),
        React.createElement(Tabs, {
          style: 'filled',
          configuration: 'fixed',
          tabCount: 4,
        }),
        React.createElement(Tabs, {
          style: 'underline',
          configuration: 'scrollable',
          tabCount: 4,
        }),
        React.createElement(Tabs, {
          style: 'filled',
          configuration: 'scrollable',
          tabCount: 4,
        }),
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
