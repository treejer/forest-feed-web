'use client';

import React, {useMemo} from 'react';

import {
  LensConfig,
  LensProvider as OriginalLensProvider,
  production,
  development,
  // appId,
} from '@lens-protocol/react-web';
import {bindings as wagmiBindings} from '@lens-protocol/wagmi';

import {useConfig} from '@forest-feed/redux/module/web3/web3.slice';
// import {lensProtocolAppId} from '@forest-feed/config';

export type LensProviderProps = React.PropsWithChildren;
export function LensProvider(props: LensProviderProps) {
  const {children} = props;

  const config = useConfig();

  const lensConfig: LensConfig = useMemo(
    () => ({
      // appId: appId(lensProtocolAppId),
      bindings: wagmiBindings(),
      environment: config.isMainnet ? production : development,
    }),
    [config],
  );

  return (
    <OriginalLensProvider config={lensConfig} key={config.network}>
      {children}
    </OriginalLensProvider>
  );
}
