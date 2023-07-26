import React from 'react';
import {Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {createTranslator} from 'next-intl';

import {Locale} from '@forest-feed/languages';
import {AllTheProviders} from '@forest-feed/components/providers/AllTheProviders';
import {Layout} from '@forest-feed/components/layout/Layout';
import {HandleOnComplete} from '@forest-feed/lib/router-events';

const inter = Inter({subsets: ['latin']});

export type RootLayoutProps = {
  params: {locale: Locale};
  children: React.ReactNode;
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../localization/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({params: {locale}}: RootLayoutProps) {
  const messages = await getMessages(locale);

  // You can use the core (non-React) APIs when you have to use next-intl
  // outside of components. Potentially this will be simplified in the future
  // (see https://next-intl-docs.vercel.app/docs/next-13/server-components).
  const t = createTranslator({locale, messages, namespace: 'metadata'});

  return {
    title: t('root.title'),
  };
}

export async function generateStaticParams() {
  return ['en', 'fa'].map(locale => ({locale}));
}

export default async function LocaleLayout(props: RootLayoutProps) {
  const {
    params: {locale},
    children,
  } = props;

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-primaryBg`}>
        <AllTheProviders locale={locale} messages={messages}>
          <Layout>{children}</Layout>
          <HandleOnComplete />
        </AllTheProviders>
      </body>
    </html>
  );
}
