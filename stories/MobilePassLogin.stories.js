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
    { title: 'Prijava SI-PASS' },
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
  // The catalog has no controls for SI-PASS (a fixed card): no controls here either.
  argTypes: {
    title: { table: { disable: true } },
    description: { table: { disable: true } },
    loginLabel: { table: { disable: true } },
    readMoreLabel: { table: { disable: true } },
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
  parameters: {
    // the catalog's text in place of controls (pass_login_preview.dart)
    docs: {
      description: {
        story:
          'Fiksna kartica Prijava SI-PASS — brez dodatnih kontrol. “Preberite več” še nima definirane destinacije.',
      },
    },
  },
};
