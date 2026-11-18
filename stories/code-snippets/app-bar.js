import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

/**
 * SIAppBar — Flutter app_bar/si_app_bar.dart, Android appbar/SIAppBar.kt,
 * iOS SwiftUI AppBar/SIAppBar.swift. Actions mirror the catalog configurator:
 * "single" = profile avatar, "multiple" = paperclip / calendar / more.
 */
const ACTIONS = {
  single: [{ icon: 'avatar', label: 'Profil', android: 'ic_si_appbar_avatar', ios: 'TokenAppBar.profileIconName', profile: true }],
  multiple: [
    { icon: 'paperclip', label: 'Priloži datoteko', android: 'ic_si_appbar_attachment', ios: 'TokenAppBar.attachmentIconName' },
    { icon: 'calendar', label: 'Izberi datum', android: 'ic_si_appbar_calendar', ios: 'TokenAppBar.calendarIconName' },
    { icon: 'more-vert', label: 'Več možnosti', android: 'ic_si_appbar_more', ios: 'TokenAppBar.moreIconName' },
  ],
  none: [],
};

const resolve = (args = {}) => ({
  configuration: args.configuration || 'small',
  style: args.style || 'light',
  title: args.title ?? 'Title',
  hideBack: args.leading === 'none',
  customLeading: args.leading === 'custom',
  actions: ACTIONS[args.actions || 'single'] || [],
});

export function buildFlutterSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIAppBar(',
    `  configuration: SIAppBarConfiguration.${r.configuration},`,
    `  style: SIAppBarStyle.${r.style},`,
    `  title: '${escapeJsString(r.title)}',`,
  ];
  if (r.hideBack) lines.push('  hideDefaultBackButton: true,');
  if (r.customLeading) {
    lines.push(
      '  leading: SIIconButton(',
      '    icon: const SIIcon(',
      "        path: 'icons/alert.svg',",
      "        package: 'si_component_library',",
      '    ),',
      '    onTap: () {},',
      '  ),',
    );
  }
  if (r.actions.length) {
    lines.push('  actions: [');
    r.actions.forEach((a) => {
      lines.push(
        '    SIIconButton(',
        '      icon: const SIIcon(',
        `        path: 'icons/${a.icon}.svg',`,
        "        package: 'si_component_library',",
      );
      if (a.profile) {
        lines.push('        size: Size(TokenAppBarV2.profileIconSize, TokenAppBarV2.profileIconSize),');
      }
      lines.push('      ),', '      onTap: () {},', '    ),');
    });
    lines.push('  ],');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIAppBar(context).apply {',
    `    configuration = SIAppBarConfiguration.${r.configuration.toUpperCase()}`,
    `    style = SIAppBarStyle.${r.style.toUpperCase()}`,
    `    title = "${escapeDoubleQuoted(r.title)}"`,
  ];
  if (r.hideBack) lines.push('    hideDefaultBackButton = true');
  if (r.customLeading) lines.push('    leadingIconResId = R.drawable.ic_si_alert', '    onLeadingClick = { }');
  if (r.actions.length) {
    lines.push(`    trailingIconResIds = listOf(${r.actions.map((a) => `R.drawable.${a.android}`).join(', ')})`);
    lines.push(`    trailingIconContentDescriptions = listOf(${r.actions.map((a) => `"${a.label}"`).join(', ')})`);
    lines.push('    onTrailingClick = { index -> }');
  }
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const r = resolve(args);
  const params = [
    `    title: "${escapeDoubleQuoted(r.title)}"`,
    `    configuration: .${r.configuration}`,
    `    style: .${r.style}`,
  ];
  if (r.hideBack) params.push('    showsLeadingButton: false');
  if (r.customLeading) params.push('    leadingIconName: "alert"', '    leadingAction: { }');
  if (r.actions.length) {
    const items = r.actions.map(
      (a) => `        .init(iconName: ${a.ios}, accessibilityLabel: "${a.label}") { }`,
    );
    params.push(`    trailingActions: [\n${items.join(',\n')}\n    ]`);
  }
  return ['SIAppBar(', params.join(',\n'), ')'].join('\n');
}

export const buildAppBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const APP_BAR_PLATFORMS = MOBILE_PLATFORMS;
