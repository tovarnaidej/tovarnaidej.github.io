/**
 * Args-driven insert snippets for mobile SIButton.
 * Fields: label, variant, size, state, leadingIcon.
 */

const escapeJsString = (value) =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const escapeDoubleQuoted = (value) =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const buttonEnabled = (args) => args?.state !== 'disabled';

const buttonVariant = (args) => args?.variant || 'filled';

const buttonSize = (args) => args?.size || 'regular';

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
export function buildFlutterSnippet(args = {}) {
  const label = escapeJsString(args.label ?? 'Example Button');
  const type = buttonVariant(args);
  const size = buttonSize(args);
  const enabled = buttonEnabled(args);
  const lines = ['SIButton('];

  lines.push(`  label: '${label}',`);

  if (args.leadingIcon) {
    lines.push(
      '  icon: const SIIcon(',
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
  const label = escapeDoubleQuoted(args.label ?? 'Example Button');
  const style = androidStyle(buttonVariant(args));
  const enabled = buttonEnabled(args);
  const useCardAction = buttonSize(args) === 'small';
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
  const label = escapeDoubleQuoted(args.label ?? 'Example Button');
  const variant = buttonVariant(args);
  const size = buttonSize(args);
  const enabled = buttonEnabled(args);
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
 * @param {'android' | 'ios' | 'flutter'} platform
 * @param {Record<string, unknown>} args
 * @returns {string}
 */
export function buildButtonSnippet(platform, args) {
  switch (platform) {
    case 'ios':
      return buildIosSnippet(args);
    case 'flutter':
      return buildFlutterSnippet(args);
    case 'android':
    default:
      return buildAndroidSnippet(args);
  }
}

// Storybook SyntaxHighlighter ships only a few Prism langs (jsx, tsx,
// typescript, …). kotlin/swift/dart are unsupported and render as plain
// black text — map them to typescript for the same colored theme.
export const BUTTON_PLATFORMS = [
  { id: 'android', label: 'Android', language: 'typescript' },
  { id: 'ios', label: 'iOS', language: 'typescript' },
  { id: 'flutter', label: 'Flutter', language: 'typescript' },
];
