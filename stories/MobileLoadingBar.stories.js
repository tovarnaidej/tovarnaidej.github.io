import React from 'react';

import { LoadingBar } from './LoadingBar';
import {
  MobileShowcase,
  ShowcaseGrid,
  ShowcaseSection,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const variants = ['linear', 'circular'];
const thicknesses = ['thin', 'thick'];
const progresses = [0, 0.1, 0.3, 0.5, 0.8, 1];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Loading bar' },
    React.createElement(
      ShowcaseSection,
      { title: 'Linear' },
      React.createElement(
        ShowcaseStack,
        { gap: 24 },
        ...progresses.map((value) =>
          React.createElement(LoadingBar, {
            key: `linear-${value}`,
            variant: 'linear',
            value,
            indeterminate: false,
          }),
        ),
        React.createElement(LoadingBar, {
          variant: 'linear',
          indeterminate: true,
        }),
      ),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Circular' },
      React.createElement(
        ShowcaseGrid,
        { columns: 4, gap: '19px 24px' },
        ...progresses.flatMap((value) =>
          thicknesses.map((thickness) =>
            React.createElement(LoadingBar, {
              key: `${thickness}-${value}`,
              variant: 'circular',
              thickness,
              value,
              indeterminate: false,
            }),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Kazalnik napredka',
  component: LoadingBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6592') },
    platformCode: {
      component: 'loading-bar',
    },
  },
  tags: ['autodocs'],
  args: {
    variant: 'linear',
    thickness: 'thin',
    indeterminate: false,
    value: 0.5,
  },
  argTypes: {
    variant: {
      name: 'Različica',
      control: {
        type: 'select',
        labels: {
          linear: 'Linearni',
          circular: 'Krožni',
        },
      },
      options: variants,
    },
    thickness: {
      name: 'Debelina',
      control: {
        type: 'select',
        labels: {
          thin: 'Tanka',
          thick: 'Debela',
        },
      },
      options: thicknesses,
      if: { arg: 'variant', eq: 'circular' },
    },
    indeterminate: {
      name: 'Animacija',
      description: 'Nedoločen (indeterminate) način.',
      control: { type: 'boolean' },
    },
    value: {
      name: 'Vrednost',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      if: { arg: 'indeterminate', eq: false },
    },
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

export const Circular = {
  name: 'Krožni',
  args: { variant: 'circular', indeterminate: true },
};

export const Indeterminate = {
  name: 'Nedoločen',
  args: { indeterminate: true },
};
