import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const rangeValue = (args) => {
  const raw = Number(args?.value);
  return Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0.5;
};

const showTicks = (args) => args?.showTicks !== false;

export function buildFlutterSnippet(args = {}) {
  return [
    'SIRangeBar(',
    `  value: ${rangeValue(args)},`,
    `  showTicks: ${showTicks(args)},`,
    '  tickCount: TokenRangeBarV2.defaultTickCount,',
    '  onChanged: (v) {},',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  return [
    'SIRangeBar(context).apply {',
    `    rangeValue = ${rangeValue(args)}f`,
    `    showTicks = ${showTicks(args)}`,
    '    tickCount = TokenRangeBar.defaultTickCount',
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SIRangeBar(',
    `    value: ${rangeValue(args)},`,
    '    onChanged: { _ in },',
    `    showTicks: ${showTicks(args)},`,
    '    tickCount: TokenRangeBar.defaultTickCount',
    ')',
  ].join('\n');
}

export const buildRangeBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const RANGE_BAR_PLATFORMS = MOBILE_PLATFORMS;
