import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'outlined';
const layout = (args) => args?.layout || 'standard';

export function buildFlutterSnippet(args = {}) {
  const lines = [
    'SICard(',
    `  style: SICardStyle.${style(args)},`,
    `  layout: SICardLayout.${layout(args)},`,
  ];
  if (args?.showHeader !== false) {
    lines.push(
      '  headerConfiguration: SICardHeaderConfiguration(',
      "    title: 'Naslov kartice',",
      "    subtitle: 'Podnaslov',",
      '  ),',
    );
  }
  if (args?.showMedia !== false) {
    lines.push('  mediaConfiguration: SICardMediaConfiguration(/* image */),');
  }
  if (layout(args) === 'standard' && args?.showContent !== false) {
    lines.push(
      '  contentConfiguration: SICardContentConfiguration(',
      "    headerText: 'Vsebina',",
      "    bodyText: 'Kratek opis kartice z osnovnimi podatki.',",
      '  ),',
    );
  }
  if (layout(args) === 'standard' && args?.showActions !== false) {
    lines.push('  actionsConfiguration: SICardActionsConfiguration(/* buttons */),');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  return [
    'SICard(context).apply {',
    `    style = SICardStyle.${style(args).toUpperCase()}`,
    `    cardLayout = SICardLayout.${layout(args).toUpperCase()}`,
    '    // headerConfiguration / mediaConfiguration / …',
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SICard(',
    `    style: .${style(args)},`,
    `    layout: .${layout(args)}`,
    '    // headerConfiguration / mediaConfiguration / …',
    ')',
  ].join('\n');
}

export const buildCardSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const CARD_PLATFORMS = MOBILE_PLATFORMS;
