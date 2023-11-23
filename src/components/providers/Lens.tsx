'use client';

import React, {useMemo} from 'react';

import {
  LensConfig,
  LensProvider as OriginalLensProvider,
  appId,
  production,
  development,
} from '@lens-protocol/react-web';
import {bindings as wagmiBindings} from '@lens-protocol/wagmi';

import {lensProtocolAppId} from '@forest-feed/config';
import useConfig from '@forest-feed/hooks/useConfig';

export type LensProviderProps = React.PropsWithChildren;
export default function LensProvider(props: LensProviderProps) {
  const {children} = props;

  const config = useConfig();

  const lensConfig: LensConfig = useMemo(
    () => ({
      appId: appId(lensProtocolAppId),
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
