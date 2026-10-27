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

export default {
  title: 'Gradniki/Header',
  component: WebHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    theme: 'light',
    layout: 'desktop',
    menuState: 'closed',
    ...sharedHandlers,
  },
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
};

export const DesktopDark = {
  name: 'Desktop dark',
  args: {
    theme: 'dark',
    layout: 'desktop',
    menuState: 'closed',
  },
};

export const DesktopDropdown = {
  name: 'Desktop dropdown',
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
};

export const MobileOpen = {
  name: 'Mobile odprt',
  args: {
    theme: 'light',
    layout: 'mobile',
    menuState: 'open',
  },
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
