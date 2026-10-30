import { TabBar } from './TabBar';

export default {
  title: 'Gradniki - mobile/Vrstica zavihkov',
  component: TabBar,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'tab-bar' },
  },
  tags: ['autodocs'],
  args: {
    tabCount: 3,
  },
  argTypes: {
    tabCount: {
      name: 'Zavihki',
      control: {
        type: 'select',
        labels: { 2: 'Dve', 3: 'Tri', 4: 'Štiri', 5: 'Pet' },
      },
      options: [2, 3, 4, 5],
    },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const FiveTabs = {
  name: 'Pet zavihkov',
  args: { tabCount: 5 },
};
