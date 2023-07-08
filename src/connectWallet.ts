import {configureChains, createConfig} from 'wagmi';
import {GetAccountResult} from '@wagmi/core';
import {arbitrum, mainnet, optimism, polygon, zora} from 'wagmi/chains';
import {getDefaultWallets, lightTheme} from '@rainbow-me/rainbowkit';
import {publicProvider} from 'wagmi/providers/public';

import {appConfig} from '@forest-feed/config';
import {colors} from 'colors';

export type ConnectionStatus = GetAccountResult['status'];

export const {chains, publicClient, webSocketPublicClient} = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [publicProvider()],
);

export const {connectors} = getDefaultWallets({
  appName: appConfig.name,
  projectId: appConfig.projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export const appInfo = {
  appName: appConfig.name,
};
export const forestFeedTheme = lightTheme({
  accentColor: colors.primaryGreen,
  accentColorForeground: colors.white,
  borderRadius: 'medium',
});
