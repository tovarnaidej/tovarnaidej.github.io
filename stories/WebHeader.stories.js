import React, { useState } from 'react';
import { fn } from 'storybook/test';

import { WebHeader } from './WebHeader';
import republikaCss from '../public/fonts/republika.css?raw';
import webButtonCss from './web-button.css?raw';
import searchCss from './search.css?raw';
import webHeaderCss from './web-header.css?raw';

const completeCss = `/* Republika font */\n${republikaCss.trim()}\n\n/* WebButton */\n${webButtonCss.trim()}\n\n/* Search */\n${searchCss.trim()}\n\n/* WebHeader */\n${webHeaderCss.trim()}\n`;

const sharedHandlers = {
  onSearchClick: fn(),
  onLanguageClick: fn(),
  onMenuToggle: fn(),
  onNavigate: fn(),
  onPrimaryAction: fn(),
  onSiPassClick: fn(),
};

const Frame = ({ title, width, children }) =>
  React.createElement(
    'section',
    { className: 'web-header-showcase__section' },
    React.createElement('h2', { className: 'web-header-showcase__title' }, title),
    React.createElement(
      'div',
      {
        className: [
          'web-header-showcase__frame',
          width === 375 ? 'web-header-showcase__frame--mobile' : '',
        ]
          .filter(Boolean)
          .join(' '),
        style: width ? { width } : undefined,
      },
      children,
    ),
  );

const Showcase = () =>
  React.createElement(
    'div',
    { className: 'web-header-showcase' },
    React.createElement(
      Frame,
      { title: 'Desktop · Light · Zaprto', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'desktop',
        menuState: 'closed',
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Desktop · Dark · Zaprto', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'dark',
        layout: 'desktop',
        menuState: 'closed',
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Desktop · Light · Dropdown', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'desktop',
        menuState: 'dropdown',
        showNavChevrons: true,
        openItemId: '1',
        items: [
          {
            id: '1',
            label: 'Naslov 1',
            children: [
              { label: 'Lorem ipsum', href: '#lorem-1' },
              { label: 'Lorem ipsum', href: '#lorem-2' },
              { label: 'Lorem ipsum', href: '#lorem-3' },
            ],
          },
          { id: '2', label: 'Naslov 2', children: [{ label: 'Lorem ipsum', href: '#2' }] },
          { id: '3', label: 'Naslov 3', children: [{ label: 'Lorem ipsum', href: '#3' }] },
          { id: '4', label: 'Naslov 4', children: [{ label: 'Lorem ipsum', href: '#4' }] },
          { id: '5', label: 'Naslov 5', children: [{ label: 'Lorem ipsum', href: '#5' }] },
        ],
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Desktop · Light · Dropdown aktivno', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'desktop',
        menuState: 'dropdown',
        showNavChevrons: true,
        openItemId: '1',
        activeHref: '#lorem-1',
        items: [
          {
            id: '1',
            label: 'Naslov 1',
            children: [
              { label: 'Lorem ipsum', href: '#lorem-1' },
              { label: 'Lorem ipsum', href: '#lorem-2' },
              { label: 'Lorem ipsum', href: '#lorem-3' },
            ],
          },
          { id: '2', label: 'Naslov 2', children: [{ label: 'Lorem ipsum', href: '#2' }] },
          { id: '3', label: 'Naslov 3', children: [{ label: 'Lorem ipsum', href: '#3' }] },
          { id: '4', label: 'Naslov 4', children: [{ label: 'Lorem ipsum', href: '#4' }] },
          { id: '5', label: 'Naslov 5', children: [{ label: 'Lorem ipsum', href: '#5' }] },
        ],
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Desktop · Dark · Dropdown', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'dark',
        layout: 'desktop',
        menuState: 'dropdown',
        showNavChevrons: true,
        openItemId: '1',
        items: [
          {
            id: '1',
            label: 'Naslov 1',
            children: [
              { label: 'Lorem ipsum', href: '#lorem-1' },
              { label: 'Lorem ipsum', href: '#lorem-2' },
              { label: 'Lorem ipsum', href: '#lorem-3' },
            ],
          },
          { id: '2', label: 'Naslov 2', children: [{ label: 'Lorem ipsum', href: '#2' }] },
          { id: '3', label: 'Naslov 3', children: [{ label: 'Lorem ipsum', href: '#3' }] },
          { id: '4', label: 'Naslov 4', children: [{ label: 'Lorem ipsum', href: '#4' }] },
          { id: '5', label: 'Naslov 5', children: [{ label: 'Lorem ipsum', href: '#5' }] },
        ],
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Compact · Light · Hamburger', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'compact',
        menuState: 'closed',
        showHelp: true,
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Compact · Light · Mega odprt', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'compact',
        menuState: 'mega',
        showHelp: true,
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Compact · Dark · Mega odprt', width: 1440 },
      React.createElement(WebHeader, {
        theme: 'dark',
        layout: 'compact',
        menuState: 'mega',
        showHelp: true,
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Mobile · Light · Zaprto', width: 375 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'mobile',
        menuState: 'closed',
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Mobile · Light · Odprt', width: 375 },
      React.createElement(WebHeader, {
        theme: 'light',
        layout: 'mobile',
        menuState: 'open',
        ...sharedHandlers,
      }),
    ),
    React.createElement(
      Frame,
      { title: 'Mobile · Dark · Odprt', width: 375 },
      React.createElement(WebHeader, {
        theme: 'dark',
        layout: 'mobile',
        menuState: 'open',
        ...sharedHandlers,
      }),
    ),
  );

const InteractiveDemo = () => {
  const [theme, setTheme] = useState('light');
  const [layout, setLayout] = useState('desktop');
  const [menuState, setMenuState] = useState('closed');
  const [openItemId, setOpenItemId] = useState(null);

  return React.createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
    React.createElement(
      'div',
      { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
      React.createElement(
        'button',
        { type: 'button', onClick: () => setTheme('light') },
        'Light',
      ),
      React.createElement(
        'button',
        { type: 'button', onClick: () => setTheme('dark') },
        'Dark',
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            setLayout('desktop');
            setMenuState('closed');
          },
        },
        'Desktop',
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            setLayout('compact');
            setMenuState('closed');
          },
        },
        'Compact',
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            setLayout('mobile');
            setMenuState('closed');
          },
        },
        'Mobile',
      ),
    ),
    React.createElement(WebHeader, {
      theme,
      layout,
      menuState,
      openItemId,
      showNavChevrons: layout === 'desktop',
      showHelp: layout === 'compact',
      onMenuToggle: (nextOpen) => {
        if (layout === 'compact') {
          setMenuState(nextOpen ? 'mega' : 'closed');
        } else if (layout === 'mobile') {
          setMenuState(nextOpen ? 'open' : 'closed');
        }
      },
      onNavigate: (item) => {
        if (item?.id) {
          setOpenItemId((current) => (current === item.id ? null : item.id));
          setMenuState('dropdown');
        }
        sharedHandlers.onNavigate(item);
      },
      onSearchClick: sharedHandlers.onSearchClick,
      onLanguageClick: sharedHandlers.onLanguageClick,
      onPrimaryAction: sharedHandlers.onPrimaryAction,
      onSiPassClick: sharedHandlers.onSiPassClick,
    }),
  );
};

const CompleteCss = () => {
  const [copied, setCopied] = useState(false);
  return React.createElement(
    'div',
    { style: { padding: 24, fontFamily: 'Republika, Arial, sans-serif' } },
    React.createElement('h1', { style: { marginTop: 0 } }, 'Celoten CSS'),
    React.createElement(
      'p',
      null,
      'Republika + WebButton + Search + WebHeader v eni datoteki za vgradnjo.',
    ),
    React.createElement(
      'button',
      {
        type: 'button',
        onClick: async () => {
          await navigator.clipboard.writeText(completeCss);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        },
      },
      copied ? 'Kopirano' : 'Kopiraj CSS',
    ),
    React.createElement(
      'pre',
      {
        style: {
          marginTop: 16,
          padding: 16,
          overflow: 'auto',
          maxHeight: 480,
          background: '#0f1720',
          color: '#e8eef2',
          fontSize: 12,
        },
      },
      completeCss,
    ),
  );
};

// The links of "Naslov 1" in the default items (the dropdown the Aktivna povezava control is for).
const defaultFirstLinks = ['#lorem-1', '#lorem-2', '#lorem-3', '#p1-4', '#p1-5', '#p1-6'];
// Storybook leaves values with "#" out of the URL: the panel keeps the key ("lorem-1") and the
// component gets the href through the mapping.
const firstLinkControl = (links) => ({
  control: {
    type: 'select',
    labels: Object.fromEntries(links.map((href, index) => [href.slice(1), `Povezava ${index + 1} (${href})`])),
  },
  options: links.map((href) => href.slice(1)),
  mapping: Object.fromEntries(links.map((href) => [href.slice(1), href])),
  if: { arg: 'openItemId', eq: '1' },
});
const itemIds = ['1', '2', '3', '4', '5'];

// What a control does depends on the layout (Pomoč only in Compact, the full language name only in
// the open mobile menu, the open item and the active link only in the desktop dropdown): each
// story is one layout and its panel lists only the controls that change it.
const headerArgTypes = {
  theme: {
    name: 'Tema',
    description: 'Svetla ali temna glava.',
    control: { type: 'radio', labels: { light: 'Svetla', dark: 'Temna' } },
    options: ['light', 'dark'],
  },
  layout: {
    name: 'Postavitev',
    description: 'Desktop, Compact, Mobile ali Auto (sledi širini okna).',
    control: { type: 'radio' },
    options: ['auto', 'desktop', 'compact', 'mobile'],
  },
  menuState: {
    name: 'Meni',
    description: 'Stanje navigacije: zaprto, spustni meni (desktop), mega meni ali odprt mobilni meni.',
    control: {
      type: 'select',
      labels: { closed: 'Zaprto', dropdown: 'Spustni meni', mega: 'Mega meni', open: 'Odprto' },
    },
    options: ['closed', 'dropdown', 'mega', 'open'],
  },
  openItemId: {
    name: 'Odprta postavka',
    description: 'Postavka, katere spustni meni je odprt.',
    control: { type: 'select', labels: Object.fromEntries(itemIds.map((id) => [id, `Naslov ${id}`])) },
    options: itemIds,
  },
  activeHref: {
    name: 'Aktivna povezava',
    description: 'Povezava trenutne strani v spustnem meniju Naslov 1 (vidna, ko je odprt).',
  },
  items: {
    name: 'Postavke',
    description: 'Navigacijske postavke in njihove podstrani.',
  },
  primaryAction: {
    name: 'Primarno dejanje',
    description: 'Oznaka primarnega gumba.',
  },
  showSiPass: {
    name: 'SI-PASS',
    description: 'Prikaže gumb za prijavo SI-PASS.',
    control: { type: 'boolean' },
  },
  language: {
    name: 'Jezik',
    description: 'Koda jezika v izbirniku jezika.',
  },
  languageLabel: {
    name: 'Ime jezika',
    description: 'Polno ime jezika v odprtem mobilnem meniju (drugje je dostopno ime izbirnika).',
  },
  showHelp: {
    name: 'Pomoč',
    description: 'Prikaže gumb Pomoč v postavitvi Compact.',
    control: { type: 'boolean' },
  },
  showNavChevrons: {
    name: 'Puščice navigacije',
    description: 'Prikaže puščice ob postavkah, ko meni ni odprt.',
    control: { type: 'boolean' },
  },
  governmentLogo: {
    name: 'Logotip vlade',
    description: 'Element namesto privzetega grba in napisa (React vozlišče).',
    control: false,
  },
  projectLogo: {
    name: 'Logotip projekta',
    description: 'URL slike logotipa projekta.',
  },
  className: {
    name: 'Razred CSS',
    description: 'Dodaten razred CSS.',
  },
};

// A story's own argTypes get their name from the arg key ("menuState") unless they repeat it:
// every change starts from the definition above.
const patch = (changes) =>
  Object.fromEntries(Object.entries(changes).map(([key, change]) => [key, { ...headerArgTypes[key], ...change }]));
const hide = { control: false };
const desktopChanges = {
  layout: hide,
  menuState: { options: ['closed', 'dropdown', 'mega'] },
  openItemId: { if: { arg: 'menuState', eq: 'dropdown' } },
  activeHref: firstLinkControl(defaultFirstLinks),
  showNavChevrons: { if: { arg: 'menuState', neq: 'dropdown' } },
  languageLabel: hide,
  showHelp: hide,
};
const desktopArgTypes = patch(desktopChanges);

export default {
  title: 'Gradniki/Header',
  component: WebHeader,
  parameters: {
    layout: 'fullscreen',
  },
  // the open item is the component's own state, seeded from openItemId and cleared when the menu
  // closes: a new open item or menu state from the panel starts it again (as a fresh load does)
  render: (args) =>
    React.createElement(WebHeader, { key: `${args.menuState}|${args.openItemId}`, ...args }),
  args: {
    theme: 'light',
    layout: 'desktop',
    menuState: 'closed',
    ...sharedHandlers,
  },
  argTypes: headerArgTypes,
};

export const Pregled = {
  name: 'Pregled stanj',
  render: () => React.createElement(Showcase),
  parameters: {
    controls: { disable: true },
  },
};

export const DesktopLight = {
  name: 'Desktop light',
  args: {
    theme: 'light',
    layout: 'desktop',
    menuState: 'closed',
  },
  argTypes: desktopArgTypes,
};

export const DesktopDark = {
  name: 'Desktop dark',
  args: {
    theme: 'dark',
    layout: 'desktop',
    menuState: 'closed',
  },
  argTypes: desktopArgTypes,
};

const dropdownFirstLinks = ['#lorem-1', '#lorem-2', '#lorem-3'];

export const DesktopDropdown = {
  name: 'Desktop dropdown',
  argTypes: patch({
    ...desktopChanges,
    activeHref: firstLinkControl(dropdownFirstLinks),
  }),
  args: {
    theme: 'light',
    layout: 'desktop',
    menuState: 'dropdown',
    showNavChevrons: true,
    openItemId: '1',
    items: [
      {
        id: '1',
        label: 'Naslov 1',
        children: [
          { label: 'Lorem ipsum', href: '#lorem-1' },
          { label: 'Lorem ipsum', href: '#lorem-2' },
          { label: 'Lorem ipsum', href: '#lorem-3' },
        ],
      },
      { id: '2', label: 'Naslov 2', children: [{ label: 'Lorem ipsum', href: '#2' }] },
      { id: '3', label: 'Naslov 3', children: [{ label: 'Lorem ipsum', href: '#3' }] },
      { id: '4', label: 'Naslov 4', children: [{ label: 'Lorem ipsum', href: '#4' }] },
      { id: '5', label: 'Naslov 5', children: [{ label: 'Lorem ipsum', href: '#5' }] },
    ],
  },
};

export const CompactMega = {
  name: 'Compact mega',
  args: {
    theme: 'light',
    layout: 'compact',
    menuState: 'mega',
    showHelp: true,
  },
  argTypes: patch({
    layout: hide,
    menuState: { options: ['closed', 'mega'] },
    openItemId: hide,
    activeHref: hide,
    primaryAction: hide,
    languageLabel: hide,
    showNavChevrons: hide,
  }),
};

export const MobileOpen = {
  name: 'Mobile odprt',
  args: {
    theme: 'light',
    layout: 'mobile',
    menuState: 'open',
  },
  argTypes: patch({
    layout: hide,
    menuState: { options: ['closed', 'open'] },
    openItemId: hide,
    activeHref: hide,
    showHelp: hide,
    showNavChevrons: hide,
    // the open menu shows the full language name, not the code
    language: hide,
    languageLabel: { if: { arg: 'menuState', eq: 'open' } },
    primaryAction: { if: { arg: 'menuState', eq: 'open' } },
    showSiPass: { if: { arg: 'menuState', eq: 'open' } },
  }),
};

export const Interaktivno = {
  name: 'Interaktivno',
  render: () => React.createElement(InteractiveDemo),
  parameters: {
    controls: { disable: true },
  },
};

export const CelotenCss = {
  name: 'Celoten CSS',
  render: () => React.createElement(CompleteCss),
  parameters: {
    controls: { disable: true },
  },
};
