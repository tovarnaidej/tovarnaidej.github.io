import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const enabled = (args) => args?.enabled !== false;
const hasError = (args) => Boolean(args?.hasError);
const label = (args) => args?.label1 ?? 'Option 1';

export function buildFlutterSnippet(args = {}) {
  const text = escapeJsString(label(args));
  return [
    'SIRadioButton<int>(',
    '  value: 0,',
    '  groupValue: 0,',
    '  onChanged: (v) {},',
    `  label: ${args?.showLabels === false ? 'null' : `'${text}'`},`,
    `  enabled: ${enabled(args)},`,
    `  hasError: ${hasError(args)},`,
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const text = escapeDoubleQuoted(label(args));
  const lines = [
    'SIRadioButton(context).apply {',
    `    isEnabled = ${enabled(args)}`,
    `    hasError = ${hasError(args)}`,
    '    isRadioSelected = true',
  ];
  if (args?.showLabels !== false) {
    lines.push(`    labelText = "${text}"`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const text = escapeDoubleQuoted(label(args));
  return [
    'SIRadioButton(',
    '    value: "0",',
    '    groupValue: "0",',
    `    label: ${args?.showLabels === false ? 'nil' : `"${text}"`},`,
    `    isEnabled: ${enabled(args)},`,
    `    hasError: ${hasError(args)}`,
    ')',
  ].join('\n');
}

export const buildRadioSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const RADIO_PLATFORMS = MOBILE_PLATFORMS;
