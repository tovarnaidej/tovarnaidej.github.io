import { CalendarInput } from './CalendarInput';

export default {
  title: 'Gradniki - mobile/Vnos datuma',
  component: CalendarInput,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'calendar-input' },
  },
  tags: ['autodocs'],
  args: {
    mode: 'single',
  },
  argTypes: {
    mode: {
      name: 'Način',
      control: {
        type: 'select',
        labels: { single: 'Enojni', range: 'Območje' },
      },
      options: ['single', 'range'],
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Range = {
  name: 'Območje',
  args: { mode: 'range' },
};
