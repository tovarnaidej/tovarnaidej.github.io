import React from 'react';

import { Avatar } from './Avatar';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const types = ['photo', 'filled', 'outlined'];
const sizes = [45, 60, 100];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Avatar' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseRow,
        { gap: 32 },
        ...types.map((type) =>
          React.createElement(
            ShowcaseStack,
            { key: type, gap: 32 },
            ...sizes.map((size) =>
              React.createElement(Avatar, {
                key: `${type}-${size}`,
                type,
                size,
                initials: 'SJ',
              }),
            ),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4293') },
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

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
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
