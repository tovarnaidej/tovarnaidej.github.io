import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

/**
 * SIProgressBar — Flutter progress_bar/si_progress_bar.dart, Android
 * progressbar/SIProgressBar.kt, iOS SwiftUI ProgressBar/SIProgressBar.swift.
 * Texts follow the catalog configurator ("Korak X od N", …).
 */
const stepsHeading = (n) => {
  const r = n % 100;
  if (r === 1) return `${n} korak`;
  if (r === 2) return `${n} koraka`;
  if (r === 3 || r === 4) return `${n} koraki`;
  return `${n} korakov`;
};

const resolve = (args = {}) => {
  const variant = args.variant || 'segmented';
  const vertical = variant === 'stepped' && args.orientation === 'vertical';
  const total = Number(args.totalSteps) || 6;
  const current = Number(args.currentStep) || 1;
  const texts = args.showText !== false && variant !== 'segmented';
  const rawValue = Number(args.value);
  const value =
    variant === 'linear' && texts
      ? current / total
      : Number.isFinite(rawValue)
        ? Math.min(1, Math.max(0, rawValue))
        : 0.5;
  return {
    variant,
    vertical,
    total,
    current,
    value: Math.round(value * 100) / 100,
    label: texts ? (vertical ? stepsHeading(total) : `Korak ${current} od ${total}`) : '',
    supporting:
      texts && variant === 'linear'
        ? current >= total
          ? 'Vsi koraki so zaključeni'
          : `Trenutno: Korak ${current}`
        : '',
    stepLabels:
      texts && vertical
        ? Array.from({ length: total }, (_, i) => (i + 1 === current ? 'Trenutni korak' : `Korak ${i + 1}`))
        : null,
  };
};

export function buildFlutterSnippet(args = {}) {
  const r = resolve(args);
  const lines = ['SIProgressBar(', `  variant: SIProgressBarVariant.${r.variant},`];
  if (r.vertical) lines.push('  orientation: SIProgressBarOrientation.vertical,');
  if (r.variant === 'linear') lines.push(`  value: ${r.value},`);
  if (r.variant !== 'linear' || r.label) {
    lines.push(`  currentStep: ${r.current},`, `  totalSteps: ${r.total},`);
  }
  if (r.label) lines.push(`  label: '${escapeJsString(r.label)}',`);
  if (r.supporting) lines.push(`  supportingText: '${escapeJsString(r.supporting)}',`);
  if (r.stepLabels) {
    lines.push('  stepLabels: [');
    r.stepLabels.forEach((l) => lines.push(`    '${escapeJsString(l)}',`));
    lines.push('  ],');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIProgressBar(context).apply {',
    `    variant = SIProgressBarVariant.${r.variant.toUpperCase()}`,
  ];
  if (r.vertical) lines.push('    orientation = SIProgressBarOrientation.VERTICAL');
  if (r.variant === 'linear') lines.push(`    value = ${r.value}f`);
  if (r.variant !== 'linear' || r.label) {
    lines.push(`    currentStep = ${r.current}`, `    totalSteps = ${r.total}`);
  }
  if (r.label) lines.push(`    label = "${escapeDoubleQuoted(r.label)}"`);
  if (r.supporting) lines.push(`    supportingText = "${escapeDoubleQuoted(r.supporting)}"`);
  if (r.stepLabels) {
    lines.push(`    stepLabels = listOf(${r.stepLabels.map((l) => `"${escapeDoubleQuoted(l)}"`).join(', ')})`);
  }
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const r = resolve(args);
  const params = [`    variant: .${r.variant}`];
  if (r.vertical) params.push('    orientation: .vertical');
  if (r.variant === 'linear') params.push(`    value: ${r.value}`);
  if (r.variant !== 'linear' || r.label) {
    params.push(`    currentStep: ${r.current}`, `    totalSteps: ${r.total}`);
  }
  if (r.label) params.push(`    label: "${escapeDoubleQuoted(r.label)}"`);
  if (r.supporting) params.push(`    supportingText: "${escapeDoubleQuoted(r.supporting)}"`);
  if (r.stepLabels) {
    params.push(`    stepLabels: [${r.stepLabels.map((l) => `"${escapeDoubleQuoted(l)}"`).join(', ')}]`);
  }
  return ['SIProgressBar(', params.join(',\n'), ')'].join('\n');
}

export const buildProgressBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const PROGRESS_BAR_PLATFORMS = MOBILE_PLATFORMS;
