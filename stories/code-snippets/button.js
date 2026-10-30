/**
 * Args-driven insert snippets for WebButton / mobile SIButton.
 * Mobile fields: mobileType, mobileSize; enabled follows state !== 'disabled'.
 */

const escapeJsString = (value) =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const escapeDoubleQuoted = (value) =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const mobileEnabled = (args) => args?.state !== 'disabled';

const mobileType = (args) => args?.mobileType || 'filled';

const mobileSize = (args) => args?.mobileSize || 'regular';

const androidStyle = (type) => {
  const map = {
    filled: 'FILLED',
    outline: 'OUTLINE',
    text: 'TEXT',
    elevated: 'ELEVATED',
  };
  return map[type] || 'FILLED';
};

/**
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
export function buildReactSnippet(args = {}) {
  const label = args.label ?? 'Nadaljuj';
  const hierarchy = args.hierarchy ?? 'primary';
  const size = args.size ?? 'medium';
  const leadingIcon = Boolean(args.leadingIcon);
  const trailingIcon = Boolean(args.trailingIcon);
  const fullWidth = Boolean(args.fullWidth);
  const lines = [
    '<WebButton',
    `  label="${escapeDoubleQuoted(label)}"`,
    `  hierarchy="${hierarchy}"`,
    `  size="${size}"`,
  ];

  if (args.state === 'disabled') {
    lines.push('  state="disabled"');
  }

  lines.push(
    `  leadingIcon={${leadingIcon}}`,
    `  trailingIcon={${trailingIcon}}`,
    `  fullWidth={${fullWidth}}`,
    '/>',
  );

  return lines.join('\n');
}

/**
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
export function buildFlutterSnippet(args = {}) {
  const label = escapeJsString(args.label ?? 'Nadaljuj');
  const type = mobileType(args);
  const size = mobileSize(args);
  const enabled = mobileEnabled(args);
  const lines = ['SIButton('];

  lines.push(`  label: '${label}',`);

  if (args.leadingIcon) {
    lines.push(
      "  icon: const SIIcon(",
      "    path: 'icons/plus.svg',",
      "    package: 'si_component_library',",
      '  ),',
    );
  }

  lines.push(
    `  type: SIButtonType.${type},`,
    `  size: SIButtonSize.${size},`,
    `  enabled: ${enabled},`,
    '  onPressed: () {},',
    ')',
  );

  return lines.join('\n');
}

/**
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
export function buildAndroidSnippet(args = {}) {
  const label = escapeDoubleQuoted(args.label ?? 'Nadaljuj');
  const style = androidStyle(mobileType(args));
  const enabled = mobileEnabled(args);
  const useCardAction = mobileSize(args) === 'small';
  const lines = [
    'SIButton(context).apply {',
    `    style = SIButtonStyle.${style}`,
    `    text = "${label}"`,
    `    isEnabled = ${enabled}`,
    `    useCardAction = ${useCardAction}`,
  ];

  if (args.leadingIcon) {
    lines.push(
      '    setLeadingIconResource(R.drawable.ic_si_button_add)',
    );
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
export function buildIosSnippet(args = {}) {
  const label = escapeDoubleQuoted(args.label ?? 'Nadaljuj');
  const variant = mobileType(args);
  const size = mobileSize(args);
  const enabled = mobileEnabled(args);
  const usesCompactHeight = size === 'small';
  const lines = [
    'SIButton(',
    `    title: "${label}",`,
    `    variant: .${variant},`,
    `    size: .${size},`,
  ];

  if (args.leadingIcon) {
    lines.push('    iconName: "plus",');
  }

  lines.push(
    `    isEnabled: ${enabled},`,
    `    usesCompactHeight: ${usesCompactHeight},`,
    '    action: { }',
    ')',
  );

  return lines.join('\n');
}

/**
 * @param {'react' | 'android' | 'ios' | 'flutter'} platform
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
export function buildButtonSnippet(platform, args) {
  switch (platform) {
    case 'android':
      return buildAndroidSnippet(args);
    case 'ios':
      return buildIosSnippet(args);
    case 'flutter':
      return buildFlutterSnippet(args);
    case 'react':
    default:
      return buildReactSnippet(args);
  }
}

// Storybook SyntaxHighlighter ships only a few Prism langs (jsx, tsx,
// typescript, …). kotlin/swift/dart are unsupported and render as plain
// black text — map them to typescript for the same colored theme.
export const BUTTON_PLATFORMS = [
  { id: 'react', label: 'React', language: 'jsx' },
  { id: 'android', label: 'Android', language: 'typescript' },
  { id: 'ios', label: 'iOS', language: 'typescript' },
  { id: 'flutter', label: 'Flutter', language: 'typescript' },
];
