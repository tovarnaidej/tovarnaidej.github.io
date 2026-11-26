import React from 'react';

import { Accordion } from './Accordion';
import {
  MobileShowcase,
  ShowcaseGrid,
  ShowcaseSurface,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['defaultStyle', 'outlined', 'filled'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Harmonika' },
    React.createElement(
      ShowcaseSurface,
      null,
      React.createElement(
        ShowcaseGrid,
        { columns: 3, gap: 24 },
        ...styles.map((style) =>
          React.createElement(
            ShowcaseStack,
            { key: style, gap: 16 },
            React.createElement(Accordion, {
              style,
              title: 'Accordion Title',
              initiallyExpanded: false,
            }),
            React.createElement(Accordion, {
              style,
              title: 'Accordion Title',
              initiallyExpanded: true,
            }),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Harmonika',
  component: Accordion,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:3977') },
    platformCode: {
      component: 'accordion',
    },
  },
  tags: ['autodocs'],
  args: {
    style: 'defaultStyle',
    title: 'Accordion Title',
    initiallyExpanded: false,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          defaultStyle: 'Privzeto',
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
      },
      options: styles,
    },
    title: {
      name: 'Naslov',
    },
    initiallyExpanded: { table: { disable: true } },
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
  // The catalog pins the preview to the top of its pane (padding 24 / 16), so opening grows
  // downward, and keys it by Slog: another style is a new, closed accordion.
  parameters: { layout: 'fullscreen' },
  render: (args) =>
    React.createElement(
      'div',
      { style: { display: 'flex', justifyContent: 'center', padding: '24px 16px' } },
      React.createElement(Accordion, { ...args, key: args.style }),
    ),
};
