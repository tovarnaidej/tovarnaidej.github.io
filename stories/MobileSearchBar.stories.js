import { SearchBar } from './SearchBar';

const styles = ['defaultStyle', 'filled', 'outlined'];
const resultsModes = ['hide', 'empty', 'shown'];

export default {
  title: 'Gradniki - mobile/Iskalno polje',
  component: SearchBar,
  parameters: {
    layout: 'centered',
    platformCode: { component: 'search-bar' },
  },
  tags: ['autodocs'],
  args: {
    style: 'defaultStyle',
    resultsMode: 'hide',
    showAvatar: false,
    showResultAvatars: true,
    placeholder: 'Input search text',
  },
  argTypes: {
    style: {
      name: 'Slog',
      control: {
        type: 'select',
        labels: {
          defaultStyle: 'Privzeto',
          filled: 'Zapolnjeno',
          outlined: 'Obrobljeno',
        },
      },
      options: styles,
    },
    resultsMode: {
      name: 'Rezultati',
      control: {
        type: 'select',
        labels: {
          hide: 'Skrij',
          empty: 'Prazno',
          shown: 'Prikazano',
        },
      },
      options: resultsModes,
    },
    showAvatar: { name: 'Avatar', control: { type: 'boolean' } },
    showResultAvatars: {
      name: 'Avatarji rezultatov',
      control: { type: 'boolean' },
      if: { arg: 'resultsMode', eq: 'shown' },
    },
    placeholder: { name: 'Nadomestno besedilo' },
    className: { table: { disable: true } },
  },
};

export const Default = { name: 'Privzeto' };

export const WithResults = {
  name: 'Z rezultati',
  args: { resultsMode: 'shown' },
};
