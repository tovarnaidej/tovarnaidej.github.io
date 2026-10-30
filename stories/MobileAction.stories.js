import { Action } from './Action';

export default {
  title: 'Gradniki - mobile/Obvestila',
  component: Action,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'action' },
  },
  tags: ['autodocs'],
  args: {
    style: 'elevated',
    maxLines: 'two',
    showAction: true,
    showDismiss: true,
    message: 'This is a notification',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          elevated: 'S senco',
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
      },
      options: ['elevated', 'outlined', 'filled'],
    },
    maxLines: {
      name: 'Največje št. vrstic',
      control: {
        type: 'select',
        labels: { one: 'Ena', two: 'Dve', unlimited: 'Neomejeno' },
      },
      options: ['one', 'two', 'unlimited'],
    },
    showAction: { name: 'Akcija', control: { type: 'boolean' } },
    showDismiss: { name: 'Zapri', control: { type: 'boolean' } },
    message: { name: 'Sporočilo' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled' },
};
