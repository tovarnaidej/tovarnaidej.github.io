import React from 'react';

import { CalendarInput } from './CalendarInput';
import {
  MobileShowcase,
  ShowcaseSurface,
  ShowcaseStack,
  figmaMobileUrl,
} from './mobile-showcase';

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Vnosno polje za datum' },
    React.createElement(
      ShowcaseSurface,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 20 },
        React.createElement(CalendarInput, { mode: 'single', focused: true }),
        React.createElement(CalendarInput, { mode: 'range', focused: true }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Vnosno polje za datum',
  component: CalendarInput,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6657') },
    platformCode: { component: 'calendar-input' },
  },
  tags: ['autodocs'],
  args: {
    mode: 'single',
    platform: 'android',
  },
  argTypes: {
    mode: {
      name: 'Način',
      control: {
        type: 'select',
        labels: { single: 'En datum', range: 'Datumsko obdobje' },
      },
      options: ['single', 'range'],
    },
    platform: {
      name: 'Platforma',
      control: { type: 'select', labels: { ios: 'iOS', android: 'Android' } },
      options: ['ios', 'android'],
    },
    focused: { table: { disable: true } },
    onConfirmed: { table: { disable: true } },
    onCancelled: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

/* The catalog's preview: the input (keyed by Način: a new, empty one), 16 below it
   "Zadnji rezultat: …" (bodyMedium), 8 below that the TextButton "Odpri kot pogovorno okno"
   opening the same input as a dialog (SICalendarInput.show: barrier 32 %, insets 24). */
const CalendarInputPreview = ({ args }) => {
  const [last, setLast] = React.useState('—');
  const [dialog, setDialog] = React.useState(false);
  return React.createElement(
    'div',
    { className: 'catalog-preview catalog-preview--centred' },
    React.createElement(CalendarInput, {
      ...args,
      key: args.mode,
      onConfirmed: setLast,
      onCancelled: () => setLast('Preklicano'),
    }),
    React.createElement('p', { className: 'catalog-text', style: { marginTop: 16 } }, `Zadnji rezultat: ${last}`),
    React.createElement(
      'button',
      { type: 'button', className: 'catalog-text-button', style: { marginTop: 12 }, onClick: () => setDialog(true) },
      'Odpri kot pogovorno okno',
    ),
    dialog
      ? React.createElement(
          'div',
          { className: 'catalog-dialog catalog-dialog--light', onClick: (e) => { if (e.target === e.currentTarget) { setDialog(false); setLast('Preklicano'); } } },
          React.createElement(CalendarInput, {
            mode: args.mode,
            platform: args.platform,
            onConfirmed: (r) => { setDialog(false); setLast(r); },
            onCancelled: () => { setDialog(false); setLast('Preklicano'); },
          }),
        )
      : null,
  );
};

export const Default = {
  name: 'Privzeto',
  render: (args) => React.createElement(CalendarInputPreview, { args }),
};
