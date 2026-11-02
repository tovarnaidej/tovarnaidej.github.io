import React from 'react';

import { Input } from './Input';
import {
  MobileShowcase,
  ShowcaseSection,
  figmaMobileUrl,
} from './mobile-showcase';
import './input-showcase.css';

const iosStyles = ['underline', 'outline', 'filled'];
const androidStyles = ['outline', 'filled'];
const stateRows = [
  { key: 'default', enabled: true, hasError: false, focused: false },
  { key: 'focused', enabled: true, hasError: false, focused: true },
  { key: 'error', enabled: true, hasError: true, focused: false },
  { key: 'disabled', enabled: false, hasError: false, focused: false },
];

const renderPlatformGrid = (platform, styles) =>
  React.createElement(
    'div',
    { className: 'input-showcase__grid' },
    ...stateRows.flatMap((row) =>
      [false, true].flatMap((showIcon) =>
        styles.map((style) =>
          React.createElement(Input, {
            key: `${platform}-${row.key}-${style}-${showIcon ? 'icon' : 'plain'}`,
            platform,
            style,
            enabled: row.enabled,
            hasError: row.hasError,
            focused: row.focused,
            showIcon,
            label: 'Label',
            placeholder: 'Placeholder text',
          }),
        ),
      ),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Vnosna polja', className: 'input-showcase' },
    React.createElement(
      ShowcaseSection,
      { title: 'iOS' },
      renderPlatformGrid('ios', iosStyles),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Android' },
      renderPlatformGrid('android', androidStyles),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vnosno polje',
  component: Input,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:2408') },
    platformCode: { component: 'input' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outline',
    enabled: true,
    hasError: false,
    focused: false,
    showIcon: false,
    obscure: false,
    label: 'Oznaka',
    placeholder: 'Nadomestno besedilo',
    platform: 'ios',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          underline: 'Podčrtano',
          outline: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
      },
      options: ['underline', 'outline', 'filled'],
    },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    focused: { name: 'Fokus', control: { type: 'boolean' } },
    showIcon: { name: 'Ikona', control: { type: 'boolean' } },
    obscure: { name: 'Skrij', control: { type: 'boolean' } },
    label: { name: 'Oznaka' },
    placeholder: { name: 'Nadomestno besedilo' },
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

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled' },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};
