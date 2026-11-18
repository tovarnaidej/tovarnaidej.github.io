import React from 'react';

import { Divider } from './Divider';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const types = ['fullWidth', 'inset'];

const column = (platform) =>
  React.createElement(
    ShowcaseStack,
    { gap: 24 },
    React.createElement(Divider, { platform, type: 'fullWidth' }),
    React.createElement(Divider, { platform, type: 'inset' }),
    React.createElement(Divider, { platform, type: 'fullWidth', showLabel: true, label: 'Subheader' }),
    React.createElement(Divider, { platform, type: 'inset', showLabel: true, label: 'Subheader' }),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Razdelilnik' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PlatformColumns, { ios: column('ios'), android: column('android') }),
    ),
  );

export default {
  title: 'Gradniki - mobile/Razdelilnik',
  component: Divider,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:3645') },
    platformCode: { component: 'divider' },
  },
  tags: ['autodocs'],
  args: {
    platform: 'android',
    type: 'fullWidth',
    showLabel: false,
    label: 'Subheader',
  },
  argTypes: {
    platform: {
      name: 'Platforma',
      control: { type: 'inline-radio', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    type: {
      name: 'Vrsta',
      control: {
        type: 'select',
        labels: {
          fullWidth: 'Celotna širina',
          inset: 'Vdelan',
        },
      },
      options: types,
    },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    label: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };
