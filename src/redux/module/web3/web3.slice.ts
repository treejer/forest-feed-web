import {useCallback} from 'react';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {BlockchainNetwork, config as configs, NetworkConfig} from '@forest-feed/config';
import {selectWeb3} from '@forest-feed/redux/selectors';
import {useAppDispatch, useAppSelector} from '@forest-feed/hooks/redux';

export type Web3State = {
  config: NetworkConfig;
  switching: boolean;
};

export type Web3Action = {
  switchNetwork: {newNetwork: BlockchainNetwork};
  updateNetwork: {newConfig: NetworkConfig};
  startConfiguration?: {newNetwork?: BlockchainNetwork};
};

export const web3InitialState: Web3State = {
  config: configs[BlockchainNetwork.Polygon],
  switching: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState: web3InitialState,
  reducers: {
    startConfiguration: (state, _action: PayloadAction<Web3Action['startConfiguration']>) => state,
    switchNetwork: (state, action: PayloadAction<Web3Action['switchNetwork']>) => {
      state.switching = true;
    },
    updateNetwork: (state, action: PayloadAction<Web3Action['updateNetwork']>) => {
      state.switching = false;
      state.config = action.payload.newConfig;
    },
  },
});

export const {switchNetwork, updateNetwork, startConfiguration} = web3Slice.actions;
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

  return {
    web3,
    dispatchSwitchNetwork,
  };
}