import React from 'react';

import { ProgressBar } from './ProgressBar';
import {
  MobileShowcase,
  ShowcaseSection,
  ShowcaseStack,
  ShowcaseRow,
  ShowcaseWidth,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

// Catalog copy (progress_bar_configurator.dart): "Korak X od N",
// "Trenutno: Korak X" / "Vsi koraki so zaključeni", vertical heading "N korakov".
const stepsHeading = (n) => {
  const r = n % 100;
  if (r === 1) return `${n} korak`;
  if (r === 2) return `${n} koraka`;
  if (r === 3 || r === 4) return `${n} koraki`;
  return `${n} korakov`;
};

const verticalLabels = (total, current) =>
  Array.from({ length: total }, (_, i) => (i + 1 === current ? 'Trenutni korak' : `Korak ${i + 1}`));

const linearSupporting = (current, total) =>
  current >= total ? 'Vsi koraki so zaključeni' : `Trenutno: Korak ${current}`;

const bar = (props, key) =>
  React.createElement(ShowcaseWidth, { width: 361, key }, React.createElement(ProgressBar, props));

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Prikaz korakov' },
    React.createElement(
      ShowcaseRow,
      { gap: 64, className: 'mobile-showcase__row--top' },
      React.createElement(
        ShowcaseStack,
        { gap: 48 },
        React.createElement(
          ShowcaseSection,
          { title: 'Segmentiran · Linearni · Koračni' },
          React.createElement(
            ShowcaseStack,
            { gap: 40 },
            bar({ variant: 'segmented', currentStep: 1, totalSteps: 6 }, 's'),
            bar({ variant: 'linear', value: 0.4 }, 'l'),
            bar({ variant: 'stepped', currentStep: 2, totalSteps: 3 }, 'st'),
          ),
        ),
        React.createElement(
          ShowcaseSection,
          { title: 'Koračni z besedilom' },
          React.createElement(
            ShowcaseStack,
            { gap: 40 },
            ...[3, 4, 5].map((n) =>
              bar({ variant: 'stepped', currentStep: 2, totalSteps: n, label: `Korak 2 od ${n}` }, n),
            ),
            bar({ variant: 'stepped', currentStep: 3, totalSteps: 6, label: 'Korak 3 od 6' }, 6),
          ),
        ),
        React.createElement(
          ShowcaseSection,
          { title: 'Linearni z besedilom' },
          React.createElement(
            ShowcaseStack,
            { gap: 40 },
            ...[3, 6, 10].map((c) =>
              bar(
                {
                  variant: 'linear',
                  value: c / 10,
                  currentStep: c,
                  totalSteps: 10,
                  label: `Korak ${c} od 10`,
                  supportingText: linearSupporting(c, 10),
                },
                c,
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        ShowcaseSection,
        { title: 'Koračni · Navpično' },
        bar(
          {
            variant: 'stepped',
            orientation: 'vertical',
            currentStep: 6,
            totalSteps: 10,
            label: stepsHeading(10),
            stepLabels: verticalLabels(10, 6),
          },
          'v',
        ),
      ),
    ),
  );

const withCatalogTexts = (args) => {
  if (!args.showText || args.variant === 'segmented') {
    return { ...args, label: '', supportingText: '', stepLabels: undefined };
  }
  const vertical = args.variant === 'stepped' && args.orientation === 'vertical';
  const total = args.totalSteps;
  const current = args.currentStep;
  return {
    ...args,
    value: args.variant === 'linear' ? current / total : args.value,
    label: vertical ? stepsHeading(total) : `Korak ${current} od ${total}`,
    supportingText: args.variant === 'linear' ? linearSupporting(current, total) : '',
    stepLabels: vertical ? verticalLabels(total, current) : undefined,
  };
};

export default {
  title: 'Gradniki - mobile/Prikaz korakov',
  component: ProgressBar,
  decorators: [withMobileWidth],
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6870') },
    platformCode: { component: 'progress-bar' },
    mobileWidth: 361,
  },
  tags: ['autodocs'],
  render: (args) => React.createElement(ProgressBar, withCatalogTexts(args)),
  args: {
    variant: 'segmented',
    orientation: 'horizontal',
    showText: true,
    value: 0.5,
    currentStep: 1,
    totalSteps: 6,
  },
  argTypes: {
    variant: {
      name: 'Različica',
      control: {
        type: 'select',
        labels: { segmented: 'Segmentiran', linear: 'Linearni', stepped: 'Koračni' },
      },
      options: ['segmented', 'linear', 'stepped'],
    },
    orientation: {
      name: 'Usmerjenost',
      control: { type: 'inline-radio', labels: { horizontal: 'Vodoravno', vertical: 'Navpično' } },
      options: ['horizontal', 'vertical'],
      if: { arg: 'variant', eq: 'stepped' },
    },
    showText: {
      name: 'Besedilo',
      control: { type: 'boolean' },
      if: { arg: 'variant', neq: 'segmented' },
    },
    value: {
      name: 'Vrednost',
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      if: { arg: 'variant', eq: 'linear' },
    },
    currentStep: { name: 'Trenutni korak', control: { type: 'number', min: 1, max: 10 } },
    totalSteps: { name: 'Skupaj korakov', control: { type: 'number', min: 2, max: 10 } },
    label: { table: { disable: true } },
    supportingText: { table: { disable: true } },
    stepLabels: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen', mobileWidth: 0 },
};

export const Default = { name: 'Privzeto' };
