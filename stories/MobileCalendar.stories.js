import React from 'react';

import { Calendar } from './Calendar';
import { CalendarIOS } from './CalendarIOS';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseSection,
  ShowcaseStack,
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
        ShowcaseStack,
        { gap: 40 },
        React.createElement(
          ShowcaseSection,
          { title: 'Android / Material (SIDatePicker)' },
          React.createElement(
            ShowcaseRow,
            { gap: 24, className: 'mobile-showcase__row--top' },
            ...styles.map((style) => React.createElement(Calendar, { key: style, style })),
          ),
        ),
        React.createElement(
          ShowcaseSection,
          { title: 'iOS (SIDatePickerIOS / SICalendar) — design_data/Koledar iOS.png' },
          React.createElement(
            ShowcaseRow,
            { gap: 24, className: 'mobile-showcase__row--top' },
            ...styles.map((style) => React.createElement(CalendarIOS, { key: style, style })),
          ),
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
  render: ({ platform, ...args }) =>
    React.createElement(platform === 'ios' ? CalendarIOS : Calendar, args),
  args: {
    style: 'outlined',
    platform: 'android',
  },
  argTypes: {
    platform: {
      name: 'Platforma',
      control: { type: 'inline-radio', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
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
