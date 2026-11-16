import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

/**
 * SIInput — Flutter input/si_input.dart, Android input/SIInput.kt,
 * iOS SwiftUI Input/SIInput.swift. Mirrors the catalog configurator.
 */
const resolve = (args = {}) => {
  const platform = args.platform || 'ios';
  return {
    style: args.style || 'outline',
    position: args.labelPosition || (platform === 'ios' ? 'above' : 'floating'),
    enabled: args.enabled !== false,
    label: args.label ?? 'Oznaka',
    value: args.value ?? '',
    error: args.hasError ? args.errorText || 'Besedilo napake' : null,
    icon: Boolean(args.showIcon),
    obscure: Boolean(args.obscure),
  };
};

export function buildFlutterSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIInput(',
    `  label: '${escapeJsString(r.label)}',`,
    `  style: SIInputStyle.${r.style},`,
    `  labelPosition: SIInputLabelPosition.${r.position},`,
  ];
  if (r.value) lines.push(`  value: '${escapeJsString(r.value)}',`);
  if (!r.enabled) lines.push('  enabled: false,');
  if (r.obscure) lines.push('  obscure: true,');
  if (r.error) lines.push(`  errorText: '${escapeJsString(r.error)}',`);
  if (r.icon) {
    lines.push(
      '  trailing: const SIIcon(',
      "    path: 'icons/chevron-down.svg',",
      "    package: 'si_component_library',",
      '  ),',
      '  onTrailingPressed: () {},',
    );
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIInput(context).apply {',
    `    labelText = "${escapeDoubleQuoted(r.label)}"`,
    `    style = SIInputStyle.${r.style.toUpperCase()}`,
    `    labelPosition = SIInputLabelPosition.${r.position.toUpperCase()}`,
  ];
  if (r.value) lines.push(`    text = "${escapeDoubleQuoted(r.value)}"`);
  if (!r.enabled) lines.push('    inputEnabled = false');
  if (r.obscure) {
    lines.push('    inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD');
  }
  if (r.error) lines.push(`    errorText = "${escapeDoubleQuoted(r.error)}"`);
  if (r.icon) {
    lines.push('    trailingIconResId = R.drawable.ic_si_input_chevron_down', '    trailingIconAction = { }');
  }
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const r = resolve(args);
  const params = [
    '    text: $text',
    `    label: "${escapeDoubleQuoted(r.label)}"`,
    `    style: .${r.style}`,
    `    labelPosition: .${r.position}`,
  ];
  if (r.error) params.push(`    errorText: "${escapeDoubleQuoted(r.error)}"`);
  if (!r.enabled) params.push('    isEnabled: false');
  if (r.obscure) params.push('    isSecure: true');
  if (r.icon) params.push('    trailingIcon: "chevron-down"', '    onTrailingIconTap: { }');
  return [
    `@State private var text = "${escapeDoubleQuoted(r.value)}"`,
    '',
    'SIInput(',
    params.join(',\n'),
    ')',
  ].join('\n');
}

export const buildInputSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const INPUT_PLATFORMS = MOBILE_PLATFORMS;
