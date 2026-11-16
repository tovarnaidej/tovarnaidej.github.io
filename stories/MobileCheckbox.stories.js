import React from 'react';

import { Checkbox } from './Checkbox';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const states = [
  { key: 'unchecked', checked: false, enabled: true, hasError: false },
  { key: 'checked', checked: true, enabled: true, hasError: false },
  { key: 'disabled', checked: true, enabled: false, hasError: false },
  { key: 'error', checked: true, enabled: true, hasError: true },
];

const renderColumn = (thickness) =>
  React.createElement(
    ShowcaseStack,
    { gap: 10 },
    ...states.map((s) =>
      React.createElement(Checkbox, {
        key: `${thickness}-${s.key}`,
        thickness,
        checked: s.checked,
        enabled: s.enabled,
        hasError: s.hasError,
        label: 'Checkbox label',
      }),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Izbira - potrditveno polje' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, {
        gap: 33,
        labels: ['Tanka', 'Debela'],
        ios: renderColumn('thin'),
        android: renderColumn('thick'),
      }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Izbira - potrditveno polje',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:2801') },
    platformCode: { component: 'checkbox' },
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    enabled: true,
    hasError: false,
    showLabel: true,
    label: 'Checkbox label',
    thickness: 'thick',
  },
  argTypes: {
    checked: { name: 'Označeno', control: { type: 'boolean' } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    label: { name: 'Oznaka', if: { arg: 'showLabel', eq: true } },
    thickness: {
      name: 'Debelina',
      control: { type: 'inline-radio', labels: { thin: 'Tanka', thick: 'Debela' } },
      options: ['thin', 'thick'],
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

export const Checked = {
  name: 'Označeno',
  args: { checked: true },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true, checked: true },
};
