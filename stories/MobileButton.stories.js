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
  args: {
    enabled: true,
    label: 'Example Button',
    variant: 'filled',
    size: 'regular',
    state: 'enabled',
    leadingIcon: false,
    onClick: fn(),
  },
  argTypes: {
    label: {
      name: 'Oznaka',
      description: 'Besedilo, prikazano na gumbu.',
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
      name: 'Vodilna ikona',
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
    className: {
      name: 'Razred CSS',
      description: 'Dodaten razred CSS.',
    },
    onClick: {
      name: 'Ob kliku',
      description: 'Dogodek, ki se sproži ob kliku.',
    },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: {
    controls: { disable: true },
  },
};

export const Default = { name: 'Privzeto' };
