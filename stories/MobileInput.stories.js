import React from 'react';

import { Input } from './Input';
import {
  MobileShowcase,
  ShowcaseSection,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';
import './input-showcase.css';

// design_data/Vnosna polja.png
// Top: label above (iOS) — underline / outline / filled, without and with icon;
//      rows enabled / focused / error / disabled.
// Bottom: floating label (Android) — outline / filled, without and with icon;
//      rows resting / floated with value / error / disabled.
const aboveColumns = [
  { style: 'underline', showIcon: false },
  { style: 'outline', showIcon: false },
  { style: 'filled', showIcon: false },
  { style: 'underline', showIcon: true },
  { style: 'outline', showIcon: true },
  { style: 'filled', showIcon: true },
];
const aboveRows = [
  {},
  { focused: true },
  { hasError: true },
  { enabled: false },
];

const floatingColumns = [
  { style: 'outline', showIcon: false },
  { style: 'filled', showIcon: false },
  { style: 'outline', showIcon: true },
  { style: 'filled', showIcon: true },
];
const floatingRows = [
  { value: '' },
  { value: 'Besedilo' },
  { value: 'Besedilo', hasError: true },
  { value: '', enabled: false },
];

const grid = (rows, columns, base) =>
  React.createElement(
    'div',
    { className: 'input-showcase__grid', style: { gridTemplateColumns: `repeat(${columns.length}, 374px)` } },
    ...rows.flatMap((row, r) =>
      columns.map((col, c) =>
        React.createElement(Input, { key: `${r}-${c}`, label: 'Oznaka', ...base, ...col, ...row }),
      ),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Vnosna polja', className: 'input-showcase' },
    React.createElement(
      ShowcaseSection,
      { title: 'Oznaka nad poljem (iOS)' },
      grid(aboveRows, aboveColumns, { platform: 'ios', labelPosition: 'above', value: 'Besedilo' }),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Oznaka v polju (Android)' },
      grid(floatingRows, floatingColumns, { platform: 'android', labelPosition: 'floating' }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vnosno polje',
  component: Input,
  decorators: [withMobileWidth],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:2408') },
    platformCode: { component: 'input' },
    mobileWidth: 361,
  },
  tags: ['autodocs'],
  args: {
    style: 'outline',
    platform: 'ios',
    labelPosition: 'above',
    enabled: true,
    hasError: false,
    focused: false,
    showIcon: false,
    obscure: false,
    label: 'Oznaka',
    value: 'Besedilo',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { underline: 'Podčrtano', outline: 'Obrobljeno', filled: 'Zapolnjeno' },
      },
      options: ['underline', 'outline', 'filled'],
    },
    platform: {
      name: 'Platforma',
      control: { type: 'inline-radio', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    labelPosition: {
      name: 'Oznaka',
      control: {
        type: 'select',
        labels: { floating: 'V polju', above: 'Nad poljem', hidden: 'Brez' },
      },
      options: ['floating', 'above', 'hidden'],
    },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    focused: { table: { disable: true } },
    showIcon: { name: 'Ikona', control: { type: 'boolean' } },
    obscure: { name: 'Skrij', control: { type: 'boolean' } },
    label: { name: 'Oznaka' },
    value: { table: { disable: true } },
    errorText: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen', mobileWidth: 0 },
};

export const Default = { name: 'Privzeto' };

export const Floating = {
  name: 'Oznaka v polju (Android)',
  args: { platform: 'android', labelPosition: 'floating' },
};

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled' },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};

export const WithIcon = {
  name: 'Z ikono',
  args: { showIcon: true },
};
