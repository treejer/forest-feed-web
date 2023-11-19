import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GetAccountResult} from '@wagmi/core';
import {Profile, ProfileId} from '@lens-protocol/react-web';

import {BlockchainNetwork, config as configs, NetworkConfig} from '@forest-feed/config';

export type Web3State = {
  isConnected: boolean;
  config: NetworkConfig;
  switching: boolean;
  isSupportedNetwork: boolean;
  address: `0x${string}` | null;
  accessToken: string;
  lensLoading: boolean;
  forestLoading: boolean;
  lensProfile: Profile | null | undefined;
  showSelectProfile: boolean;
  selectedProfileId: ProfileId | null;
};

type SwitchNetworkAction = {
  newNetwork: BlockchainNetwork;
  userInApp?: boolean;
  onSuccess?: () => void;
  inInit?: boolean;
};

type LensLogout = {lensLogout: (isSaga?: boolean) => void};

export type Web3Action = {
  switchNetwork: SwitchNetworkAction & Partial<LensLogout>;
  startConfiguration?: SwitchNetworkAction;
  watchCurrentWeb3: {lensLogout: (isSaga?: boolean) => void};
  updateNetwork: {newConfig: NetworkConfig};
  connectedWallet: {address?: `0x${string}`};
  checkAccount: {account: GetAccountResult} & Partial<LensLogout>;
  setLensLoading: {loading: boolean};
  setAccessToken: {token: string};
  setLensProfile: {profile: Profile | null | undefined};
  setShowSelectProfile?: boolean;
  setSelectedProfileId: ProfileId;
};

const web3InitialState: Web3State = {
  isConnected: false,
  config: configs[BlockchainNetwork.Mumbai],
  switching: false,
  isSupportedNetwork: false,
  address: null,
  accessToken: '',
  lensLoading: false,
  forestLoading: false,
  lensProfile: null,
  showSelectProfile: false,
  selectedProfileId: null,
};

const web3Slice = createSlice({
  name: 'web3',
  initialState: web3InitialState,
  reducers: {
    startConfiguration: (state, _action: PayloadAction<Web3Action['startConfiguration']>) => state,
    watchCurrentWeb3: (state, _action: PayloadAction<Web3Action['watchCurrentWeb3']>) => state,
    checkAccount: (state, _action: PayloadAction<Web3Action['checkAccount']>) => state,
    loginAccount: state => {
      state.forestLoading = true;
    },
    logoutAccount: state => state,
    switchNetwork: (state, _action: PayloadAction<Web3Action['switchNetwork']>) => {
      state.switching = true;
    },
    updateNetwork: (state, action: PayloadAction<Web3Action['updateNetwork']>) => {
      state.switching = false;
      state.config = action.payload.newConfig;
      state.isSupportedNetwork = true;
    },
    notSupportedNetwork: state => {
      state.isSupportedNetwork = false;
    },
    cancelSwitchNetwork: state => {
      state.switching = false;
    },
    connectedWallet: (state, action: PayloadAction<Web3Action['connectedWallet']>) => {
      state.isConnected = !!action.payload.address;
      state.selectedProfileId = !action.payload.address ? null : state.selectedProfileId;
      state.lensProfile = !action.payload.address ? null : state.lensProfile;
      state.address = action.payload.address || null;
      state.showSelectProfile = !state.lensProfile && !state.selectedProfileId && !!action.payload.address;
    },
    setLensLoading: (state, action: PayloadAction<Web3Action['setLensLoading']>) => {
      state.lensLoading = action.payload.loading;
    },
    setAccessToken: (state, action: PayloadAction<Web3Action['setAccessToken']>) => {
      state.accessToken = action.payload.token;
      state.forestLoading = false;
    },
    setLensProfile: (state, action: PayloadAction<Web3Action['setLensProfile']>) => {
      state.lensProfile = action.payload.profile;
    },
    setShowSelectProfile: (state, action: PayloadAction<Web3Action['setShowSelectProfile']>) => {
      state.showSelectProfile = !!action.payload;
    },
    toggleShowSelectProfile: state => {
      state.showSelectProfile = !state.showSelectProfile;
    },
    setSelectedProfileId: (state, action: PayloadAction<Web3Action['setSelectedProfileId']>) => {
      state.selectedProfileId = action.payload;
    },
    removeSelectedProfileId: state => {
      state.selectedProfileId = null;
    },
  },
});

export const {
  switchNetwork,
  updateNetwork,
  startConfiguration,
  notSupportedNetwork,
  watchCurrentWeb3,
  cancelSwitchNetwork,
  connectedWallet,
  checkAccount,
  loginAccount,
  logoutAccount,
  setLensLoading,
  setAccessToken,
  setLensProfile,
  toggleShowSelectProfile,
  setShowSelectProfile,
  setSelectedProfileId,
  removeSelectedProfileId,
} = web3Slice.actions;
export default web3Slice.reducer;
