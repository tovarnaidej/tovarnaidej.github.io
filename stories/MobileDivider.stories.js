import React from 'react';

import { Divider } from './Divider';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const types = ['fullWidth', 'inset'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Divider' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 24 },
        React.createElement(Divider, {
          type: 'fullWidth',
          showLabel: false,
        }),
        React.createElement(Divider, {
          type: 'inset',
          showLabel: false,
        }),
        React.createElement(Divider, {
          type: 'inset',
          showLabel: true,
          label: 'Subheader',
        }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Ločilo',
  component: Divider,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:3645') },
    platformCode: { component: 'divider' },
  },
  tags: ['autodocs'],
  args: {
    type: 'fullWidth',
    showLabel: false,
    label: 'Subheader',
  },
  argTypes: {
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
    label: {
      name: 'Oznaka',
      if: { arg: 'showLabel', eq: true },
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

export const InsetLabeled = {
  name: 'Vdelan z oznako',
  args: { type: 'inset', showLabel: true },
};
