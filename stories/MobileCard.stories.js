import { Card } from './Card';

const styles = ['outlined', 'filled', 'elevated'];
const layouts = ['standard', 'compact'];

export default {
  title: 'Gradniki - mobile/Kartica',
  component: Card,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'card' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outlined',
    layout: 'standard',
    showHeader: true,
    showMedia: true,
    showContent: true,
    showActions: true,
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
    layout: {
      name: 'Postavitev',
      control: {
        type: 'select',
        labels: {
          standard: 'Standardna',
          compact: 'Kompaktna',
        },
      },
      options: layouts,
    },
    showHeader: { name: 'Glava', control: { type: 'boolean' } },
    showMedia: { name: 'Mediji', control: { type: 'boolean' } },
    showContent: {
      name: 'Vsebina',
      control: { type: 'boolean' },
      if: { arg: 'layout', eq: 'standard' },
    },
    showActions: {
      name: 'Dejanja',
      control: { type: 'boolean' },
      if: { arg: 'layout', eq: 'standard' },
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Compact = {
  name: 'Kompaktna',
  args: { layout: 'compact' },
};

export const Elevated = {
  name: 'S senco',
  args: { style: 'elevated' },
};
