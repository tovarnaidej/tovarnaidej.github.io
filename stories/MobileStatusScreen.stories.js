import React from 'react';

import { StatusScreen } from './StatusScreen';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseSection,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Gradnik za prisilno posodobitev aplikacije' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseSection,
        { title: 'Celozaslonsko' },
        React.createElement(
          ShowcaseRow,
          { gap: 24 },
          React.createElement(StatusScreen, {
            presentation: 'fullScreen',
            scenario: 'update',
          }),
          React.createElement(StatusScreen, {
            presentation: 'fullScreen',
            scenario: 'offline',
          }),
          React.createElement(StatusScreen, {
            presentation: 'fullScreen',
            scenario: 'unsupported',
          }),
        ),
      ),
      React.createElement(
        ShowcaseSection,
        { title: 'Pojavno okno' },
        React.createElement(
          ShowcaseRow,
          { gap: 24 },
          React.createElement(StatusScreen, {
            presentation: 'popup',
            scenario: 'update',
          }),
          React.createElement(StatusScreen, {
            presentation: 'popup',
            scenario: 'offline',
          }),
          React.createElement(StatusScreen, {
            presentation: 'popup',
            scenario: 'unsupported',
          }),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Gradnik za prisilno posodobitev aplikacije',
  component: StatusScreen,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:7328') },
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
    showClose: true,
    // Catalog: the app bar replaces the Figma top inset.
    fullScreenTopInset: 0,
  },
  argTypes: {
    fullScreenTopInset: { table: { disable: true } },
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
          update: 'Posodobitev aplikacije',
          offline: 'Ni interneta',
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
    showClose: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };
