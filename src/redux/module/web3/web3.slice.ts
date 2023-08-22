import {useCallback} from 'react';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GetAccountResult} from '@wagmi/core';

import {BlockchainNetwork, config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig, selectRegularSale, selectWeb3} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';
import {profileActions} from '@forest-feed/redux/module/profile/profile';
import {nonceActions} from '@forest-feed/redux/module/nonce/nonce';
import {signActions} from '@forest-feed/redux/module/sign/sign';

export type Web3State = {
  isConnected: boolean;
  config: NetworkConfig;
  switching: boolean;
  isSupportedNetwork: boolean;
  address: `0x${string}` | null;
  accessToken: string | null;
  lensLoading: boolean;
};

export type SwitchNetworkAction = {
  newNetwork: BlockchainNetwork;
  userInApp?: boolean;
  onSuccess?: () => void;
};

export type Web3Action = {
  switchNetwork: SwitchNetworkAction;
  startConfiguration?: SwitchNetworkAction;
  updateNetwork: {newConfig: NetworkConfig};
  connectedWallet: {address?: `0x${string}`};
  checkAccount: {account: GetAccountResult};
  setLensLoading: {loading: boolean};
  setAccessToken: {token: string};
};

export const web3InitialState: Web3State = {
  isConnected: false,
  config: configs[BlockchainNetwork.Mumbai],
  switching: false,
  isSupportedNetwork: false,
  address: null,
  accessToken: null,
  lensLoading: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState: web3InitialState,
  reducers: {
    startConfiguration: (state, _action: PayloadAction<Web3Action['startConfiguration']>) => state,
    watchCurrentWeb3: state => state,
    checkAccount: (state, _action: PayloadAction<Web3Action['checkAccount']>) => state,
    loginAccount: state => state,
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
      state.address = action.payload.address || null;
    },
    setLensLoading: (state, action: PayloadAction<Web3Action['setLensLoading']>) => {
      state.lensLoading = action.payload.loading;
    },
    setAccessToken: (state, actions: PayloadAction<Web3Action['setAccessToken']>) => {
      state.accessToken = actions.payload.token;
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
    dispatchRemoveAccessToken();
    dispatch(profileActions.resetCache());
    dispatch(nonceActions.resetCache());
    dispatch(signActions.resetCache());
  }, [dispatchRemoveAccessToken, dispatch]);

  const dispatchSignWithForest = useCallback(() => {
    dispatch(loginAccount());
  }, [dispatch]);

  return {
    web3,
    dispatchSwitchNetwork,
    dispatchNotSupportedNetwork,
    dispatchSetLensLoading,
    dispatchRemoveAccessToken,
    dispatchSignWithForest,
    dispatchLogoutForest,
  };
}

export const useConfig = () => useAppSelector(selectConfig);
export const useRegularSale = () => useAppSelector(selectRegularSale);
