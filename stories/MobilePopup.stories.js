import React from 'react';

import { Popup } from './Popup';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['outlined', 'filled', 'elevated'];

const sampleMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Popup' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseRow,
        { gap: 24 },
        ...styles.map((style) =>
          React.createElement(Popup, {
            key: style,
            style,
            showAction: true,
            heading: 'Sample Heading',
            message: sampleMessage,
          }),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Pojavno okno',
  component: Popup,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4428') },
    platformCode: { component: 'popup' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outlined',
    showAction: true,
    heading: 'Sample Heading',
    message: sampleMessage,
    actionLabel: 'Example Button',
  },
  argTypes: {
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
    showAction: { name: 'Gumb dejanja', control: { type: 'boolean' } },
    heading: { name: 'Naslov' },
    message: { name: 'Sporočilo' },
    actionLabel: {
      name: 'Oznaka gumba',
      if: { arg: 'showAction', eq: true },
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

export const Elevated = {
  name: 'S senco',
  args: { style: 'elevated' },
};
