import {
  escapeDoubleQuoted,
  escapeJsString,
  makeSnippetBuilder,
  MOBILE_PLATFORMS,
} from './_shared.js';

const avatarType = (args) => args?.type || 'filled';
const avatarSize = (args) => Number(args?.size) || 45;
const avatarInitials = (args) => args?.initials ?? 'SJ';

const iosFillType = (type) => {
  if (type === 'outlined') return 'outline';
  if (type === 'photo') return 'color';
  return 'gradient';
};

export function buildFlutterSnippet(args = {}) {
  const type = avatarType(args);
  const size = avatarSize(args);
  const initials = escapeJsString(avatarInitials(args));
  const lines = ['SIAvatar('];

  lines.push(`  type: SIAvatarType.${type},`);
  lines.push(`  size: TokenAvatarV2.size${size},`);

  if (type === 'photo') {
    lines.push('  // image: AssetImage(...),');
  } else {
    lines.push(`  initials: '${initials}',`);
  }

  lines.push(')');
  return lines.join('\n');
}

export function buildAndroidSnippet(args = {}) {
  const type = avatarType(args).toUpperCase();
  const size = avatarSize(args);
  const initials = escapeDoubleQuoted(avatarInitials(args));
  const lines = [
    'SIAvatar(context).apply {',
    `    type = SIAvatarType.${type}`,
    `    sizeDp = ${size}f`,
  ];

  if (avatarType(args) !== 'photo') {
    lines.push(`    initials = "${initials}"`);
  } else {
    lines.push('    // imageResId = R.drawable.avatar_photo');
  }

  lines.push('}');
  return lines.join('\n');
}

export function buildIosSnippet(args = {}) {
  const type = avatarType(args);
  const size = avatarSize(args);
  const initials = escapeDoubleQuoted(avatarInitials(args));
  const iosType = type === 'photo' ? 'photo' : 'letters';
  const lines = [
    'SIAvatar(',
    `    type: .${iosType},`,
    `    fillType: .${iosFillType(type)},`,
  ];

  if (type !== 'photo') {
    lines.push(`    initials: "${initials}",`);
  } else {
    lines.push('    image: nil,');
  }

  lines.push(`    size: TokenAvatar.size${size}`);
  lines.push(')');
  return lines.join('\n');
}

export const buildAvatarSnippet = makeSnippetBuilder({
  android: buildAndroidSnippet,
  ios: buildIosSnippet,
  flutter: buildFlutterSnippet,
});

export const AVATAR_PLATFORMS = MOBILE_PLATFORMS;
