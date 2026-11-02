import React from 'react';

import { TabBar } from './TabBar';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const counts = [5, 4, 3, 2];

const renderColumn = (platform) =>
  React.createElement(
    ShowcaseStack,
    { gap: 20 },
    ...counts
      .filter((n) => platform === 'ios' || n > 2)
      .map((tabCount) =>
        React.createElement(TabBar, {
          key: `${platform}-${tabCount}`,
          platform,
          tabCount,
        }),
      ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Tab Bar' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, {
        gap: 168,
        showLabels: true,
        ios: renderColumn('ios'),
        android: renderColumn('android'),
      }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vrstica zavihkov',
  component: TabBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:2898') },
    platformCode: { component: 'tab-bar' },
  },
  tags: ['autodocs'],
  args: {
    tabCount: 3,
    platform: 'ios',
  },
  argTypes: {
    tabCount: {
      name: 'Zavihki',
      control: {
        type: 'select',
        labels: { 2: 'Dve', 3: 'Tri', 4: 'Štiri', 5: 'Pet' },
      },
      options: [2, 3, 4, 5],
    },
    platform: {
      name: 'Platforma',
      control: { type: 'select', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
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

export const FiveTabs = {
  name: 'Pet zavihkov',
  args: { tabCount: 5 },
};
