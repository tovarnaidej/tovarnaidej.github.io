import { Alert } from './Alert';

export default {
  title: 'Gradniki - mobile/Opozorila',
  component: Alert,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'alert' },
  },
  tags: ['autodocs'],
  args: {
    mode: 'alert',
    style: 'filled',
    showIcon: true,
    showDismiss: true,
    title: 'Title',
    message: 'Message',
    listStyle: 'basic',
    showSupporting: true,
    showAvatar: false,
    showChevron: true,
    listTitle: 'List Item Title',
    supportingLines: 2,
    supportingText: 'Supporting text goes here',
  },
  argTypes: {
    mode: {
      name: 'Vrsta',
      control: {
        type: 'select',
        labels: { alert: 'Opozorilo', list: 'Pojasnilo' },
      },
      options: ['alert', 'list'],
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { filled: 'Zapolnjeno', stroke: 'Obrobljeno' },
      },
      options: ['filled', 'stroke'],
      if: { arg: 'mode', eq: 'alert' },
    },
    showIcon: {
      name: 'Ikona',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'alert' },
    },
    showDismiss: {
      name: 'Zapri',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'alert' },
    },
    title: { name: 'Naslov', if: { arg: 'mode', eq: 'alert' } },
    message: { name: 'Sporočilo', if: { arg: 'mode', eq: 'alert' } },
    listStyle: {
      name: 'Slog seznama',
      control: {
        type: 'select',
        labels: {
          basic: 'Privzeto',
          filled: 'Zapolnjeno',
          outlined: 'Obrobljeno',
        },
      },
      options: ['basic', 'filled', 'outlined'],
      if: { arg: 'mode', eq: 'list' },
    },
    listTitle: { name: 'Naslov', if: { arg: 'mode', eq: 'list' } },
    showSupporting: {
      name: 'Besedilo',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'list' },
    },
    supportingText: {
      name: 'Podporno besedilo',
      if: { arg: 'mode', eq: 'list' },
    },
    supportingLines: {
      name: 'Vrstice',
      control: { type: 'select', labels: { 1: '1 vrstica', 2: '2 vrstici' } },
      options: [1, 2],
      if: { arg: 'mode', eq: 'list' },
    },
    showAvatar: {
      name: 'Avatar',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'list' },
    },
    showChevron: {
      name: 'Puščica',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'list' },
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const ListItem = {
  name: 'Pojasnilo',
  args: { mode: 'list' },
};
