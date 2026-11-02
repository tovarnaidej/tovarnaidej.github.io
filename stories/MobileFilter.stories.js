import React from 'react';

import { Filter } from './Filter';
import {
  MobileShowcase,
  ShowcaseRow,
  ShowcaseSection,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const types = ['category', 'filters', 'applied', 'sort'];
const styles = ['outlined', 'filled'];
const layouts = ['singleRowScrollable', 'multiRowOverflow'];
const categoryStates = ['unselected', 'selected', 'disabled'];

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Filter' },
    React.createElement(
      ShowcaseSection,
      { title: 'Filter Chip' },
      React.createElement(
        ShowcaseRow,
        { gap: 33 },
        React.createElement(Filter, {
          type: 'category',
          categoryState: 'unselected',
        }),
        React.createElement(Filter, {
          type: 'category',
          categoryState: 'selected',
        }),
        React.createElement(Filter, {
          type: 'category',
          categoryState: 'disabled',
        }),
        React.createElement(Filter, {
          type: 'category',
          categoryState: 'unselected',
          leadingIcon: true,
        }),
      ),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Filter button' },
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        React.createElement(
          ShowcaseRow,
          { gap: 30 },
          React.createElement(Filter, { type: 'filters', style: 'outlined' }),
          React.createElement(Filter, {
            type: 'filters',
            style: 'outlined',
            showBadge: true,
          }),
        ),
        React.createElement(
          ShowcaseRow,
          { gap: 30 },
          React.createElement(Filter, { type: 'filters', style: 'filled' }),
          React.createElement(Filter, {
            type: 'filters',
            style: 'filled',
            showBadge: true,
          }),
        ),
      ),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Sort button' },
      React.createElement(
        ShowcaseRow,
        { gap: 30 },
        React.createElement(Filter, { type: 'sort', style: 'outlined' }),
        React.createElement(Filter, { type: 'sort', style: 'filled' }),
      ),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Applied filter' },
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        React.createElement(Filter, { type: 'applied', style: 'outlined' }),
        React.createElement(Filter, { type: 'applied', style: 'filled' }),
        React.createElement(Filter, {
          type: 'applied',
          style: 'outlined',
          showDismiss: true,
        }),
        React.createElement(Filter, {
          type: 'applied',
          style: 'filled',
          showDismiss: true,
        }),
      ),
    ),
    React.createElement(
      ShowcaseSection,
      { title: 'Chip groups' },
      React.createElement(
        ShowcaseRow,
        { gap: 67 },
        React.createElement(Filter, {
          previewAsBar: true,
          layout: 'singleRowScrollable',
        }),
        React.createElement(Filter, {
          previewAsBar: true,
          layout: 'multiRowOverflow',
        }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Filter',
  component: Filter,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6495') },
    platformCode: {
      component: 'filter',
    },
  },
  tags: ['autodocs'],
  args: {
    previewAsBar: false,
    layout: 'singleRowScrollable',
    type: 'category',
    style: 'outlined',
    categoryState: 'unselected',
    label: '',
    leadingIcon: false,
    showBadge: false,
    showDismiss: false,
  },
  argTypes: {
    previewAsBar: {
      name: 'Predogled kot vrstica',
      control: { type: 'boolean' },
    },
    layout: {
      name: 'Postavitev',
      control: {
        type: 'select',
        labels: {
          singleRowScrollable: 'Ena vrstica',
          multiRowOverflow: 'Prelom v več vrstic',
        },
      },
      options: layouts,
      if: { arg: 'previewAsBar', eq: true },
    },
    type: {
      name: 'Vrsta',
      control: {
        type: 'select',
        labels: {
          category: 'Kategorija',
          filters: 'Filtri',
          applied: 'Uporabljeno',
          sort: 'Razvrščanje',
        },
      },
      options: types,
      if: { arg: 'previewAsBar', eq: false },
    },
    categoryState: {
      name: 'Stanje',
      control: {
        type: 'select',
        labels: {
          unselected: 'Neizbrano',
          selected: 'Izbrano',
          disabled: 'Onemogočeno',
        },
      },
      options: categoryStates,
      if: { arg: 'type', eq: 'category' },
    },
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          outlined: 'Obrobljeno',
          filled: 'Zapolnjeno',
        },
      },
      options: styles,
      if: { arg: 'type', neq: 'category' },
    },
    label: {
      name: 'Oznaka',
      if: { arg: 'previewAsBar', eq: false },
    },
    leadingIcon: {
      name: 'Vodilna ikona',
      control: { type: 'boolean' },
      if: { arg: 'type', eq: 'category' },
    },
    showBadge: {
      name: 'Značka',
      control: { type: 'boolean' },
      if: { arg: 'type', eq: 'filters' },
    },
    showDismiss: {
      name: 'Zapri',
      control: { type: 'boolean' },
      if: { arg: 'type', eq: 'applied' },
    },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

export const Default = {
  name: 'Privzeto',
};

export const Sort = {
  name: 'Razvrščanje',
  args: { type: 'sort' },
};

export const AsBar = {
  name: 'Vrstica filtrov',
  args: { previewAsBar: true },
};
