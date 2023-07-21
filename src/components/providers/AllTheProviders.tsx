'use client';

import React, {useEffect, useState} from 'react';

import {WagmiConfig} from 'wagmi';
import {polygon} from 'wagmi/chains';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {AbstractIntlMessages, NextIntlClientProvider} from 'next-intl';
import {Provider} from 'react-redux';
import {ToastContainer} from 'react-toastify';

import {Locale} from '@forest-feed/languages';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {appInfo, chains, forestFeedTheme, wagmiConfig} from '@forest-feed/connectWallet';
import store from '@forest-feed/redux/store';

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
      <RainbowKitProvider chains={chains} appInfo={appInfo} theme={forestFeedTheme} initialChain={polygon}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RenderIf condition={mounted}>
            <Provider store={store}>
              <ToastContainer pauseOnHover position="bottom-center" hideProgressBar />
              {children}
            </Provider>
          </RenderIf>
        </NextIntlClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
