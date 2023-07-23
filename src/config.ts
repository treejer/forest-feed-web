import {ImageProps} from 'next/image';

import {formatUrl} from '@forest-feed/utils/fotmatUrl';
import MaticLogo from 'public/assets/images/Asset.png';
import {polygon, polygonMumbai} from 'wagmi/chains';

export const projectName = 'Forest Feed';
export const projectId = 'ID';

export enum ContractType {
  NOTHING_YET = 'NOTHING_YET',
  DAI = 'DAI',
}

export interface ConfigContract {
  address: `0x${string}`;
  abi: any;
  // TODO: apollo-link-ethereum
  // abi: AbiDefinition['abi'];
}

export enum BlockchainNetwork {
  Polygon = 'Polygon',
  Mumbai = 'Mumbai',
}

export interface NetworkConfig {
  name: string;
  projectId: string;
  contracts: {
    [key in ContractType]: ConfigContract;
  };
  networkId: number;
  isMainnet: boolean;
  web3Url: string;
  forestFeedApiUrl: string;
  thegraphUrl: string;
  ipfsPostURL: string;
  ipfsGetURL: string;
  preferredRelays: string;
  relayLookupWindowBlocks: string;
  relayRegistrationLookupBlocks: string;
  pastEventsQueryMaxPageSize: string;
  learnMoreLink: string;
  network: BlockchainNetwork;
  chainId: number;
  explorerUrl: string;
}

export interface Config {
  [BlockchainNetwork.Polygon]: NetworkConfig;
  [BlockchainNetwork.Mumbai]: NetworkConfig;
}

export const isProd = process.env.NODE_ENV?.toLowerCase() === 'production';

export const config: Config = {
  [BlockchainNetwork.Polygon]: {
    name: projectName,
    projectId: projectId,
    contracts: {
      NOTHING_YET: {
        address: '' as `0x${string}`,
        abi: '',
      },
      DAI: {
        address: (process.env.NEXT_PUBLIC_POLYGON_DAI_TOKEN || '') as `0x${string}`,
        abi: require('./abis/Dai.json'),
      },
    },
    networkId: Number('' || 3),
    isMainnet: true,
    web3Url: '',
    forestFeedApiUrl: formatUrl(''),
    thegraphUrl: formatUrl(''),
    ipfsPostURL: formatUrl(''),
    ipfsGetURL: formatUrl(''),
    preferredRelays: '',
    relayLookupWindowBlocks: '',
    relayRegistrationLookupBlocks: '',
    pastEventsQueryMaxPageSize: '',
    learnMoreLink: '',
    network: BlockchainNetwork.Polygon,
    chainId: polygon.id,
    explorerUrl: '',
  },
  [BlockchainNetwork.Mumbai]: {
    name: projectName,
    projectId: projectId,
    contracts: {
      NOTHING_YET: {
        address: '' as `0x${string}`,
        abi: '',
      },
      DAI: {
        address: (process.env.NEXT_PUBLIC_MUMBAI_DAI_TOKEN || '') as `0x${string}`,
        abi: require('./abis/Dai.json'),
      },
    },
    networkId: Number('' || 3),
    isMainnet: false,
    web3Url: '',
    forestFeedApiUrl: formatUrl(''),
    thegraphUrl: formatUrl(''),
    ipfsPostURL: formatUrl(''),
    ipfsGetURL: formatUrl(''),
    preferredRelays: '',
    relayLookupWindowBlocks: '',
    relayRegistrationLookupBlocks: '',
    pastEventsQueryMaxPageSize: '',
    learnMoreLink: '',
    network: BlockchainNetwork.Mumbai,
    chainId: polygonMumbai.id,
    explorerUrl: '',
  },
};

export interface NetworkInfo {
  title: string;
  network: BlockchainNetwork;
  details: string;
  logo: ImageProps['src'];
}

export type Networks = {
  [key in BlockchainNetwork]: NetworkInfo;
};

export const networks: Networks = {
  [BlockchainNetwork.Polygon]: {
    title: 'Polygon',
    network: BlockchainNetwork.Polygon,
    details:
      'This is the main network, by switching all your transaction would be send on the treejer main blockchain network!',
    logo: MaticLogo,
  },
  [BlockchainNetwork.Mumbai]: {
    title: 'Mumbai',
    network: BlockchainNetwork.Mumbai,
    details: 'This network is development purpose only',
    logo: MaticLogo,
  },
};

export const debugFetch = false;
export const reduxLogger = false;
