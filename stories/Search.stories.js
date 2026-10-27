import React, { useState } from 'react';
import { fn } from 'storybook/test';

import { Search } from './Search';
import republikaCss from '../public/fonts/republika.css?raw';
import searchCss from './search.css?raw';

const completeCss = `/* Republika font */\n${republikaCss.trim()}\n\n/* Search / Iskalnik */\n${searchCss.trim()}\n`;

const variants = ['universal', 'compact', 'embedded'];
const states = ['default', 'hover', 'focus', 'filled', 'error', 'disabled', 'results'];
const resultStates = ['loading', 'results', 'empty', 'error'];
const compactDisabledPlaceholder = 'Iskanje trenutno ni na voljo';

const variantNames = {
  universal: 'Universal',
  compact: 'Compact',
  embedded: 'Embedded action',
};

const stateNames = {
  default: 'Privzeto',
  hover: 'Lebdenje',
  focus: 'Fokus',
  filled: 'Izpolnjeno',
  error: 'Napaka',
  disabled: 'Onemogočen',
  results: 'Rezultati (vrstica)',
};

const resultStateNames = {
  loading: 'Nalaganje',
  results: 'Rezultati',
  empty: 'Prazno',
  error: 'Napaka',
};

const filledValue = 'Digitalno potrdilo';

const valueForState = (state) =>
  state === 'filled' ? filledValue : '';

const statesForVariant = (variant) =>
  variant === 'embedded'
    ? states.filter((state) => state !== 'results')
    : states;

const renderVariantStates = (variant, size) =>
  React.createElement(
    'section',
    { className: 'search-showcase__section', key: `${variant}-${size || 'default'}` },
    React.createElement(
      'h2',
      { className: 'search-showcase__title' },
      size ? `${variantNames[variant]} · ${size === 'large' ? 'Velik' : 'Kompaktni'}` : variantNames[variant],
    ),
    React.createElement(
      'div',
      { className: 'search-showcase__grid' },
      ...statesForVariant(variant).flatMap((state) => [
        React.createElement(
          'p',
          { className: 'search-showcase__label', key: `${variant}-${size}-${state}-label` },
          stateNames[state],
        ),
        React.createElement(Search, {
          key: `${variant}-${size}-${state}`,
          variant,
          size,
          state,
          defaultValue: valueForState(state),
          placeholder:
            variant === 'compact' && state === 'disabled'
              ? compactDisabledPlaceholder
              : 'Kaj iščete?',
          onSubmit: fn(),
        }),
      ]),
    ),
  );

const renderShowcase = () =>
  React.createElement(
    'div',
    { className: 'search-showcase' },
    renderVariantStates('universal'),
    renderVariantStates('compact'),
    renderVariantStates('embedded', 'large'),
    renderVariantStates('embedded', 'compact'),
  );

const renderResultsShowcase = () =>
  React.createElement(
    'div',
    { className: 'search-showcase' },
    React.createElement(
      'section',
      { className: 'search-showcase__section' },
      React.createElement('h2', { className: 'search-showcase__title' }, 'Search / Results'),
      React.createElement(
        'div',
        { className: 'search-showcase__grid' },
        ...resultStates.flatMap((state) => [
          React.createElement(
            'p',
            { className: 'search-showcase__label', key: `${state}-label` },
            resultStateNames[state],
          ),
          React.createElement(Search, {
            key: state,
            variant: 'universal',
            defaultValue: filledValue,
            resultsState: state,
            actionLabel: state === 'empty' || state === 'error' ? 'Išči' : 'Iskanje',
            onSubmit: fn(),
          }),
        ]),
      ),
    ),
  );

const Documentation = () =>
  React.createElement(
    'div',
    { className: 'search-docs' },
    React.createElement('h1', { style: { margin: 0, fontSize: 40 } }, 'Iskalnik'),
    React.createElement(
      'p',
      { className: 'search-docs__intro' },
      'Iskalnik za iskanje po spletnem mestu. Vključuje osnovna stanja, minimalne različice in odzivna pravila.',
    ),
    React.createElement(
      'div',
      { className: 'search-docs__rules' },
      React.createElement(
        'div',
        { className: 'search-docs__rule' },
        React.createElement('h3', null, 'Desktop'),
        React.createElement(
          'p',
          null,
          'Polje in gumb v eni vrstici · največja uporabna širina 760 px',
        ),
      ),
      React.createElement(
        'div',
        { className: 'search-docs__rule' },
        React.createElement('h3', null, 'Mobile'),
        React.createElement('p', null, 'En stolpec pod 480 px · gumb polne širine'),
      ),
      React.createElement(
        'div',
        { className: 'search-docs__rule' },
        React.createElement('h3', null, 'Accessibility'),
        React.createElement(
          'p',
          null,
          '44 px dotik · jasen fokus · napake niso označene samo z barvo',
        ),
      ),
    ),
    React.createElement('h2', { style: { margin: '8px 0 0', fontSize: 28 } }, 'Mobilni primeri'),
    React.createElement(
      'p',
      { style: { margin: 0, color: '#45636d' } },
      'Ista komponenta se skrči na širino ekrana; polje zapolni razpoložljiv prostor, akcija ostane najmanj 44 px široka.',
    ),
    React.createElement(
      'div',
      { className: 'search-docs__previews' },
      React.createElement(
        'div',
        { className: 'search-docs__preview' },
        React.createElement('h3', null, 'Universal'),
        React.createElement(Search, { variant: 'universal', onSubmit: fn() }),
      ),
      React.createElement(
        'div',
        { className: 'search-docs__preview' },
        React.createElement('h3', null, 'Compact'),
        React.createElement(Search, { variant: 'compact', onSubmit: fn() }),
      ),
      React.createElement(
        'div',
        { className: 'search-docs__preview' },
        React.createElement('h3', null, 'Suggestions'),
        React.createElement(Search, {
          variant: 'universal',
          defaultValue: 'Dig',
          state: 'focus',
          showSuggestions: true,
          onSubmit: fn(),
        }),
      ),
    ),
  );

const CompleteCss = () => {
  const [copied, setCopied] = useState(false);

  const copyCss = async () => {
    await navigator.clipboard.writeText(completeCss);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return React.createElement(
    'section',
    {
      style: {
        boxSizing: 'border-box',
        minHeight: '100vh',
        padding: '32px',
        color: '#0b3a4a',
        background: '#ffffff',
        fontFamily: "'Republika', Arial, sans-serif",
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '20px',
        },
      },
      React.createElement(
        'div',
        null,
        React.createElement('h1', { style: { margin: '0 0 8px', fontSize: '28px' } }, 'Celoten CSS'),
        React.createElement(
          'p',
          { style: { margin: 0, color: '#45636d', fontSize: '16px' } },
          'Vključuje pisavo Republika ter vse velikosti, različice in stanja iskalnika.',
        ),
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: copyCss,
          style: {
            flex: '0 0 auto',
            padding: '12px 18px',
            border: 0,
            borderRadius: '8px',
            color: '#ffffff',
            background: copied ? '#447972' : '#3c7b94',
            font: "700 15px 'Republika', Arial, sans-serif",
            cursor: 'pointer',
          },
        },
        copied ? 'Kopirano' : 'Kopiraj CSS',
      ),
    ),
    React.createElement(
      'pre',
      {
        style: {
          overflow: 'auto',
          margin: 0,
          padding: '24px',
          border: '1px solid #d9e2e6',
          borderRadius: '8px',
          color: '#eaf4f6',
          background: '#0b3a4a',
          font: '14px/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          whiteSpace: 'pre',
        },
      },
      React.createElement('code', null, completeCss),
    ),
  );
};

export default {
  title: 'Gradniki/Search - Iskalnik',
  component: Search,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'search',
      values: [{ name: 'search', value: '#f4f5f7' }],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/mSlovenija---WEB-Design-System?node-id=3604-6667',
    },
  },
  decorators: [
    (Story) =>
      React.createElement(
        'div',
        {
          style: {
            boxSizing: 'border-box',
            minHeight: '100vh',
            padding: '32px',
            background: '#f4f5f7',
          },
        },
        React.createElement(Story),
      ),
  ],
  tags: ['autodocs'],
  args: {
    variant: 'universal',
    size: 'large',
    state: 'default',
    placeholder: 'Kaj iščete?',
    actionLabel: 'Iskanje',
    label: 'Iskanje',
    defaultValue: '',
    showSuggestions: false,
    resultsState: 'none',
    onSubmit: fn(),
    onChange: fn(),
    onSuggestionSelect: fn(),
  },
  argTypes: {
    variant: {
      name: 'Različica',
      description: 'Postavitev iskalnika.',
      control: {
        type: 'select',
        labels: {
          universal: 'Universal',
          compact: 'Compact',
          embedded: 'Embedded action',
        },
      },
      options: variants,
    },
    size: {
      name: 'Velikost',
      description: 'Velikost za različico Embedded action.',
      control: {
        type: 'select',
        labels: {
          large: 'Velik',
          compact: 'Kompaktni',
        },
      },
      options: ['large', 'compact'],
      if: { arg: 'variant', eq: 'embedded' },
    },
    state: {
      name: 'Stanje',
      description: 'Interakcijsko stanje iskalnika.',
      control: {
        type: 'select',
        labels: stateNames,
      },
      options: [...states, 'results'],
    },
    placeholder: {
      name: 'Nadomestno besedilo',
      description: 'Besedilo, prikazano ko je polje prazno.',
    },
    defaultValue: {
      name: 'Vrednost',
      description: 'Začetna vrednost iskalnega polja.',
    },
    actionLabel: {
      name: 'Besedilo akcije',
      description: 'Oznaka gumba za iskanje.',
    },
    label: {
      name: 'Oznaka',
      description: 'Dostopna oznaka polja (vizualno skrita).',
    },
    showSuggestions: {
      name: 'Predlogi',
      description: 'Prikaže spustni seznam predlogov.',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    resultsState: {
      name: 'Stanje rezultatov',
      description: 'Prikaz panela rezultatov po oddaji.',
      control: {
        type: 'select',
        labels: {
          none: 'Brez',
          ...resultStateNames,
        },
      },
      options: ['none', ...resultStates],
    },
    className: {
      name: 'Razred CSS',
      description: 'Dodaten razred CSS.',
    },
    onSubmit: {
      name: 'Ob oddaji',
      description: 'Dogodek ob oddaji obrazca.',
    },
    onChange: {
      name: 'Ob spremembi',
      description: 'Dogodek ob spremembi vrednosti.',
    },
    onSuggestionSelect: {
      name: 'Ob izbiri predloga',
      description: 'Dogodek ob izbiri predloga.',
    },
  },
};

export const DocsOverview = {
  name: 'Dokumentacija - pregled',
  render: () => React.createElement(Documentation),
  decorators: [(Story) => React.createElement(Story)],
  parameters: {
    controls: { disable: true },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderShowcase,
  decorators: [(Story) => React.createElement(Story)],
  parameters: {
    controls: { disable: true },
  },
};

export const Universal = {
  name:'Universal',
  args:{
    variant:'universal',
    state:"filled"
  },
};

export const Compact = {
  name: 'Compact',
  args: {
    variant: 'compact',
  },
};

export const EmbeddedLarge = {
  name: 'Embedded - velik',
  args: {
    variant: 'embedded',
    size: 'large',
  },
};

export const EmbeddedCompact = {
  name: 'Embedded - kompaktni',
  args: {
    variant: 'embedded',
    size: 'compact',
  },
};

export const Suggestions = {
  name: 'Predlogi',
  args: {
    variant: 'universal',
    state: 'focus',
    defaultValue: 'Dig',
    showSuggestions: true,
  },
};

export const Results = {
  name: 'Rezultati',
  args: {
    variant: 'universal',
    defaultValue: filledValue,
    resultsState: 'results',
  },
  argTypes: {
    resultsState: {
      options: resultStates,
    },
  },
  render: (args) =>
    React.createElement(Search, {
      ...args,
      actionLabel:
        args.resultsState === 'empty' || args.resultsState === 'error'
          ? 'Išči'
          : args.actionLabel || 'Iskanje',
    }),
};

export const ResultsAll = {
  name: 'Rezultati - vse',
  render: renderResultsShowcase,
  decorators: [(Story) => React.createElement(Story)],
  parameters: {
    controls: { disable: true },
  },
};

export const ErrorState = {
  name: 'Napaka',
  args: {
    state: 'error',
  },
};

export const Disabled = {
  name: 'Onemogočen',
  args: {
    state: 'disabled',
  },
};

export const Css = {
  name: 'Celoten CSS',
  render: () => React.createElement(CompleteCss),
  decorators: [(Story) => React.createElement(Story)],
  parameters: {
    controls: { disable: true },
    docs: {
      source: {
        code: completeCss,
        language: 'css',
      },
    },
  },
};
