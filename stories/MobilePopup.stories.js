import { Popup } from './Popup';

export default {
  title: 'Gradniki - mobile/Pojavno okno',
  component: Popup,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'popup' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outlined',
    showAction: true,
    heading: 'Sample Heading',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
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
      options: ['outlined', 'filled', 'elevated'],
    },
    showAction: { name: 'Gumb dejanja', control: { type: 'boolean' } },
    heading: { name: 'Naslov' },
    message: { name: 'Sporočilo' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Elevated = {
  name: 'S senco',
  args: { style: 'elevated' },
};
