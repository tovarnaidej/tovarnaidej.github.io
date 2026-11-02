import React from 'react';

import { Calendar } from './Calendar';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['outlined', 'filled', 'elevated'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Calendar' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseRow,
        { gap: 24 },
        ...styles.map((style) =>
          React.createElement(Calendar, {
            key: style,
            style,
          }),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Koledar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:3035') },
    platformCode: { component: 'calendar' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outlined',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
          elevated: 'S senco',
        },
      },
      options: styles,
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
