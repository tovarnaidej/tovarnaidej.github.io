import { fn } from 'storybook/test';

import { Header } from './Header';

export default {
  title: 'Primeri/Glava',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['!dev', '!autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    onLogin: fn(),
    onLogout: fn(),
    onCreateAccount: fn(),
  },
};

export const LoggedIn = {
  name: 'Prijavljen uporabnik',
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
};

export const LoggedOut = {
  name: 'Odjavljen uporabnik',
};
