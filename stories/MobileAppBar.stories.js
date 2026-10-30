import { AppBar } from './AppBar';

export default {
  title: 'Gradniki - mobile/Navigacija - zgornji meni',
  component: AppBar,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'app-bar' },
  },
  tags: ['autodocs'],
  args: {
    configuration: 'small',
    style: 'light',
    leading: 'defaultBack',
    actions: 'single',
    title: 'Page Title',
  },
  argTypes: {
    configuration: {
      name: 'Konfiguracija',
      control: {
        type: 'select',
        labels: { small: 'Majhna', medium: 'Srednja', large: 'Velika' },
      },
      options: ['small', 'medium', 'large'],
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { light: 'Svetla', primary: 'Primarna' },
      },
      options: ['light', 'primary'],
    },
    leading: {
      name: 'Vodilno',
      control: {
        type: 'select',
        labels: {
          defaultBack: 'Privzeti nazaj',
          none: 'Brez',
          custom: 'Po meri',
        },
      },
      options: ['defaultBack', 'none', 'custom'],
    },
    actions: {
      name: 'Dejanja',
      control: {
        type: 'select',
        labels: { single: 'Eno', multiple: 'Več', none: 'Brez' },
      },
      options: ['single', 'multiple', 'none'],
    },
    title: { name: 'Naslov' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const PrimaryLarge = {
  name: 'Primarna velika',
  args: { style: 'primary', configuration: 'large' },
};
