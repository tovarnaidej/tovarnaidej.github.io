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
  { configuration: 'small', style: 'light', title: 'Page Title', actions: 'single' },
  { configuration: 'small', style: 'primary', title: 'Page Title', actions: 'single' },
  { configuration: 'small', style: 'light', title: 'Page Title' },
  { configuration: 'small', style: 'primary', title: 'Page Title' },
  { configuration: 'medium', style: 'light', title: 'Page Title' },
  { configuration: 'medium', style: 'primary', title: 'Page Title' },
  { configuration: 'large', style: 'light', title: 'Page Title' },
  { configuration: 'large', style: 'primary', title: 'Page Title' },
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
    title: 'Page Title',
  },
  argTypes: {
    configuration: {
      name: 'Konfiguracija',
      control: {
        type: 'select',
        labels: { small: 'Majhna', medium: 'Srednja', large: 'Velika' },
      },
      options: ['small', 'medium', 'large'],
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { light: 'Svetla', primary: 'Primarna' },
      },
      options: ['light', 'primary'],
    },
    leading: {
      name: 'Vodilno',
      control: {
        type: 'select',
        labels: {
          defaultBack: 'Privzeti nazaj',
          none: 'Brez',
          custom: 'Po meri',
        },
      },
      options: ['defaultBack', 'none', 'custom'],
    },
    actions: {
      name: 'Dejanja',
      control: {
        type: 'select',
        labels: { single: 'Eno', multiple: 'Več', none: 'Brez' },
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
