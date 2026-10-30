import { Input } from './Input';

export default {
  title: 'Gradniki - mobile/Vnosno polje',
  component: Input,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'input' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outline',
    enabled: true,
    hasError: false,
    showIcon: false,
    obscure: false,
    label: 'Oznaka',
    placeholder: 'Nadomestno besedilo',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          underline: 'Podčrtano',
          outline: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
      },
      options: ['underline', 'outline', 'filled'],
    },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showIcon: { name: 'Ikona', control: { type: 'boolean' } },
    obscure: { name: 'Skrij', control: { type: 'boolean' } },
    label: { name: 'Oznaka' },
    placeholder: { name: 'Nadomestno besedilo' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled' },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};
