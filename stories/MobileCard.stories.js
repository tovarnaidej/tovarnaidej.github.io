import React from 'react';

import { Card } from './Card';
import {
  MobileShowcase,
  ShowcaseGrid,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['outlined', 'filled', 'elevated'];
const layouts = ['standard', 'compact'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Cards' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 24 },
        React.createElement(
          ShowcaseGrid,
          { columns: 3, gap: 24 },
          ...styles.map((style) =>
            React.createElement(Card, {
              key: `standard-${style}`,
              style,
              layout: 'standard',
            }),
          ),
        ),
        React.createElement(
          ShowcaseRow,
          { gap: 24 },
          ...styles.map((style) =>
            React.createElement(Card, {
              key: `compact-${style}`,
              style,
              layout: 'compact',
            }),
          ),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Kartica',
  component: Card,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:2979') },
    platformCode: { component: 'card' },
  },
  tags: ['autodocs'],
  args: {
    style: 'outlined',
    layout: 'standard',
    showHeader: true,
    showMedia: true,
    showContent: true,
    showActions: true,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
          elevated: 'S senco',
        },
      },
      options: styles,
    },
    layout: {
      name: 'Postavitev',
      control: {
        type: 'select',
        labels: {
          standard: 'Standardna',
          compact: 'Kompaktna',
        },
      },
      options: layouts,
    },
    showHeader: { name: 'Glava', control: { type: 'boolean' } },
    showMedia: { name: 'Mediji', control: { type: 'boolean' } },
    showContent: {
      name: 'Vsebina',
      control: { type: 'boolean' },
      if: { arg: 'layout', eq: 'standard' },
    },
    showActions: {
      name: 'Dejanja',
      control: { type: 'boolean' },
      if: { arg: 'layout', eq: 'standard' },
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

export const Compact = {
  name: 'Kompaktna',
  args: { layout: 'compact' },
};

export const Elevated = {
  name: 'S senco',
  args: { style: 'elevated' },
};
