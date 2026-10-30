import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const tabCount = (args) => Number(args?.tabCount) || 3;

const flutterItems = (count) =>
  Array.from({ length: count }, () =>
    "  SITabBarItem(icon: icon, label: 'Oznaka'),",
  ).join('\n');

export function buildFlutterSnippet(args = {}) {
  const count = tabCount(args);
  return [
    'SITabBar(',
    '  items: [',
    flutterItems(count),
    '  ],',
    '  selectedIndex: 0,',
    '  onTap: (i) {},',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  return [
    'SITabBar(context).apply {',
    `    // ${tabCount(args)} items with icon + label "Oznaka"`,
    '    setSelectedTab(0)',
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SITabBar(',
    `    items: [/* ${tabCount(args)} × SITabBarItem(icon:label:) */],`,
    '    selectedIndex: 0',
    ')',
  ].join('\n');
}

export const buildTabBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const TAB_BAR_PLATFORMS = MOBILE_PLATFORMS;
