import React from 'react';

import { SearchBar } from './SearchBar';
import {
  MobileShowcase,
  ShowcaseRow,
  ShowcaseStack,
  ShowcaseSurface,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

const styles = ['filled', 'defaultStyle', 'outlined'];
const resultsModes = ['hide', 'empty', 'shown'];

// design_data/Iskalno polje.png: one column per style (default sits on the
// primary app bar colour, TokenSearchBarV2.defaultOuterBackground).
const column = (style) => {
  const stack = React.createElement(
    ShowcaseStack,
    { gap: 24 },
    React.createElement(SearchBar, { style, resultsMode: 'hide', showAvatar: false }),
    React.createElement(SearchBar, { style, resultsMode: 'hide', showAvatar: true }),
    React.createElement(SearchBar, { style, resultsMode: 'empty', query: '' }),
    React.createElement(SearchBar, { style, resultsMode: 'empty' }),
    React.createElement(SearchBar, { style, resultsMode: 'shown', showResultAvatars: true }),
    React.createElement(SearchBar, { style, resultsMode: 'shown', showResultAvatars: false }),
  );
  return style === 'defaultStyle'
    ? React.createElement(
        ShowcaseSurface,
        { key: style, padding: 16, className: 'mobile-showcase__surface--primary' },
        stack,
      )
    : React.createElement('div', { key: style, style: { paddingTop: 16 } }, stack);
};

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Iskalno polje' },
    React.createElement(
      ShowcaseRow,
      { gap: 48, className: 'mobile-showcase__row--top' },
      ...styles.map(column),
    ),
  );

export default {
  title: 'Gradniki - mobile/Iskalno polje',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:3654') },
    platformCode: { component: 'search-bar' },
  },
  tags: ['autodocs'],
  decorators: [withMobileWidth],
  args: {
    platform: 'android',
    style: 'defaultStyle',
    resultsMode: 'hide',
    showAvatar: false,
    showResultAvatars: true,
    showClearButton: true,
    placeholder: 'Input search text',
    supportingText: 'Supporting line text lorem ipsum dolor sit amet, consectetur',
  },
  argTypes: {
    platform: {
      name: 'Platforma',
      control: { type: 'inline-radio', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          defaultStyle: 'Privzeto',
          filled: 'Zapolnjeno',
          outlined: 'Obrobljeno',
        },
      },
      // catalog order (SISearchBarStyle.values)
      options: ['defaultStyle', 'filled', 'outlined'],
    },
    resultsMode: {
      name: 'Rezultati',
      control: {
        type: 'select',
        labels: {
          hide: 'Skrij',
          empty: 'Prazno',
          shown: 'Prikazano',
        },
      },
      options: resultsModes,
    },
    showAvatar: { name: 'Avatar', control: { type: 'boolean' } },
    showResultAvatars: { name: 'Avatarji rezultatov', control: { type: 'boolean' } },
    showClearButton: { name: 'Zapri', control: { type: 'boolean' } },
    placeholder: { name: 'Nadomestno besedilo' },
    // the iOS catalog has it (Flutter / Android fix the text); only the shown results use it
    supportingText: { name: 'Besedilo', if: { arg: 'resultsMode', eq: 'shown' } },
    query: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

/* Catalog preview fills the pane (393 wide phone). */
export const Default = {
  name: 'Privzeto',
  parameters: { mobileWidth: 361 },
  // The catalog keys the bar by Slog, Rezultati and Zapri: a new bar with its starting text.
  render: (args) =>
    React.createElement(SearchBar, { ...args, key: `${args.style}${args.resultsMode}${args.showClearButton}` }),
};
