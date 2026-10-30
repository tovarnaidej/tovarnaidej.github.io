import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const filterType = (args) => args?.type || 'category';
const filterStyle = (args) => {
  if (filterType(args) === 'category') {
    if (args?.categoryState === 'selected') return 'filled';
    return 'outlined';
  }
  return args?.style || 'outlined';
};
const filterEnabled = (args) =>
  !(filterType(args) === 'category' && args?.categoryState === 'disabled');
const filterLabel = (args) => {
  if (args?.label) return args.label;
  const map = {
    category: 'Kategorija',
    filters: 'Filtri',
    applied: 'Uporabljeno',
    sort: 'Razvrščanje',
  };
  return map[filterType(args)] || 'Filter';
};

export function buildFlutterSnippet(args = {}) {
  if (args?.previewAsBar) {
    const layout = args?.layout || 'singleRowScrollable';
    return [
      'SIFilterBar(',
      `  layout: SIFilterLayout.${layout},`,
      '  children: [',
      "    SIFilter(label: 'Kategorija', type: SIFilterType.category, style: SIFilterStyle.filled, onPressed: () {}),",
      "    SIFilter(label: 'Filtri', type: SIFilterType.filters, style: SIFilterStyle.outlined, badgeCount: 3, onPressed: () {}),",
      '  ],',
      ')',
    ].join('\n');
  }

  const type = filterType(args);
  const style = filterStyle(args);
  const label = escapeJsString(filterLabel(args));
  const lines = [
    'SIFilter(',
    `  label: '${label}',`,
    `  type: SIFilterType.${type},`,
    `  style: SIFilterStyle.${style},`,
  ];

  if (type === 'category' && args?.leadingIcon) {
    lines.push(
      '  leadingIcon: const SIIcon(',
      "    path: 'icons/filter-diamond.svg',",
      "    package: 'si_component_library',",
      '  ),',
    );
  }
  if (type === 'filters' && args?.showBadge) {
    lines.push('  badgeCount: 3,');
  }
  if (type === 'applied' && args?.showDismiss) {
    lines.push('  showDismiss: true,');
    lines.push('  onDismiss: () {},');
  }
  lines.push(`  enabled: ${filterEnabled(args)},`);
  lines.push('  onPressed: () {},');
  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  if (args?.previewAsBar) {
    const layout = (args?.layout || 'singleRowScrollable').toUpperCase();
    return [
      'SIFilterBar(context).apply {',
      `    layout = SIFilterLayout.${layout}`,
      '    // setFilters(listOf(...))',
      '}',
    ].join('\n');
  }

  const type = filterType(args).toUpperCase();
  const style = filterStyle(args).toUpperCase();
  const label = escapeDoubleQuoted(filterLabel(args));
  const lines = [
    'SIFilter(context).apply {',
    `    label = "${label}"`,
    `    type = SIFilterType.${type}`,
    `    style = SIFilterStyle.${style}`,
  ];

  if (filterType(args) === 'category' && args?.leadingIcon) {
    lines.push('    leadingIconResId = R.drawable.ic_si_filter_diamond');
  }
  if (filterType(args) === 'filters' && args?.showBadge) {
    lines.push('    badgeCount = 3');
  }
  if (filterType(args) === 'applied' && args?.showDismiss) {
    lines.push('    showDismiss = true');
    lines.push('    onDismiss = { }');
  }
  lines.push(`    isEnabled = ${filterEnabled(args)}`);
  lines.push('    onClick = { }');
  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  if (args?.previewAsBar) {
    const layout = args?.layout || 'singleRowScrollable';
    return [
      `SIFilterBar(layout: .${layout}) {`,
      '    // SIFilter chips…',
      '}',
    ].join('\n');
  }

  const type = filterType(args);
  const style = filterStyle(args);
  const label = escapeDoubleQuoted(filterLabel(args));
  const lines = [
    'SIFilter(',
    `    label: "${label}",`,
    `    type: .${type},`,
    `    style: .${style},`,
  ];

  if (type === 'category' && args?.leadingIcon) {
    lines.push('    leadingIconName: "filter-diamond",');
  }
  if (type === 'filters' && args?.showBadge) {
    lines.push('    badgeCount: 3,');
  }
  if (type === 'applied' && args?.showDismiss) {
    lines.push('    showDismiss: true,');
    lines.push('    onDismiss: { },');
  }
  lines.push(`    enabled: ${filterEnabled(args)},`);
  lines.push('    onPressed: { }');
  lines.push(')');
  return lines.join('\n');
}

export const buildFilterSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const FILTER_PLATFORMS = MOBILE_PLATFORMS;
