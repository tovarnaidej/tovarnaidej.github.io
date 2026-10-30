import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const variant = (args) => args?.variant || 'segmented';
const value = (args) => {
  const raw = Number(args?.value);
  return Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 0.5;
};
const currentStep = (args) => Number(args?.currentStep) || 1;
const totalSteps = (args) => Number(args?.totalSteps) || 6;

export function buildFlutterSnippet(args = {}) {
  return [
    'SIProgressBar(',
    `  variant: SIProgressBarVariant.${variant(args)},`,
    `  value: ${value(args)},`,
    `  currentStep: ${currentStep(args)},`,
    `  totalSteps: ${totalSteps(args)},`,
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  return [
    'SIProgressBar(context).apply {',
    `    variant = SIProgressBarVariant.${variant(args).toUpperCase()}`,
    `    value = ${value(args)}f`,
    `    currentStep = ${currentStep(args)}`,
    `    totalSteps = ${totalSteps(args)}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SIProgressBar(',
    `    variant: .${variant(args)},`,
    `    value: ${value(args)},`,
    `    currentStep: ${currentStep(args)},`,
    `    totalSteps: ${totalSteps(args)}`,
    ')',
  ].join('\n');
}

export const buildProgressBarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const PROGRESS_BAR_PLATFORMS = MOBILE_PLATFORMS;
