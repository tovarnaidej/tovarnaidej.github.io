import React from 'react';
import { fn } from 'storybook/test';

import { Button } from './Button';
import { figmaMobileUrl } from './mobile-showcase';

const variants = ['filled', 'outline', 'text', 'elevated'];
const sizes = ['regular', 'small'];
const states = ['enabled', 'pressed', 'disabled'];

const renderVariants = () =>
  React.createElement(
    'div',
    { className: 'button-showcase' },
    ...variants.map((variant) =>
      React.createElement(
        'div',
        { className: 'button-showcase__row', key: variant },
        React.createElement(
          'div',
          { className: 'button-showcase__group' },
          ...states.map((state) =>
            React.createElement(Button, {
              key: `${variant}-${state}-plain`,
              variant,
              state,
              leadingIcon: false,
            }),
          ),
        ),
        React.createElement(
          'div',
          { className: 'button-showcase__group button-showcase__group--icons' },
          ...states.map((state) =>
            React.createElement(Button, {
              key: `${variant}-${state}-icon`,
              variant,
              state,
              leadingIcon: true,
            }),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Gumb',
  component: Button,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: figmaMobileUrl('3911:4464'),
    },
    platformCode: {
      component: 'button',
    },
  },
  tags: ['autodocs'],
  // Catalog order: Slog, Omogočeno, Ikona, Oznaka.
  args: {
    variant: 'filled',
    enabled: true,
    leadingIcon: false,
    label: 'Example Button',
    platform: 'android',
    size: 'regular',
    state: 'enabled',
    onClick: fn(),
  },
  argTypes: {
    label: {
      name: 'Oznaka',
      description: 'Besedilo, prikazano na gumbu (prazno: samo ikona).',
    },
    platform: {
      name: 'Platforma',
      control: { type: 'select', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    variant: {
      name: 'Slog',
      description: 'Vizualni slog SIButton.',
      control: {
        type: 'select',
        labels: {
          filled: 'Zapolnjeno',
          outline: 'Obrobljeno',
          text: 'Besedilo',
          elevated: 'S senco',
        },
      },
      options: variants,
    },
    size: { table: { disable: true } },
    state: { table: { disable: true } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    leadingIcon: {
      name: 'Ikona',
      description: 'Prikaže ikono pred besedilom.',
      control: {
        type: 'boolean',
        labels: {
          true: 'Da',
          false: 'Ne',
        },
      },
    },
    disabled: {
      name: 'Onemogočen',
      description: 'Onemogoči uporabo gumba.',
      table: { disable: true },
    },
    className: { table: { disable: true } },
    onClick: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: {
    controls: { disable: true },
  },
};

// The catalog centres the button in its preview pane.
export const Default = { name: 'Privzeto', parameters: { layout: 'centered' } };
