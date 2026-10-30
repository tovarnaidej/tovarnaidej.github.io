import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'outlined';
const heading = (args) => args?.heading ?? 'Sample Heading';
const message = (args) =>
  args?.message ?? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

export function buildFlutterSnippet(args = {}) {
  const lines = [
    'SIPopup(',
    `  style: SIPopupStyle.${style(args)},`,
    '  icon: const SIIcon(',
    "    path: 'icons/check-verified.svg',",
    "    package: 'si_component_library',",
    '  ),',
    `  heading: '${escapeJsString(heading(args))}',`,
    `  message: '${escapeJsString(message(args))}',`,
  ];
  if (args?.showAction !== false) {
    lines.push("  buttonLabel: 'Continue',");
    lines.push('  onButtonPressed: () {},');
  }
  lines.push('  onClose: () {},');
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const lines = [
    'SIPopup(context).apply {',
    `    style = SIPopupStyle.${style(args).toUpperCase()}`,
    `    heading = "${escapeDoubleQuoted(heading(args))}"`,
    `    message = "${escapeDoubleQuoted(message(args))}"`,
  ];
  if (args?.showAction !== false) {
    lines.push('    buttonLabel = "Continue"');
    lines.push('    onAction = { }');
  }
  lines.push('    onClose = { }');
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const lines = [
    'SIPopup(',
    `    heading: "${escapeDoubleQuoted(heading(args))}",`,
    `    message: "${escapeDoubleQuoted(message(args))}",`,
    `    style: .${style(args)},`,
  ];
  if (args?.showAction !== false) {
    lines.push('    buttonLabel: "Continue",');
    lines.push('    onButtonPressed: { },');
  }
  lines.push('    onClose: { }');
  lines.push(')');
  return lines.join('\n');
}

export const buildPopupSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const POPUP_PLATFORMS = MOBILE_PLATFORMS;
