import { RangeBar } from './RangeBar';

export default {
  title: 'Gradniki - mobile/Drsnik',
  component: RangeBar,
  parameters: {
    layout: 'centered',
    platformCode: {
      component: 'range-bar',
    },
  },
  tags: ['autodocs'],
  args: {
    value: 0.5,
    showTicks: true,
  },
  argTypes: {
    value: {
      name: 'Vrednost',
      description: 'Vrednost drsnika (0–1).',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
    showTicks: {
      name: 'Oznake',
      description: 'Prikaže oznake (ticks).',
      control: { type: 'boolean' },
    },
    tickCount: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Default = {
  name: 'Privzeto',
};

export const WithoutTicks = {
  name: 'Brez oznak',
  args: { showTicks: false },
};
