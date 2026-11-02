import React from 'react';

import { ProgressBar } from './ProgressBar';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Progress bars' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 32 },
        React.createElement(ProgressBar, {
          variant: 'segmented',
          currentStep: 2,
          totalSteps: 6,
        }),
        React.createElement(ProgressBar, {
          variant: 'stepped',
          currentStep: 3,
          totalSteps: 6,
        }),
        React.createElement(ProgressBar, {
          variant: 'linear',
          value: 0.55,
        }),
        React.createElement(ProgressBar, {
          variant: 'linear',
          value: 0.2,
        }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vrstica napredka',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6870') },
    platformCode: { component: 'progress-bar' },
  },
  tags: ['autodocs'],
  args: {
    variant: 'segmented',
    value: 0.5,
    currentStep: 2,
    totalSteps: 6,
  },
  argTypes: {
    variant: {
      name: 'Različica',
      control: {
        type: 'select',
        labels: {
          segmented: 'Segmentiran',
          linear: 'Linearni',
          stepped: 'Korakni',
        },
      },
      options: ['segmented', 'linear', 'stepped'],
    },
    value: {
      name: 'Vrednost',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      if: { arg: 'variant', eq: 'linear' },
    },
    currentStep: {
      name: 'Trenutni korak',
      control: { type: 'number', min: 1, max: 8 },
      if: { arg: 'variant', neq: 'linear' },
    },
    totalSteps: {
      name: 'Število korakov',
      control: { type: 'number', min: 2, max: 8 },
      if: { arg: 'variant', neq: 'linear' },
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

export const Linear = {
  name: 'Linearni',
  args: { variant: 'linear', value: 0.65 },
};
