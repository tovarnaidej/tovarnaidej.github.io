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

const renderColumn = (platform) =>
  React.createElement(
    ShowcaseStack,
    { gap: 10 },
    ...states.map((s) =>
      React.createElement(Checkbox, {
        key: `${platform}-${s.key}`,
        platform,
        checked: s.checked,
        enabled: s.enabled,
        hasError: s.hasError,
        label: 'Placeholder text',
      }),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Checkbox' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, {
        gap: 33,
        showLabels: false,
        ios: renderColumn('ios'),
        android: renderColumn('android'),
      }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Potrditveno polje',
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
    platform: 'ios',
  },
  argTypes: {
    checked: { name: 'Označeno', control: { type: 'boolean' } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
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

export const Checked = {
  name: 'Označeno',
  args: { checked: true },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true, checked: true },
};
