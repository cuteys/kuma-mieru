import '@/styles/globals.css';
import { clsx } from 'clsx';
import type { Metadata, Viewport } from 'next';

import { Footer } from '@/components/Footer';
import Analytics from '@/components/basic/google-analytics';
import { Navbar } from '@/components/basic/navbar';
import { fontMono, fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import packageJson from '@/package.json';
import { getGlobalConfig } from '@/services/config.server';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Kuma Mieru',
    template: siteConfig.name ? `%s - ${siteConfig.name}` : '%s - Kuma Mieru',
  },
  description: siteConfig.description || 'Kuma Mieru',
  icons: {
    icon: siteConfig.icon,
  },
  generator: `Kuma-Mieru/${packageJson.version}`,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  const { config } = await getGlobalConfig();
  const { theme, googleAnalyticsId } = config;

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
          fontMono.variable,
        )}
      >
        {googleAnalyticsId && <Analytics id={googleAnalyticsId} />}
        <NextIntlClientProvider messages={messages}>
          <Providers themeProps={{ attribute: 'class', defaultTheme: theme }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">{children}</main>
              <Footer config={config} />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
