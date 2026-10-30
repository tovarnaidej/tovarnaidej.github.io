import { Switch } from './Switch';

export default {
  title: 'Gradniki - mobile/Stikalo',
  component: Switch,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'switch' },
  },
  tags: ['autodocs'],
  args: {
    value: false,
    enabled: true,
    showLabel: true,
    label: 'Switch label',
  },
  argTypes: {
    value: { name: 'Vrednost', control: { type: 'boolean' } },
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    label: { name: 'Oznaka', if: { arg: 'showLabel', eq: true } },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const On = {
  name: 'Vklopljeno',
  args: { value: true },
};
