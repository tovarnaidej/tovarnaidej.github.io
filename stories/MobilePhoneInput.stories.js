import { PhoneInput } from './PhoneInput';

export default {
  title: 'Gradniki - mobile/Telefonska številka',
  component: PhoneInput,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'phone-input' },
  },
  tags: ['autodocs'],
  args: {
    enabled: true,
    hasError: false,
    countryCode: '+386',
  },
  argTypes: {
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    countryCode: { name: 'Koda države' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};
