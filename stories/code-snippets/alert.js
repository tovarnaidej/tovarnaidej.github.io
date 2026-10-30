import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

export function buildFlutterSnippet(args = {}) {
  if (args?.mode === 'list') {
    const title = escapeJsString(args?.listTitle ?? 'List Item Title');
    const supporting = escapeJsString(
      args?.supportingText ?? 'Supporting text goes here',
    );
    const lines = [
      'SIListItem(',
      `  style: SIListItemStyle.${args?.listStyle || 'basic'},`,
      `  title: '${title}',`,
    ];
    if (args?.showSupporting !== false) {
      lines.push(`  supportingText: '${supporting}',`);
      lines.push(`  supportingLineLimit: ${args?.supportingLines || 2},`);
    }
    if (args?.showAvatar) {
      lines.push(
        "  avatar: SIAvatar(type: SIAvatarType.filled, initials: 'A', size: 25),",
      );
    }
    lines.push(`  showChevron: ${args?.showChevron !== false},`);
    lines.push('  onTap: () {},');
    lines.push(')');
    return lines.join('\n');
  }

  const title = escapeJsString(args?.title ?? 'Title');
  const message = escapeJsString(args?.message ?? 'Message');
  const style = args?.style || 'filled';
  const lines = [
    'SIAlert(',
    `  type: SIAlertType.${style === 'stroke' ? 'stroke' : 'filled'},`,
    `  title: '${title}',`,
    `  message: '${message}',`,
  ];
  if (args?.showIcon !== false) {
    lines.push(
      '  icon: const SIIcon(',
      "    path: 'icons/alert.svg',",
      "    package: 'si_component_library',",
      '  ),',
    );
  }
  if (args?.showDismiss !== false) {
    lines.push('  onDismiss: () {},');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  if (args?.mode === 'list') {
    const title = escapeDoubleQuoted(args?.listTitle ?? 'List Item Title');
    const style =
      args?.listStyle === 'basic'
        ? 'DEFAULT'
        : (args?.listStyle || 'basic').toUpperCase();
    return [
      'SIListItem(context).apply {',
      `    style = SIListItemStyle.${style}`,
      `    title = "${title}"`,
      `    showChevron = ${args?.showChevron !== false}`,
      '}',
    ].join('\n');
  }

  const title = escapeDoubleQuoted(args?.title ?? 'Title');
  const message = escapeDoubleQuoted(args?.message ?? 'Message');
  return [
    'SIAlert(context).apply {',
    `    type = SIAlertType.${(args?.style || 'filled').toUpperCase()}`,
    `    title = "${title}"`,
    `    message = "${message}"`,
    args?.showDismiss !== false ? '    onDismiss = { }' : null,
    '}',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildIosSnippet(args = {}) {
  if (args?.mode === 'list') {
    const title = escapeDoubleQuoted(args?.listTitle ?? 'List Item Title');
    return [
      'SIListItem(',
      `    title: "${title}",`,
      `    style: .${args?.listStyle || 'basic'},`,
      `    showChevron: ${args?.showChevron !== false}`,
      ')',
    ].join('\n');
  }

  const title = escapeDoubleQuoted(args?.title ?? 'Title');
  const message = escapeDoubleQuoted(args?.message ?? 'Message');
  return [
    'SIAlert(',
    `    title: "${title}",`,
    `    message: "${message}",`,
    `    style: .${args?.style || 'filled'}`,
    ')',
  ].join('\n');
}

export const buildAlertSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const ALERT_PLATFORMS = MOBILE_PLATFORMS;
