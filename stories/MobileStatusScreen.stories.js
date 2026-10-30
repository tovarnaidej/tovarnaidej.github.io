import { StatusScreen } from './StatusScreen';

export default {
  title: 'Gradniki - mobile/Zaslon stanja',
  component: StatusScreen,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'status-screen' },
  },
  tags: ['autodocs'],
  args: {
    presentation: 'fullScreen',
    scenario: 'update',
    title: '',
    description: '',
    meta: '',
    primaryLabel: '',
    secondaryLabel: '',
  },
  argTypes: {
    presentation: {
      name: 'Prikaz',
      control: {
        type: 'select',
        labels: {
          fullScreen: 'Celozaslonsko',
          popup: 'Pojavno okno',
        },
      },
      options: ['fullScreen', 'popup'],
    },
    scenario: {
      name: 'Scenarij',
      control: {
        type: 'select',
        labels: {
          update: 'Posodobitev',
          offline: 'Brez povezave',
          unsupported: 'Nepodprto',
        },
      },
      options: ['update', 'offline', 'unsupported'],
    },
    title: { name: 'Naslov' },
    description: { name: 'Opis' },
    meta: { name: 'Meta' },
    primaryLabel: { name: 'Primarni gumb' },
    secondaryLabel: { name: 'Sekundarni gumb' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const OfflinePopup = {
  name: 'Brez povezave (popup)',
  args: { scenario: 'offline', presentation: 'popup' },
};
