'use client';

import React, {useEffect, useState} from 'react';

import {WagmiConfig} from 'wagmi';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {AbstractIntlMessages, NextIntlClientProvider} from 'next-intl';

import {Locale} from '@forest-feed/languages';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {appInfo, chains, forestFeedTheme, wagmiConfig} from '@forest-feed/connectWallet';

export type AllTheProvidersProps = React.PropsWithChildren<{
  locale: Locale;
  messages: AbstractIntlMessages;
}>;

export function AllTheProviders(props: AllTheProvidersProps) {
  const {locale, messages, children} = props;

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} theme={forestFeedTheme}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RenderIf condition={mounted}>{children}</RenderIf>
        </NextIntlClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
