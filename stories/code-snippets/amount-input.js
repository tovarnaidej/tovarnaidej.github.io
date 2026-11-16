import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

/**
 * SIAmountInput — Flutter phone_amount/si_amount_input.dart, Android
 * phoneamount/SIAmountInput.kt, iOS SwiftUI PhoneAmount/SIAmountInput.swift.
 */
const resolve = (args = {}) => ({
  label: args.label ?? 'Znesek',
  style: args.style || 'outline',
  layout: args.layout || 'style1',
  code: args.currencyCode || 'NGN',
  value: args.value || '',
  enabled: args.enabled !== false,
  error: args.hasError ? args.errorText || 'Prišlo je do napake...' : '',
  helper: args.helperText || '',
});

export function buildAmountFlutter(args) {
  const r = resolve(args);
  const lines = [
    'SIAmountInput(',
    `  label: '${escapeJsString(r.label)}',`,
    `  style: SIInputStyle.${r.style},`,
    `  layout: SIPhoneAmountLayout.${r.layout},`,
    `  currencyCode: '${escapeJsString(r.code)}',`,
  ];
  if (r.value) lines.push(`  value: '${escapeJsString(r.value)}',`);
  if (!r.enabled) lines.push('  enabled: false,');
  if (r.error) lines.push(`  errorText: '${escapeJsString(r.error)}',`);
  if (r.helper) lines.push(`  helperText: '${escapeJsString(r.helper)}',`);
  lines.push('  onChanged: (value) {},', ')');
  return lines.join('\n');
}

export function buildAmountAndroid(args) {
  const r = resolve(args);
  const lines = [
    'SIAmountInput(context).apply {',
    `    label = "${escapeDoubleQuoted(r.label)}"`,
    `    style = SIInputStyle.${r.style.toUpperCase()}`,
    `    layout = SIPhoneAmountLayout.${r.layout.toUpperCase()}`,
    `    currencyCode = "${escapeDoubleQuoted(r.code)}"`,
  ];
  if (r.value) lines.push(`    value = "${escapeDoubleQuoted(r.value)}"`);
  if (!r.enabled) lines.push('    inputEnabled = false');
  if (r.error) lines.push(`    errorText = "${escapeDoubleQuoted(r.error)}"`);
  if (r.helper) lines.push(`    helperText = "${escapeDoubleQuoted(r.helper)}"`);
  lines.push('    onChanged = { value -> }', '}');
  return lines.join('\n');
}

export function buildAmountIos(args) {
  const r = resolve(args);
  const params = [
    '    text: $amount',
    `    label: "${escapeDoubleQuoted(r.label)}"`,
    `    style: .${r.style}`,
    `    layout: .${r.layout}`,
    `    currencyCode: "${escapeDoubleQuoted(r.code)}"`,
  ];
  if (!r.enabled) params.push('    enabled: false');
  if (r.error) params.push(`    errorText: "${escapeDoubleQuoted(r.error)}"`);
  if (r.helper) params.push(`    helperText: "${escapeDoubleQuoted(r.helper)}"`);
  return [
    `@State private var amount = "${escapeDoubleQuoted(r.value)}"`,
    '',
    'SIAmountInput(',
    params.join(',\n'),
    ')',
  ].join('\n');
}

export const buildAmountInputSnippet = makeSnippetBuilder({
  android: buildAmountAndroid,
  ios: buildAmountIos,
  flutter: buildAmountFlutter,
});

export const AMOUNT_INPUT_PLATFORMS = MOBILE_PLATFORMS;
