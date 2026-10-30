import { Checkbox } from './Checkbox';

export default {
  title: 'Gradniki - mobile/Potrditveno polje',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'checkbox' },
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    enabled: true,
    hasError: false,
    showLabel: true,
    label: 'Checkbox label',
  },
  argTypes: {
    checked: { name: 'Označeno', control: { type: 'boolean' } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    label: { name: 'Oznaka', if: { arg: 'showLabel', eq: true } },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Checked = {
  name: 'Označeno',
  args: { checked: true },
};

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};
