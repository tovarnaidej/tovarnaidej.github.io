import React from 'react';
import { useArgs, useEffect, useRef } from 'storybook/preview-api';

import { StatusScreen, STATUS_SCENARIOS } from './StatusScreen';
import { Button } from './Button';
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

// status_screen_configurator.dart _applyScenarioDefaults: the five texts of a scenario.
function scenarioTexts(scenario) {
  const c = STATUS_SCENARIOS[scenario];
  return {
    title: c.title,
    description: c.description,
    meta: c.meta || '',
    primaryLabel: c.primary,
    secondaryLabel: c.secondary || '',
  };
}

/* The catalog's popup preview: an "Odpri pojavno okno" button on its #F5F5F5 pane; the dialog
   (barrier #000000CC, 16 / 24 from the screen edges) closes on the close button, both buttons
   and a tap on the barrier. */
const PopupPreview = ({ args }) => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  return React.createElement(
    'div',
    { className: 'catalog-status-pane' },
    React.createElement(Button, {
      variant: 'outline',
      label: 'Odpri pojavno okno',
      className: 'catalog-status-open',
      onClick: () => setOpen(true),
    }),
    open
      ? React.createElement(
          'div',
          { className: 'catalog-dialog', onClick: (e) => { if (e.target === e.currentTarget) close(); } },
          React.createElement(StatusScreen, { ...args, onPrimary: close, onSecondary: close, onClose: close }),
        )
      : null,
  );
};

export default {
  title: 'Gradniki - mobile/Gradnik za prisilno posodobitev aplikacije',
  component: StatusScreen,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:7328') },
    platformCode: { component: 'status-screen' },
  },
  tags: ['autodocs'],
  // The catalog's fields start at the scenario's copy (and Scenarij puts them back).
  args: {
    presentation: 'fullScreen',
    scenario: 'update',
    ...scenarioTexts('update'),
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
    onPrimary: { table: { disable: true } },
    onSecondary: { table: { disable: true } },
    onClose: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = {
  name: 'Privzeto',
  render: (args) => {
    const [, updateArgs] = useArgs();
    // Scenarij puts the five texts back to that scenario's copy (catalog onChanged).
    const previous = useRef(args.scenario);
    useEffect(() => {
      if (previous.current !== args.scenario) {
        previous.current = args.scenario;
        updateArgs(scenarioTexts(args.scenario));
      }
    }, [args.scenario]);
    return args.presentation === 'popup'
      ? React.createElement(PopupPreview, { args })
      : React.createElement(StatusScreen, args);
  },
};
