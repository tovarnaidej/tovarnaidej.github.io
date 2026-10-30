import { Radio } from './Radio';

export default {
  title: 'Gradniki - mobile/Izbira - izbirni gumb',
  component: Radio,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'radio' },
  },
  tags: ['autodocs'],
  args: {
    enabled: true,
    hasError: false,
    showLabels: true,
    label1: 'Option 1',
    label2: 'Option 2',
    label3: 'Option 3',
  },
  argTypes: {
    enabled: { name: 'Omogočeno', control: { type: 'boolean' } },
    hasError: { name: 'Napaka', control: { type: 'boolean' } },
    showLabels: { name: 'Prikaži oznake', control: { type: 'boolean' } },
    label1: { name: 'Oznaka 1' },
    label2: { name: 'Oznaka 2' },
    label3: { name: 'Oznaka 3' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const Error = {
  name: 'Napaka',
  args: { hasError: true },
};

export const Disabled = {
  name: 'Onemogočeno',
  args: { enabled: false },
};
