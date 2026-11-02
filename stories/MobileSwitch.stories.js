import React from 'react';

import { Switch } from './Switch';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const states = [
  { key: 'on', value: true, enabled: true },
  { key: 'off', value: false, enabled: true },
  { key: 'disabled', value: true, enabled: false },
];

const renderColumn = (platform) =>
  React.createElement(
    ShowcaseStack,
    { gap: 20 },
    ...states.map((s) =>
      React.createElement(Switch, {
        key: `${platform}-${s.key}`,
        platform,
        value: s.value,
        enabled: s.enabled,
        showLabel: false,
      }),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Switch/Toggle' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, {
        gap: 98,
        showLabels: true,
        ios: renderColumn('ios'),
        android: renderColumn('android'),
      }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Stikalo',
  component: Switch,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6388') },
    platformCode: { component: 'switch' },
  },
  tags: ['autodocs'],
  args: {
    value: false,
    enabled: true,
    showLabel: true,
    label: 'Switch label',
    platform: 'ios',
  },
  argTypes: {
    value: { name: 'Vrednost', control: { type: 'boolean' } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    label: { name: 'Oznaka', if: { arg: 'showLabel', eq: true } },
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

export const On = {
  name: 'Vklopljeno',
  args: { value: true },
};
