import React from 'react';
import { fn } from 'storybook/test';

import { Button } from './Button';

const variants = ['filled', 'outline', 'text', 'elevated'];
const sizes = ['regular', 'small'];
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
    })),
  )),
);

export default {
  title: 'Gradniki - mobile/Gumb',
  component: Button,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=2304-1776',
    },
    platformCode: {
      component: 'button',
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Example Button',
    variant: 'filled',
    size: 'regular',
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
      name: 'Slog',
      description: 'Vizualni slog SIButton.',
      control: {
        type: 'select',
        labels: {
          filled: 'Polni',
          elevated: 'Senca',
          outline: 'Obroba',
          text: 'Besedilni',
        },
      },
      options: variants,
    },
    size: {
      name: 'Velikost',
      description: 'Običajna (48px) ali majhna in-card (40px).',
      control: {
        type: 'select',
        labels: {
          regular: 'Običajna',
          small: 'Majhna',
        },
      },
      options: sizes,
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

export const Filled = {
  name: 'Polni',
};

export const Elevated = {
  name: 'Senca',
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
