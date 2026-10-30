import { Filter } from './Filter';

const types = ['category', 'filters', 'applied', 'sort'];
const styles = ['outlined', 'filled', 'tonal'];
const layouts = ['singleRowScrollable', 'multiRowOverflow'];
const categoryStates = ['unselected', 'selected', 'disabled'];

export default {
  title: 'Gradniki - mobile/Filter',
  component: Filter,
  parameters: {
    layout: 'centered',
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
          tonal: 'Tonsko',
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

export const Default = {
  name: 'Privzeto',
};

export const AsBar = {
  name: 'Vrstica filtrov',
  args: { previewAsBar: true },
};
