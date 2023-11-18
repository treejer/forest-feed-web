'use client';

import React from 'react';

import {WagmiConfig} from 'wagmi';
import {polygonMumbai} from 'wagmi/chains';
import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {ToastContainer} from 'react-toastify';

import {QueryClientProvider, QueryClient} from '@tanstack/react-query';

import {Locale} from '@forest-feed/languages';
import {appInfo, chains, forestFeedTheme, wagmiConfig} from '@forest-feed/connectWallet';
import LensProvider from '@forest-feed/components/providers/Lens';
import {store, persistor} from '@forest-feed/redux/store';
import {I18nProviderClient} from '@forest-feed/locales/client';

export type AllTheProvidersProps = React.PropsWithChildren<{
  locale: Locale;
}>;

export const reactQueryClient = new QueryClient();

export default function AllTheProviders(props: AllTheProvidersProps) {
  const {locale, children} = props;

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={appInfo} theme={forestFeedTheme} initialChain={polygonMumbai}>
        <I18nProviderClient locale={locale}>
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
              <LensProvider>
                <QueryClientProvider client={reactQueryClient}>
                  <ToastContainer pauseOnHover position="bottom-center" hideProgressBar />
                  {children}
                </QueryClientProvider>
              </LensProvider>
            </PersistGate>
          </Provider>
        </I18nProviderClient>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
