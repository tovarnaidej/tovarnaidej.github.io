import React from 'react';

import { AppBar } from './AppBar';
import {
  MobileShowcase,
  ShowcaseGrid,
  ShowcaseSection,
  figmaMobileUrl,
} from './mobile-showcase';

// design_data/Navigacija - zgornji meni.png: small + profile (title centred),
// small + 3 actions (title start), medium, large.
const configs = [
  { configuration: 'small', style: 'light', title: 'Title', actions: 'single' },
  { configuration: 'small', style: 'primary', title: 'Title', actions: 'single' },
  { configuration: 'small', style: 'light', title: 'Title' },
  { configuration: 'small', style: 'primary', title: 'Title' },
  { configuration: 'medium', style: 'light', title: 'Title' },
  { configuration: 'medium', style: 'primary', title: 'Title' },
  { configuration: 'large', style: 'light', title: 'Title' },
  { configuration: 'large', style: 'primary', title: 'Title' },
];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Navigacija - zgornji meni' },
    React.createElement(
      ShowcaseSection,
      null,
      React.createElement(
        ShowcaseGrid,
        { columns: 2, gap: '40px 41px' },
        ...configs.map((cfg) =>
          React.createElement(AppBar, {
            key: `${cfg.configuration}-${cfg.style}-${cfg.actions || 'multiple'}`,
            leading: 'defaultBack',
            actions: 'multiple',
            ...cfg,
          }),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Navigacija - zgornji meni',
  component: AppBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4056') },
    platformCode: { component: 'app-bar' },
  },
  tags: ['autodocs'],
  args: {
    configuration: 'small',
    style: 'light',
    leading: 'defaultBack',
    actions: 'single',
    title: 'Title',
  },
  argTypes: {
    configuration: {
      name: 'Velikost',
      control: {
        type: 'select',
        labels: { small: 'Ozka', medium: 'Srednja', large: 'Široka' },
      },
      options: ['small', 'medium', 'large'],
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { light: 'Svetla', primary: 'Temna' },
      },
      options: ['light', 'primary'],
    },
    leading: {
      name: 'Primarna ikona',
      control: {
        type: 'select',
        labels: {
          defaultBack: 'Nazaj',
          none: 'Brez',
          custom: 'Po meri',
        },
      },
      options: ['defaultBack', 'none', 'custom'],
    },
    actions: {
      name: 'Dodatne ikone',
      control: {
        type: 'select',
        labels: { single: 'Ena', multiple: 'Več', none: 'Brez' },
      },
      options: ['single', 'multiple', 'none'],
    },
    title: { name: 'Naslov' },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };

export const PrimaryLarge = {
  name: 'Primarna velika',
  args: { style: 'primary', configuration: 'large' },
};
