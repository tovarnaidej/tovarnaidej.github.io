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
      storySort: {
        order: ['Gradniki', 'Dokumentacija', 'Primeri'],
      },
    },
  },
};

export default preview;
