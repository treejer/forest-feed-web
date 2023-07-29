import {useCallback} from 'react';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {BlockchainNetwork, config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig, selectWeb3} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

export type Web3State = {
  isConnected: boolean;
  config: NetworkConfig;
  switching: boolean;
  isSupportedNetwork: boolean;
};

export type Web3Action = {
  switchNetwork: {newNetwork: BlockchainNetwork; userInApp?: boolean};
  updateNetwork: {newConfig: NetworkConfig};
  startConfiguration?: {newNetwork?: BlockchainNetwork; userInApp?: boolean};
  walletConnected: {address?: string};
};

export const web3InitialState: Web3State = {
  isConnected: false,
  config: configs[BlockchainNetwork.Mumbai],
  switching: false,
  isSupportedNetwork: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState: web3InitialState,
  reducers: {
    startConfiguration: (state, _action: PayloadAction<Web3Action['startConfiguration']>) => state,
    watchCurrentNetwork: state => state,
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
    walletConnected: (state, action: PayloadAction<Web3Action['walletConnected']>) => {
      state.isConnected = !!action.payload.address;
    },
  },
});

export const {
  switchNetwork,
  updateNetwork,
  startConfiguration,
  notSupportedNetwork,
  watchCurrentNetwork,
  cancelSwitchNetwork,
  walletConnected,
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
