import { Calendar } from './Calendar';

const styles = ['outlined', 'filled', 'elevated'];

export default {
  title: 'Gradniki - mobile/Koledar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'calendar' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outlined',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
          elevated: 'S senco',
        },
      },
      options: styles,
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled' },
};
