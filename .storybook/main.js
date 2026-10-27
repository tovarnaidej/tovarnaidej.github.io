

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "staticDirs": ["../public"],
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@whitespace/storybook-addon-html",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "docs": {
    "defaultName": "Dokumentacija"
  },
  "framework": "@storybook/react-vite"
};
export default config;
