'use client';

import {ImageProps} from 'next/image';

import {formatUrl} from '@forest-feed/utils/fotmatUrl';
import {myCampaignsActions} from '@forest-feed/redux/module/campaign/myCampaigns';
import {PaginationName} from '@forest-feed/redux/module/pagination/pagination.slice';

export const projectName = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME || '';
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';
export const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY || '';

export const lensProtocolAppId = process.env.NEXT_PUBLIC_LENS_PROTOCOL_APP_ID || '';

export const defaultChainId = 80001;

export const paginationPageSize = 7;

export const PaginationNameFetcher = {
  [PaginationName.MyCampaigns]: myCampaignsActions.load,
};
export enum ContractType {
  DAI = 'DAI',
  REGULAR_SALE = 'REGULAR_SALE',
  FOREST_FEED = 'FOREST_FEED',
}
export interface ConfigContract {
  address: `0x${string}`;
  abi: any;
}

export enum BlockchainNetwork {
  Polygon = 137,
  Mumbai = 80001,
}

export enum BlockchainNetworkName {
  Polygon = 'Polygon',
  Mumbai = 'Polygon Mumbai',
}

export interface NetworkConfig {
  name: string;
  projectId: string;
  contracts: {
    [key in ContractType]: ConfigContract;
  };
  networkId: number;
  isMainnet: boolean;
  infuraKey: string;
  forestFeedApiUrl: string;
  lensApiUrl: string;
  thegraphUrl: string;
  ipfsPostURL: string;
  ipfsGetURL: string;
  preferredRelays: string;
  relayLookupWindowBlocks: string;
  relayRegistrationLookupBlocks: string;
  pastEventsQueryMaxPageSize: string;
  learnMoreLink: string;
  network: BlockchainNetworkName;
  chainId: BlockchainNetwork;
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
      DAI: {
        address: (process.env.NEXT_PUBLIC_POLYGON_DAI_TOKEN || '') as `0x${string}`,
        abi: require('./abis/Dai.json'),
      },
      REGULAR_SALE: {
        address: (process.env.NEXT_PUBLIC_POLYGON_REGULAR_SALE_CONTRACT || '') as `0x${string}`,
        abi: require('./abis/RegularSale.json'),
      },
      FOREST_FEED: {
        address: (process.env.NEXT_PUBLIC_POLYGON_FOREST_FEED_CONTRACT || '') as `0x${string}`,
        abi: require('./abis/ForestFeed.json'),
      },
    },
    networkId: Number('' || 3),
    isMainnet: true,
    infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY || '',
    forestFeedApiUrl: formatUrl(process.env.NEXT_PUBLIC_POLYGON_NEST_API_URL || ''),
    lensApiUrl: formatUrl(process.env.NEXT_PUBLIC_POLYGON_LENS_API_URL || ''),
    thegraphUrl: formatUrl(''),
    ipfsPostURL: formatUrl(process.env.NEXT_PUBLIC_POLYGON_IPFS_POST_URL || ''),
    ipfsGetURL: formatUrl(process.env.NEXT_PUBLIC_POLYGON_IPFS_GET_URL || ''),
    preferredRelays: '',
    relayLookupWindowBlocks: '',
    relayRegistrationLookupBlocks: '',
    pastEventsQueryMaxPageSize: '',
    learnMoreLink: '',
    network: BlockchainNetworkName.Polygon,
    chainId: BlockchainNetwork.Polygon,
    explorerUrl: '',
  },
  [BlockchainNetwork.Mumbai]: {
    name: projectName,
    projectId: projectId,
    contracts: {
      DAI: {
        address: (process.env.NEXT_PUBLIC_MUMBAI_DAI_TOKEN || '') as `0x${string}`,
        abi: require('./abis/Dai.json'),
      },
      REGULAR_SALE: {
        address: (process.env.NEXT_PUBLIC_MUMBAI_REGULAR_SALE_CONTRACT || '') as `0x${string}`,
        abi: require('./abis/RegularSale.json'),
      },
      FOREST_FEED: {
        address: (process.env.NEXT_PUBLIC_MUMBAI_FOREST_FEED_CONTRACT || '') as `0x${string}`,
        abi: require('./abis/ForestFeed.json'),
      },
    },
    networkId: Number('' || 3),
    isMainnet: false,
    infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY || '',
    forestFeedApiUrl: formatUrl(process.env.NEXT_PUBLIC_MUMBAI_NEST_API_URL || ''),
    lensApiUrl: formatUrl(process.env.NEXT_PUBLIC_MUMBAI_LENS_API_URL || ''),
    thegraphUrl: formatUrl(''),
    ipfsPostURL: formatUrl(process.env.NEXT_PUBLIC_MUMBAI_IPFS_POST_URL || ''),
    ipfsGetURL: formatUrl(process.env.NEXT_PUBLIC_MUMBAI_IPFS_GET_URL || ''),
    preferredRelays: '',
    relayLookupWindowBlocks: '',
    relayRegistrationLookupBlocks: '',
    pastEventsQueryMaxPageSize: '',
    learnMoreLink: '',
    network: BlockchainNetworkName.Mumbai,
    chainId: BlockchainNetwork.Mumbai,
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

export const polygonBuyDaiUrl = process.env.NEXT_PUBLIC_POLYGON_BUY_DAI_EXPLORE_URL || '';
export const polygonSwapDaiUrl = process.env.NEXT_PUBLIC_POLYGON_SWAP_DAI_EXPLORE_URL || '';
export const mumbaiBuyDaiUrl = process.env.NEXT_PUBLIC_MUMBAI_BUY_DAI_EXPLORE_URL || '';
export const mumbaiSwapDaiUrl = process.env.NEXT_PUBLIC_MUMBAI_SWAP_DAI_EXPLORE_URL || '';

export const networks: Networks = {
  [BlockchainNetwork.Polygon]: {
    title: 'Polygon',
    network: BlockchainNetwork.Polygon,
    details:
      'This is the main network, by switching all your transaction would be send on the treejer main blockchain network!',
    logo: '/assets/images/Polygon-MATIC.svg',
  },
  [BlockchainNetwork.Mumbai]: {
    title: 'Mumbai',
    network: BlockchainNetwork.Mumbai,
    details: 'This network is development purpose only',
    logo: '/assets/images/Polygon-MATIC.svg',
  },
};

export const storageKeys = {
  CAMPAIGN_SIZE: 'FOREST_FEED_STORAGE_CAMPAIGN_SIZE',
  CAMPAIGN_TITLE: 'FOREST_FEED_STORAGE_CAMPAIGN_TITLE',
  CAMPAIGN_TITLE_ERROR: 'FOREST_FEED_STORAGE_CAMPAIGN_TITLE_ERROR',
  CAMPAIGN_DELAY: 'FOREST_FEED_STORAGE_CAMPAIGN_DELAY',
  CAMPAIGN_DEPOSIT_SUCCEED: 'FOREST_FEED_STORAGE_CAMPAIGN_DEPOSIT_SUCCEED',
  CAMPAIGN_APPROVE_SUCCEED: 'FOREST_FEED_STORAGE_CAMPAIGN_APPROVE_SUCCEED',
};

export enum SubmitCampaignSteps {
  CreatePost,
  CheckAllowance,
  PrepareApprove,
  Approve,
  PrepareDeposit,
  Deposit,
  Finalize,
}

export const debugFetch = false;
export const reduxLogger = false;
