import React, { useMemo, useState } from 'react';

import { AddonPanel, SyntaxHighlighter } from 'storybook/internal/components';
import {
  addons,
  types,
  useArgs,
  useAddonState,
  useParameter,
} from 'storybook/manager-api';

import {
  BUTTON_PLATFORMS,
  buildButtonSnippet,
} from '../../../stories/code-snippets/button.js';
import {
  AVATAR_PLATFORMS,
  buildAvatarSnippet,
} from '../../../stories/code-snippets/avatar.js';
import {
  RANGE_BAR_PLATFORMS,
  buildRangeBarSnippet,
} from '../../../stories/code-snippets/range-bar.js';
import {
  FILTER_PLATFORMS,
  buildFilterSnippet,
} from '../../../stories/code-snippets/filter.js';
import {
  ACCORDION_PLATFORMS,
  buildAccordionSnippet,
} from '../../../stories/code-snippets/accordion.js';
import {
  LOADING_BAR_PLATFORMS,
  buildLoadingBarSnippet,
} from '../../../stories/code-snippets/loading-bar.js';

const ADDON_ID = 'mslovenija/platform-code';
const PANEL_ID = `${ADDON_ID}/panel`;
const PARAM_KEY = 'platformCode';

const snippetBuilders = {
  button: buildButtonSnippet,
  avatar: buildAvatarSnippet,
  'range-bar': buildRangeBarSnippet,
  filter: buildFilterSnippet,
  accordion: buildAccordionSnippet,
  'loading-bar': buildLoadingBarSnippet,
};

const platformsByComponent = {
  button: BUTTON_PLATFORMS,
  avatar: AVATAR_PLATFORMS,
  'range-bar': RANGE_BAR_PLATFORMS,
  filter: FILTER_PLATFORMS,
  accordion: ACCORDION_PLATFORMS,
  'loading-bar': LOADING_BAR_PLATFORMS,
};

const emptyMessage =
  'Za to zgodbo ni generatorja kode. Odpri mobilni gradnik z konfiguratorjem (npr. Gradniki - mobile / Gumb).';

function PlatformCodePanel({ active }) {
  const [args] = useArgs();
  const platformCode = useParameter(PARAM_KEY, null);
  const component = platformCode?.component;
  const platforms = platformsByComponent[component] || [];
  const [state, setState] = useAddonState(ADDON_ID, {
    platform: 'android',
  });
  const [copied, setCopied] = useState(false);

  const platformId =
    platforms.some((item) => item.id === state.platform)
      ? state.platform
      : platforms[0]?.id || 'android';

  const code = useMemo(() => {
    if (!component || !snippetBuilders[component]) {
      return '';
    }
    return snippetBuilders[component](platformId, args || {});
  }, [args, component, platformId]);

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (!active) {
    return null;
  }

  if (!component || !platforms.length) {
    return (
      <AddonPanel active={active}>
        <div style={styles.empty}>{emptyMessage}</div>
      </AddonPanel>
    );
  }

  return (
    <AddonPanel active={active}>
      <div style={styles.root}>
        <div style={styles.toolbar}>
          <div style={styles.tabs} role="tablist" aria-label="Platforma">
            {platforms.map((platform) => {
              const isSelected = platform.id === platformId;
              return (
                <button
                  key={platform.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setState({ platform: platform.id })}
                  style={{
                    ...styles.tab,
                    ...(isSelected ? styles.tabActive : null),
                  }}
                >
                  {platform.label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={copyCode}
            disabled={!code}
            style={{
              ...styles.copy,
              ...(copied ? styles.copyDone : null),
            }}
          >
            {copied ? 'Kopirano' : 'Kopiraj'}
          </button>
        </div>
        <div style={styles.codeWrap}>
          <SyntaxHighlighter
            // Storybook Prism ships jsx/tsx/typescript/… but not
            // kotlin/swift/dart — those fall back to uncolored text.
            language="typescript"
            copyable={false}
            padded
            format={false}
            showLineNumbers={false}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </AddonPanel>
  );
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: 0,
    background: '#ffffff',
    color: '#0b3a4a',
    fontFamily: "'Republika', Arial, sans-serif",
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 12px',
    borderBottom: '1px solid #d9e2e6',
    flex: '0 0 auto',
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  tab: {
    appearance: 'none',
    border: '1px solid #c5d4da',
    borderRadius: 6,
    background: '#ffffff',
    color: '#0b3a4a',
    padding: '6px 12px',
    font: "600 13px 'Republika', Arial, sans-serif",
    cursor: 'pointer',
  },
  tabActive: {
    background: '#0b3a4a',
    borderColor: '#0b3a4a',
    color: '#ffffff',
  },
  copy: {
    appearance: 'none',
    flex: '0 0 auto',
    border: 0,
    borderRadius: 6,
    background: '#3c7b94',
    color: '#ffffff',
    padding: '8px 14px',
    font: "700 13px 'Republika', Arial, sans-serif",
    cursor: 'pointer',
  },
  copyDone: {
    background: '#447972',
  },
  codeWrap: {
    flex: '1 1 auto',
    minHeight: 0,
    overflow: 'auto',
  },
  empty: {
    padding: 16,
    color: '#45636d',
    font: "15px/1.45 'Republika', Arial, sans-serif",
  },
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Koda',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <PlatformCodePanel active={active} />,
    paramKey: PARAM_KEY,
  });
});
