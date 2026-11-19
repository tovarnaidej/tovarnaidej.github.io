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

/* Fixed sample for the overview (the catalog preview itself uses DateTime.now()). */
const sample = { initialDate: '2026-01-17', today: '2026-01-05' };
/* design_data/Koledar iOS.png: June 2022, today 10, selected 16. */
const iosSample = { initialDate: '2022-06-16', today: '2022-06-10' };

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Koledar' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 40 },
        React.createElement(
          ShowcaseSection,
          { title: 'Android (SIDatePicker)' },
          React.createElement(
            ShowcaseStack,
            { gap: 24 },
            ...styles.map((style) =>
              React.createElement(
                ShowcaseRow,
                { key: style, gap: 24, className: 'mobile-showcase__row--top' },
                React.createElement(Calendar, { style, ...sample }),
                React.createElement(Calendar, { style, ...sample, initialView: 'years' }),
              ),
            ),
          ),
        ),
        React.createElement(
          ShowcaseSection,
          { title: 'iOS (SIDatePickerIOS)' },
          React.createElement(
            ShowcaseRow,
            { gap: 24, className: 'mobile-showcase__row--top' },
            ...styles.map((style) => React.createElement(CalendarIOS, { key: style, style, ...iosSample })),
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
    React.createElement(platform === 'ios' ? CalendarIOS : Calendar, {
      key: `${platform}-${args.style}-${args.initialDate}-${args.today}-${args.initialView}`,
      ...args,
    }),
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
    initialDate: { control: 'text', type: { name: 'string' }, table: { disable: true } },
    today: { control: 'text', type: { name: 'string' }, table: { disable: true } },
    initialView: { control: 'text', type: { name: 'string' }, table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };
