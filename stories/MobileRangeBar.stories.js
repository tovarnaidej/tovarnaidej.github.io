import React from 'react';

import { RangeBar } from './RangeBar';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Range bar / slider' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 40 },
        React.createElement(RangeBar, { value: 0, showTicks: true }),
        React.createElement(RangeBar, { value: 0.25, showTicks: true }),
        React.createElement(RangeBar, { value: 0.5, showTicks: true }),
        React.createElement(RangeBar, { value: 0.75, showTicks: true }),
        React.createElement(RangeBar, { value: 1, showTicks: true }),
        React.createElement(RangeBar, { value: 0.5, showTicks: false }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Drsnik',
  component: RangeBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6895') },
    platformCode: {
      component: 'range-bar',
    },
  },
  tags: ['autodocs'],
  args: {
    value: 0.5,
    showTicks: true,
  },
  argTypes: {
    value: {
      name: 'Vrednost',
      description: 'Vrednost drsnika (0–1).',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    showTicks: {
      name: 'Oznake',
      description: 'Prikaže oznake (ticks).',
      control: { type: 'boolean' },
    },
    tickCount: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = {
  name: 'Privzeto',
};

export const WithoutTicks = {
  name: 'Brez oznak',
  args: { showTicks: false },
};
