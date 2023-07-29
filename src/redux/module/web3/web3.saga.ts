import {PayloadAction} from '@reduxjs/toolkit';
import {put, select, takeEvery} from 'redux-saga/effects';
import {switchNetwork as switchNetworkWeb3, watchNetwork} from '@wagmi/core';

import {config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig} from '@forest-feed/redux/selectors';
import {
  startConfiguration,
  switchNetwork,
  updateNetwork,
  watchCurrentNetwork,
  notSupportedNetwork,
  Web3Action,
} from '@forest-feed/redux/module/web3/web3.slice';
import {AppStore} from '@forest-feed/redux/store';

export function* watchStartConfiguration({payload}: PayloadAction<Web3Action['startConfiguration']>) {
  try {
    const {newNetwork} = payload || {};
    console.log(newNetwork, 'newNetwork is here');
    let config: NetworkConfig = yield select(selectConfig);
    if (newNetwork) {
      if (config.chainId !== newNetwork) {
        yield switchNetworkWeb3({
          chainId: configs[newNetwork].chainId,
        });
      }
      config = configs[newNetwork];
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

export function* watchWatchCurrentNetwork(store: AppStore) {
  try {
    const unwatch = watchNetwork(network => {
      if (typeof network.chain?.unsupported !== 'undefined' && network.chain?.unsupported) {
        store.dispatch(notSupportedNetwork());
      } else {
        if (network.chain?.id) {
          store.dispatch(switchNetwork({newNetwork: network?.chain?.id}));
        }
      }
    });
  } catch (e: any) {
    console.log(e, 'error in watch network');
  }
}

export function* web3Sagas(store: AppStore) {
  yield takeEvery(startConfiguration.type, watchStartConfiguration);
  yield takeEvery(switchNetwork.type, watchSwitchNetwork);
  yield takeEvery(watchCurrentNetwork.type, watchWatchCurrentNetwork, store);
}
