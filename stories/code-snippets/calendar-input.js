import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const mode = (args) => args?.mode || 'single';

export function buildFlutterSnippet(args = {}) {
  return [
    'SICalendarInput(',
    `  mode: SICalendarInputMode.${mode(args)},`,
    '  onConfirmed: (r) {},',
    '  onCancelled: () {},',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  return [
    'SICalendarInput(context).apply {',
    `    mode = SICalendarInputMode.${mode(args).toUpperCase()}`,
    '    onConfirmed = { }',
    '    onCancelled = { }',
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SICalendarInput(',
    `    mode: .${mode(args)},`,
    '    onConfirmed: { _ in },',
    '    onCancelled: { }',
    ')',
  ].join('\n');
}

export const buildCalendarInputSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const CALENDAR_INPUT_PLATFORMS = MOBILE_PLATFORMS;
