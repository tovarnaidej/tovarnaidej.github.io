import React, { useContext } from 'react';
import {
  Controls,
  Description,
  DocsContext,
  DocsStory,
  Heading,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import { styled } from 'storybook/theming';

import './docs-page.css';

// Storybook's own "Stories" heading (addon-docs blocks/Stories.tsx).
const StoriesHeading = styled(Heading)(({ theme }) => ({
  fontSize: `${theme.typography.size.s2 - 1}px`,
  fontWeight: theme.typography.weight.bold,
  lineHeight: '16px',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: theme.textMutedColor,
  border: 0,
  marginBottom: '12px',
  '&:first-of-type': { marginTop: '56px' },
}));

const hasControls = (story) => !story.parameters.controls?.disable;
const hasRows = (story) => Object.values(story.argTypes).some((argType) => !argType.table?.disable);

/**
 * The docs page (Dokumentacija). Storybook's own page puts the file's first story on top and binds
 * the Controls table to it; here the first story is an overview of fixed instances ("Vse
 * različice", "Pregled") that ignores its args, so every control in that table did nothing and the
 * overview was shown twice. This page puts the first story with controls on top (one widget:
 * "Privzeto", "Primarni" ...), the table right below it and bound to it, then the other stories in
 * the sidebar's order, none of them twice. Checked by tools/flutter-reference/webcontrols.mjs (DOCS=1).
 */
const DocsPage = () => {
  const context = useContext(DocsContext);
  // the stories Storybook's Stories block lists
  let stories = context.componentStories();
  if (stories.some((story) => story.tags?.includes('autodocs'))) {
    stories = stories.filter((story) => story.tags?.includes('autodocs') && !story.usesMount);
  }
  const top = stories.find(hasControls) ?? stories[0];
  const rest = stories.filter((story) => story !== top);
  return (
    <>
      <Title />
      <Subtitle />
      <Description of="meta" />
      {top && (
        <>
          <Description of={top.moduleExport} />
          <DocsStory of={top.moduleExport} expanded={false} withToolbar __primary />
          {hasControls(top) && hasRows(top) && <Controls of={top.moduleExport} />}
        </>
      )}
      {rest.length > 0 && (
        <>
          <StoriesHeading>Stories</StoriesHeading>
          {rest.map((story) => (
            <DocsStory key={story.id} of={story.moduleExport} expanded __forceInitialArgs />
          ))}
        </>
      )}
    </>
  );
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    docs: {
      codePanel: false,
      page: DocsPage,
    },
    html: {
      removeEmptyComments: true,
      transform: (code) =>
        code
          .replace(/\s+data-[a-zA-Z0-9_-]+="[^"]*"/g, '')
          .replace(/\s+data-[a-zA-Z0-9_-]+='[^']*'/g, ''),
    },
    options: {
      // Groups in a fixed order; widgets inside a group alphabetically (Slovenian
      // collation, like the mobile catalog); stories keep their export order.
      // Storybook inlines this function, so it must stay self-contained.
      storySort: (a, b) => {
        const groups = ['Gradniki', 'Gradniki - mobile', 'Dokumentacija', 'Primeri'];
        const split = (title) => {
          const i = title.indexOf('/');
          return i < 0 ? [title, ''] : [title.slice(0, i), title.slice(i + 1)];
        };
        const rank = (group) => {
          const i = groups.indexOf(group);
          return i < 0 ? groups.length : i;
        };
        const [groupA, nameA] = split(a.title);
        const [groupB, nameB] = split(b.title);
        if (groupA !== groupB) {
          return rank(groupA) - rank(groupB) || groupA.localeCompare(groupB, 'sl');
        }
        return nameA.localeCompare(nameB, 'sl');
      },
    },
  },
};

export default preview;
