import { PassLogin } from './PassLogin';

export default {
  title: 'Gradniki - mobile/Prijava SI-PASS',
  component: PassLogin,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'pass-login' },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { table: { disable: true } },
  },
};

export const Default = {
  name: 'Privzeto',
};
