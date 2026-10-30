import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'underline';
const configuration = (args) => args?.configuration || 'fixed';
const tabCount = (args) => Number(args?.tabCount) || 3;

const labels = (count) =>
  Array.from({ length: count }, (_, i) => `'Tab ${i + 1}'`).join(', ');

const labelsDouble = (count) =>
  Array.from({ length: count }, (_, i) => `"Tab ${i + 1}"`).join(', ');

export function buildFlutterSnippet(args = {}) {
  const count = tabCount(args);
  return [
    'SITabs(',
    `  labels: [${labels(count)}],`,
    '  selectedIndex: 0,',
    `  style: SITabsStyle.${style(args)},`,
    `  configuration: SITabsConfiguration.${configuration(args)},`,
    '  onTap: (i) {},',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const count = tabCount(args);
  return [
    'SITabs(context).apply {',
    `    style = SITabsStyle.${style(args).toUpperCase()}`,
    `    configuration = SITabsConfiguration.${configuration(args).toUpperCase()}`,
    `    setLabels(listOf(${labelsDouble(count)}))`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const count = tabCount(args);
  return [
    'SITabs(',
    `    labels: [${labelsDouble(count)}],`,
    '    selectedIndex: 0,',
    `    style: .${style(args)},`,
    `    configuration: .${configuration(args)}`,
    ')',
  ].join('\n');
}

export const buildTabsSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const TABS_PLATFORMS = MOBILE_PLATFORMS;
