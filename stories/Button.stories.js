import React from 'react';
import { fn } from 'storybook/test';

import { Button } from './Button';

const variants = ['filled', 'outline', 'text', 'elevated'];
const states = ['enabled', 'pressed', 'disabled'];

const renderVariants = () => React.createElement(
  'div',
  { className: 'button-showcase' },
  ...variants.flatMap((variant) => [false, true].flatMap((leadingIcon) =>
    states.map((state) => React.createElement(Button, {
      key: `${variant}-${state}-${leadingIcon ? 'icon' : 'plain'}`,
      variant,
      state,
      leadingIcon,
    }))
  ))
);

export default {
  title: 'Gradniki/Gumb',
  component: Button,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=2304-1776',
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Example Button',
    variant: 'filled',
    state: 'enabled',
    leadingIcon: false,
    onClick: fn(),
  },
  argTypes: {
    label: {
      name: 'Besedilo',
      description: 'Besedilo, prikazano na gumbu.',
    },
    variant: {
      name: 'Različica',
      description: 'Vizualna različica gumba.',
      control: {
        type: 'select',
        labels: {
          filled: 'Polni',
          elevated: 'Privzdignjeni',
          outline: 'Obroba',
          text: 'Besedilni',
        },
      },
      options: variants,
    },
    state: {
      name: 'Stanje',
      description: 'Trenutno stanje gumba.',
      control: {
        type: 'select',
        labels: {
          enabled: 'Omogočen',
          pressed: 'Pritisnjen',
          disabled: 'Onemogočen',
        },
      },
      options: states,
    },
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
};

export const Filled = {
  name: 'Polni',
};

export const Elevated = {
  name: 'Privzdignjeni',
  args: { variant: 'elevated' },
};

export const Outline = {
  name: 'Obroba',
  args: { variant: 'outline' },
};

export const Text = {
  name: 'Besedilni',
  args: { variant: 'text' },
};

export const WithLeadingIcon = {
  name: 'Z vodilno ikono',
  args: { leadingIcon: true },
};

export const Disabled = {
  name: 'Onemogočen',
  args: { state: 'disabled' },
};
