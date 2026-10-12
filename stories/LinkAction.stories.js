import React from 'react';

import { LinkAction } from './WebAction';

const states = ['default', 'hover', 'focus', 'pressed', 'visited', 'disabled'];
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
  { className: 'web-action-showcase' },
  React.createElement(
    'div',
    { className: 'web-action-showcase__grid' },
    ...states.map((state) => React.createElement(
      'p',
      { className: 'web-action-showcase__label', key: `${state}-label` },
      stateNames[state],
    )),
    ...states.map((state) => React.createElement(
      'div',
      { className: 'web-action-showcase__cell', key: state },
      React.createElement(LinkAction, { state }),
    )),
  ),
);

export default {
  title: 'Gradniki/Gumb - spletna različica/Povezava - akcija',
  component: LinkAction,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/Ph5kySZOVPpzP6565W17LV/mSlovenija---Design-System--UI-kit-?node-id=3598-5861',
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Preberi več',
    state: 'default',
    showIcon: false,
    href: '#',
  },
  argTypes: {
    label: { name: 'Besedilo' },
    state: {
      name: 'Stanje',
      control: { type: 'select', labels: stateNames },
      options: states,
    },
    showIcon: {
      name: 'Prikaži ikono',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    href: { name: 'Povezava' },
    className: { name: 'Razred CSS' },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
};

export const Default = {
  name: 'Privzeto',
};
