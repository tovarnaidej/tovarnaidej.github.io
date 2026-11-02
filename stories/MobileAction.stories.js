import React from 'react';

import { Action } from './Action';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseSection,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['elevated', 'outlined', 'filled'];
const maxLinesOptions = ['one', 'two', 'unlimited'];

const sampleMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor';

// Figma columns: no buttons · dismiss · action · action + dismiss
const buttonConfigs = [
  { showAction: false, showDismiss: false },
  { showAction: false, showDismiss: true },
  { showAction: true, showDismiss: false },
  { showAction: true, showDismiss: true },
];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Notifications' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 32 },
        ...styles.map((style) =>
          React.createElement(
            ShowcaseSection,
            { key: style, title: style },
            React.createElement(
              ShowcaseStack,
              { gap: 24 },
              ...maxLinesOptions.map((maxLines) =>
                React.createElement(
                  ShowcaseRow,
                  { key: maxLines, gap: 24 },
                  ...buttonConfigs.map((config, index) =>
                    React.createElement(Action, {
                      key: index,
                      style,
                      maxLines,
                      message: sampleMessage,
                      ...config,
                    }),
                  ),
                ),
              ),
            ),
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
    message: sampleMessage,
    actionLabel: 'Action',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          elevated: 'S senco',
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
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
    showAction: { name: 'Akcija', control: { type: 'boolean' } },
    showDismiss: { name: 'Zapri', control: { type: 'boolean' } },
    message: { name: 'Sporočilo' },
    actionLabel: {
      name: 'Oznaka akcije',
      if: { arg: 'showAction', eq: true },
    },
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
  args: { maxLines: 'unlimited', actionLabel: 'Longer Action' },
};
