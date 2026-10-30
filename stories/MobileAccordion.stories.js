import { Accordion } from './Accordion';

const styles = ['defaultStyle', 'outlined', 'filled'];

export default {
  title: 'Gradniki - mobile/Harmonika',
  component: Accordion,
  parameters: {
    layout: 'centered',
    platformCode: {
      component: 'accordion',
    },
  },
  tags: ['autodocs'],
  args: {
    style: 'defaultStyle',
    title: 'Accordion Title',
    initiallyExpanded: false,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          defaultStyle: 'Privzeto',
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
      },
      options: styles,
    },
    title: {
      name: 'Naslov',
    },
    initiallyExpanded: {
      name: 'Razširjeno',
      control: { type: 'boolean' },
    },
    className: { table: { disable: true } },
  },
};

export const Default = {
  name: 'Privzeto',
};

export const Outlined = {
  name: 'Obrobljeno',
  args: { style: 'outlined', initiallyExpanded: true },
};

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled', initiallyExpanded: true },
};
