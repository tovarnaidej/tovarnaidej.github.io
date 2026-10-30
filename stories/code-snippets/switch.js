import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const value = (args) => Boolean(args?.value);
const enabled = (args) => args?.enabled !== false;
const label = (args) =>
  args?.showLabel === false ? null : (args?.label ?? 'Switch label');

export function buildFlutterSnippet(args = {}) {
  const text = label(args);
  return [
    'SISwitch(',
    `  value: ${value(args)},`,
    '  onChanged: (v) {},',
    `  label: ${text == null ? 'null' : `'${escapeJsString(text)}'`},`,
    `  enabled: ${enabled(args)},`,
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const text = label(args);
  return [
    'SISwitch(context).apply {',
    `    isOn = ${value(args)}`,
    `    isEnabled = ${enabled(args)}`,
    `    labelText = ${text == null ? 'null' : `"${escapeDoubleQuoted(text)}"`}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const text = label(args);
  return [
    'SISwitch(',
    `    label: ${text == null ? 'nil' : `"${escapeDoubleQuoted(text)}"`},`,
    '    isOn: $isOn,',
    `    isEnabled: ${enabled(args)}`,
    ')',
  ].join('\n');
}

export const buildSwitchSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const SWITCH_PLATFORMS = MOBILE_PLATFORMS;
