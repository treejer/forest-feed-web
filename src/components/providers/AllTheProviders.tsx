'use client';

import React from 'react';

import {WagmiConfig} from 'wagmi';
import {polygonMumbai} from 'wagmi/chains';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {AbstractIntlMessages, NextIntlClientProvider} from 'next-intl';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {ToastContainer} from 'react-toastify';

import {Locale} from '@forest-feed/languages';
import {appInfo, chains, forestFeedTheme, wagmiConfig} from '@forest-feed/connectWallet';
import {ApolloProvider} from '@forest-feed/components/providers/Apollo';
import {LensProvider} from '@forest-feed/components/providers/Lens';
import {store, persistor} from '@forest-feed/redux/store';
import {InitAppActions} from '@forest-feed/components/providers/InitActions';

export type AllTheProvidersProps = React.PropsWithChildren<{
  locale: Locale;
  messages: AbstractIntlMessages;
}>;

export function AllTheProviders(props: AllTheProvidersProps) {
  const {locale, messages, children} = props;

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} theme={forestFeedTheme} initialChain={polygonMumbai}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
              <InitAppActions>
                <LensProvider>
                  <ApolloProvider>
                    <ToastContainer pauseOnHover position="bottom-center" hideProgressBar />
                    {children}
                  </ApolloProvider>
                </LensProvider>
              </InitAppActions>
            </PersistGate>
          </Provider>
        </NextIntlClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
