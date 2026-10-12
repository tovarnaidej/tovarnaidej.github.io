

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "staticDirs": ["../public"],
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "docs": {
    "defaultName": "Dokumentacija"
  },
  "framework": "@storybook/react-vite"
};
export default config;
