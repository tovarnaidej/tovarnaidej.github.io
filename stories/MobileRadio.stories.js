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
  { key: 'error', selected: false, enabled: true, hasError: true },
];

const renderColumn = (thickness) =>
  React.createElement(
    ShowcaseStack,
    { gap: 20 },
    ...states.map((s, i) =>
      React.createElement(RadioItem, {
        key: `${thickness}-${s.key}`,
        thickness,
        selected: s.selected,
        enabled: s.enabled,
        hasError: s.hasError,
        label: `Option ${(i % 3) + 1}`,
        name: `si-radio-showcase-${thickness}-${s.key}`,
      }),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Izbira - izbirni gumb' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, {
        gap: 63,
        labels: ['Tanka', 'Debela'],
        ios: renderColumn('thin'),
        android: renderColumn('thick'),
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
  // Catalog order: Debelina, Omogočeno, Napaka, Prikaži oznake.
  args: {
    thickness: 'thick',
    enabled: true,
    hasError: false,
    showLabels: true,
    label1: 'Option 1',
    label2: 'Option 2',
    label3: 'Option 3',
    platform: 'android',
  },
  argTypes: {
    thickness: {
      name: 'Debelina',
      control: { type: 'inline-radio', labels: { thin: 'Tanka', thick: 'Debela' } },
      options: ['thin', 'thick'],
    },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showLabels: { name: 'Prikaži oznake', control: { type: 'boolean' } },
    label1: { table: { disable: true } },
    label2: { table: { disable: true } },
    label3: { table: { disable: true } },
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
