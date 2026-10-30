import React from 'react';

import { Avatar } from './Avatar';

const types = ['photo', 'filled', 'outlined'];
const sizes = [45, 60, 100];

export default {
  title: 'Gradniki - mobile/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    platformCode: {
      component: 'avatar',
    },
  },
  tags: ['autodocs'],
  args: {
    type: 'filled',
    size: 45,
    initials: 'SJ',
  },
  argTypes: {
    type: {
      name: 'Vrsta',
      description: 'Vrsta SIAvatar.',
      control: {
        type: 'select',
        labels: {
          photo: 'Fotografija',
          filled: 'Zapolnjeno',
          outlined: 'Obrobljeno',
        },
      },
      options: types,
    },
    size: {
      name: 'Velikost',
      description: 'Velikost avatarja v dp.',
      control: {
        type: 'select',
        labels: {
          45: 'S45',
          60: 'S60',
          100: 'S100',
        },
      },
      options: sizes,
    },
    initials: {
      name: 'Inicialke',
      description: 'Inicialke (filled / outlined).',
    },
    className: {
      table: { disable: true },
    },
  },
};

export const Default = {
  name: 'Privzeto',
};

export const Photo = {
  name: 'Fotografija',
  args: { type: 'photo' },
};

export const Outlined = {
  name: 'Obrobljeno',
  args: { type: 'outlined' },
};

export const Large = {
  name: 'S100',
  args: { size: 100 },
};
