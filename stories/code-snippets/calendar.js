import {
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const style = (args) => args?.style || 'outlined';

export function buildFlutterSnippet(args = {}) {
  return [
    'SIDatePicker(',
    '  initialDate: DateTime.now(),',
    `  style: SIDatePickerStyle.${style(args)},`,
    '  onDateSelected: (d) {},',
    ')',
  ].join('\n');
}

export function buildAndroidSnippet(args = {}) {
  return [
    'SIDatePickerView(context).apply {',
    '    initialDate = LocalDate.now()',
    `    style = SIDatePickerStyle.${style(args).toUpperCase()}`,
    '    onDateConfirmed = { }',
    '}',
  ].join('\n');
}

export function buildIosSnippet(args = {}) {
  return [
    'SIDatePicker(',
    '    date: Date(),',
    `    style: .${style(args)}`,
    ')',
  ].join('\n');
}

export const buildCalendarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const CALENDAR_PLATFORMS = MOBILE_PLATFORMS;
