'use client';

import React, {useEffect, useState} from 'react';

import {WagmiConfig} from 'wagmi';
import {polygonMumbai} from 'wagmi/chains';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {LensProvider} from '@lens-protocol/react-web';
import {AbstractIntlMessages, NextIntlClientProvider} from 'next-intl';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {ToastContainer} from 'react-toastify';

import {Locale} from '@forest-feed/languages';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {appInfo, chains, forestFeedTheme, lensConfig, wagmiConfig} from '@forest-feed/connectWallet';
import {ApolloProvider} from '@forest-feed/components/providers/Apollo';
import {store, persistor} from '@forest-feed/redux/store';

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
      <RainbowKitProvider chains={chains} appInfo={appInfo} theme={forestFeedTheme} initialChain={polygonMumbai}>
        <LensProvider config={lensConfig}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Provider store={store}>
              <PersistGate persistor={persistor} loading={null}>
                <ApolloProvider>
                  <ToastContainer pauseOnHover position="bottom-center" hideProgressBar />
                  {children}
                </ApolloProvider>
                <ToastContainer pauseOnHover position="bottom-center" hideProgressBar />
                <RenderIf condition={mounted}>{children}</RenderIf>
              </PersistGate>
            </Provider>
          </NextIntlClientProvider>
        </LensProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
