import React from 'react';
import { fn } from 'storybook/test';

import { WebButton } from './WebButton';
import { DownloadButton, LinkAction } from './WebAction';

const hierarchies = ['primary', 'secondary', 'outline', 'text'];
const sizes = ['small', 'medium', 'large'];
const states = ['default', 'hover', 'focus', 'pressed', 'disabled'];
const linkStates = ['default', 'hover', 'focus', 'pressed', 'visited', 'disabled'];

const hierarchyNames = {
  primary: 'Primarni',
  secondary: 'Sekundarni',
  outline: 'Obroba',
  text: 'Besedilni',
};

const stateNames = {
  default: 'Privzeto',
  hover: 'Lebdenje',
  focus: 'Fokus',
  pressed: 'Pritisnjen',
  visited: 'Obiskano',
  disabled: 'Onemogočen',
};

const renderVariants = () => React.createElement(
  'div',
  { className: 'web-button-showcase' },
  ...hierarchies.map((hierarchy) => React.createElement(
    'section',
    { className: 'web-button-showcase__section', key: hierarchy },
    React.createElement('h2', { className: 'web-button-showcase__title' }, hierarchyNames[hierarchy]),
    React.createElement(
      'div',
      { className: 'web-button-showcase__grid' },
      ...states.map((state) => React.createElement(
        'p',
        { className: 'web-button-showcase__label', key: `${hierarchy}-${state}-label` },
        ({
          default: 'Privzeto',
          hover: 'Lebdenje',
          focus: 'Fokus',
          pressed: 'Pritisnjen',
          disabled: 'Onemogočen',
        })[state],
      )),
      ...sizes.flatMap((size) => states.map((state) => React.createElement(
        'div',
        { className: 'web-button-showcase__cell', key: `${hierarchy}-${size}-${state}` },
        React.createElement(WebButton, { hierarchy, size, state }),
      ))),
    ),
  )),
);

const renderLinkVariants = () => React.createElement(
  'div',
  { className: 'web-action-showcase' },
  React.createElement(
    'div',
    { className: 'web-action-showcase__grid' },
    ...linkStates.map((state) => React.createElement(
      'p',
      { className: 'web-action-showcase__label', key: `${state}-label` },
      stateNames[state],
    )),
    ...linkStates.map((state) => React.createElement(
      'div',
      { className: 'web-action-showcase__cell', key: state },
      React.createElement(LinkAction, { state }),
    )),
  ),
);

const renderDownloadVariants = () => React.createElement(
  'div',
  { className: 'web-action-showcase' },
  React.createElement(
    'div',
    { className: 'web-action-showcase__grid web-action-showcase__grid--download' },
    ...states.map((state) => React.createElement(
      'p',
      { className: 'web-action-showcase__label', key: `${state}-label` },
      stateNames[state],
    )),
    ...sizes.flatMap((size) => states.map((state) => React.createElement(
      'div',
      { className: 'web-action-showcase__cell', key: `${size}-${state}` },
      React.createElement(DownloadButton, { size, state }),
    ))),
  ),
);

export default {
  title: 'Gradniki/Gumb - spletna različica',
  component: WebButton,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=3588-2562',
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Nadaljuj',
    hierarchy: 'primary',
    size: 'medium',
    state: 'default',
    leadingIcon: false,
    trailingIcon: false,
    fullWidth: false,
    onClick: fn(),
  },
  argTypes: {
    label: {
      name: 'Besedilo',
      description: 'Besedilo, prikazano na gumbu.',
    },
    hierarchy: {
      name: 'Hierarhija',
      description: 'Vizualna pomembnost spletnega dejanja.',
      control: {
        type: 'select',
        labels: {
          primary: 'Primarni',
          secondary: 'Sekundarni',
          outline: 'Obroba',
          text: 'Besedilni',
        },
      },
      options: hierarchies,
    },
    size: {
      name: 'Velikost',
      description: 'Višina in tipografska velikost gumba.',
      control: {
        type: 'select',
        labels: {
          small: 'Majhen',
          medium: 'Srednji',
          large: 'Velik',
        },
      },
      options: sizes,
    },
    state: {
      name: 'Stanje',
      description: 'Interakcijsko stanje gumba.',
      control: {
        type: 'select',
        labels: {
          default: 'Privzeto',
          hover: 'Lebdenje',
          focus: 'Fokus',
          pressed: 'Pritisnjen',
          disabled: 'Onemogočen',
        },
      },
      options: states,
    },
    leadingIcon: {
      name: 'Vodilna ikona',
      description: 'Prikaže ikono pred besedilom.',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    trailingIcon: {
      name: 'Končna ikona',
      description: 'Prikaže ikono za besedilom.',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    fullWidth: {
      name: 'Polna širina',
      description: 'Raztegne gumb na širino vsebnika.',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    className: {
      name: 'Razred CSS',
      description: 'Dodaten razred CSS.',
    },
    onClick: {
      name: 'Ob kliku',
      description: 'Dogodek, ki se sproži ob kliku.',
    },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
};

export const Primary = {
  name: 'Primarni',
};

export const Secondary = {
  name: 'Sekundarni',
  args: { hierarchy: 'secondary' },
};

export const Outline = {
  name: 'Obroba',
  args: { hierarchy: 'outline' },
};

export const Text = {
  name: 'Besedilni',
  args: { hierarchy: 'text' },
};

export const Sizes = {
  name: 'Velikosti',
  render: () => React.createElement(
    'div',
    { className: 'web-button-showcase' },
    ...sizes.map((size) => React.createElement(WebButton, {
      key: size,
      size,
      style: { marginRight: 20 },
    })),
  ),
};

export const Disabled = {
  name: 'Onemogočen',
  args: { state: 'disabled' },
};

export const LinkActionCategory = {
  name: 'Povezava - akcija',
  render: renderLinkVariants,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=3598-5861',
    },
  },
};

export const DownloadCategory = {
  name: 'Prenos',
  render: renderDownloadVariants,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=3598-5935',
    },
  },
};
