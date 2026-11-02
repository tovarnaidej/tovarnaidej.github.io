import React from 'react';

import { Alert } from './Alert';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseSection,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const listStyles = ['basic', 'filled', 'outlined'];

const supportingSample =
  'Supporting line text lorem ipsum dolor sit amet, consectetur';

// Figma list item rows: title only, 2-line (ellipsis), 3-line (wrapping).
const listConfigs = [
  { showSupporting: false, showAvatar: false, showChevron: false },
  { showSupporting: true, supportingLines: 1, showAvatar: false, showChevron: false },
  { showSupporting: true, supportingLines: 2, showAvatar: false, showChevron: false },
  { showSupporting: false, showAvatar: true, showChevron: true },
  { showSupporting: true, supportingLines: 1, showAvatar: true, showChevron: true },
  { showSupporting: true, supportingLines: 2, showAvatar: true, showChevron: true },
];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Alerts' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 24 },
        React.createElement(
          ShowcaseSection,
          { title: 'Alert' },
          React.createElement(
            ShowcaseStack,
            { gap: 16 },
            React.createElement(Alert, {
              mode: 'alert',
              style: 'filled',
              showIcon: true,
              showDismiss: true,
              title: 'Title',
              message: 'Message',
            }),
            React.createElement(Alert, {
              mode: 'alert',
              style: 'stroke',
              showIcon: true,
              showDismiss: true,
              title: 'Title',
              message: 'Message',
            }),
          ),
        ),
        React.createElement(
          ShowcaseSection,
          { title: 'List' },
          React.createElement(
            ShowcaseStack,
            { gap: 24 },
            ...listStyles.map((listStyle) =>
              React.createElement(
                ShowcaseStack,
                { key: listStyle, gap: 16 },
                ...listConfigs.map((config, index) =>
                  React.createElement(Alert, {
                    key: index,
                    mode: 'list',
                    listStyle,
                    listTitle: 'List Item',
                    supportingText: supportingSample,
                    ...config,
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Opozorila',
  component: Alert,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4207') },
    platformCode: { component: 'alert' },
  },
  tags: ['autodocs'],
  args: {
    mode: 'alert',
    style: 'filled',
    showIcon: true,
    showDismiss: true,
    title: 'Title',
    message: 'Message',
    listStyle: 'basic',
    showSupporting: true,
    showAvatar: false,
    showChevron: true,
    listTitle: 'List Item',
    supportingLines: 2,
    supportingText: supportingSample,
  },
  argTypes: {
    mode: {
      name: 'Vrsta',
      control: {
        type: 'select',
        labels: { alert: 'Opozorilo', list: 'Pojasnilo' },
      },
      options: ['alert', 'list'],
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { filled: 'Zapolnjeno', stroke: 'Obrobljeno' },
      },
      options: ['filled', 'stroke'],
      if: { arg: 'mode', eq: 'alert' },
    },
    showIcon: {
      name: 'Ikona',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'alert' },
    },
    showDismiss: {
      name: 'Zapri',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'alert' },
    },
    title: { name: 'Naslov', if: { arg: 'mode', eq: 'alert' } },
    message: { name: 'Sporočilo', if: { arg: 'mode', eq: 'alert' } },
    listStyle: {
      name: 'Slog seznama',
      control: {
        type: 'select',
        labels: {
          basic: 'Privzeto',
          filled: 'Zapolnjeno',
          outlined: 'Obrobljeno',
        },
      },
      options: ['basic', 'filled', 'outlined'],
      if: { arg: 'mode', eq: 'list' },
    },
    listTitle: { name: 'Naslov', if: { arg: 'mode', eq: 'list' } },
    showSupporting: {
      name: 'Besedilo',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'list' },
    },
    supportingText: {
      name: 'Podporno besedilo',
      if: { arg: 'mode', eq: 'list' },
    },
    supportingLines: {
      name: 'Vrstice',
      control: { type: 'select', labels: { 1: '1 vrstica', 2: '2 vrstici' } },
      options: [1, 2],
      if: { arg: 'mode', eq: 'list' },
    },
    showAvatar: {
      name: 'Avatar',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'list' },
    },
    showChevron: {
      name: 'Puščica',
      control: { type: 'boolean' },
      if: { arg: 'mode', eq: 'list' },
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

export const ListItem = {
  name: 'Pojasnilo',
  args: { mode: 'list' },
};
