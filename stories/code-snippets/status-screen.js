import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const SCENARIOS = {
  update: {
    tone: 'primary',
    title: 'Posodobite aplikacijo',
    description:
      'Za nadaljnjo uporabo potrebujete najnovejšo različico aplikacije. Posodobitev vključuje pomembne varnostne izboljšave in popravke.',
    meta: 'Trenutna različica 2.4.1 · zahtevana 2.5.0',
    primary: 'Posodobi aplikacijo',
    secondary: 'Pomoč pri posodobitvi',
  },
  offline: {
    tone: 'primary',
    title: 'Ni internetne povezave',
    description:
      'Za preverjanje in namestitev posodobitve se povežite z internetom. Ko bo povezava vzpostavljena, poskusite znova.',
    meta: 'Povezava je potrebna za nadaljevanje',
    primary: 'Poskusi znova',
    secondary: 'Pomoč pri posodobitvi',
  },
  unsupported: {
    tone: 'error',
    title: 'Naprava ni več podprta',
    description:
      'Ta različica aplikacije zahteva novejši operacijski sistem. Posodobite napravo ali se obrnite na podporo.',
    meta: 'Najnižja podprta različica: iOS 17 / Android 12',
    primary: 'Pomoč pri posodobitvi',
    secondary: '',
  },
};

const resolve = (args = {}) => {
  const preset = SCENARIOS[args.scenario] || SCENARIOS.update;
  return {
    presentation: args.presentation || 'fullScreen',
    tone: preset.tone,
    title: args.title || preset.title,
    description: args.description || preset.description,
    meta: args.meta || preset.meta,
    primary: args.primaryLabel || preset.primary,
    secondary: args.secondaryLabel || preset.secondary,
  };
};

export function buildFlutterSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIStatusScreen(',
    `  presentation: SIStatusScreenPresentation.${r.presentation},`,
    `  tone: SIStatusScreenTone.${r.tone},`,
    `  title: '${escapeJsString(r.title)}',`,
    `  description: '${escapeJsString(r.description)}',`,
  ];
  if (r.meta) {
    lines.push(`  meta: '${escapeJsString(r.meta)}',`);
  }
  lines.push(`  primaryLabel: '${escapeJsString(r.primary)}',`);
  lines.push('  onPrimaryPressed: () {},');
  if (r.secondary) {
    lines.push(`  secondaryLabel: '${escapeJsString(r.secondary)}',`);
    lines.push('  onSecondaryPressed: () {},');
  }
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const r = resolve(args);
  const presentation =
    r.presentation === 'fullScreen' ? 'FULL_SCREEN' : 'POPUP';
  return [
    'SIStatusScreen(context).apply {',
    `    presentation = SIStatusScreenPresentation.${presentation}`,
    `    illustrationTone = SIStatusScreenTone.${r.tone.toUpperCase()}`,
    `    title = "${escapeDoubleQuoted(r.title)}"`,
    `    description = "${escapeDoubleQuoted(r.description)}"`,
    `    primaryLabel = "${escapeDoubleQuoted(r.primary)}"`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const r = resolve(args);
  return [
    'SIStatusScreen(',
    `    presentation: .${r.presentation},`,
    `    tone: .${r.tone},`,
    `    title: "${escapeDoubleQuoted(r.title)}",`,
    `    description: "${escapeDoubleQuoted(r.description)}",`,
    `    primaryLabel: "${escapeDoubleQuoted(r.primary)}"`,
    ')',
  ].join('\n');
}

export const buildStatusScreenSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
  platforms: MOBILE_PLATFORMS,
});
