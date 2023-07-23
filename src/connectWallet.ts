import {configureChains, createConfig} from 'wagmi';
import {GetAccountResult} from '@wagmi/core';
import {polygonMumbai, polygon} from 'wagmi/chains';
import {getDefaultWallets, lightTheme} from '@rainbow-me/rainbowkit';
import {publicProvider} from 'wagmi/providers/public';
import {LensConfig, development} from '@lens-protocol/react-web';
import {bindings as wagmiBindings} from '@lens-protocol/wagmi';

import {colors} from 'colors';
import {projectId, projectName} from '@forest-feed/config';

export type ConnectionStatus = GetAccountResult['status'];

export const {chains, publicClient, webSocketPublicClient} = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()],
);

export const {connectors} = getDefaultWallets({
  appName: projectName,
  projectId: projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};

export const appInfo = {
  appName: projectName,
};
export const forestFeedTheme = lightTheme({
  accentColor: colors.primaryGreen,
  accentColorForeground: colors.white,
  borderRadius: 'medium',
});
