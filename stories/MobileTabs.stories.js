import React from 'react';
import { useArgs, useEffect, useRef } from 'storybook/preview-api';

import { Tabs } from './Tabs';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Zavihki' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        // design_data/Tabs.png: fixed 3 + 4 in both styles, then scrollable.
        ...[
          ['underline', 'fixed', 3],
          ['filled', 'fixed', 3],
          ['underline', 'fixed', 4],
          ['filled', 'fixed', 4],
          ['underline', 'scrollable', 8],
          ['filled', 'scrollable', 8],
        ].map(([style, configuration, tabCount]) =>
          React.createElement(Tabs, {
            key: `${style}-${configuration}-${tabCount}`,
            style,
            configuration,
            tabCount,
          }),
        ),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Zavihki',
  component: Tabs,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6740') },
    platformCode: { component: 'tabs' },
  },
  tags: ['autodocs'],
  decorators: [withMobileWidth],
  render: (args) => {
    // Catalog: switching to "Pomakljivo" with 3 tabs jumps to 8 tabs.
    const [, updateArgs] = useArgs();
    const previous = useRef(args.configuration);
    useEffect(() => {
      const before = previous.current;
      previous.current = args.configuration;
      if (before !== args.configuration && args.configuration === 'scrollable' && Number(args.tabCount) === 3) {
        updateArgs({ tabCount: 8 });
      }
    }, [args.configuration]);
    // Catalog: a smaller count moves the selection to the last tab (and it stays there).
    useEffect(() => {
      const count = Number(args.tabCount);
      if (Number(args.selectedIndex) >= count) updateArgs({ selectedIndex: count - 1 });
    }, [args.tabCount]);
    const count = Number(args.tabCount);
    const selected = Math.min(Number(args.selectedIndex) || 0, count - 1);
    // The catalog's preview: the tabs, 24 below them "Izbrano: <tab>" (bodyMedium), and for
    // Pomakljivo a hint 8 below that (13px, #5E6366), texts inset 16.
    return React.createElement(
      'div',
      { className: 'catalog-preview' },
      React.createElement(Tabs, { ...args, onTap: (i) => updateArgs({ selectedIndex: i }) }),
      React.createElement('p', { className: 'catalog-text', style: { margin: '24px 16px 0' } }, `Izbrano: Zavihek ${selected + 1}`),
      args.configuration === 'scrollable'
        ? React.createElement(
            'p',
            { className: 'catalog-text catalog-text--13', style: { margin: '8px 16px 0', color: '#5e6366' } },
            'Za zavihke zunaj zaslona podrsajte vodoravno.',
          )
        : null,
    );
  },
  args: {
    style: 'underline',
    configuration: 'fixed',
    tabCount: 3,
    selectedIndex: 0,
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: { underline: 'Podčrtano', filled: 'Zapolnjeno' },
      },
      options: ['underline', 'filled'],
    },
    configuration: {
      name: 'Postavitev',
      control: {
        type: 'select',
        labels: { fixed: 'Fiksno', scrollable: 'Pomakljivo' },
      },
      options: ['fixed', 'scrollable'],
    },
    tabCount: {
      name: 'Zavihki',
      control: {
        type: 'select',
        labels: { 3: '3', 4: '4', 5: '5', 8: '8' },
      },
      options: [3, 4, 5, 8],
    },
    selectedIndex: { table: { disable: true } },
    onTap: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

/* Catalog preview fills the pane (393 wide phone). */
export const Default = { name: 'Privzeto', parameters: { mobileWidth: 361 } };
