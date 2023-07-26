import {configureChains, createConfig} from 'wagmi';
import {GetAccountResult} from '@wagmi/core';
import {polygonMumbai, polygon} from 'wagmi/chains';
import {getDefaultWallets, lightTheme} from '@rainbow-me/rainbowkit';
import {publicProvider} from 'wagmi/providers/public';
import {infuraProvider} from 'wagmi/providers/infura';
import {LensConfig, development} from '@lens-protocol/react-web';
import {bindings as wagmiBindings} from '@lens-protocol/wagmi';

import {infuraKey, projectId, projectName} from '@forest-feed/config';
import {colors} from 'colors';

export type ConnectionStatus = GetAccountResult['status'];

export const {chains, publicClient, webSocketPublicClient} = configureChains(
  [polygon, polygonMumbai],
  [infuraProvider({apiKey: infuraKey}), publicProvider()],
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
