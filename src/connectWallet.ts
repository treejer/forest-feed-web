import {configureChains, createConfig} from 'wagmi';
import {GetAccountResult} from '@wagmi/core';
import {polygonMumbai, polygon} from 'wagmi/chains';
import {getDefaultWallets, lightTheme} from '@rainbow-me/rainbowkit';
import {publicProvider} from 'wagmi/providers/public';

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

export const appInfo = {
  appName: projectName,
};
export const forestFeedTheme = lightTheme({
  accentColor: colors.primaryGreen,
  accentColorForeground: colors.white,
  borderRadius: 'medium',
});
