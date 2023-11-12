import {useCallback} from 'react';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GetAccountResult} from '@wagmi/core';
import {Profile, ProfileId} from '@lens-protocol/react-web';

import {BlockchainNetwork, config as configs, NetworkConfig} from '@forest-feed/config';
import {
  selectAccessToken,
  selectConfig,
  selectDaiTokenContract,
  selectForestFeedContract,
  selectRegularSaleContract,
  selectWeb3,
} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {InitAction} from '@forest-feed/redux/module/init/init.slice';

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

export type SwitchNetworkAction = {
  newNetwork: BlockchainNetwork;
  userInApp?: boolean;
  onSuccess?: () => void;
  inInit?: boolean;
};

export type Web3Action = {
  switchNetwork: SwitchNetworkAction & Partial<InitAction['init']>;
  startConfiguration?: SwitchNetworkAction;
  watchCurrentWeb3: InitAction['init'];
  updateNetwork: {newConfig: NetworkConfig};
  connectedWallet: {address?: `0x${string}`};
  checkAccount: {account: GetAccountResult} & InitAction['init'];
  setLensLoading: {loading: boolean};
  setAccessToken: {token: string};
  setLensProfile: {profile: Profile | null | undefined};
  setShowSelectProfile?: boolean;
  setSelectedProfileId: ProfileId;
};

export const web3InitialState: Web3State = {
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

export const web3Slice = createSlice({
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

export function useWeb3() {
  const web3 = useAppSelector(selectWeb3);
  const dispatch = useAppDispatch();

  const dispatchSwitchNetwork = useCallback(
    (payload: Web3Action['switchNetwork']) => {
      dispatch(switchNetwork(payload));
    },
    [dispatch],
  );

  const dispatchNotSupportedNetwork = useCallback(() => {
    dispatch(notSupportedNetwork());
  }, [dispatch]);

  const dispatchSetLensLoading = useCallback(
    (payload: Web3Action['setLensLoading']) => {
      dispatch(setLensLoading(payload));
    },
    [dispatch],
  );

  const dispatchRemoveAccessToken = useCallback(() => {
    dispatch(setAccessToken({token: ''}));
  }, [dispatch]);

  const dispatchLogoutForest = useCallback(() => {
    // dispatchRemoveAccessToken();
    // dispatch(profileActions.resetCache());
    // dispatch(nonceActions.resetCache());
    // dispatch(signActions.resetCache());
    dispatch(logoutAccount());
  }, [dispatch]);

  const dispatchSignWithForest = useCallback(() => {
    dispatch(loginAccount());
  }, [dispatch]);

  const dispatchSetLensProfile = useCallback(
    (payload: Web3Action['setLensProfile']) => {
      dispatch(setLensProfile(payload));
    },
    [dispatch],
  );

  const dispatchSetSelectedProfileId = useCallback(
    (payload: Web3Action['setSelectedProfileId']) => {
      dispatch(setSelectedProfileId(payload));
    },
    [dispatch],
  );

  const dispatchRemoveSelectedProfileId = useCallback(() => {
    dispatch(removeSelectedProfileId());
  }, [dispatch]);

  const dispatchSetShowSelectProfile = useCallback(
    (payload: Web3Action['setShowSelectProfile']) => {
      dispatch(setShowSelectProfile(payload));
    },
    [dispatch],
  );

  const dispatchToggleShowSelectProfile = useCallback(() => {
    dispatch(toggleShowSelectProfile());
  }, [dispatch]);

  return {
    web3,
    dispatchSwitchNetwork,
    dispatchNotSupportedNetwork,
    dispatchSetLensLoading,
    dispatchRemoveAccessToken,
    dispatchSignWithForest,
    dispatchLogoutForest,
    dispatchSetLensProfile,
    dispatchSetSelectedProfileId,
    dispatchRemoveSelectedProfileId,
    dispatchSetShowSelectProfile,
    dispatchToggleShowSelectProfile,
  };
}

export const useConfig = () => useAppSelector(selectConfig);
export const useRegularSaleContract = () => useAppSelector(selectRegularSaleContract);
export const useForestFeedContract = () => useAppSelector(selectForestFeedContract);
export const useDaiTokenContract = () => useAppSelector(selectDaiTokenContract);
export const useAccessToken = () => useAppSelector(selectAccessToken);
