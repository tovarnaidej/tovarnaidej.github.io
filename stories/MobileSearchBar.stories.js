import React from 'react';

import { SearchBar } from './SearchBar';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseRow,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const styles = ['defaultStyle', 'filled', 'outlined'];
const resultsModes = ['hide', 'empty', 'shown'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Search bar' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 24 },
        ...styles.map((style) =>
          React.createElement(
            ShowcaseRow,
            { key: style, gap: 24 },
            React.createElement(SearchBar, {
              style,
              resultsMode: 'hide',
              showAvatar: false,
            }),
            React.createElement(SearchBar, {
              style,
              resultsMode: 'hide',
              showAvatar: true,
            }),
          ),
        ),
        React.createElement(
          ShowcaseRow,
          { gap: 24 },
          React.createElement(SearchBar, {
            style: 'defaultStyle',
            resultsMode: 'shown',
            showAvatar: false,
            showResultAvatars: true,
          }),
          React.createElement(SearchBar, {
            style: 'filled',
            resultsMode: 'empty',
            showAvatar: false,
          }),
        ),
      ),
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
  args: {
    style: 'defaultStyle',
    resultsMode: 'hide',
    showAvatar: false,
    showResultAvatars: true,
    placeholder: 'Input search text',
  },
  argTypes: {
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
      options: styles,
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
    showResultAvatars: {
      name: 'Avatarji rezultatov',
      control: { type: 'boolean' },
      if: { arg: 'resultsMode', eq: 'shown' },
    },
    placeholder: { name: 'Nadomestno besedilo' },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = { name: 'Privzeto' };

export const WithResults = {
  name: 'Z rezultati',
  args: { resultsMode: 'shown' },
};
