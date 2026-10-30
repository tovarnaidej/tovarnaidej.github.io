import { LoadingBar } from './LoadingBar';

const variants = ['linear', 'circular'];
const thicknesses = ['thin', 'thick'];

export default {
  title: 'Gradniki - mobile/Kazalnik napredka',
  component: LoadingBar,
  parameters: {
    layout: 'centered',
    platformCode: {
      component: 'loading-bar',
    },
  },
  tags: ['autodocs'],
  args: {
    variant: 'linear',
    thickness: 'thin',
    indeterminate: false,
    value: 0.5,
  },
  argTypes: {
    variant: {
      name: 'Različica',
      control: {
        type: 'select',
        labels: {
          linear: 'Linearni',
          circular: 'Krožni',
        },
      },
      options: variants,
    },
    thickness: {
      name: 'Debelina',
      control: {
        type: 'select',
        labels: {
          thin: 'Tanka',
          thick: 'Debela',
        },
      },
      options: thicknesses,
      if: { arg: 'variant', eq: 'circular' },
    },
    indeterminate: {
      name: 'Animacija',
      description: 'Nedoločen (indeterminate) način.',
      control: { type: 'boolean' },
    },
    value: {
      name: 'Vrednost',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      if: { arg: 'indeterminate', eq: false },
    },
    className: { table: { disable: true } },
  },
};

export const Default = {
  name: 'Privzeto',
};

export const Circular = {
  name: 'Krožni',
  args: { variant: 'circular', indeterminate: true },
};

export const Indeterminate = {
  name: 'Nedoločen',
  args: { indeterminate: true },
};
