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
