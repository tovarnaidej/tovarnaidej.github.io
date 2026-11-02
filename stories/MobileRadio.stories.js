import React from 'react';

import { Radio, RadioItem } from './Radio';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const states = [
  { key: 'unselected', selected: false, enabled: true, hasError: false },
  { key: 'selected', selected: true, enabled: true, hasError: false },
  { key: 'disabled', selected: false, enabled: false, hasError: false },
  { key: 'error', selected: true, enabled: true, hasError: true },
];

const renderColumn = (platform) =>
  React.createElement(
    ShowcaseStack,
    { gap: 20 },
    ...states.map((s) =>
      React.createElement(RadioItem, {
        key: `${platform}-${s.key}`,
        platform,
        selected: s.selected,
        enabled: s.enabled,
        hasError: s.hasError,
        label: 'Placeholder text',
        name: `si-radio-showcase-${platform}-${s.key}`,
      }),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Radio Button' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, {
        gap: 63,
        showLabels: false,
        ios: renderColumn('ios'),
        android: renderColumn('android'),
      }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Izbira - izbirni gumb',
  component: Radio,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6285') },
    platformCode: { component: 'radio' },
  },
  tags: ['autodocs'],
  args: {
    enabled: true,
    hasError: false,
    showLabels: true,
    label1: 'Option 1',
    label2: 'Option 2',
    label3: 'Option 3',
    platform: 'ios',
  },
  argTypes: {
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showLabels: { name: 'Prikaži oznake', control: { type: 'boolean' } },
    label1: { name: 'Oznaka 1' },
    label2: { name: 'Oznaka 2' },
    label3: { name: 'Oznaka 3' },
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

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};

export const Disabled = {
  name: 'Onemogočeno',
  args: { enabled: false },
};
