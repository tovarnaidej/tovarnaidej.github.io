import React from 'react';

import { fn } from 'storybook/test';

import { Button } from './Button';

const renderVariants = () => {
  const row = (items) =>
    React.createElement(
      'div',
      { className: 'button-showcase__row' },
      ...items.map((item) =>
        React.createElement(Button, {
          key: `${item.variant}-${item.label}-${item.leadingIcon ? 'icon' : 'plain'}`,
          label: item.label,
          variant: item.variant,
          leadingIcon: item.leadingIcon,
        })
      )
    );

  return React.createElement(
    'div',
    { className: 'button-showcase' },
    row([
      { label: 'Example Button', variant: 'solid', leadingIcon: false },
      { label: 'Example Button', variant: 'solid', leadingIcon: false },
      { label: 'Example Button', variant: 'solid', leadingIcon: false },
      { label: 'Example Button', variant: 'solid', leadingIcon: true },
      { label: 'Example Button', variant: 'solid', leadingIcon: true },
      { label: 'Example Button', variant: 'solid', leadingIcon: true },
    ]),
    row([
      { label: 'Example Button', variant: 'outline', leadingIcon: false },
      { label: 'Example Button', variant: 'outline', leadingIcon: false },
      { label: 'Example Button', variant: 'outline', leadingIcon: false },
      { label: 'Example Button', variant: 'outline', leadingIcon: true },
      { label: 'Example Button', variant: 'outline', leadingIcon: true },
      { label: 'Example Button', variant: 'outline', leadingIcon: true },
    ]),
    row([
      { label: 'Example Button', variant: 'text', leadingIcon: false },
      { label: 'Example Button', variant: 'text', leadingIcon: false },
      { label: 'Example Button', variant: 'text', leadingIcon: false },
      { label: 'Example Button', variant: 'text', leadingIcon: true },
      { label: 'Example Button', variant: 'text', leadingIcon: true },
      { label: 'Example Button', variant: 'text', leadingIcon: true },
    ]),
    row([
      { label: 'Example Button', variant: 'ghost', leadingIcon: false },
      { label: 'Example Button', variant: 'ghost', leadingIcon: false },
      { label: 'Example Button', variant: 'ghost', leadingIcon: false },
      { label: 'Example Button', variant: 'ghost', leadingIcon: true },
      { label: 'Example Button', variant: 'ghost', leadingIcon: true },
      { label: 'Example Button', variant: 'ghost', leadingIcon: true },
    ]),
    React.createElement(
      'div',
      { className: 'button-showcase__caption' },
      React.createElement('span', { className: 'button-showcase__variant-badge' }, '24 Variants')
    )
  );
};

export default {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const Variants = {
  render: renderVariants,
};

export const Solid = {
  args: {
    label: 'Example Button',
    variant: 'solid',
  },
};

export const Outline = {
  args: {
    label: 'Example Button',
    variant: 'outline',
  },
};

export const Text = {
  args: {
    label: 'Example Button',
    variant: 'text',
  },
};

export const WithIcon = {
  args: {
    label: 'Example Button',
    variant: 'solid',
    leadingIcon: true,
  },
};
