'use client';

import {configureChains, createConfig} from 'wagmi';
import type {GetAccountResult} from '@wagmi/core';
import {polygonMumbai, polygon} from 'wagmi/chains';
import {getDefaultWallets, lightTheme} from '@rainbow-me/rainbowkit';
import {publicProvider} from 'wagmi/providers/public';
import {infuraProvider} from 'wagmi/providers/infura';

import {infuraKey, projectId, projectName} from '@forest-feed/config';
import colors from 'colors';

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

export const appInfo = {
  appName: projectName,
};
export const forestFeedTheme = lightTheme({
  accentColor: colors.primaryGreen,
  accentColorForeground: colors.white,
  borderRadius: 'medium',
});
