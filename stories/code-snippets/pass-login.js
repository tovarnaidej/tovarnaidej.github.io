import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

export function buildFlutterSnippet() {
  return [
    'SIPassLogin(',
    '  onLoginPressed: () {},',
    '  onReadMorePressed: null,',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet() {
  return [
    'SIPassLogin(context).apply {',
    '    onLoginClick = { }',
    '    onReadMoreClick = null',
    '}',
  ].join('\n');
}

export function buildIosSnippet() {
  return [
    'SIPassLogin(',
    '    onLoginPressed: { },',
    '    onReadMorePressed: nil',
    ')',
  ].join('\n');
}

export const buildPassLoginSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const PASS_LOGIN_PLATFORMS = MOBILE_PLATFORMS;
