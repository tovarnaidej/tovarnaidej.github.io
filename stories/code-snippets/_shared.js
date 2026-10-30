/**
 * Shared helpers for mobile Gradniki platform Koda snippets.
 */

export const escapeJsString = (value) =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export const escapeDoubleQuoted = (value) =>
  String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');

// Storybook Prism ships jsx/tsx/typescript/… but not kotlin/swift/dart.
export const MOBILE_PLATFORMS = [
  { id: 'android', label: 'Android', language: 'typescript' },
  { id: 'ios', label: 'iOS', language: 'typescript' },
  { id: 'flutter', label: 'Flutter', language: 'typescript' },
];

/**
 * @param {{ android: Function, ios: Function, flutter: Function }} builders
 */
export function makeSnippetBuilder(builders) {
  return (platform, args) => {
    switch (platform) {
      case 'ios':
        return builders.ios(args);
      case 'flutter':
        return builders.flutter(args);
      case 'android':
      default:
        return builders.android(args);
    }
  };
}
