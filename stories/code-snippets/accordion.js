import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const accordionStyle = (args) => args?.style || 'defaultStyle';
const accordionTitle = (args) => args?.title ?? 'Accordion Title';

const androidStyle = (style) =>
  style === 'defaultStyle' ? 'DEFAULT' : style.toUpperCase();

export function buildFlutterSnippet(args = {}) {
  const title = escapeJsString(accordionTitle(args));
  return [
    'SIAccordion(',
    `  style: SIAccordionStyle.${accordionStyle(args)},`,
    `  title: '${title}',`,
    "  children: const ['Item 1', 'Item 2', 'Item 3'],",
    `  initiallyExpanded: ${Boolean(args?.initiallyExpanded)},`,
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const title = escapeDoubleQuoted(accordionTitle(args));
  return [
    'SIAccordion(context).apply {',
    `    style = SIAccordionStyle.${androidStyle(accordionStyle(args))}`,
    `    title = "${title}"`,
    '    items = listOf("Item 1", "Item 2", "Item 3")',
    `    isExpanded = ${Boolean(args?.initiallyExpanded)}`,
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  const title = escapeDoubleQuoted(accordionTitle(args));
  return [
    'SIAccordion(',
    `    title: "${title}",`,
    '    children: ["Item 1", "Item 2", "Item 3"],',
    `    style: .${accordionStyle(args)},`,
    `    initiallyExpanded: ${Boolean(args?.initiallyExpanded)}`,
    ')',
  ].join('\n');
}

export const buildAccordionSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const ACCORDION_PLATFORMS = MOBILE_PLATFORMS;
