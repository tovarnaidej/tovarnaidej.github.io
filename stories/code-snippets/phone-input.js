import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const enabled = (args) => args?.enabled !== false;
const countryCode = (args) => args?.countryCode || '+386';
const errorText = (args) =>
  args?.hasError ? 'Prišlo je do napake.' : null;

export function buildFlutterSnippet(args = {}) {
  const err = errorText(args);
  return [
    'SIPhoneInput(',
    "  label: 'Telefonska številka',",
    `  countryCode: '${escapeJsString(countryCode(args))}',`,
    `  enabled: ${enabled(args)},`,
    `  errorText: ${err == null ? 'null' : `'${escapeJsString(err)}'`},`,
    '  onCountryChanged: (c) {},',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const err = errorText(args);
  return [
    'SIPhoneInput(context).apply {',
    '    label = "Telefonska številka"',
    `    countryCode = "${escapeDoubleQuoted(countryCode(args))}"`,
    `    inputEnabled = ${enabled(args)}`,
    `    errorText = ${err == null ? 'null' : `"${escapeDoubleQuoted(err)}"`}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SIPhoneInput(',
    '    label: "Telefonska številka",',
    `    countryCode: "${escapeDoubleQuoted(countryCode(args))}"`,
    ')',
  ].join('\n');
}

export const buildPhoneInputSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const PHONE_INPUT_PLATFORMS = MOBILE_PLATFORMS;
