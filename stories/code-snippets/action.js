import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'elevated';
const message = (args) => args?.message ?? 'This is a notification';
const maxLinesValue = (args) => {
  if (args?.maxLines === 'one') return 1;
  if (args?.maxLines === 'unlimited') return null;
  return 2;
};

export function buildFlutterSnippet(args = {}) {
  const msg = escapeJsString(message(args));
  const max = maxLinesValue(args);
  const lines = [
    'SIAction(',
    `  style: SIActionStyle.${style(args)},`,
    `  maxLines: ${max === null ? 'null' : max},`,
    `  message: '${msg}',`,
  ];
  if (args?.showAction !== false) {
    lines.push("  actionLabel: 'Undo',");
    lines.push('  onAction: () {},');
  }
  if (args?.showDismiss !== false) {
    lines.push('  onDismiss: () {},');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const msg = escapeDoubleQuoted(message(args));
  const max = maxLinesValue(args);
  const lines = [
    'SIAction(context).apply {',
    `    style = SIActionStyle.${style(args).toUpperCase()}`,
    `    maxLines = ${max === null ? 'null' : max}`,
    `    message = "${msg}"`,
  ];
  if (args?.showAction !== false) {
    lines.push('    actionLabel = "Undo"');
    lines.push('    onAction = { }');
  }
  if (args?.showDismiss !== false) {
    lines.push('    onDismiss = { }');
  }
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const msg = escapeDoubleQuoted(message(args));
  const max = args?.maxLines || 'two';
  const lines = [
    'SIAction(',
    `    message: "${msg}",`,
    `    style: .${style(args)},`,
  ];
  if (args?.showAction !== false) {
    lines.push('    actionLabel: "Undo",');
    lines.push('    onAction: { },');
  }
  if (args?.showDismiss !== false) {
    lines.push('    onDismiss: { },');
  }
  lines.push(`    maxLines: .${max}`);
  lines.push(')');
  return lines.join('\n');
}

export const buildActionSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const ACTION_PLATFORMS = MOBILE_PLATFORMS;
