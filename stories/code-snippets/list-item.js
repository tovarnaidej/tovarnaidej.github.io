import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

/**
 * SIListItem — Flutter si_list_item.dart, Android listitem/SIListItem.kt,
 * iOS SwiftUI ListItem/SIListItem.swift.
 * args: style, title, supportingText (empty = none), supportingLineLimit,
 *       showAvatar, avatarInitials, showChevron, chevronHidden
 */
const resolve = (args = {}) => ({
  style: args.style || 'basic',
  title: args.title ?? 'List Item Title',
  supporting: args.supportingText || '',
  lines: Number(args.supportingLineLimit) === 1 ? 1 : 2,
  avatar: args.showAvatar ? args.avatarInitials || 'A' : '',
  showChevron: args.showChevron !== false,
  chevronHidden: Boolean(args.chevronHidden),
});

export function buildListItemFlutter(args) {
  const a = resolve(args);
  const lines = [
    'SIListItem(',
    `  style: SIListItemStyle.${a.style},`,
    `  title: '${escapeJsString(a.title)}',`,
  ];
  if (a.supporting) {
    lines.push(`  supportingText: '${escapeJsString(a.supporting)}',`);
    if (a.lines !== 2) lines.push(`  supportingLineLimit: ${a.lines},`);
  }
  if (a.avatar) {
    lines.push(
      '  avatar: const SIAvatar(',
      '    type: SIAvatarType.filled,',
      `    initials: '${escapeJsString(a.avatar)}',`,
      '    size: 25,',
      '  ),',
    );
  }
  if (a.showChevron) lines.push('  showChevron: true,');
  if (a.chevronHidden) lines.push('  chevronHidden: true,');
  lines.push('  onTap: () {},', ')');
  return lines.join('\n');
}

export function buildListItemAndroid(args) {
  const a = resolve(args);
  const style = a.style === 'basic' ? 'DEFAULT' : a.style.toUpperCase();
  const lines = [
    'SIListItem(context).apply {',
    `    style = SIListItemStyle.${style}`,
    `    title = "${escapeDoubleQuoted(a.title)}"`,
  ];
  if (a.supporting) {
    lines.push(`    supportingText = "${escapeDoubleQuoted(a.supporting)}"`);
    if (a.lines !== 2) lines.push(`    supportingMaxLines = ${a.lines}`);
  }
  if (a.avatar) lines.push(`    avatarInitial = "${escapeDoubleQuoted(a.avatar)}"`);
  if (a.showChevron) lines.push('    showChevron = true');
  if (a.chevronHidden) lines.push('    chevronHidden = true');
  lines.push('    onTap = { }', '}');
  return lines.join('\n');
}

export function buildListItemIos(args) {
  const a = resolve(args);
  const params = [`    title: "${escapeDoubleQuoted(a.title)}"`];
  if (a.supporting) {
    params.push(`    supportingText: "${escapeDoubleQuoted(a.supporting)}"`);
    if (a.lines !== 2) params.push(`    supportingLineLimit: ${a.lines}`);
  }
  if (a.avatar) params.push(`    avatarInitials: "${escapeDoubleQuoted(a.avatar)}"`);
  if (a.showChevron) params.push('    showChevron: true');
  if (a.chevronHidden) params.push('    chevronHidden: true');
  params.push(`    style: .${a.style}`);
  return ['SIListItem(', params.join(',\n'), ') { }'].join('\n');
}

export const buildListItemSnippet = makeSnippetBuilder({
  android: buildListItemAndroid,
  ios: buildListItemIos,
  flutter: buildListItemFlutter,
});

export const LIST_ITEM_PLATFORMS = MOBILE_PLATFORMS;
