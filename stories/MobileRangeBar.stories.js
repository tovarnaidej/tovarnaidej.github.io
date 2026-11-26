import React from 'react';
import { useArgs, useEffect, useRef } from 'storybook/preview-api';

import { RangeBar } from './RangeBar';
import {
  MobileShowcase,
  ShowcasePanel,
  ShowcaseStack,
  figmaMobileUrl,
  withMobileWidth,
} from './mobile-showcase';

const STOPS = [0, 0.25, 0.5, 0.75, 1];
const nearestStop = (v) => STOPS.reduce((a, b) => (Math.abs(a - v) <= Math.abs(b - v) ? a : b));

const renderVariants = () =>
  React.createElement(
    MobileShowcase,
    { title: 'Drsnik' },
    React.createElement(
      ShowcasePanel,
      null,
      React.createElement(
        ShowcaseStack,
        { gap: 40 },
        React.createElement(RangeBar, { value: 0, showTicks: true }),
        React.createElement(RangeBar, { value: 0.25, showTicks: true }),
        React.createElement(RangeBar, { value: 0.5, showTicks: true }),
        React.createElement(RangeBar, { value: 0.75, showTicks: true }),
        React.createElement(RangeBar, { value: 1, showTicks: true }),
        React.createElement(RangeBar, { value: 0.5, showTicks: false }),
      ),
    ),
  );

export default {
  title: 'Gradniki - mobile/Drsnik',
  component: RangeBar,
  parameters: {
    layout: 'centered',
    design: { type: 'figma', url: figmaMobileUrl('3911:6895') },
    platformCode: {
      component: 'range-bar',
    },
  },
  tags: ['autodocs'],
  decorators: [withMobileWidth],
  // Catalog: "Oznake", then the value - five buttons 0 / 25 / 50 / 75 / 100 with ticks, a
  // slider without. valueStop is the buttons; value is what the bar shows (and Koda uses).
  args: {
    showTicks: true,
    value: 0.5,
    valueStop: 0.5,
  },
  argTypes: {
    showTicks: {
      name: 'Oznake',
      description: 'Prikaže oznake (ticks). Ob vklopu se vrednost pripne na najbližjo stopnjo.',
      control: { type: 'boolean' },
    },
    valueStop: {
      // a typed arg keeps its place after the component's props (an untyped one is listed first)
      type: { name: 'number' },
      name: 'Vrednost',
      description: 'Vrednost drsnika (z oznakami: stopnje 0 / 25 / 50 / 75 / 100).',
      control: { type: 'inline-radio', labels: { 0: '0', 0.25: '25', 0.5: '50', 0.75: '75', 1: '100' } },
      options: STOPS,
      if: { arg: 'showTicks', eq: true },
    },
    value: {
      name: 'Vrednost',
      description: 'Vrednost drsnika (0–1).',
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      if: { arg: 'showTicks', eq: false },
    },
    tickCount: { table: { disable: true } },
    className: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
};

export const Variants = {
  name: 'Vse različice',
  render: renderVariants,
  parameters: { controls: { disable: true }, layout: 'fullscreen' },
};

/* Catalog preview fills the pane (393 wide phone). */
export const Default = {
  name: 'Privzeto',
  parameters: { mobileWidth: 393 },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const previous = useRef(args);
    useEffect(() => {
      const before = previous.current;
      previous.current = args;
      const value = Number(args.value);
      if (args.showTicks && !before.showTicks) {
        // _setShowTicks: turning the ticks on snaps the value to the nearest stop
        const v = nearestStop(value);
        if (v !== value || v !== args.valueStop) updateArgs({ value: v, valueStop: v });
      } else if (args.showTicks && args.valueStop !== before.valueStop && args.valueStop !== value) {
        updateArgs({ value: args.valueStop }); // one of the 0 / 25 / 50 / 75 / 100 buttons
      } else if (value !== Number(before.value) && STOPS.includes(value) && args.valueStop !== value) {
        updateArgs({ valueStop: value });
      }
    }, [args.showTicks, args.value, args.valueStop]);
    // Dragging or tapping the bar changes "Vrednost" too (the catalog shares one value).
    return React.createElement(RangeBar, {
      ...args,
      onChange: (value) => updateArgs(STOPS.includes(value) ? { value, valueStop: value } : { value }),
    });
  },
};
