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
  title: 'Design System/Button',
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
    variant: {
      control: 'select',
      options: variants,
    },
    state: {
      control: 'select',
      options: states,
    },
  },
};

export const Variants = {
  render: renderVariants,
};

export const Filled = {};

export const Elevated = {
  args: { variant: 'elevated' },
};

export const Outline = {
  args: { variant: 'outline' },
};

export const Text = {
  args: { variant: 'text' },
};

export const WithLeadingIcon = {
  args: { leadingIcon: true },
};

export const Disabled = {
  args: { state: 'disabled' },
};
