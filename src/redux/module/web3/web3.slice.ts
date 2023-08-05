import {useCallback} from 'react';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {GetAccountResult} from '@wagmi/core';

import {BlockchainNetwork, config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig, selectWeb3} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

export type Web3State = {
  isConnected: boolean;
  config: NetworkConfig;
  switching: boolean;
  isSupportedNetwork: boolean;
  address: `0x${string}` | null;
  accessToken: string | null;
};

export type SwitchNetworkAction = {
  newNetwork: BlockchainNetwork;
  userInApp?: boolean;
  onSuccess?: () => void;
};

export type Web3Action = {
  switchNetwork: SwitchNetworkAction;
  startConfiguration?: SwitchNetworkAction;
  watchCurrentWeb3: {lensLogout: () => void};
  updateNetwork: {newConfig: NetworkConfig};
  connectedWallet: {address?: `0x${string}`};
  checkAccount: {account: GetAccountResult; lensLogout: () => void};
};

export const web3InitialState: Web3State = {
  isConnected: false,
  config: configs[BlockchainNetwork.Mumbai],
  switching: false,
  isSupportedNetwork: false,
  address: null,
  accessToken: null,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState: web3InitialState,
  reducers: {
    startConfiguration: (state, _action: PayloadAction<Web3Action['startConfiguration']>) => state,
    watchCurrentWeb3: (state, _action: PayloadAction<Web3Action['watchCurrentWeb3']>) => state,
    checkAccount: (state, _action: PayloadAction<Web3Action['checkAccount']>) => state,
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

  return {
    web3,
    dispatchSwitchNetwork,
    dispatchNotSupportedNetwork,
  };
}

export const useConfig = () => useAppSelector(selectConfig);
