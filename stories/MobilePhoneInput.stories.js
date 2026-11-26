import React from 'react';
import { useArgs } from 'storybook/preview-api';

import { PhoneInput } from './PhoneInput';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Vnosno polje za telefonsko številko' },
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
  title: 'Gradniki - mobile/Vnosno polje za telefonsko številko',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6980') },
    platformCode: { component: 'phone-input' },
  },
  tags: ['autodocs'],
  decorators: [withMobileWidth],
  args: {
    enabled: true,
    hasError: false,
    errorText: 'Prišlo je do napake...',
    countryCode: 'SI',
    value: '',
    open: false,
  },
  argTypes: {
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    label: { table: { disable: true } },
    // the iOS catalog has it (Flutter / Android fix the text)
    errorText: { name: 'Besedilo napake', if: { arg: 'hasError' } },
    value: { table: { disable: true } },
    open: { table: { disable: true } },
    countryCode: { table: { disable: true } },
    onCountryChange: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

/* Catalog preview fills the pane (393 wide phone). */
export const Default = {
  name: 'Privzeto',
  parameters: { mobileWidth: 361 },
  // The catalog keeps the picked country and keys the field by Omogočeno, Napaka and the
  // country: a change builds a new field (picker closed, typed number gone).
  render: (args) => {
    const [, updateArgs] = useArgs();
    return React.createElement(PhoneInput, {
      ...args,
      key: `${args.enabled}${args.hasError}${args.countryCode}`,
      onCountryChange: (countryCode) => updateArgs({ countryCode }),
    });
  },
};
