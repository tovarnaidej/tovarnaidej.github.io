import React from 'react';

import { Action } from './Action';
import {
  MobileShowcase,
  ShowcaseRow,
  ShowcaseSection,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['elevated', 'outlined', 'filled'];
const maxLinesOptions = ['one', 'two', 'unlimited'];
const styleLabels = { elevated: 'S senco', outlined: 'Obrobljeno', filled: 'Zapolnjeno' };

const sampleMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor';

// design_data/Obvestila.png: per style two columns (without / with close) × rows.
const rows = [
  { maxLines: 'one', showAction: false },
  { maxLines: 'one', showAction: true, actionLabel: 'Razveljavi' },
  { maxLines: 'two', showAction: false },
  { maxLines: 'two', showAction: true, actionLabel: 'Razveljavi' },
  { maxLines: 'unlimited', showAction: true, actionLabel: 'Razveljavi' },
];

const renderColumn = (style, showDismiss) =>
  React.createElement(
    ShowcaseStack,
    { gap: 24 },
    ...rows.map((row, index) =>
      React.createElement(Action, {
        key: index,
        style,
        showDismiss,
        message: sampleMessage,
        ...row,
      }),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Obvestila' },
    React.createElement(
      ShowcaseStack,
      { gap: 48 },
      ...styles.map((style) =>
        React.createElement(
          ShowcaseSection,
          { key: style, title: styleLabels[style] },
          React.createElement(
            ShowcaseRow,
            { gap: 64 },
            renderColumn(style, false),
            renderColumn(style, true),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Obvestila',
  component: Action,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4327') },
    platformCode: { component: 'action' },
  },
  tags: ['autodocs'],
  args: {
    style: 'elevated',
    maxLines: 'two',
    showAction: true,
    showDismiss: true,
    message: 'To je obvestilo',
    actionLabel: 'Razveljavi',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: styleLabels,
      },
      options: styles,
    },
    maxLines: {
      name: 'Največje št. vrstic',
      control: {
        type: 'select',
        labels: { one: 'Ena', two: 'Dve', unlimited: 'Neomejeno' },
      },
      options: maxLinesOptions,
    },
    showAction: { name: 'Dejanje', control: { type: 'boolean' } },
    showDismiss: { name: 'Zapri', control: { type: 'boolean' } },
    message: { name: 'Sporočilo' },
    actionLabel: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };

export const Filled = {
  name: 'Zapolnjeno',
  args: { style: 'filled' },
};

export const UnlimitedWithAction = {
  name: 'Neomejeno z akcijo',
  args: { maxLines: 'unlimited', message: sampleMessage, actionLabel: 'Razveljavi' },
};
