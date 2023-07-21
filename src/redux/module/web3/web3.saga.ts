import {PayloadAction} from '@reduxjs/toolkit';
import {put, select, takeEvery} from 'redux-saga/effects';
import {switchNetwork as switchNetworkWeb3} from '@wagmi/core';

import {config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig} from '@forest-feed/redux/selectors';
import {startConfiguration, switchNetwork, updateNetwork, Web3Action} from '@forest-feed/redux/module/web3/web3.slice';

export function* watchStartConfiguration({payload}: PayloadAction<Web3Action['startConfiguration']>) {
  try {
    const {newNetwork} = payload || {};
    let config: NetworkConfig = yield select(selectConfig);
    if (newNetwork) {
      config = configs[newNetwork];
      yield switchNetworkWeb3({
        chainId: +configs[newNetwork].chainId,
      });
    }
    yield put(updateNetwork({newConfig: config}));
  } catch (e: any) {
    console.log(e, 'error is start configuration');
  }
}

export function* watchSwitchNetwork({payload}: PayloadAction<Web3Action['switchNetwork']>) {
  try {
    const {newNetwork} = payload;
    yield put(startConfiguration({newNetwork}));
  } catch (e: any) {
    console.log(e, 'error in switch network');
  }
}

export function* web3Sagas() {
  yield takeEvery(startConfiguration.type, watchStartConfiguration);
  yield takeEvery(switchNetwork.type, watchSwitchNetwork);
}
