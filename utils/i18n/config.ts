export type Locale = (typeof locales)[number]['key'];
export const defaultLocale: Locale = 'zh-CN';
export const locales = [
  {
    key: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳',
    alpha2Code: 'CN',
  },
  {
    key: 'zh-TW',
    name: '繁體中文 (台灣)',
    flag: '🇹🇼',
    alpha2Code: 'TW',
  },
  {
    key: 'zh-HK',
    name: '繁體中文 (香港)',
    flag: '🇭🇰',
    alpha2Code: 'HK',
  },
  {
    key: 'en-US',
    name: 'English',
    flag: '🇺🇸',
    alpha2Code: 'US',
  },
  {
    key: 'ja-JP',
    name: '日本語',
    flag: '🇯🇵',
    alpha2Code: 'JP',
  },
] as const;
