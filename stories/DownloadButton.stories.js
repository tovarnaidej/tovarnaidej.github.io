import React from 'react';

import { DownloadButton } from './WebAction';

const sizes = ['small', 'medium', 'large'];
const states = ['default', 'hover', 'focus', 'pressed', 'disabled'];
const stateNames = {
  default: 'Privzeto',
  hover: 'Lebdenje',
  focus: 'Fokus',
  pressed: 'Pritisnjen',
  disabled: 'Onemogočen',
};

const renderVariants = () => React.createElement(
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
  title: 'Gradniki/Gumb - spletna različica/Prenos',
  component: DownloadButton,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=3598-5935',
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Prenesi',
    size: 'medium',
    state: 'default',
    showIcon: true,
  },
  argTypes: {
    label: { name: 'Besedilo' },
    size: {
      name: 'Velikost',
      control: {
        type: 'select',
        labels: { small: 'Majhen', medium: 'Srednji', large: 'Velik' },
      },
      options: sizes,
    },
    state: {
      name: 'Stanje',
      control: { type: 'select', labels: stateNames },
      options: states,
    },
    showIcon: {
      name: 'Prikaži ikono',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    className: { name: 'Razred CSS' },
    onClick: { name: 'Ob kliku' },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
};

export const Default = {
  name: 'Privzeto',
};
