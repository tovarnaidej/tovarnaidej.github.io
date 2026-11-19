import React from 'react';

import { CalendarInput } from './CalendarInput';
import {
  MobileShowcase,
  ShowcaseSurface,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Vnosno polje za datum' },
    React.createElement(
      ShowcaseSurface,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        React.createElement(CalendarInput, { mode: 'single', focused: true }),
        React.createElement(CalendarInput, { mode: 'range', focused: true }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vnosno polje za datum',
  component: CalendarInput,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6657') },
    platformCode: { component: 'calendar-input' },
  },
  tags: ['autodocs'],
  args: {
    mode: 'single',
  },
  argTypes: {
    mode: {
      name: 'Način',
      control: {
        type: 'select',
        labels: { single: 'En datum', range: 'Datumsko obdobje' },
      },
      options: ['single', 'range'],
    },
    focused: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };
