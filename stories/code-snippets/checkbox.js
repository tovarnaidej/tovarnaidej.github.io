import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const enabled = (args) => args?.enabled !== false;
const hasError = (args) => Boolean(args?.hasError);
const checked = (args) => Boolean(args?.checked);
const label = (args) =>
  args?.showLabel === false ? null : (args?.label ?? 'Checkbox label');

export function buildFlutterSnippet(args = {}) {
  const text = label(args);
  return [
    'SICheckbox(',
    `  value: ${checked(args)},`,
    '  onChanged: (v) {},',
    `  label: ${text == null ? 'null' : `'${escapeJsString(text)}'`},`,
    `  enabled: ${enabled(args)},`,
    `  hasError: ${hasError(args)},`,
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const text = label(args);
  return [
    'SICheckbox(context).apply {',
    `    isChecked = ${checked(args)}`,
    `    isEnabled = ${enabled(args)}`,
    `    hasError = ${hasError(args)}`,
    `    labelText = ${text == null ? 'null' : `"${escapeDoubleQuoted(text)}"`}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const text = label(args);
  return [
    'SICheckbox(',
    `    label: ${text == null ? 'nil' : `"${escapeDoubleQuoted(text)}"`},`,
    '    isChecked: $isChecked,',
    `    isEnabled: ${enabled(args)},`,
    `    hasError: ${hasError(args)}`,
    ')',
  ].join('\n');
}

export const buildCheckboxSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const CHECKBOX_PLATFORMS = MOBILE_PLATFORMS;
