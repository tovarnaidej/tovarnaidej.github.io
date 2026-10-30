import { Divider } from './Divider';

const types = ['fullWidth', 'inset'];

export default {
  title: 'Gradniki - mobile/Ločilo',
  component: Divider,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'divider' },
  },
  tags: ['autodocs'],
  args: {
    type: 'fullWidth',
    showLabel: false,
    label: 'Subheader',
  },
  argTypes: {
    type: {
      name: 'Vrsta',
      control: {
        type: 'select',
        labels: {
          fullWidth: 'Celotna širina',
          inset: 'Vdelan',
        },
      },
      options: types,
    },
    showLabel: { name: 'Prikaži oznako', control: { type: 'boolean' } },
    label: {
      name: 'Oznaka',
      if: { arg: 'showLabel', eq: true },
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const InsetLabeled = {
  name: 'Vdelan z oznako',
  args: { type: 'inset', showLabel: true },
};
