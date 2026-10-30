import { Tabs } from './Tabs';

export default {
  title: 'Gradniki - mobile/Zavihki',
  component: Tabs,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'tabs' },
  },
  tags: ['autodocs'],
  args: {
    style: 'underline',
    configuration: 'fixed',
    tabCount: 3,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { underline: 'Podčrtano', filled: 'Zapolnjeno' },
      },
      options: ['underline', 'filled'],
    },
    configuration: {
      name: 'Konfiguracija',
      control: {
        type: 'select',
        labels: { fixed: 'Fiksno', scrollable: 'Pomakljivo' },
      },
      options: ['fixed', 'scrollable'],
    },
    tabCount: {
      name: 'Zavihki',
      control: {
        type: 'select',
        labels: { 3: 'Tri', 4: 'Štiri', 5: 'Pet', 8: 'Osem' },
      },
      options: [3, 4, 5, 8],
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const FilledScrollable = {
  name: 'Zapolnjeno pomakljivo',
  args: { style: 'filled', configuration: 'scrollable', tabCount: 8 },
};
