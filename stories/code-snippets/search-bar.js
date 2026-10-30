import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'defaultStyle';
const placeholder = (args) => args?.placeholder ?? 'Input search text';
const showResults = (args) => args?.resultsMode === 'shown' || args?.resultsMode === 'empty';

const androidStyle = (s) => (s === 'defaultStyle' ? 'DEFAULT' : s.toUpperCase());

export function buildFlutterSnippet(args = {}) {
  const ph = escapeJsString(placeholder(args));
  const lines = [
    'SISearchBar<String>(',
    `  style: SISearchBarStyle.${style(args)},`,
    `  placeholder: '${ph}',`,
  ];
  if (args?.showAvatar) {
    lines.push("  avatar: const SIAvatar(initials: 'SJ', size: TokenAvatarV2.size45),");
  }
  lines.push(`  showResults: ${showResults(args)},`);
  if (args?.resultsMode === 'shown') {
    lines.push("  results: const ['Ljubljana', 'Maribor', 'Celje'],");
  } else if (args?.resultsMode === 'empty') {
    lines.push('  results: const [],');
  }
  lines.push('  onChanged: (q) {},');
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const ph = escapeDoubleQuoted(placeholder(args));
  const lines = [
    'SISearchBar(context).apply {',
    `    style = SISearchBarStyle.${androidStyle(style(args))}`,
    `    placeholder = "${ph}"`,
    `    showResults = ${showResults(args)}`,
  ];
  if (args?.showAvatar) {
    lines.push('    avatarInitial = "SJ"');
  }
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const ph = escapeDoubleQuoted(placeholder(args));
  return [
    'SISearchBar(',
    `    placeholder: "${ph}",`,
    `    style: .${style(args)},`,
    `    showResults: ${showResults(args)}`,
    ')',
  ].join('\n');
}

export const buildSearchBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const SEARCH_BAR_PLATFORMS = MOBILE_PLATFORMS;
