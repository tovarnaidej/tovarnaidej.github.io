import React from 'react';

import { PhoneInput } from './PhoneInput';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Phone number input' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 39 },
        React.createElement(PhoneInput, {
          enabled: true,
          value: '',
          open: false,
        }),
        React.createElement(PhoneInput, {
          enabled: true,
          value: '41 321 654',
          open: false,
        }),
        React.createElement(PhoneInput, {
          enabled: true,
          value: '41 321 654',
          open: true,
        }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Telefonska številka',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6980') },
    platformCode: { component: 'phone-input' },
  },
  tags: ['autodocs'],
  args: {
    enabled: true,
    hasError: false,
    countryCode: 'si',
    value: '41 321 654',
    open: false,
  },
  argTypes: {
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    value: { name: 'Številka' },
    open: { name: 'Odprt seznam', control: { type: 'boolean' } },
    countryCode: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};
