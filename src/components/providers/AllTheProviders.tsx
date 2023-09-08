'use client';

import React from 'react';

import {WagmiConfig} from 'wagmi';
import {polygonMumbai} from 'wagmi/chains';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {AbstractIntlMessages, NextIntlClientProvider} from 'next-intl';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {ToastContainer} from 'react-toastify';

import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import {Locale} from '@forest-feed/languages';
import {appInfo, chains, forestFeedTheme, wagmiConfig} from '@forest-feed/connectWallet';
import {ApolloProvider} from '@forest-feed/components/providers/Apollo';
import {LensProvider} from '@forest-feed/components/providers/Lens';
import {store, persistor} from '@forest-feed/redux/store';

export type AllTheProvidersProps = React.PropsWithChildren<{
  locale: Locale;
  messages: AbstractIntlMessages;
}>;

export function AllTheProviders(props: AllTheProvidersProps) {
  const {locale, messages, children} = props;

  const [client] = React.useState(new QueryClient());

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} theme={forestFeedTheme} initialChain={polygonMumbai}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
              <LensProvider>
                <ApolloProvider>
                  <QueryClientProvider client={client}>
                    <ToastContainer pauseOnHover position="bottom-center" hideProgressBar />
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                  </QueryClientProvider>
                </ApolloProvider>
              </LensProvider>
            </PersistGate>
          </Provider>
        </NextIntlClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
