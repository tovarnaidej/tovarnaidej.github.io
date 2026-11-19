import React from 'react';

import { StatusScreen } from './StatusScreen';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseSection,
  figmaMobileUrl,
} from './mobile-showcase';

/* design_data "Prisilen update Pop-up pregled": the pop-up over a 393 × 852 app screen.
   Geometry is the Figma frame (measured on the PNG): bar 361 × 56 at 16 / 20, content
   cards 361 × 88 from 96, overlay rgba(0,0,0,.42); the pop-up top is 162 (198 for the
   shortest scenario). The backdrop is sample content, not part of the library widget. */
const abs = (style) => ({ position: 'absolute', left: 16, width: 361, background: '#ffffff', ...style });

const popupOnScreen = (scenario, top) =>
  React.createElement(
    'div',
    {
      key: scenario,
      style: { position: 'relative', flex: 'none', width: 393, height: 852, overflow: 'hidden', background: '#e6e7e9' },
    },
    React.createElement(
      'div',
      { style: abs({ top: 20, height: 56, borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 16, boxSizing: 'border-box' }) },
      React.createElement('div', { style: { width: 160, height: 12, borderRadius: 6, background: '#d1d2d4' } }),
    ),
    ...[96, 200, 304, 408].map((y) =>
      React.createElement('div', { key: y, style: abs({ top: y, height: 88, borderRadius: 12 }) }),
    ),
    React.createElement('div', { style: { position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.42)' } }),
    React.createElement(
      'div',
      { style: { position: 'absolute', left: 16, top } },
      React.createElement(StatusScreen, { presentation: 'popup', scenario }),
    ),
  );

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
          { gap: 24, className: 'mobile-showcase__row--top' },
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
      React.createElement(
        ShowcaseSection,
        { title: 'Pojavno okno na zaslonu' },
        React.createElement(
          ShowcaseRow,
          { gap: 85, className: 'mobile-showcase__row--top' },
          popupOnScreen('update', 162),
          popupOnScreen('offline', 162),
          popupOnScreen('unsupported', 198),
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
