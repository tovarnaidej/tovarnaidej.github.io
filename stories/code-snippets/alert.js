import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';
import {
  buildListItemAndroid,
  buildListItemFlutter,
  buildListItemIos,
} from './list-item.js';

/**
 * SIAlert — Flutter alert/si_alert.dart, Android alert/SIAlert.kt,
 * iOS SwiftUI Alert/SIAlert.swift. mode="list" → SIListItem (Opozorila catalog).
 */
const listArgs = (args = {}) => ({
  style: args.listStyle,
  title: args.listTitle,
  supportingText: args.showSupporting === false ? '' : args.supportingText,
  supportingLineLimit: args.supportingLines,
  showAvatar: args.showAvatar,
  avatarInitials: 'A',
  // Catalog reserves the chevron slot; "Puščica" off only hides the glyph.
  showChevron: true,
  chevronHidden: args.showChevron === false,
});

export function buildFlutterSnippet(args = {}) {
  if (args?.mode === 'list') return buildListItemFlutter(listArgs(args));

  const lines = [
    'SIAlert(',
    `  type: SIAlertType.${args?.style === 'stroke' ? 'stroke' : 'filled'},`,
    `  title: '${escapeJsString(args?.title ?? 'Title')}',`,
    `  message: '${escapeJsString(args?.message ?? 'Message')}',`,
  ];
  if (args?.showIcon !== false) {
    lines.push(
      '  icon: const SIIcon(',
      "    path: 'icons/alert.svg',",
      "    package: 'si_component_library',",
      '  ),',
    );
  }
  if (args?.showDismiss !== false) lines.push('  onDismiss: () {},');
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  if (args?.mode === 'list') return buildListItemAndroid(listArgs(args));

  const lines = [
    'SIAlert(context).apply {',
    `    type = SIAlertType.${(args?.style || 'filled').toUpperCase()}`,
    `    title = "${escapeDoubleQuoted(args?.title ?? 'Title')}"`,
    `    message = "${escapeDoubleQuoted(args?.message ?? 'Message')}"`,
  ];
  if (args?.showIcon !== false) lines.push('    iconResId = R.drawable.ic_si_alert');
  if (args?.showDismiss !== false) lines.push('    onDismiss = { }');
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  if (args?.mode === 'list') return buildListItemIos(listArgs(args));

  const params = [
    `    title: "${escapeDoubleQuoted(args?.title ?? 'Title')}"`,
    `    message: "${escapeDoubleQuoted(args?.message ?? 'Message')}"`,
  ];
  if (args?.showIcon !== false) params.push('    icon: "alert"');
  if (args?.showDismiss !== false) params.push('    onDismiss: { }');
  params.push(`    style: .${args?.style || 'filled'}`);
  return ['SIAlert(', params.join(',\n'), ')'].join('\n');
}

export const buildAlertSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const ALERT_PLATFORMS = MOBILE_PLATFORMS;
