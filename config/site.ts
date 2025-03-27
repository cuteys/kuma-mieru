'use client';

import { env } from './env';

const baseConfig = {
  name: 'Kuma Mieru',
  description: 'A beautiful and modern uptime monitoring dashboard',
  icon: '/favicon.svg',
} as const;

type NavItem = {
  label: string;
  href: string;
  external: boolean;
};

const navItems: NavItem[] = [
  {
    label: 'pageMain',
    href: '/',
    external: false,
  },
  {
    label: 'pageEdit',
    href: `${env.config.baseUrl}/manage-status-page`,
    external: true,
  },
];

export const siteConfig = {
  name: env.config.siteMeta.title || baseConfig.name,
  description: env.config.siteMeta.description || baseConfig.description,
  icon: env.config.siteMeta.icon
    ? env.config.siteMeta.icon.startsWith('http')
      ? env.config.siteMeta.icon
      : `${env.config.baseUrl}/${env.config.siteMeta.icon.replace(/^\//, '')}`
    : baseConfig.icon,
  navItems: navItems.filter((item): item is NavItem =>
    item.label !== 'pageEdit' ? true : env.config.isEditThisPage,
  ),
  navMenuItems: navItems.filter((item): item is NavItem =>
    item.label !== 'pageEdit' ? true : env.config.isEditThisPage,
  ),
  links: {
    github: 'https://github.com/Alice39s/kuma-mieru',
    docs: 'https://github.com/Alice39s/kuma-mieru/blob/main/README.md',
  },
} as const;

export type SiteConfig = typeof siteConfig;
