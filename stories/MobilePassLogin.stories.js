import React from 'react';

import { PassLogin } from './PassLogin';
import {
  MobileShowcase,
  ShowcasePanel,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'SI-PASS Login' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(PassLogin),
    ),
  );

export default {
  title: 'Gradniki - mobile/Prijava SI-PASS',
  component: PassLogin,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:7308') },
    platformCode: { component: 'pass-login' },
  },
  tags: ['autodocs'],
  argTypes: {
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
