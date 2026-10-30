import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const variant = (args) => args?.variant || 'linear';
const thickness = (args) => args?.thickness || 'thin';
const loadingValue = (args) => {
  if (args?.indeterminate) return null;
  const raw = Number(args?.value);
  return Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0.5;
};

export function buildFlutterSnippet(args = {}) {
  const value = loadingValue(args);
  const lines = [
    'SILoadingBar(',
    `  variant: SILoadingBarVariant.${variant(args)},`,
  ];
  if (variant(args) === 'circular') {
    lines.push(`  thickness: SILoadingBarThickness.${thickness(args)},`);
  }
  lines.push(`  value: ${value === null ? 'null' : value},`);
  lines.push('  animate: true,');
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const value = loadingValue(args);
  const lines = [
    'SILoadingBar(context).apply {',
    `    variant = SILoadingBarVariant.${variant(args).toUpperCase()}`,
  ];
  if (variant(args) === 'circular') {
    lines.push(
      `    thickness = SILoadingBarThickness.${thickness(args).toUpperCase()}`,
    );
  }
  lines.push(`    value = ${value === null ? 'null' : `${value}f`}`);
  lines.push('    animated = true');
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const value = loadingValue(args);
  const lines = [
    'SILoadingBar(',
    `    variant: .${variant(args)},`,
    `    value: ${value === null ? 'nil' : value},`,
  ];
  if (variant(args) === 'circular') {
    lines.push(`    thickness: .${thickness(args)},`);
  }
  lines.push('    animate: true');
  lines.push(')');
  return lines.join('\n');
}

export const buildLoadingBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const LOADING_BAR_PLATFORMS = MOBILE_PLATFORMS;
