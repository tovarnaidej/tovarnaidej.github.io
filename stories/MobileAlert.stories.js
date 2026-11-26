import React from 'react';
import { useArgs, useEffect } from 'storybook/preview-api';

import { Alert } from './Alert';
import {
  MobileShowcase,
  PlatformColumns,
  ShowcaseSection,
  ShowcaseStack,
  ShowcaseSurface,
  ShowcaseWidth,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

const listStyles = ['basic', 'filled', 'outlined'];
const listStyleLabels = { basic: 'Privzeto', filled: 'Zapolnjeno', outlined: 'Obrobljeno' };

const supportingSample =
  'Supporting line text lorem ipsum dolor sit amet, consectetur';

// Figma / design_data "Opozorila": title only, 1 line (ellipsis), 2 lines (wrapping);
// the same three with avatar + chevron. The catalog always reserves the chevron slot.
const listConfigs = [
  { showSupporting: false, showAvatar: false, showChevron: false },
  { showSupporting: true, supportingLines: 1, showAvatar: false, showChevron: false },
  { showSupporting: true, supportingLines: 2, showAvatar: false, showChevron: false },
  { showSupporting: false, showAvatar: true, showChevron: true },
  { showSupporting: true, supportingLines: 1, showAvatar: true, showChevron: true },
  { showSupporting: true, supportingLines: 2, showAvatar: true, showChevron: true },
];

const renderAlerts = (platform) =>
  React.createElement(
    ShowcaseWidth,
    { width: 361 },
    React.createElement(
      ShowcaseStack,
      { gap: 16 },
      ...['filled', 'stroke'].map((style) =>
        React.createElement(Alert, {
          key: style,
          mode: 'alert',
          style,
          platform,
          showIcon: true,
          showDismiss: true,
          title: 'Title',
          message: 'Message',
        }),
      ),
    ),
  );

const renderList = (platform, listStyle) => {
  const rows = React.createElement(
    ShowcaseStack,
    { gap: 16 },
    ...listConfigs.map((config, index) =>
      React.createElement(Alert, {
        key: index,
        mode: 'list',
        listStyle,
        platform,
        title: 'Title',
        message: supportingSample,
        ...config,
      }),
    ),
  );
  const sized = React.createElement(ShowcaseWidth, { width: 360 }, rows);
  return listStyle === 'basic'
    ? React.createElement(ShowcaseSurface, { padding: 16 }, sized)
    : sized;
};

const renderPlatform = (platform) =>
  React.createElement(
    ShowcaseStack,
    { gap: 32 },
    React.createElement(ShowcaseSection, { title: 'Opozorilo' }, renderAlerts(platform)),
    ...listStyles.map((listStyle) =>
      React.createElement(
        ShowcaseSection,
        { key: listStyle, title: `Pojasnilo — ${listStyleLabels[listStyle]}` },
        renderList(platform, listStyle),
      ),
    ),
  );

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Opozorila' },
    React.createElement(PlatformColumns, {
      ios: renderPlatform('ios'),
      android: renderPlatform('android'),
      gap: 48,
    }),
  );

export default {
  title: 'Gradniki - mobile/Opozorila',
  component: Alert,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4207') },
    platformCode: { component: 'alert' },
    mobileWidth: 361,
  },
  tags: ['autodocs'],
  decorators: [withMobileWidth],
  // One Naslov and one Besedilo for both kinds, as the catalog. textShown / linesShown are
  // kept by Privzeto: an `if` takes one condition, while the catalog shows the text for
  // Opozorilo or with Besedilo on, and the lines only for Pojasnilo with Besedilo on.
  args: {
    mode: 'alert',
    style: 'filled',
    listStyle: 'basic',
    platform: 'android',
    showIcon: true,
    showDismiss: true,
    showSupporting: true,
    showAvatar: false,
    showChevron: true,
    title: 'Title',
    supportingLines: 2,
    message: 'Message',
    textShown: true,
    linesShown: false,
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
    listStyle: {
      name: 'Slog',
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
    platform: {
      name: 'Platforma',
      control: { type: 'inline-radio', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
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
    showSupporting: {
      name: 'Besedilo',
      control: { type: 'boolean' },
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
    title: { name: 'Naslov', control: { type: 'text' } },
    supportingLines: {
      name: 'Besedilo',
      control: { type: 'select', labels: { 1: 'Ena', 2: 'Dve' } },
      options: [1, 2],
      if: { arg: 'linesShown' },
    },
    message: { name: 'Besedilo', control: { type: 'text' }, if: { arg: 'textShown' } },
    textShown: { type: { name: 'boolean' }, table: { disable: true } },
    linesShown: { type: { name: 'boolean' }, table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen', mobileWidth: 0 },
};

export const Default = {
  name: 'Privzeto',
  render: (args) => {
    const [, updateArgs] = useArgs();
    const textShown = args.mode === 'alert' || Boolean(args.showSupporting);
    const linesShown = args.mode === 'list' && Boolean(args.showSupporting);
    useEffect(() => {
      if (args.textShown !== textShown || args.linesShown !== linesShown) updateArgs({ textShown, linesShown });
    }, [textShown, linesShown]);
    return React.createElement(Alert, args);
  },
};
