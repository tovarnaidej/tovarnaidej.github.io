import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const configuration = (args) => args?.configuration || 'small';
const style = (args) => args?.style || 'light';
const title = (args) => args?.title ?? 'Page Title';

export function buildFlutterSnippet(args = {}) {
  const t = escapeJsString(title(args));
  const lines = [
    'SIAppBar(',
    `  configuration: SIAppBarConfiguration.${configuration(args)},`,
    `  style: SIAppBarStyle.${style(args)},`,
    `  title: '${t}',`,
  ];
  if (args?.leading === 'none') {
    lines.push('  hideDefaultBackButton: true,');
  } else if (args?.leading === 'custom') {
    lines.push('  leading: /* SIIconButton(...) */,');
  }
  if (args?.actions === 'none') {
    lines.push('  actions: null,');
  } else {
    lines.push('  actions: [/* SIIconButton... */],');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const t = escapeDoubleQuoted(title(args));
  const config =
    configuration(args) === 'small'
      ? 'SMALL_CENTERED'
      : configuration(args).toUpperCase();
  return [
    'SIAppBar(context).apply {',
    `    configuration = SIAppBarConfiguration.${config}`,
    `    style = SIAppBarStyle.${style(args).toUpperCase()}`,
    `    title = "${t}"`,
    `    hideDefaultBackButton = ${args?.leading === 'none'}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const t = escapeDoubleQuoted(title(args));
  const config =
    configuration(args) === 'small' ? 'smallCentered' : configuration(args);
  return [
    'SIAppBar(',
    `    title: "${t}",`,
    `    configuration: .${config},`,
    `    style: .${style(args)},`,
    `    showsLeadingButton: ${args?.leading !== 'none'}`,
    ')',
  ].join('\n');
}

export const buildAppBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const APP_BAR_PLATFORMS = MOBILE_PLATFORMS;
