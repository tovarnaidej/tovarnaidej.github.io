import React from 'react';

import { AmountInput } from './AmountInput';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

// Layout style2 = iOS default (label above), style1 = Android default (label inside).
const states = [
  { key: 'empty' },
  { key: 'value', value: '1250.00' },
  { key: 'helper', value: '1250.00', helperText: 'Pomožno besedilo' },
  { key: 'error', value: '1250.00', hasError: true },
  { key: 'disabled', enabled: false },
];

const column = (layout) =>
  React.createElement(
    ShowcaseStack,
    { gap: 24 },
    ...['outline', 'filled'].flatMap((style) =>
      states.map(({ key, ...state }) =>
        React.createElement(AmountInput, { key: `${style}-${key}`, layout, style, ...state }),
      ),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Vnos zneska' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, { ios: column('style2'), android: column('style1'), gap: 48 }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vnos zneska',
  component: AmountInput,
  decorators: [withMobileWidth],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6980') },
    platformCode: { component: 'amount-input' },
    mobileWidth: 375,
  },
  tags: ['autodocs'],
  args: {
    label: 'Znesek',
    style: 'outline',
    layout: 'style1',
    currencyCode: 'NGN',
    value: '',
    enabled: true,
    hasError: false,
    helperText: '',
  },
  argTypes: {
    label: { name: 'Oznaka' },
    style: {
      name: 'Slog',
      control: { type: 'inline-radio', labels: { outline: 'Obrobljeno', filled: 'Zapolnjeno' } },
      options: ['outline', 'filled'],
    },
    layout: {
      name: 'Postavitev',
      control: {
        type: 'inline-radio',
        labels: { style1: 'Oznaka v polju (Android)', style2: 'Oznaka nad poljem (iOS)' },
      },
      options: ['style1', 'style2'],
    },
    currencyCode: { name: 'Valuta' },
    value: { name: 'Vrednost' },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    helperText: { name: 'Pomožno besedilo' },
    placeholder: { table: { disable: true } },
    errorText: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen', mobileWidth: 0 },
};

export const Default = { name: 'Privzeto' };

export const LabelAbove = {
  name: 'Oznaka nad poljem (iOS)',
  args: { layout: 'style2', value: '1250.00' },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true, value: '1250.00' },
};
