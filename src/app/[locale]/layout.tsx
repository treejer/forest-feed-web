import React from 'react';
import {Inter} from 'next/font/google';

import {Locale} from '@forest-feed/languages';
import {AllTheProviders} from '@forest-feed/components/providers/AllTheProviders';
import {Layout} from '@forest-feed/components/layout/Layout';
import {HandleOnComplete} from '@forest-feed/lib/router-events';
import {getScopedI18n} from '@forest-feed/locales/server';
import {cn} from '@forest-feed/utils/tailwind';

const inter = Inter({subsets: ['latin']});

export type RootLayoutProps = {
  params: {locale: Locale};
  children: React.ReactNode;
};

export async function generateMetadata() {
  const t = await getScopedI18n('metadata');

  return {
    title: t('root.title'),
  };
}

export default async function LocaleLayout(props: RootLayoutProps) {
  const {
    params: {locale},
    children,
  } = props;

  return (
    <html lang={locale}>
      <body className={cn(inter.className, 'bg-primaryBg')} suppressHydrationWarning={true}>
        <AllTheProviders locale={locale}>
          <Layout>{children}</Layout>
          <HandleOnComplete />
        </AllTheProviders>
      </body>
    </html>
  );
}
