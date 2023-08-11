import {PayloadAction} from '@reduxjs/toolkit';
import {put, select, takeEvery} from 'redux-saga/effects';
import {switchNetwork as switchNetworkWeb3, watchAccount, watchNetwork} from '@wagmi/core';

import {config as configs, NetworkConfig} from '@forest-feed/config';
import {selectConfig, selectWeb3} from '@forest-feed/redux/selectors';
import {
  Web3Action,
  startConfiguration,
  switchNetwork,
  updateNetwork,
  watchCurrentWeb3,
  notSupportedNetwork,
  cancelSwitchNetwork,
  connectedWallet,
  Web3State,
  checkAccount,
} from '@forest-feed/redux/module/web3/web3.slice';
import {AppStore} from '@forest-feed/redux/store';

export function* watchStartConfiguration({payload}: PayloadAction<Web3Action['startConfiguration']>) {
  try {
    const {newNetwork, userInApp, onSuccess} = payload || {};
    console.log(newNetwork, 'newNetwork');
    let config: NetworkConfig = yield select(selectConfig);
    if (newNetwork) {
      if (config.chainId !== newNetwork && userInApp) {
        yield switchNetworkWeb3({
          chainId: configs[newNetwork].chainId,
        });
      }
      config = configs[newNetwork];
      yield onSuccess?.();
    }
    yield put(updateNetwork({newConfig: config}));
  } catch (e: any) {
    console.log(e, 'error is start configuration');
    yield put(cancelSwitchNetwork());
  }
}

export function* watchSwitchNetwork({payload}: PayloadAction<Web3Action['switchNetwork']>) {
  try {
    const {newNetwork, userInApp, onSuccess} = payload;
    yield put(startConfiguration({newNetwork, userInApp, onSuccess}));
  } catch (e: any) {
    console.log(e, 'error in switch network');
  }
}

export function* watchCheckAccount({payload}: PayloadAction<Web3Action['checkAccount']>) {
  try {
    const {account, lensLogout} = payload || {};
    const {address, accessToken}: Web3State = yield select(selectWeb3);
    if (!accessToken || address !== account.address) {
      // TODO: logout/login
      // * logout lens account
      // yield lensLogout();
      // * 1. nonce load, 2. take nonce response, 3. sign message, 4. sign load
    }
    yield put(connectedWallet({address: account.address}));
  } catch (e: any) {
    console.log('error in check account');
  }
}

export function* watchWatchWeb3(store: AppStore, {payload}: PayloadAction<Web3Action['watchCurrentWeb3']>) {
  try {
    const {lensLogout} = payload || {};
    watchAccount(account => {
      store.dispatch(checkAccount({account, lensLogout}));
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
  yield takeEvery(checkAccount.type, watchCheckAccount);
  yield takeEvery(watchCurrentWeb3.type, watchWatchWeb3, store);
}
