import React from 'react';

import { Accordion } from './Accordion';
import {
  MobileShowcase,
  ShowcaseGrid,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['defaultStyle', 'outlined', 'filled'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Accordion' },
    React.createElement(
      ShowcasePanel,
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
    initiallyExpanded: {
      name: 'Razširjeno',
      control: { type: 'boolean' },
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

export const Outlined = {
  name: 'Obrobljeno',
  args: { style: 'outlined', initiallyExpanded: true },
};

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled', initiallyExpanded: true },
};
