import React from 'react';
import {Inter} from 'next/font/google';
import {notFound} from 'next/navigation';
import {NextIntlClientProvider, createTranslator} from 'next-intl';

import './globals.css';
import {AppHeader} from '@forest-feed/components/layout/AppHeader';
import {Navbar} from '@forest-feed/components/layout/Navbar';

const inter = Inter({subsets: ['latin']});

export type RootLayoutProps = {
  params: {locale: string};
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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="container mx-auto">
            <div className="grid grid-cols-6 gap-20">
              <div className="grid col-span-6">
                <AppHeader walletAddress="0x21212121212121212121212" />
              </div>
              <div className="col-span-1">
                <Navbar />
              </div>
              <div className="col-span-5">{children}</div>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
