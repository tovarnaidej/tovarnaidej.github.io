import React, { useState } from 'react';
import { fn } from 'storybook/test';

import { Obvestilo } from './Obvestilo';
import republikaCss from '../public/fonts/republika.css?raw';
import obvestiloCss from './obvestilo.css?raw';

const completeCss = `/* Republika font */\n${republikaCss.trim()}\n\n/* Obvestilo / Alert */\n${obvestiloCss.trim()}\n`;

const types = ['success', 'warning', 'error', 'information'];

const typeNames = {
  success: 'Uspeh',
  warning: 'Opozorilo',
  error: 'Napaka',
  information: 'Informacija',
};

const defaultArgs = {
  title: 'Naslov obvestila',
  message: 'Kratek opis obvestila z jasnim naslednjim korakom za uporabnika.',
  showAction: true,
  actionLabel: 'Poglej podrobnosti',
  dismissible: true,
  onActionClick: fn(),
  onDismiss: fn(),
};

const renderShowcase = () =>
  React.createElement(
    'div',
    { className: 'obvestilo-showcase' },
    ...types.map((type) =>
      React.createElement(
        'section',
        { className: 'obvestilo-showcase__section', key: type },
        React.createElement(
          'h2',
          { className: 'obvestilo-showcase__title' },
          typeNames[type],
        ),
        React.createElement(
          'div',
          { className: 'obvestilo-showcase__row' },
          React.createElement(
            'div',
            { className: 'obvestilo-showcase__frame obvestilo-showcase__frame--desktop' },
            React.createElement(
              'p',
              { className: 'obvestilo-showcase__label' },
              'Desktop · 720 px',
            ),
            React.createElement(Obvestilo, {
              ...defaultArgs,
              type,
              viewport: 'desktop',
            }),
          ),
          React.createElement(
            'div',
            { className: 'obvestilo-showcase__frame obvestilo-showcase__frame--mobile' },
            React.createElement(
              'p',
              { className: 'obvestilo-showcase__label' },
              'Mobile · 343 px',
            ),
            React.createElement(Obvestilo, {
              ...defaultArgs,
              type,
              viewport: 'mobile',
            }),
          ),
        ),
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
          'Vključuje pisavo Republika ter vse statusne različice obvestila.',
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
  title: 'Gradniki/Obvestilo',
  component: Obvestilo,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/JT1wXP9SDHaY1dGphFxNh3/mSlovenija---WEB-Design-System?node-id=7006-277',
    },
  },
  tags: ['autodocs'],
  args: {
    type: 'success',
    title: 'Naslov obvestila',
    message: 'Kratek opis obvestila z jasnim naslednjim korakom za uporabnika.',
    showAction: true,
    actionLabel: 'Poglej podrobnosti',
    actionHref: '',
    dismissible: true,
    viewport: 'desktop',
    onActionClick: fn(),
    onDismiss: fn(),
  },
  argTypes: {
    type: {
      name: 'Tip',
      description: 'Statusna resnost obvestila.',
      control: {
        type: 'select',
        labels: {
          success: 'Uspeh',
          warning: 'Opozorilo',
          error: 'Napaka',
          information: 'Informacija',
        },
      },
      options: types,
    },
    title: {
      name: 'Naslov',
      description: 'Kratek naslov, ki pove bistvo.',
    },
    message: {
      name: 'Sporočilo',
      description: 'Razlaga z jasnim naslednjim korakom.',
    },
    showAction: {
      name: 'Prikaži akcijo',
      description: 'Prikaže neobvezno akcijo pod sporočilom.',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    actionLabel: {
      name: 'Besedilo akcije',
      description: 'Besedilo neobvezne akcije.',
    },
    actionHref: {
      name: 'Povezava akcije',
      description: 'Če je podana, se akcija upodobi kot povezava.',
    },
    dismissible: {
      name: 'Zapiranje',
      description: 'Prikaže gumb za zapiranje.',
      control: { type: 'boolean', labels: { true: 'Da', false: 'Ne' } },
    },
    viewport: {
      name: 'Pogled',
      description: 'Tipografija za Desktop ali Mobile (auto sledi širini okna).',
      control: {
        type: 'select',
        labels: {
          auto: 'Samodejno',
          desktop: 'Desktop',
          mobile: 'Mobile',
        },
      },
      options: ['auto', 'desktop', 'mobile'],
    },
    className: {
      name: 'Razred CSS',
      description: 'Dodaten razred CSS.',
    },
    onActionClick: {
      name: 'Ob akciji',
      description: 'Dogodek ob kliku na akcijo.',
    },
    onDismiss: {
      name: 'Ob zaprtju',
      description: 'Dogodek ob zaprtju obvestila.',
    },
  },
};

const paddedFrame = (width) => (Story) =>
  React.createElement(
    'div',
    {
      style: {
        boxSizing: 'border-box',
        minHeight: '100vh',
        padding: '32px',
        background: '#ffffff',
      },
    },
    React.createElement(
      'div',
      { style: { width, maxWidth: '100%' } },
      React.createElement(Story),
    ),
  );

export const Pregled = {
  name: 'Pregled',
  render: renderShowcase,
  parameters: {
    controls: { disable: true },
  },
};

export const Success = {
  name: 'Uspeh',
  args: { type: 'success' },
  decorators: [paddedFrame(720)],
};

export const Warning = {
  name: 'Opozorilo',
  args: { type: 'warning' },
  decorators: [paddedFrame(720)],
};

export const Error = {
  name: 'Napaka',
  args: { type: 'error' },
  decorators: [paddedFrame(720)],
};

export const Information = {
  name: 'Informacija',
  args: { type: 'information' },
  decorators: [paddedFrame(720)],
};

export const Mobile = {
  name: 'Mobile',
  args: {
    type: 'success',
    viewport: 'mobile',
  },
  decorators: [paddedFrame(343)],
};

export const BrezAkcije = {
  name: 'Brez akcije',
  args: {
    type: 'success',
    showAction: false,
  },
  decorators: [paddedFrame(720)],
};

export const BrezZapiranja = {
  name: 'Brez zapiranja',
  args: {
    type: 'warning',
    dismissible: false,
  },
  decorators: [paddedFrame(720)],
};

export const Css = {
  name: 'Celoten CSS',
  render: () => React.createElement(CompleteCss),
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
