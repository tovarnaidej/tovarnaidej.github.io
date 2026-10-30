import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'outline';
const enabled = (args) => args?.enabled !== false;
const label = (args) => args?.label ?? 'Oznaka';
const placeholder = (args) => args?.placeholder ?? 'Nadomestno besedilo';
const errorText = (args) => (args?.hasError ? 'Besedilo napake' : null);

export function buildFlutterSnippet(args = {}) {
  const err = errorText(args);
  const lines = [
    'SIInput(',
    `  label: '${escapeJsString(label(args))}',`,
    `  style: SIInputStyle.${style(args)},`,
    `  placeholder: '${escapeJsString(placeholder(args))}',`,
    `  enabled: ${enabled(args)},`,
    `  obscure: ${Boolean(args?.obscure)},`,
    `  errorText: ${err == null ? 'null' : `'${escapeJsString(err)}'`},`,
  ];
  if (args?.showIcon) {
    lines.push('  trailing: /* Icon */,');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const err = errorText(args);
  return [
    'SIInput(context).apply {',
    `    labelText = "${escapeDoubleQuoted(label(args))}"`,
    `    style = SIInputStyle.${style(args).toUpperCase()}`,
    `    placeholder = "${escapeDoubleQuoted(placeholder(args))}"`,
    `    inputEnabled = ${enabled(args)}`,
    `    errorText = ${err == null ? 'null' : `"${escapeDoubleQuoted(err)}"`}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SIInput(',
    `    label: "${escapeDoubleQuoted(label(args))}",`,
    `    placeholder: "${escapeDoubleQuoted(placeholder(args))}",`,
    `    style: .${style(args)}`,
    ')',
  ].join('\n');
}

export const buildInputSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const INPUT_PLATFORMS = MOBILE_PLATFORMS;
