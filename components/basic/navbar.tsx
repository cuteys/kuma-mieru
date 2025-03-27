'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from '@heroui/navbar';
import { link as linkStyles } from '@heroui/theme';
import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';

import { apiConfig } from '@/config/api';
import { GithubIcon, SearchIcon } from '@/components/basic/icons';
import { ThemeSwitch } from '@/components/basic/theme-switch';
import { NavbarSkeleton } from '@/components/ui/CommonSkeleton';
import { siteConfig } from '@/config/site';
import type { Config } from '@/types/config';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { I18NSwitch } from './i18n-switch';

const isExternalUrl = (url: string) => {
  return url?.startsWith('http://') || url?.startsWith('https://');
};

export const Navbar = () => {
  const t = useTranslations();

  if (!apiConfig) {
    return <NavbarSkeleton />;
  }

  const searchInput = (
    // TODO: 实现节点过滤器
    <Input
      isDisabled
      aria-label={t('ariaSearch')}
      classNames={{
        inputWrapper: 'bg-default-100',
        input: 'text-sm',
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={['command']}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder={t('nodeSearch')}
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  const starButton = (
    <Button
      isExternal
      as={Link}
      className="text-sm font-normal text-default-600 bg-default-100"
      href={siteConfig.links.github}
      startContent={<GithubIcon />}
      variant="flat"
    >
      Star on Github
    </Button>
  );

  const getIconUrl = () => {
    if (apiConfig.siteMeta.icon) {
      return isExternalUrl(apiConfig.siteMeta.icon)
        ? apiConfig.siteMeta.icon
        : new URL(apiConfig.siteMeta.icon, apiConfig.baseUrl).toString();
    }
    return '';
  };

  return (
    <HeroUINavbar maxWidth="xl" position="static">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              src={getIconUrl() || '/favicon.svg'}
              alt={`${apiConfig.siteMeta.title} logo`}
              width={34}
              height={34}
            />
            <p className="font-bold text-inherit">{apiConfig.siteMeta.title}</p>
          </NextLink>
        </NavbarBrand>
        <nav aria-label={t('ariaMainNav')}>
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: 'foreground' }),
                    'data-[active=true]:text-primary data-[active=true]:font-medium',
                  )}
                  color="foreground"
                  href={item.href}
                  target={item.external ? '_blank' : '_self'}
                >
                  {t(item.label)}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <nav aria-label={t('ariaToolbar')}>
          <ul className="flex items-center gap-4">
            <li>
              <ThemeSwitch />
            </li>
            <li>
              <I18NSwitch />
            </li>
            <li className="hidden lg:block">{searchInput}</li>
            <li className="hidden sm:block">{apiConfig.isShowStarButton && starButton}</li>
          </ul>
        </nav>
      </NavbarContent>

      {/* 移动端 */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <nav aria-label={t('ariaMobileToolbar')}>
          <ul className="flex items-center gap-2">
            <li>
              <ThemeSwitch />
            </li>
            <li>
              <I18NSwitch />
            </li>
            <li>
              <NavbarMenuToggle
                icon={(isOpen) => (
                  <motion.div
                    variants={{
                      closed: { rotate: 0, opacity: 1 },
                      open: { rotate: 90, opacity: 1 },
                    }}
                    animate={isOpen ? 'open' : 'closed'}
                    transition={{ duration: 0.3 }}
                    className="text-default-500"
                  >
                    {isOpen ? <X width={24} /> : <Menu size={24} />}
                  </motion.div>
                )}
              />
            </li>
          </ul>
        </nav>
      </NavbarContent>

      <NavbarMenu className="z-[60]">
        {apiConfig.isShowStarButton && starButton}
        {searchInput}
        <nav aria-label={t('ariaMobileNav')}>
          <ul className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navItems.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Link
                  color={
                    index === 2
                      ? 'primary'
                      : index === siteConfig.navItems.length - 1
                        ? 'danger'
                        : 'foreground'
                  }
                  href={item.href}
                  target={item.external ? '_blank' : '_self'}
                  size="lg"
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
