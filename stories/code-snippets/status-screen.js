import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const SCENARIOS = {
  update: {
    icon: 'update',
    tone: 'primary',
    title: 'Posodobite aplikacijo',
    description:
      'Za nadaljnjo uporabo potrebujete najnovejšo različico aplikacije. Posodobitev vključuje pomembne varnostne izboljšave in popravke.',
    meta: 'Trenutna različica 2.4.1 · zahtevana 2.5.0',
    primary: 'Posodobi aplikacijo',
    secondary: 'Pomoč pri posodobitvi',
  },
  offline: {
    icon: 'wifi-slash',
    tone: 'primary',
    title: 'Ni internetne povezave',
    description:
      'Za preverjanje in namestitev posodobitve se povežite z internetom. Ko bo povezava vzpostavljena, poskusite znova.',
    meta: 'Povezava je potrebna za nadaljevanje',
    primary: 'Poskusi znova',
    secondary: 'Pomoč pri posodobitvi',
  },
  unsupported: {
    icon: 'warning',
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
  const presentation = args.presentation || 'fullScreen';
  return {
    presentation,
    tone: preset.tone,
    icon: preset.icon,
    title: args.title || preset.title,
    description: args.description || preset.description,
    meta: args.meta || preset.meta,
    primary: args.primaryLabel || preset.primary,
    secondary: args.secondaryLabel || preset.secondary,
    close: presentation === 'popup' && args.showClose !== false,
  };
};

const FLUTTER_ICON = {
  update: 'TokenStatusScreenV2.updateIconPath',
  'wifi-slash': 'TokenStatusScreenV2.wifiSlashIconPath',
  warning: 'TokenStatusScreenV2.warningIconPath',
};
const IOS_ICON = {
  update: 'TokenStatusScreen.updateIconName',
  'wifi-slash': 'TokenStatusScreen.wifiSlashIconName',
  warning: 'TokenStatusScreen.warningIconName',
};

export function buildFlutterSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIStatusScreen(',
    `  presentation: SIStatusScreenPresentation.${r.presentation},`,
    `  tone: SIStatusScreenTone.${r.tone},`,
    `  iconPath: ${FLUTTER_ICON[r.icon]},`,
    `  title: '${escapeJsString(r.title)}',`,
    `  description: '${escapeJsString(r.description)}',`,
  ];
  if (r.meta) lines.push(`  meta: '${escapeJsString(r.meta)}',`);
  lines.push(`  primaryLabel: '${escapeJsString(r.primary)}',`, '  onPrimaryPressed: () {},');
  if (r.secondary) {
    lines.push(`  secondaryLabel: '${escapeJsString(r.secondary)}',`, '  onSecondaryPressed: () {},');
  }
  if (r.close) lines.push('  onClose: () {},');
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const r = resolve(args);
  const lines = [
    'SIStatusScreen(context).apply {',
    `    presentation = SIStatusScreenPresentation.${r.presentation === 'fullScreen' ? 'FULL_SCREEN' : 'POPUP'}`,
    `    illustrationTone = SIStatusScreenTone.${r.tone.toUpperCase()}`,
    `    iconResId = R.drawable.ic_si_status_${r.icon.replace('-', '_')}`,
    `    title = "${escapeDoubleQuoted(r.title)}"`,
    `    description = "${escapeDoubleQuoted(r.description)}"`,
  ];
  if (r.meta) lines.push(`    meta = "${escapeDoubleQuoted(r.meta)}"`);
  lines.push(`    primaryLabel = "${escapeDoubleQuoted(r.primary)}"`, '    onPrimary = { }');
  if (r.secondary) {
    lines.push(`    secondaryLabel = "${escapeDoubleQuoted(r.secondary)}"`, '    onSecondary = { }');
  }
  if (r.close) lines.push('    onClose = { }');
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const r = resolve(args);
  const params = [
    `    presentation: .${r.presentation}`,
    `    tone: .${r.tone}`,
    `    iconName: ${IOS_ICON[r.icon]}`,
    `    title: "${escapeDoubleQuoted(r.title)}"`,
    `    description: "${escapeDoubleQuoted(r.description)}"`,
  ];
  if (r.meta) params.push(`    meta: "${escapeDoubleQuoted(r.meta)}"`);
  params.push(`    primaryLabel: "${escapeDoubleQuoted(r.primary)}"`);
  if (r.secondary) params.push(`    secondaryLabel: "${escapeDoubleQuoted(r.secondary)}"`);
  params.push('    onPrimaryPressed: { }');
  if (r.secondary) params.push('    onSecondaryPressed: { }');
  if (r.close) params.push('    onClose: { }');
  return ['SIStatusScreen(', params.join(',\n'), ')'].join('\n');
}

export const STATUS_SCREEN_PLATFORMS = MOBILE_PLATFORMS;

export const buildStatusScreenSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});
