import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const type = (args) => args?.type || 'fullWidth';
const label = (args) =>
  args?.showLabel ? (args?.label ?? 'Subheader') : null;

export function buildFlutterSnippet(args = {}) {
  const text = label(args);
  return [
    'SIDivider(',
    `  type: SIDividerType.${type(args)},`,
    `  label: ${text == null ? 'null' : `'${escapeJsString(text)}'`},`,
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const text = label(args);
  return [
    'SIDivider(context).apply {',
    `    type = SIDividerType.${type(args) === 'fullWidth' ? 'FULL_WIDTH' : 'INSET'}`,
    `    label = ${text == null ? 'null' : `"${escapeDoubleQuoted(text)}"`}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const text = label(args);
  return [
    'SIDivider(',
    `    type: .${type(args)},`,
    `    label: ${text == null ? 'nil' : `"${escapeDoubleQuoted(text)}"`}`,
    ')',
  ].join('\n');
}

export const buildDividerSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const DIVIDER_PLATFORMS = MOBILE_PLATFORMS;
