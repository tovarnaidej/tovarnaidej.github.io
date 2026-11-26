import React from 'react';
import { useArgs } from 'storybook/preview-api';

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
  // Catalog order: Debelina, Označeno, Omogočeno, Napaka, Prikaži oznako, Oznaka (always shown).
  args: {
    thickness: 'thick',
    checked: false,
    enabled: true,
    hasError: false,
    showLabel: true,
    label: 'Checkbox label',
    platform: 'android',
  },
  argTypes: {
    thickness: {
      name: 'Debelina',
      control: { type: 'inline-radio', labels: { thin: 'Tanka', thick: 'Debela' } },
      options: ['thin', 'thick'],
    },
    checked: { name: 'Označeno', control: { type: 'boolean' } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    // shown while Prikaži oznako is on, as in the iOS catalog (Flutter / Android show it always)
    label: { name: 'Oznaka', control: { type: 'text' }, if: { arg: 'showLabel', eq: true } },
    platform: {
      name: 'Platforma',
      control: { type: 'select', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = {
  name: 'Privzeto',
  // Tapping the box changes "Označeno" too (the catalog shares one value).
  render: (args) => {
    const [, updateArgs] = useArgs();
    return React.createElement(Checkbox, { ...args, onChange: (checked) => updateArgs({ checked }) });
  },
};
