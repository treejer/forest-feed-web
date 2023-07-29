import {PayloadAction} from '@reduxjs/toolkit';
import {put, select, takeEvery} from 'redux-saga/effects';
import {switchNetwork as switchNetworkWeb3, watchAccount, watchNetwork} from '@wagmi/core';

import {config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig} from '@forest-feed/redux/selectors';
import {
  Web3Action,
  startConfiguration,
  switchNetwork,
  updateNetwork,
  watchCurrentNetwork,
  notSupportedNetwork,
  cancelSwitchNetwork,
  walletConnected,
} from '@forest-feed/redux/module/web3/web3.slice';
import {AppStore} from '@forest-feed/redux/store';

export function* watchStartConfiguration({payload}: PayloadAction<Web3Action['startConfiguration']>) {
  try {
    const {newNetwork, userInApp} = payload || {};
    console.log(newNetwork, 'newNetwork is here');
    let config: NetworkConfig = yield select(selectConfig);
    if (newNetwork) {
      if (config.chainId !== newNetwork && userInApp) {
        yield switchNetworkWeb3({
          chainId: configs[newNetwork].chainId,
        });
      }
      config = configs[newNetwork];
    }

    yield put(updateNetwork({newConfig: config}));
  } catch (e: any) {
    console.log(e, 'error is start configuration');
    yield put(cancelSwitchNetwork());
  }
}

export function* watchSwitchNetwork({payload}: PayloadAction<Web3Action['switchNetwork']>) {
  try {
    const {newNetwork, userInApp} = payload;
    yield put(startConfiguration({newNetwork, userInApp}));
  } catch (e: any) {
    console.log(e, 'error in switch network');
  }
}

export function* watchWatchCurrentNetwork(store: AppStore) {
  try {
    watchAccount(account => {
      store.dispatch(walletConnected({address: account.address}));
    });
    watchNetwork(network => {
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
