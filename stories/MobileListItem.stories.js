import React from 'react';

import { ListItem } from './ListItem';
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

const styles = ['basic', 'filled', 'outlined'];
const styleLabels = { basic: 'Privzeto', filled: 'Zapolnjeno', outlined: 'Obrobljeno' };

const supportingSample =
  'Supporting line text lorem ipsum dolor sit amet, consectetur';

// list_item_configurator.dart: title only / supporting 1 line / 2 lines, ± avatar, chevron.
const rows = [
  { supportingText: '', showChevron: false },
  { supportingText: supportingSample, supportingLineLimit: 1, showChevron: false },
  { supportingText: supportingSample, supportingLineLimit: 2, showChevron: false },
  { supportingText: '', showAvatar: true, showChevron: true },
  { supportingText: supportingSample, supportingLineLimit: 1, showAvatar: true, showChevron: true },
  { supportingText: supportingSample, supportingLineLimit: 2, showAvatar: true, showChevron: true },
];

const renderStyle = (platform, style) => {
  const list = React.createElement(
    ShowcaseWidth,
    { width: 360 },
    React.createElement(
      ShowcaseStack,
      { gap: 16 },
      ...rows.map((row, index) =>
        React.createElement(ListItem, {
          key: index,
          style,
          platform,
          title: 'List Item',
          ...row,
        }),
      ),
    ),
  );
  return React.createElement(
    ShowcaseSection,
    { key: style, title: styleLabels[style] },
    style === 'basic' ? React.createElement(ShowcaseSurface, { padding: 16 }, list) : list,
  );
};

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Seznam' },
    React.createElement(PlatformColumns, {
      ios: React.createElement(ShowcaseStack, { gap: 32 }, ...styles.map((s) => renderStyle('ios', s))),
      android: React.createElement(
        ShowcaseStack,
        { gap: 32 },
        ...styles.map((s) => renderStyle('android', s)),
      ),
      gap: 48,
    }),
  );

export default {
  title: 'Gradniki - mobile/Seznam',
  component: ListItem,
  decorators: [withMobileWidth],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:4207') },
    platformCode: { component: 'list-item' },
    mobileWidth: 360,
  },
  tags: ['autodocs'],
  args: {
    style: 'basic',
    platform: 'android',
    title: 'List Item Title',
    supportingText: 'Supporting text goes here',
    supportingLineLimit: 2,
    showAvatar: false,
    avatarInitials: 'AB',
    showChevron: true,
    chevronHidden: false,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: { type: 'select', labels: styleLabels },
      options: styles,
    },
    platform: {
      name: 'Platforma',
      control: { type: 'inline-radio', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    title: { name: 'Naslov' },
    supportingText: { name: 'Besedilo' },
    supportingLineLimit: {
      name: 'Vrstice',
      control: { type: 'select', labels: { 1: '1 vrstica', 2: '2 vrstici' } },
      options: [1, 2],
    },
    showAvatar: { name: 'Avatar', control: { type: 'boolean' } },
    avatarInitials: { name: 'Inicialke', if: { arg: 'showAvatar' } },
    showChevron: { name: 'Puščica', control: { type: 'boolean' } },
    chevronHidden: { name: 'Skrij puščico (rezerviraj prostor)', control: { type: 'boolean' } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen', mobileWidth: 0 },
};

export const Default = { name: 'Privzeto' };

export const Filled = { name: 'Zapolnjeno', args: { style: 'filled' } };

export const OutlinedWithAvatar = {
  name: 'Obrobljeno z avatarjem',
  args: { style: 'outlined', showAvatar: true },
};
